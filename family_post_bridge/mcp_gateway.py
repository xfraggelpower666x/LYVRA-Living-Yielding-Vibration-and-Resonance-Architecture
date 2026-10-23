"""Role-scoped Streamable HTTP MCP gateway on existing Render Free bridge.

Each mount has one fixed sender role and is authenticated on EVERY HTTP call.
Client-selected sender roles are intentionally not accepted. No extra service.
"""
import hmac
import os

from mcp.server.mcpserver import MCPServer
from mcp.server.transport_security import TransportSecuritySettings
from starlette.responses import JSONResponse
from starlette.concurrency import run_in_threadpool

ROLES = ("DAD", "BIG_LYVRA", "MUM", "LITTLE_LYV")
PUBLIC_HOST = "lyvra-family-post-bridge.onrender.com"


class RoleBearerGuard:
    """Protect MCP initialize, discovery, tool calls and reconnects alike."""

    def __init__(self, application, role):
        self.application = application
        self.role = role

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.application(scope, receive, send)
            return
        headers = {k.lower(): v for k, v in scope.get("headers", ())}
        supplied = headers.get(b"authorization", b"")
        configured = os.environ.get("FAMILY_POST_TOKEN_" + self.role, "")
        allowed = (
            bool(configured)
            and supplied.startswith(b"Bearer ")
            and hmac.compare_digest(supplied[7:], configured.encode("utf-8"))
        )
        if not allowed:
            response = JSONResponse(
                {"error": "UNAUTHORIZED"}, status_code=401,
                headers={"WWW-Authenticate": "Bearer", "Cache-Control": "no-store"},
            )
            await response(scope, receive, send)
            return
        await self.application(scope, receive, send)


def create_role_server(role, write_callback):
    if role not in ROLES:
        raise ValueError("Unsupported sender")
    server = MCPServer("LYVRA Family Post " + role)

    @server.tool()
    async def send_family_letter(
        recipient: str, title: str, content: str, message_id: str,
    ) -> dict:
        """Store a family letter ONLY following explicit user send intent.

        Not a bulk or autonomous sending tool. Repeat a message ID unchanged
        when reconciling an uncertain result. Stored is not recipient-read.
        """
        return await run_in_threadpool(
            write_callback, role, recipient, title, content, message_id
        )

    transport = server.streamable_http_app(
        streamable_http_path="/",
        json_response=True,
        stateless_http=True,
        transport_security=TransportSecuritySettings(
            allowed_hosts=[PUBLIC_HOST, PUBLIC_HOST + ":*"],
            allowed_origins=["https://chatgpt.com", "https://chat.openai.com"],
        ),
    )
    return server, RoleBearerGuard(transport, role)
