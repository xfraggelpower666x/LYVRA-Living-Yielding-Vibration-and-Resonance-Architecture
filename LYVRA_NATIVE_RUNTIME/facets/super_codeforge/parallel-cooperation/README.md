# SuperCodeForge Parallel Cooperation R02

Additive source modules for the existing LYVRA SuperCodeForge facet. This directory is not a new system, router, controller, agent runtime, transport or message bus.

Modules:
- capability-contract.mjs — typed capability and permission contract; no self-promotion.
- capability-catalog.mjs — in-memory metadata only.
- peer-source-registry.mjs — read-only source snapshots and pointer mismatch quarantine.
- parallel-wave-planner.mjs — dependency/read-write conflict scheduling only.
- composition-planner.mjs — reviewable proposals only.
- evidence-ledger.mjs — in-memory provenance records only; no durable storage or peer authentication.

Tests: `node --test LYVRA_NATIVE_RUNTIME/facets/super_codeforge/parallel-cooperation/test/*.test.mjs`.

R02 source tests are local evidence, not GitHub CI, remote delivery, plugin host acceptance or peer deployment. Current verified peer capabilities remain zero.

## R03 — Coding Profi engineering coordination (additive)
The original R02 catalog, peer registry, wave planner, composition planner and evidence ledger remain unchanged. `coding-profi-coordination.mjs` provides a **read-only, review-only** capability and peer-currentness report. `example-r02-integration.mjs` binds this module to the exact original R02 imports and rejects bad source/permission claims. Its 18 original contract tests plus 11 genuine R02/R03 integration tests reside under `test/`.
Coordinator = LYVRA_CODING_PROFI for technical review **only**. Every peer retains its own native identity, pointer, permission and execution authority. No agent dispatch, source verification promotion, peer delivery, adoption, plugin-host assertion or foreign repository writes. A release is source integration only, not a live multi-agent swarm. The prechange recovery branch and the GitHub PR/CI receipt should be consulted before interpreting status.
