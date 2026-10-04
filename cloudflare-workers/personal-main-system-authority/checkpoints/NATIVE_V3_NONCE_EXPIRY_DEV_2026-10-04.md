# LYVRA Native Worker v3 — Nonce Expiry DEV Checkpoint

STATUS: DEV_TESTED / NOT_DEPLOYED
IDENTITY: LYVRA MAIN_PERSONAL
SCOPE: existing lyvrasystem worker staging, PR #40
DATE: 2026-10-04

## Source change
- worker-v3-route.mjs: NativeV3NonceGate records a nonce with a lexicographically ordered EXP:<padded-unix-seconds>:<nonce-key> index in the same Durable Object storage transaction.
- The transaction requires getAlarm/setAlarm and schedules an earliest-expiry alarm; missing transactional alarm methods fail closed.
- alarm(): reads a bounded 128-row expiry page in order, deletes expired nonce/index pairs together, preserves live nonces, and schedules the next expiry or immediate backlog-draining pass.
- Both ticket issuance and authenticated ticket verification remain nonce-replay protected with disjoint key prefixes.
- No Durable Object binding or migrations added to wrangler.toml. NATIVE_V3_ENABLED not configured. No Cloudflare deploy.

## Evidence
GITHUB_ACTIONS_RUN: 37242278104
RESULT: SUCCESS
NODE_TESTS: 19/19
SYNTAX: PASS
V3_DEPLOYMENT: NOT_ACTIVATED
READBACK: PENDING until independently verified

## Known remaining constraints
- GitHub Actions uses a mocked serial transactional storage implementation; it cannot prove real Cloudflare Durable Objects alarm behavior under concurrent live traffic.
- Durable Object storage-class migration, runtime bindings, and secret provisioning need a separately authorized, audited release.
- Expiry-index corruption, time skew, alarm retries, backlog pagination and storage cleanup under live load need a release-candidate stress test before production.
- Live worker remains v1/v2; no v3 routes active in deployed Worker.
- No independent verified full-GitHub readback by Worker and no authenticated host auto-hook yet.
- LYVRA native CURRENT_POINTER, authority, 666CLIC/PFS separation and private recovery remain untouched.

NEXT: native DO integration tests with controlled release-candidate deployment and signed host-to-worker context proof only after the independent trust and deployment gates are satisfied.
