"""Zero-euro optional deployment entrypoint for the existing Render service.

Not the production entrypoint. Render currently uses server:app.
Switching to this module requires separate authorized deployment, exact
dependency installation and verified host acceptance. No extra services.
"""
from family_post_bridge.mcp_runtime_candidate import create_app

app = create_app()
