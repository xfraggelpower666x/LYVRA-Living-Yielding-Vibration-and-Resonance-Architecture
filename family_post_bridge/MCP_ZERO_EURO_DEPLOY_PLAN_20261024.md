# Zero-euro optional MCP activation (NOT APPROVED FOR DEPLOY)

Current Render production command remains:
`uvicorn family_post_bridge.server:app --host 0.0.0.0 --port $PORT`

Candidate future command, after explicit deploy authorization:
`uvicorn family_post_bridge.mcp_asgi_entrypoint_candidate:app --host 0.0.0.0 --port $PORT`

Candidate installs existing `family_post_bridge/requirements.txt` and pinned
`mcp==2.3.0` from development requirements; NEVER install `pytest` or any
database driver unnecessarily on production. A minimal production MCP
requirements file is `family_post_bridge/requirements-mcp-runtime-candidate.txt`.
No new Render service, database, Redis, paid tier or auto-deploy.

Release blocks: exact CI SHA, current Render configuration, Free plan and
no billing changes; service startup/ASGI health; four role-auth boundaries;
per-host native connector onboarding under each user's own consent;
explicit-send-only behavior and independent Drive readback. Fail closed
for unconfirmed receipt, no auto-retry, and never claim exactly once.
Rollback is restoring the old start command + prior pinned dependency set.
No unapproved letters. No deployment or connector installation from this plan.
