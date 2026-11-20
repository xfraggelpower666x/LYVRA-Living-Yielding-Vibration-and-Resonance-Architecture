# LYVRA Worker Evidence — optional preflight (DEV, 2026-10-03)

STATUS=DEV_CANDIDATE_NOT_LIVE_INTEGRATED
SCOPE=LYVRA_READ_ONLY_OBSERVATION
SOURCE_PRODUCTIVE_HEAD=4415940bfa68f54348f9ac67b9bcce78ef7e5897
WORKER_SOURCE_BRANCH=worker-v2-main-system-authority
WORKER_SOURCE_HEAD=f26c15a262c830bda67b752c6b59725e31c160a8
SCRIPT=LYVRA_NATIVE_RUNTIME/tools/worker_evidence_preflight.py

This is **not** a new controller, native router, worker deployment, automatic task, or authority owner. The worker is historically named `lyvrasystem`, a v2.0.0 evidence-only gate for MAIN_PERSONAL systems. Its signed BOOT / FOREGROUND / RECOVERY tickets do not replace native GitHub CURRENT or native operation semantics. No automatic invocation has been enabled.

Run on a trusted local/CI environment when desired:
```sh
python LYVRA_NATIVE_RUNTIME/tools/worker_evidence_preflight.py
```

This fixed-host client sends **GET requests only** to `/health` and `/v2/systems` with short timeouts and maximum body length. It prints only HTTP/parse result classifications; **does not print response payloads**, fetch secrets, issue evidence tickets, or treat HTTP 200 as a cryptographic PASS. No POST, no state mutation, no credentials embedded or required. The host response is untrusted.

Interpretation:
- `HTTP_200_JSON_OBSERVED`: HTTP and JSON parsing succeeded; **not** evidence authentication, schema/canon match, worker identity attestation, or native rehydration PASS.
- `WORKER_ENDPOINT_UNAVAILABLE`: local runtime cannot reach the endpoint; **not** proof of a dead Cloudflare Worker.
- HTTP errors, invalid JSON/schema and oversize responses are surfaced without changing authority.

Readback before any promotion: authenticated Cloudflare Workers script/domain/deployment identity and safe signed ticket test in explicitly authorized personal scope. Preserve `LYVRA_BOOT_SIGNING_SECRET`, `PORTABLE_WORKER_BINDING=DISABLED`, target-native scopes and existing v1 compatibility. The August 20, 2026 checkpoint documents historical deployment only; the discovery snapshot reporting `CLOUDFLARE_API_TOKEN=MISSING` is earlier than the successful deploy and must not be misrepresented as current.

NO_DEPLOYMENT=true
NO_AUTOLOAD=true
NO_GITHUB_CURRENT_POINTER_MUTATION=true
NO_PFS_CLIC_MUTATION=true
PRIVATE_VAULT_NOT_READ=true


## Additive security review — 2026-10-03

The candidate initially relied on urllib's redirect-following default. This violated the *fixed-host* intent. DEV repair added `NoRedirectHandler`, so HTTP 3xx is reported locally as `HTTP_ERROR` instead of sending follow-up requests to any `Location` host. The two allowed initial request paths remain GET-only, and no token, secret, signed ticket or authority value is sent.

Offline tests: `python -m unittest discover -s LYVRA_NATIVE_RUNTIME/tools -p "test_worker_evidence_preflight.py" -v`.
Cases cover redirect rejection, bounded successful JSON classification that explicitly is *not* signed verification, HTTP 302 classification without follow-up, invalid/oversize responses, and endpoint unavailability. The test module uses only mocked openers and never performs real network access. These tests are supplied as a candidate; **execution evidence is pending** until actually run in a trusted runtime.

SECURITY_REVIEW=REDIRECT_BOUNDARY_REPAIRED_IN_DEV
OFFLINE_TEST_EXECUTION=PENDING
PRODUCTION_PROMOTION=NOT_AUTHORIZED_BY_TEST_SOURCE_ALONE


## Execution evidence — 2026-10-03 (after original DEV drafting)

This later evidence supersedes the earlier `OFFLINE_TEST_EXECUTION=PENDING` flag above **for the tested DEV sources only**. Earlier statements are preserved as dated provenance.

- CI test run `37155625979` at commit `11f95e03157a9436ace282a560129c9131bf5811`: syntax PASS; five mocked offline tests PASS.
- Public read-only health run `37155676854`: `GET /health` and `GET /v2/systems` both produced HTTP 200 and JSON when called by the GitHub runner. The local ChatGPT web viewer remained unable to access the same endpoints; this is a tool-specific visibility difference, not an outage claim.
- Public authority contract run `37155775987`: five offline tests PASS, /health expected service PASS, /v2/systems LYVRA enabled in MAIN_PERSONAL scope PASS, /v2/authority-root?system=LYVRA correct identity, role constraints, and worker non-authority policy PASS. A previous strict probe received HTTP 403 due to default Python User-Agent; aligning to the bounded known User-Agent fixed this without bypassing a worker security control.
- Non-mutating, one-shot signed evidence roundtrip `37155868636`: `POST /v2/evidence-ticket` purpose FOREGROUND, system LYVRA, MAIN_PERSONAL, and `POST /v2/verify-evidence`: PASS. Ticket only held in CI process memory and not printed, no native foreground command executed, no signing key read or exported. Successful signed proof is **scoped to the test at this date**, not permanent worker uptime nor host auto-wiring.
- One-shot Cloudflare authenticated provider audit `37155921214`: BLOCKED: GitHub Actions did not have values for `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; script stopped before any Cloudflare API request. Prior historical deploy receipts cannot substitute authenticated current provider account/domain/deployment readback.
- Temporary one-shot tests were removed from the repeatable workflow after execution; offline Python tests and bounded public checks remain. Public identity live check is best-effort and not a native rehydration gate.

CURRENT DEV EVIDENCE:
`OFFLINE_5_OF_5=PASS`
`PUBLIC_HEALTH_AND_REGISTRY=PASS_AT_2026_10_03`
`PUBLIC_LYVRA_AUTHORITY_ROOT=PASS_AT_2026_10_03`
`SIGNED_FOREGROUND_EVIDENCE_ROUNDTRIP=PASS_AT_2026_10_03`
`CLOUDFLARE_AUTHENTICATED_OWNER_READBACK=BLOCKED_MISSING_GITHUB_BINDINGS`
`NATIVE_CHATGPT_AUTOMATIC_WORKER_WIRING=NOT_IMPLEMENTED`
`RELEASE_PROMOTION=BLOCKED_BY_PROVIDER_READBACK_AND_NATIVE_INTEGRATION_GATES`
`NO_MUTATION_OF_PRODUCTION_POINTER_OR_FOREIGN_SYSTEMS=TRUE`

The authenticated account audit may be resumed only through a legitimate Cloudflare connection or a governed secret-backed read-only workflow, never by inventing credentials or leaking tokens.
