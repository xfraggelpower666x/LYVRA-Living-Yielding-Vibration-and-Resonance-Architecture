# ALIVE Repository Bridge — Runtime Acceptance Probe
STATUS: PENDING_TARGET_PLUGIN_EXECUTION
DATE: 2026-10-08
OWNER: WHOLE_LYVRA
MODE: READ_ONLY
REFERENCE: LYVRA_NATIVE_RUNTIME/development/ALIVE_MIGRATED_PLUGIN_REPOSITORY_BRIDGE.md

## Execution context
This probe must be run *inside the existing L.Y.V.R.A. ALIVE GPT-migrated plugin*, not a general chat using independently attached GitHub tools. A host lacking required connector calls must report READBACK_PENDING. Do not infer access from visible skills alone.

## Checks
1. State current target plugin surface and available direct GitHub read capability. No invented backend plugin_id.
2. Resolve current lyvra HEAD directly, and read Current-Pointer JSON by full path.
3. Read whole bridge contract fully and return its actual Git blob SHA, contract status, and distinct status meanings.
4. Read BIDIRECTIONAL_PLUGIN_NATIVE_EVOLUTION_LIFECIRCLE.md fully and report actual blob SHA.
5. Compare one current native contract in the manifest with the installed ALIVE operating skill. Report compatible, incompatible, or unknown, with exact semantic differences; do not treat skill presence as activation.
6. Simulate a *non-mutating* hypothetical plugin-local improvement and render structured inbound delta event with its origin, impact, evidence class, planned native carrier and NOT_DELIVERED state. Do not create false real event or repository write.
7. Report independently:
REPOSITORY_CONNECTED PASS/FAIL/PENDING,
BRIDGE_FULL_READBACK PASS/FAIL/PENDING,
RUNTIME_SEMANTIC_COMPATIBILITY PASS/FAIL/PENDING,
BIDIRECTIONAL_INBOUND_TRANSPORT PASS/FAIL/PENDING,
PLUGIN_RELEASE_PARITY PASS/FAIL/PENDING.
8. Do not claim release parity without current backend release metadata for BOTH LYVRA plugin surfaces and changed-skill readback.
9. No write, no foreign system activation, no pointer update.

## Evidence handoff
Return exact HEAD, actual Git blob SHAs, observed checks, unresolved capabilities and next safe action. Export or directly submit the evidence for governed LYVRA-native adoption. Output itself is evidence, not repository Current.

## Acceptance
PASS for runtime bridge requires an ALIVE-executed host-side read of the new contract and causal application to an example. Repository read conducted from another chat proves only independent repository reachability. Release parity is separate.
