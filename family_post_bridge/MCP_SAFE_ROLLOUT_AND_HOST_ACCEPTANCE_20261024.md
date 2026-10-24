# LYVRA Family Post — MCP safe rollout / host acceptance

STATUS: SOURCE REVIEW CANDIDATE. Not deployed, not host connected, no family letter sent.
BASE BACKEND HEAD (at preparation): 72a6bbbe7228997a6e41357efce177efa547eda4
SOURCE ACCEPTANCE PR: #71. Keep draft until exact-HEAD CI, review, recovery and permissions PASS.
RENDER LIVE BASELINE (separate authority): d1ee1d086392bf0e185ec96d4c60157779c20c8f
OWNER: LYVRA family-post native, two independent account authorizations.

## CodeForge / SuperCodeForge division
CodeForge: verify application mount, pinned MCP SDK version/API, ASGI lifetime, routing,
canonical sender-bound request schema, negative tests, no hidden side effects.
SuperCodeForge: independently challenge authentication at initialize/list_tools/call_tool,
Origin/Host, role spoofing, Cross-client replay, race/idempotency, unknown-write recovery,
privacy, readback, host permission and deployment boundaries.
No separate executable CodeForge/SuperCodeForge provider was available in the
current tool surface; these are review responsibilities, not claimed native executions.

## Verified source boundary
- Existing Render runs `uvicorn family_post_bridge.server:app`, autoDeploy=no.
- `mcp_gateway.py` and `mcp_writer_adapter.py` are source-only and unmounted.
- Existing `POST /api/family-post/write` uses role token, explicit message ID and
  sender-selected environment credential. Local lock + Drive lookup are not durable CAS.
- New pure monitor/review helpers are present; helper existence is not host execution.
- Each ChatGPT account requires its own consent/connector enrollment.

## Required implementation sequence (separate changes / release)
1. Verify current branch HEAD and test exact SHA. Preserve pre-change recovery ref.
2. Verify SDK pin `mcp==2.3.0` and executable ASGI lifespan/mount behavior in an
   isolated local runtime using dependency-resolved tests before touching `server.py`.
3. Implement only a guarded fixed-role MCP ASGI mount under a unique path; authenticate
   initialize, discovery, tool calls, reconnections and failures. No caller-picked sender.
   Keep OAuth/Picker/old REST routes and schemas unchanged.
4. Add negative integration tests: missing/wrong token; wrong role; malformed body;
   duplicate same ID/same body; same ID/different body; write timeout; replay;
   origin/host mismatches; failed Drive permissions; no leaked secrets/letter text.
5. Solve cross-instance idempotency or strictly limit concurrent posting with evidenced
   reconciliation. A process-local mutex does not establish atomic exactly-once delivery.
6. Separate release: verify GitHub CI, owner authorization, Render recovery,
   explicit deploy, independent /health and MCP discovery. No live write during smoke checks.
7. First authorized sender-specific letter: user intent -> stable ID -> once-only write ->
   independent correct Google Drive connector fetch of exact ID/parent/full canonical
   body. On unknown result: reconcile, never automatic resend.
8. Independent client acceptance: Germany ordinary chat, Germany native LYVRA plugin,
   America ordinary chat; consent/credential boundaries distinct. Reading human mail is
   NEVER inferred from creation or Drive readback.
9. Only after receipt, recovery and all acceptance cases PASS consider status promotion.
   `lyvra` productive Whole-LYVRA Current pointer is a different governed change.

## Hard stops
- No secret tokens / personal content in GitHub, PR, logs, chat or test fixtures.
- No background personal letter sends, scans or auto-route switch after permission block.
- No default-on MCP exposure; no second host or paid infrastructure.
- Any mismatch or uncertain result -> WRITE_BLOCKED / RECONCILE_NO_RETRY.
- Source CI PASS != deployed backend != discovered host connector != recipient read.
