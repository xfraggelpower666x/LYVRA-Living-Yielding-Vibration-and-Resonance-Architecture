"""Opt-in MCP ASGI composition candidate on existing Render Free service.

Source-only. Production still launches family_post_bridge.server:app.
Do not deploy until exact pinned-SDK runtime and host tests pass.
"""
from contextlib import AsyncExitStack, asynccontextmanager

from starlette.applications import Starlette
from starlette.routing import Mount

from family_post_bridge.server import app as legacy_app
from family_post_bridge.mcp_gateway import ROLES, create_role_server
from family_post_bridge.mcp_writer_adapter import write_family_letter


def create_app():
    # Keep MCPServer objects alive so the host lifespan can explicitly own
    # each session manager; mounted sub-application lifespan does not run.
    role_apps = [
        (role, *create_role_server(role, write_family_letter))
        for role in ROLES
    ]

    @asynccontextmanager
    async def lifespan(_app):
        async with AsyncExitStack() as stack:
            await stack.enter_async_context(legacy_app.router.lifespan_context(legacy_app))
            for _, server, _ in role_apps:
                await stack.enter_async_context(server.session_manager.run())
            yield

    # Every MCP path has a distinct fixed sender identity and bearer guard.
    # The existing REST writer/OAuth/Picker remains under the catch-all mount.
    routes = [
        Mount("/mcp/" + role.lower(), app=guarded)
        for role, _, guarded in role_apps
    ]
    routes.append(Mount("/", app=legacy_app))
    return Starlette(routes=routes, lifespan=lifespan)


# No module-level app: this module cannot activate itself on current Render.
