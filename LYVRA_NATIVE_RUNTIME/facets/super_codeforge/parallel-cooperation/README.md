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
