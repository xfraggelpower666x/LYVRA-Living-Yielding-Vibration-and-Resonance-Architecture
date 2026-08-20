# 666 GLOBAL MAIN-SYSTEM AUTHORITY EVIDENCE GATE v2.0.0

## Purpose

Evolution of `LYVRA_BOOT_AUTHORITY_GATE v1.0.0`.

The Worker provides additional host-independent, namespace-bound authority evidence for personal main systems. It is not an absolute root of trust, system owner, creative authority, or canonical storage.

## Deployment authority

`DEPLOY_MODE=MANUAL_WRANGLER`

GitHub is source/config/checkpoint authority only. This directory does not establish GitHub auto-deployment.

## Portable rule

Personal Worker binding applies only to `MAIN_PERSONAL` systems.

Portable/shareable branches do not inherit personal endpoints, signing secrets, authority contexts, recovery bindings, or Worker tickets.

## API compatibility

Historic LYVRA v1 endpoints remain supported:

- `GET /v1/authority-root`
- `POST /v1/boot-ticket`
- `POST /v1/verify-ticket`

Generic v2 endpoints:

- `GET /v2/systems`
- `GET /v2/authority-root?system=<namespace-or-system-id>`
- `POST /v2/evidence-ticket`
- `POST /v2/verify-evidence`

Evidence purposes:

- `BOOT`
- `FOREGROUND`
- `RECOVERY`

## Failure semantics

Worker evidence loss is not automatically target-system failure.

Worker-generated statuses include:

- `WORKER_VERIFIED`
- `WORKER_REACHABLE_NO_VALID_EVIDENCE`
- `WORKER_CONFLICT`
- `WORKER_VERIFICATION_FAILED`
- `WORKER_NOT_CONFIGURED`

Host-side integrations may additionally report `WORKER_UNAVAILABLE_IN_HOST` or `WORKER_ENDPOINT_UNAVAILABLE` when the Worker cannot be reached.

## Main-system registry

The registry is server-side and namespace-bound. Clients may select a registered system but may not upload or redefine its authority root.

Known personal main-system candidates:

- LYVRA
- 666CLIC
- 666PFS
- 666CSM
- 666LINGUA
- 666CLS
- additional systems only after native authority verification

This is not an eternally closed list.

## Secrets

Prefer separate signing bindings per system:

- `LYVRA_BOOT_SIGNING_SECRET`
- `CLIC_AUTHORITY_SIGNING_SECRET`
- `PFS_AUTHORITY_SIGNING_SECRET`
- `CSM_AUTHORITY_SIGNING_SECRET`
- `LINGUA_AUTHORITY_SIGNING_SECRET`
- `CLS_AUTHORITY_SIGNING_SECRET`

Secret values must never be committed, printed, exposed in frontend code, or included in portable exports.

## LYVRA state

LYVRA development TODOs remain paused. Worker maintenance does not implicitly resume them.
