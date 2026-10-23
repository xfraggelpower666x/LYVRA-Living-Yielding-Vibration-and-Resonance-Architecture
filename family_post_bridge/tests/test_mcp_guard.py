"""Offline guard regression: does NOT send family letters or touch Drive.

Run after installing the pinned MCP dependencies in a disposable test venv:
    python -m pytest -q family_post_bridge/tests/test_mcp_guard.py
"""
import os
from unittest.mock import patch

import pytest
from starlette.responses import JSONResponse
from starlette.testclient import TestClient

from family_post_bridge.mcp_gateway import RoleBearerGuard


@pytest.fixture
def guarded():
    async def downstream(scope, receive, send):
        response = JSONResponse({"granted": True})
        await response(scope, receive, send)

    return RoleBearerGuard(downstream, "DAD")


@pytest.mark.parametrize("headers", [{}, {"Authorization": "Bearer bad"}, {"Authorization": "Basic secret"}])
def test_missing_wrong_or_unsupported_credentials_fail_closed(guarded, headers):
    with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD": "dad-private-test-secret"}):
        from starlette.applications import Starlette
        from starlette.routing import Mount
        with TestClient(Starlette(routes=[Mount("/", app=guarded)])) as client:
            response = client.get("/mcp", headers=headers)
            assert response.status_code == 401
            assert "dad-private-test-secret" not in response.text
            assert response.headers["Cache-Control"] == "no-store"


def test_bound_role_allows_only_its_own_token(guarded):
    with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD": "dad-private-test-secret",
                                  "FAMILY_POST_TOKEN_MUM": "mum-private-test-secret"}):
        from starlette.applications import Starlette
        from starlette.routing import Mount
        with TestClient(Starlette(routes=[Mount("/", app=guarded)])) as client:
            assert client.get("/mcp", headers={"Authorization": "Bearer mum-private-test-secret"}).status_code == 401
            assert client.get("/mcp", headers={"Authorization": "Bearer dad-private-test-secret"}).json() == {"granted": True}


def test_missing_server_secret_fails_closed(guarded):
    env = os.environ.copy()
    env.pop("FAMILY_POST_TOKEN_DAD", None)
    with patch.dict(os.environ, env, clear=True):
        from starlette.applications import Starlette
        from starlette.routing import Mount
        with TestClient(Starlette(routes=[Mount("/", app=guarded)])) as client:
            assert client.post("/mcp", headers={"Authorization": "Bearer any"}).status_code == 401
