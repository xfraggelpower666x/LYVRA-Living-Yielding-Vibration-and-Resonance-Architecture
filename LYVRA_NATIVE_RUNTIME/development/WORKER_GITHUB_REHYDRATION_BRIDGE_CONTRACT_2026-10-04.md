# LYVRA Worker — native GitHub rehydration compatibility bridge (DEV only)

DATE=2026-10-04
STATUS=SPECIFICATION_ONLY_NOT_LIVE_INTEGRATED
ROOT_IDENTITY=LYVRA
SOURCE_PRODUCTIVE_BRANCH=lyvra
SOURCE_PRODUCTIVE_HEAD_AT_AUDIT=3a1d167a1cbeac0a3c314ecf29182cbc4fe4da45
SOURCE_NATIVE_POINTER=LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json
SOURCE_NATIVE_MANIFEST=LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json
SOURCE_NATIVE_FRESHNESS=LYVRA_NATIVE_RUNTIME/continuity/VERSION_FRESHNESS_GUARD.md
SOURCE_NATIVE_REGISTRY=LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json
WORKER_STAGING_HEAD=f26c15a262c830bda67b752c6b59725e31c160a8
WORKER_ENTRY=cloudflare-workers/personal-main-system-authority/worker-runtime-adapter.js
UPGRADE_TARGET=EXISTING_WORKER_NOT_SECOND_DEPLOYMENT
NO_AUTHORITY_CHANGE=TRUE
NO_CURRENT_POINTER_WRITE=TRUE
NO_GITHUB_WRITE=TRUE
NO_CLOUDFLARE_DEPLOY=TRUE
NO_CROSS_NAMESPACE_AUTOLOAD=TRUE

## Verified lineage vs hypothesis

1. Existing Worker v2.0.0 has independent HMAC-signed BOOT/FOREGROUND/RECOVERY evidence and older LYVRA v1 boot routes. Live 2026-10-03 GitHub Actions run 37155868636 verified signed FOREGROUND issuance and verification. It does not establish host auto-invocation.
2. Worker code uses constant LYVRA root_revision `LYVRA-AUTHORITY-ROOT-1.0.0`. This is **an independent worker contract revision**, NOT GitHub CURRENT, Whole-LYVRA rev, or Track Design rev; never substitute it.
3. The v2 purpose adapter accepts caller-provided `current_pointer_revision`, `current_root_revision`, `session_revision` and optional expected context. It does NOT directly read the live GitHub HEAD/manifest/fingerprints or cryptographically bind to them. Therefore ticket verification by itself does not establish correct native repository rehydration.
4. The native `lyvra` branch moved beyond the earlier PR #31 base; latest observed production head is recorded only as audit provenance, never pinned as a permanent runtime value.
5. The worker's older `all_modes_require_valid_boot_ticket` describes legacy v1 behavior, not permission to replace current native rehydration or block safe native GitHub reads when optional evidence is unavailable.
6. No direct Cloudflare account connector is connected. GitHub Actions account audit run 37155921214 failed before API request because CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID were unset in that workflow. This does not negate validated public worker functionality.

## Proposed caller-first causal handshake (NOT enabled)

1. Read the `lyvra` branch HEAD and non-truncated recursive tree. Fully consume exact CURRENT_POINTER revision, AUTHORITY_CONTRACT, REHYDRATION_MANIFEST, COVERAGE_LEDGER and required domain references, including track references / submanifests and newer valid evolution.
2. Verify VERSION_FRESHNESS_GUARD and every current critical carrier Git blob SHA from CURRENT_REVISION_FINGERPRINTS against the *same* snapshot; if the HEAD changes, rebase and repeat changed reads.
3. Only after that: form a bounded `LYVRA_NATIVE_EVIDENCE_CONTEXT_V1` envelope containing system_id=LYVRA; branch=lyvra; immutable repo commit SHA; CURRENT_POINTER blob SHA; REHYDRATION_MANIFEST blob SHA; CURRENT_REVISION_FINGERPRINTS blob SHA; freshness epoch and domain-coverage result. No private payloads or tokens. Native context digest should be SHA-256 of canonical envelope bytes and include a fresh request nonce.
4. An **authenticated trusted caller** (not an unauthenticated website) requests optional short-lived Worker BOOT/FOREGROUND/RECOVERY evidence for LYVRA_MAIN_PERSONAL and purpose. Preserve v1/v2 routes during adaptation; add *versioned* envelope validation rather than overloading worker `root_revision`.
5. The Worker signs a *bounded commitment* to that caller-provided native context hash after validating explicit namespace/branch/host/purpose, nonce and freshness limits. A worker signature proves what the Worker checked and signed, **not** independent GitHub freshness unless the Worker separately reads and verifies GitHub via a read-only constrained identity.
6. The native caller checks the response and independently verifies the evidence against its own pinned repo snapshot. Do not call this a full cryptographic client-side verification merely because the same remote Worker /verify endpoint approves it; Worker /verify establishes server-side signing validation.
7. Return distinct results: NATIVE_GITHUB_REHYDRATED; WORKER_EVIDENCE_VALID; WORKER_EVIDENCE_UNAVAILABLE; WORKER_CONFLICT. Worker unavailability must not erase already verified native state or grant fallback authority to host.
8. Never automatically invoke CLIC, PFS, CSM, private vault, or unrelated identity as a side effect.

## Security and implementation hazards to resolve before Worker code changes

- v2 `POST /v2/evidence-ticket` currently validates client-supplied claims and a server-side LYVRA signing secret, but has no separate client authentication step. This is a credential/issuance boundary risk. Put authentication and authorization **before issuance**; do not confuse client claims (`host_id`, `authority_context`) with authentication.
- `sanitizeContext()` truncates each signed `request_context`/`session_context` string to 240 characters. The adapter's `compactContext()` collects several 160-character fields before creating those strings. Truncation can destroy structured content and omit important fields; never depend on this pathway to bind a full GitHub manifest. The upgrade should sign short canonical hashes in typed versioned fields with length checks and rejection (not silent truncation).
- v2 signed tickets currently have `exp` and UUID `jti`, but uniqueness/replay checking is not demonstrated by the shown code. Decide bounded replay prevention and audit requirements before gating any native operation.
- Avoid publishing tickets in CI logs, artifacts, browser storage or public static JS. Do not issue or verify privileged tickets from public website JavaScript.
- Preserve `MAIN_PERSONAL_ONLY`, portable disablement, legacy v1 compatibility, independent LYVRA decision authority and existing Cloudflare domain.
- Maintain GitHub and Cloudflare account ownership proofs as separate evidence. No secret values in repository.
- Do not install a new router, GPT Action or connector based solely on this spec. A later target integration requires actual host tool capability and tested authenticated invocation.

## Acceptance tests before promotion

A1 native pinned HEAD + pointer + manifest + 25 critical fingerprint checks pass for current snapshot (count dynamic).
A2 worker HTTP public endpoints + schema + LYVRA_MAIN_PERSONAL authority root pass.
A3 authenticated caller issuance passes, anonymous issuance denied.
A4 correct native context digest matches across signed ticket, independently checked context and verified response.
A5 stale commit, forged hash, wrong namespace, wrong authority, portable branch, incorrect host/purpose and replay are rejected.
A6 network failure or Worker unavailability does not demote a valid native GitHub read or permit host takeover.
A7 legacy v1/v2 regression and FOREGROUND/RECOVERY evidence-only invariants pass.
A8 secret-free logs, deploy provenance, Cloudflare account authenticated readback and rollback are tested.
A9 whole-native rehydration separately satisfies required domains; no PASS from Worker alone.

CURRENT_RELEASE_STATUS=DEV_PROPOSAL_ONLY
AUTO_WIRING=NOT_PROVEN
PRODUCTION_MERGE=NOT_PERFORMED


## 2026-10-04 executable DEV increment — verified test evidence

- `LYVRA_NATIVE_RUNTIME/tools/worker-native-context.mjs`: pure, dependency-free canonical context validator + SHA-256 commitment. Must not be confused with independent repository readback or Worker ticket signature.
- `LYVRA_NATIVE_RUNTIME/tools/worker-native-context.test.mjs`: seven regression tests covering deterministic digest, changed commit hash, missing domain, partial domain, foreign/portable identity, invalid SHA/nonce/extraneous fields and rejection of unjustified NOT_APPLICABLE.
- `.github/workflows/lyvra-worker-evidence-offline.yml`: CI runs the new Node 22 tests and previously established Python tests and non-gating public worker GET checks.
- GitHub Actions run `37237354725` was PASS (7/7 Node tests + 5/5 Python tests). Subsequent stricter domain rejection run `37237425401` was completed SUCCESS. Source SHA at this latter run: `1e172aa008428b1892104c5b07777da4f2e8e697`.
- Worker v1/v2 unchanged, production Cloudflare deployment unchanged. Current native GitHub pointer/fingerprint registry must remain unchanged. No authenticated client ticket binding or independent GitHub data receipt is yet implemented.

IMPLEMENTED=DEV_NATIVE_CONTEXT_VALIDATION_AND_CANONICAL_DIGEST
VALIDATED=CI_PASS_12_REGRESSION_TESTS
UNVERIFIED=TRUSTED_CALLER_PROOF_AND_WORKER_V3_SIGNING_OF_COMMITMENT
PRODUCTION_DEPLOYMENT=NONE
AUTO_SYSTEMSTART_WIRING=NONE

The next gated implementation is secure client authentication + versioned Worker endpoint and independent snapshot verification, with full compatibility/replay/rollback acceptance. Do not merge solely based on schema and digest tests.


## Read-only host bridge DEV increment — 2026-10-04

Added `LYVRA_NATIVE_RUNTIME/tools/worker-native-bridge.mjs` plus `worker-native-bridge.test.mjs`.
The bridge requires an externally verified native GitHub readback flag and structurally
valid canonical envelope before making any HTTP request. It calls **only** public
`GET /v2/authority-root?system=LYVRA` using bounded response and timeout rules.
It checks LYVRA namespace, authority context, MAIN_PERSONAL scope, execution host,
non-ownership and failure policy. Network/HTTP/response failures do not erase
native-rehydration evidence, grant fallback authority, or claim signed proof.
No ticket generation, secrets, authentication, Cloudflare mutation or GitHub CURRENT mutation.
The `nativeReadbackVerified` flag MUST be derived from the independent trusted native
caller; passing it is not proof by itself and the bridge is not auto-installed in host.

GitHub Actions run 37238757278: SUCCESS, 13/13 Node tests and 5/5 Python tests.
Read-only public Worker health/authority GET checks passed in that run.
All tests are DEV evidence. **No end-to-end host startup hook and no signed native-context
roundtrip are established.** The earlier security and provider ownership gates remain.

DEV_READONLY_BRIDGE=IMPLEMENTED_TESTED
NODE_REGRESSIONS=13_PASS
PYTHON_REGRESSIONS=5_PASS
PUBLIC_WORKER_READONLY=PASS_AT_RUN_37238757278
HOST_AUTO_WIRING=NOT_VERIFIED
SIGNED_GITHUB_COMMITMENT=NOT_IMPLEMENTED
DEPLOYMENT_EXECUTED=FALSE


## 2026-10-04 UPDATE: GitHub carrier snapshot consistency (DEV)

Added two source files:
- `LYVRA_NATIVE_RUNTIME/tools/worker-github-snapshot.mjs`: read-only consistency guard for complete Git tree structure, exact repository/branch, required native anchor carriers, full critical-carrier Git blob fingerprint registry and pinned envelope's SHA fields; validates complete native domain envelope. Returns `CARRIER_SNAPSHOT_CONSISTENT` with `verified:false` intentionally — caller-supplied evidence is NOT independent source readback.
- `LYVRA_NATIVE_RUNTIME/tools/worker-github-snapshot.test.mjs`: ten tests of positive consistency, truncated tree, missing anchor, mismatched critical SHA, stale/forged commit and pointer, foreign repo/branch, malformed/duplicate tree nodes, empty registry, incomplete domain.

GitHub Actions readback:
RUN_ID=37239261362
CONCLUSION=SUCCESS
NODE_TESTS=23/23
PYTHON_TESTS=5/5
PUBLIC_WORKER_READ_ONLY_HEALTH=PASS
PUBLIC_WORKER_READ_ONLY_AUTHORITY_CONTEXT=PASS

No live worker mutation, production promotion or credentials. This stage closes structural consistency gaps, NOT authenticated caller identity, independently fetched native source, complete semantic rehydration, signed GitHub context ticket, host-automatic startup or Cloudflare deployment readback.
STATUS=DEV_TESTED_NOT_PRODUCTION


## 2026-10-04 UPDATE: authenticated v3 native-context signing prototype

SOURCE_FILES:
- `LYVRA_NATIVE_RUNTIME/tools/worker-native-v3.mjs`
- `LYVRA_NATIVE_RUNTIME/tools/worker-native-v3.test.mjs`

SOURCE_STATUS=DEV_TESTED_STANDALONE_NOT_ROUTED_NOT_DEPLOYED
FEATURE_FLAG=NOT_CONNECTED_TO_WORKER_ADAPTER
WORKER_V1_V2=UNCHANGED
PRODUCTION_LYVRA=UNCHANGED
CRYPTO_WEBCRYPTO=HMAC_SHA256_EXPLICIT
CLIENT_SIGNING_SEPARATION=TRUE
TICKET_VALIDITY_SECONDS=90
CLOCK_SKEW_SECONDS=60
ATOMIC_REPLAY_STORE_REQUIRED=TRUE
ATOMIC_REPLAY_STORE_PRODUCTION_IMPLEMENTATION=NONE
HOST_AUTHENTICATED_CALLER=NONE
INDEPENDENT_GITHUB_REHYDRATION_PROOF=NOT_IMPLEMENTED
PRODUCTION_SECRET_BINDINGS=NOT_CONFIGURED_OR_VERIFIED

The standalone v3 module supplies makeNativeClientProof(), issueNativeContextTicket()
and verifyNativeContextTicket() with a versioned token, tightly scoped LYVRA/
MAIN_PERSONAL identity, separate client-auth and ticket-signature secrets, a
request+envelope nonce match, short-lived tickets, replay-store hard-fail and
constant-time WebCrypto signature verification. The issuer signs a
caller-provided native context commitment: **it does not independently verify
repository HEAD, whole-system domain rehydration or trust the caller by name**.

CRITICAL DEPLOYMENT GUARDS:
1. Do not deploy v3 until there is a trusted authenticated server-side client
   and separately provisioned secrets in the appropriate Cloudflare environment.
2. Implement a globally atomic nonce consumption backend (e.g. correctly
   serialized Durable Object), **not Cloudflare KV alone**.
3. Integrate a new versioned route in the existing Worker with strict body
   size limits, host binding and exception control. Preserve v1/v2 paths.
4. Bind real native GitHub full readback to the caller independently; require
   its own trusted read evidence before any higher-level verified status.
5. Verify issued tickets against matching current pinned context, test replay,
   rate limits, wrong host, wrong identity, wrong purpose, expiry, rollback.
6. Secure deployment via Wrangler requires independent GitHub Actions/Cloudflare
   credential audit; do not infer from WebRadio repo secrets.
7. No pointer update, native authority transfer or auto-activation of CLIC/PFS.

GitHub Actions run `37239803055` completed SUCCESS after correcting
WebCrypto HMAC import to explicitly use SHA-256. Tests: 35/35 Node and 5/5
Python; public Worker health and authority-root read checks PASS.
No claim of production v3 evidence issuance or authenticated host wiring.

STATE=DEV_CRYPTOGRAPHIC_PROTOCOL_TEST_PASS
WORKER_LIVE_V3=FALSE
REHYDRATION_AUTO_HOOK=NOT_VERIFIED
