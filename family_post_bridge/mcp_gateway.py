"""Role-bound MCP protocol adapters for the existing write-only Family Post Bridge.

Four independent stateless MCP entry paths, no extra services.
No credentials appear in the tool schema or source.
"""
import hmac
import os

from mcp.server import MCPServer
from mcp.server.transport_security import TransportSecuritySettings
from starlette.responses import JSONResponse


ROLES = ("DAD", "BIG_LYVRA", "MUM", "LITTLE_LYV")
PUBLIC_HOST = "lyvra-family-post-bridge.onrender.com"


class RoleBearerGuard:
    """Authenticate every MCP HTTP request BEFORE parsing JSON-RPC."""

    def __init__(self, app, role: str):
        self.app = app
        self.role = role

    async def __call__(self, scope, receive, send):
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return
        headers = {k.lower(): v for k, v in scope.get("headers", ())}
        raw = headers.get(b"authorization", b"")
        configured = os.getenv("FAMILY_POST_TOKEN_" + self.role, "")
        if not configured or not raw.startswith(b"Bearer "):
            response = JSONResponse(
                {"error": "UNAUTHORIZED"}, status_code=401,
                headers={"WWW-Authenticate": "Bearer", "Cache-Control": "no-store"},
            )
            await response(scope, receive, send)
            return
        supplied = raw[7:]
        # Never send or log the secret; authenticate with a fixed-time comparison.
        accepted = hmac.compare_digest(supplied, configured.encode("utf-8"))
        if not accepted:
            response = JSONResponse(
                {"error": "UNAUTHORIZED"}, status_code=401,
                headers={"WWW-Authenticate": "Bearer", "Cache-Control": "no-store"},
            )
            await response(scope, receive, send)
            return
        await self.app(scope, receive, send)


def create_role_server(role: str, write_callback):
    """Create one MCP adapter bound to exactly one identity."""
    if role not in ROLES:
        raise ValueError("Unsupported sender")

    mcp = MCPServer("LYVRA Family Post " + role)

    @mcp.tool()
    async def send_family_letter(
        recipient: str, title: str, content: str, message_id: str,
    ) -> dict:
        """Send a user-authorized family letter. Do NOT call without clear send intent.

        The client must preserve the same message_id for ambiguous retries.
        A successful storage response does NOT imply the recipient read the letter.
        """
        from starlette.concurrency import run_in_threadpool
        # Writer performs Pydantic validation, Drive access and replay checking.
        return await run_in_threadpool(
            write_callback, role, recipient, title, content, message_id
        )

    app = mcp.streamable_http_app(
        streamable_http_path="/",
        json_response=True,
        stateless_http=True,
        transport_security=TransportSecuritySettings(
            allowed_hosts=[PUBLIC_HOST, PUBLIC_HOST + ":443"],
            allowed_origins=["https://chatgpt.com", "https://chat.openai.com"],
        ),
    )
    return mcp, RoleBearerGuard(app, role)
