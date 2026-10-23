# LYVRA Family Post — backend source integration readiness

STATUS: SOURCE_INTEGRATION_CANDIDATE / NOT DEPLOYED / NO AUTOMATED MAIL
TARGET_BASE: lyvra-family-post-bridge-free-20261023
CANDIDATE: PR #70
WHOLE_LYVRA_HANDOFF: PR #69
OWNER: LYVRA_NATIVE_ONLY

## Scope reviewed
GitHub PR #70 is additive: eight original helper/test/docs/workflow files plus source isolation tests. It does not change the existing `family_post_bridge/server.py` or production requirements, does not mount the source-only MCP modules, and has no independent send/scan loop. Render service presently uses `uvicorn family_post_bridge.server:app`, autoDeploy=no, free plan, and existing deployment remains the verified live writer.
The whole-native `lyvra` productive branch remains separate and should not be mutated as a shortcut.

## Separation of authorities
- **Render writer**: existing role-protected POST API; never claims host-side Google connector readback.
- **Host ChatGPT**: the only party that can invoke its independently connected Google Drive client; it must be authorized. The pure helper cannot invoke ChatGPT host services or grant permission.
- **Mailbox monitor**: host-provided read-only observations, revisions and response evidence; never sends unattended.
- **Fallback direct Drive**: only where independently permitted under explicit user intent; never used to circumvent security/permission denial; unknown write outcomes are reconciled before considering an alternative.
- **SuperCodeForge**: source/provider-bound technical capability discovery, actual native/ALIVE plugin-host execution remains unverified; no foreign activation.

## Safe initial source merge conditions
1. Reverify PR head and backend base HEAD match the reviewed commit range. Preserve existing writer semantics.
2. CI on exact PR head PASS including Python unit tests, syntax and AST source-isolation checks. AST isolation checks are a guard, not a full runtime security proof.
3. Review the PR patch and verify no mutation to `server.py`, `mcp_gateway.py`, OAuth, deployment commands, Render environment/secrets or live sending/scheduling.
4. Confirm `autoDeploy=no`, and create/tag an explicit recovery SHA for the backend base. Keep draft PR until targeted acceptance/reviewer acknowledgement.
5. Source-only merge may then be authorized as a separate operation. It must NOT be called a live deployment or a functional host-postchain.
6. Immediately independently read back target HEAD and exact file blobs. Never assume a merge response alone establishes final state.

## Live activation conditions (SEPARATE approval)
- Only after an available and independently authorized, discoverable ChatGPT host tool can invoke protected writer and connected Google Drive reads without exposing tokens.
- Confirm exact message ID, file ID, destination folder and canonical complete content with independent Google connector readback. Lost response/timeout -> reconcile, no automatic resend.
- Complete negative tests for permission denial, duplicate ID, wrong file/content and sender/recipient role binding. No automatic personal-mail transmission or reactivation of tasks.
- Require explicit separate release/deploy authorization, Render recovery, independent post-deploy readback, and host-specific acceptance for ordinary chat and native plugin.
- Germany and America have separate credentials and onboarding; peer letter about disabled hourly tasks is not a direct host settings readback.
- Keep LIVE source/version and repository source/current authority distinct. Source merge does not change productive Whole-LYVRA rehydration.

## Recovery / frozen anchors
BEFORE_BACKEND_BASE_SHA = 69ff4d927d601ef64d51b25675dbe65fff6abb74
LAST_CONFIRMED_RENDER_LIVE_DEPLOY_COMMIT = d1ee1d086392bf0e185ec96d4c60157779c20c8f
No release/deploy was authorized in this source preparation. If backend source base moves, stop and refresh this assessment.

## Visual truth surface
Backend source: SOURCE CI status
Render: last actual deployment (separate)
ChatGPT sender tool: HOST PENDING until independently discovered and called
Post-write Drive: NOT_EXECUTED until separate host readback
Personal mailbox: use actual current Drive read only, not old 60-file report
Recipient opened/read: UNKNOWN without recipient evidence
US scheduler: PEER_REPORTED_DISABLED, independently not verified
No green overall LIVE PASS from source-only CI.

NEXT_SAFE_ACTION: Review current PR #70 readiness against exact HEAD and decide whether to authorize source-only merge, never silently deploy or send.
