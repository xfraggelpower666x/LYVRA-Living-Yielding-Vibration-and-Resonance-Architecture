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
