# DEPLOYED VERIFIED — Worker v2.1 — 2026-10-05

STATUS=DEPLOYED_VERIFIED
TARGET_SCRIPT=lyvrasystem
LIVE_VERSION=2.1.0
SERVICE=666_MAIN_SYSTEM_AUTHORITY_EVIDENCE_GATE
DEPLOY_MODE=DIRECT_CLOUDFLARE_API_EXISTING_SCRIPT_ONLY
SOURCE_REF=worker-v2-main-system-authority
SOURCE_WORKER_BLOB_SHA=78261aadf52ca0cb9178ceca54fe09d8d57bf7db
SOURCE_PATH=cloudflare-workers/personal-main-system-authority

PREVIOUS_LIVE_VERSION=2.0.0
PREVIOUS_VERSION_ID=e14c3d4c-a9f1-46a8-b61f-d3a927589ee3

POST_DEPLOYMENT_ID=485b345a-2b00-4473-b8a2-d6a5b4ca68ae
POST_VERSION_ID=0e2ed614-3c44-413b-ac85-61c53c143e31
POST_TRAFFIC_PERCENTAGE=100
POST_CREATED_ON=2026-10-05T12:11:48.384102Z

LIVE_CODE_READBACK_VERSION=2.1.0
LIVE_CODE_READBACK_TICKET_LIFETIME_SECONDS=300
LIVE_ENTRY_POINT=worker-runtime-adapter.js
LIVE_COMPATIBILITY_DATE=2026-04-09

PRESERVED_BINDINGS:
- LYVRA_BOOT_SIGNING_SECRET (secret_text)
- PORTABLE_WORKER_BINDING=DISABLED
- WORKER_SCOPE=MAIN_PERSONAL_ONLY

V3_BINDINGS_PRESENT=FALSE
SQLITE_BINDING_PRESENT=FALSE
DURABLE_OBJECT_BINDING_PRESENT=FALSE
NEW_CLOUDFLARE_RESOURCE_CREATED=FALSE
PLAN_CHANGE=FALSE

HARDENING:
- built-in LYVRA and 666CLIC registry identities protected from server-side override / alias shadowing
- v2 ticket TTL reduced from 900 to 300 seconds
- issuer / subject / temporal relationships / max lifetime / ticket identifier checked
- v1 compatibility retained in source regression tests

ROLLBACK_VERSION_ID=e14c3d4c-a9f1-46a8-b61f-d3a927589ee3

NOTE:
The public custom-domain endpoint could not be fetched by the external web reader in this session. Verification therefore consists of direct Cloudflare API deployment state, live script-content readback, preserved settings/bindings, and 100% deployment assignment.

STATUS_SUMMARY=SOURCE_V2_1_VERIFIED; CLOUDFLARE_LIVE_V2_1_VERIFIED_BY_DIRECT_API_READBACK; ZERO_NEW_RESOURCE_BOUNDARY_PRESERVED.
