# Verified existing Render Free configuration — 2026-10-24

Read-only direct Render get_service evidence (service srv-dbdohpbrjlhs73b0afdg):
- service name: lyvra-family-post-bridge
- plan: free; numInstances: 1
- autoDeploy: no; autoDeployTrigger: off
- preview generation: off; PR previews: no
- source branch: lyvra-family-post-bridge-free-20261023
- build: pip install -r family_post_bridge/requirements.txt
- start: uvicorn family_post_bridge.server:app --host 0.0.0.0 --port $PORT
- rootDir: repository root
- region: oregon
- app: https://lyvra-family-post-bridge.onrender.com

PRODUCTION IS NOT PR #72. PR #72 is a draft source-only change
on lyvra-family-post-mcp-runtime-candidate-20261024.

Activation plan still NOT AUTHORIZED:
- Don't merge PR #72 as if it changes deployed production. Existing Render
  points at the separate backend branch, not at the PR candidate.
- A future authorized migration needs a governed source promotion, pinned
  dependency review, recovery snapshot, updated build and start commands,
  health/API/MCP checks, and independent readback with explicit send intent.
- Do not create extra services, databases, previews, paid tiers, or billing.
- A single running instance and local lock do not ensure crash-proof
  or cross-instance exactly-once message creation.
- Avoid automatic retries on unknown Drive outcomes and keep role isolation.
- Ordinary ChatGPT, native LYVRA plugin and Mum/Little Lyv account require
  independent host connector authorization; source tests do not grant it.

This is evidence of *configuration*, not a successful live MCP deployment.
