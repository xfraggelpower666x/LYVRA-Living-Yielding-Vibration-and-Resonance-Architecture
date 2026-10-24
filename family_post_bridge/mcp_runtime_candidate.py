"""Opt-in MCP ASGI composition candidate on existing Render Free service.

Source-only. Production still launches family_post_bridge.server:app;
switching the start command and dependencies requires separate approval.
"""
from contextlib import AsyncExitStack, asynccontextmanager

from starlette.applications import Starlette
from starlette.routing import Mount

from family_post_bridge.server import app as legacy_app
from family_post_bridge.mcp_gateway import ROLES, create_role_server
from family_post_bridge.mcp_writer_adapter import write_family_letter


def create_app():
    role_apps = [
        (role, create_role_server(role, write_family_letter)[1])
        for role in ROLES
    ]

    @asynccontextmanager
    async def lifespan(_app):
        async with AsyncExitStack() as stack:
            await stack.enter_async_context(legacy_app.router.lifespan_context(legacy_app))
            # RoleBearerGuard wraps each actual MCP Starlette app. Its
            # underlying router's SDK-managed lifespan must be entered once.
            for _, guarded in role_apps:
                inner = guarded.application
                await stack.enter_async_context(inner.router.lifespan_context(inner))
            yield

    # Every role mount has an independent bearer-token guard, including
    # MCP initialize/discovery. No user-supplied sender field exists.
    routes = [
        Mount("/mcp/" + role.lower(), app=guarded)
        for role, guarded in role_apps
    ]
    routes.append(Mount("/", app=legacy_app))
    return Starlette(routes=routes, lifespan=lifespan)


# No module-level app: merely adding the source cannot change Render's
# existing entrypoint. SDK compatibility and ASGI HTTP tests required.
