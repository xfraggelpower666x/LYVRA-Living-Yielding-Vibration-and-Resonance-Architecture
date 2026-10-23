"""Source-only MCP role dispatch regression using a fake SDK, not real MCP wire testing.

pytest -q family_post_bridge/tests/test_mcp_role_dispatch.py
No Google API calls, Render deployment, secrets, or letter delivery.
"""
import asyncio
import importlib.util
import sys
import types
from pathlib import Path
from unittest.mock import patch

from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Mount
from starlette.testclient import TestClient


class FakeMCPServer:
    def __init__(self, name):
        self.name = name
        self.tools = {}

    def tool(self):
        def register(fn):
            self.tools[fn.__name__] = fn
            return fn
        return register

    def streamable_http_app(self, **kwargs):
        self.settings = kwargs

        async def downstream(scope, receive, send):
            await JSONResponse({"ok": True})(scope, receive, send)

        return downstream


class FakeTransportSecuritySettings:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


def _load_gateway(monkeypatch):
    root = Path(__file__).resolve().parents[1]
    server_module = types.ModuleType("mcp.server")
    server_module.MCPServer = FakeMCPServer
    security_module = types.ModuleType("mcp.server.transport_security")
    security_module.TransportSecuritySettings = FakeTransportSecuritySettings
    mcp_module = types.ModuleType("mcp")
    mcp_module.server = server_module
    monkeypatch.setitem(sys.modules, "mcp", mcp_module)
    monkeypatch.setitem(sys.modules, "mcp.server", server_module)
    monkeypatch.setitem(sys.modules, "mcp.server.transport_security", security_module)
    spec = importlib.util.spec_from_file_location("role_gateway_under_test", root / "mcp_gateway.py")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_each_role_registers_one_sender_bound_tool(monkeypatch):
    gateway = _load_gateway(monkeypatch)
    for role in gateway.ROLES:
        events = []

        def writer(*args):
            events.append(args)
            return {"state": "MOCK_NO_DRIVE"}

        server, guarded = gateway.create_role_server(role, writer)
        assert server.name.endswith(role)
        assert list(server.tools) == ["send_family_letter"]
        assert server.settings["stateless_http"] is True
        assert server.settings["transport_security"].allowed_hosts == [
            gateway.PUBLIC_HOST, gateway.PUBLIC_HOST + ":*"
        ]
        with patch.dict("os.environ", {"FAMILY_POST_TOKEN_" + role: "only-" + role}):
            with TestClient(Starlette(routes=[Mount("/gateway", app=guarded)])) as client:
                assert client.get("/gateway", headers={"Authorization": "Bearer only-" + role}).status_code == 200
                assert client.get("/gateway", headers={"Authorization": "Bearer another-role"}).status_code == 401
        result = asyncio.run(server.tools["send_family_letter"](
            "FAMILY", "Title", "Test content", "message-id-test-1234"
        ))
        assert result["state"] == "MOCK_NO_DRIVE"
        assert events == [(role, "FAMILY", "Title", "Test content", "message-id-test-1234")]


def test_unsupported_role_rejected_before_tool_registration(monkeypatch):
    gateway = _load_gateway(monkeypatch)
    try:
        gateway.create_role_server("UNAUTHORIZED", lambda *args: None)
    except ValueError:
        pass
    else:
        raise AssertionError("Unrecognized sender accepted")
