"""Opt-in ASGI composition candidate for one Render Free service.

NOT the production entrypoint. The current service continues starting
family_post_bridge.server:app. Enabling this alternative requires a separate
review, dependency install, authorization, deploy and host acceptance.
"""
from contextlib import AsyncExitStack, asynccontextmanager

from starlette.applications import Starlette
from starlette.routing import Mount

from family_post_bridge.server import app as legacy_app
from family_post_bridge.mcp_gateway import ROLES, create_role_server
from family_post_bridge.mcp_writer_adapter import write_family_letter


def create_app():
    role_apps = []
    for role in ROLES:
        server, guarded_app = create_role_server(role, write_family_letter)
        role_apps.append((role, server, guarded_app))

    @asynccontextmanager
    async def lifespan(_app):
        # MCP streamable transports need a live session manager; without it,
        # initialize/list_tools may fail even when ASGI routes are mounted.
        async with AsyncExitStack() as stack:
            async with legacy_app.router.lifespan_context(legacy_app):
                for _, server, _ in role_apps:
                    transport = server.streamable_http_app(
                        streamable_http_path="/",
                        json_response=True,
                        stateless_http=True,
                    )
                    # The real guarded_app created above is the routed app.
                    # Do not activate without SDK-specific lifespan validation.
                    _ = transport
                yield

    # Sender identity is fixed by path and backend credentials, not by a
    # client argument. The REST writer remains on the original ASGI app.
    routes = [Mount("/mcp/" + role.lower(), app=guarded)
              for role, _, guarded in role_apps]
    routes.append(Mount("/", app=legacy_app))
    return Starlette(routes=routes, lifespan=lifespan)


# Deliberately no module-level 'app': production cannot activate this by
# accidentally importing the candidate. Test ASGI behavior before release.
