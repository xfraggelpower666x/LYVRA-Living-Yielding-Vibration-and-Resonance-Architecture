# LYVRA Track Design ↔ CLIC — Currentness and Output Assembly Review

STATUS: STAGED_EVIDENCE_ONLY | PRODUCTIVE_RUNTIME_UNCHANGED | REPAIR_READBACK_PENDING
DATE: 2026-11-21
NATIVE_OWNER: WHOLE_LYVRA
BASE_PRODUCTIVE_HEAD: f75789056f37c3fd03fa351ec594f0548384d999
PRE_CHANGE_RECOVERY_BRANCH: lyvra-recovery-pre-clic-track-currentness-20261121-r01
REVIEW_BRANCH: lyvra-review-clic-track-currentness-20261121-r01
FOREIGN_SCOPE: CLIC_READ_ONLY | NO_FOREIGN_AUTOACTIVATION | NO_CROSS_SYSTEM_MERGE
SCOPE: EXISTING_TRACK_DESIGN_CURRENTNESS_AND_OUTPUT_ASSEMBLY_ONLY

## Native functions preserved (direct productive-source reads)

1. `LYVRA_NATIVE_RUNTIME/continuity/VERSION_FRESHNESS_GUARD.md` already defines WHOLE_REVISION, TRACK_REVISION, FRESHNESS_EPOCH, CARRIER_PATH, CONTENT_SHA and POINTER_BINDING; stale or superseded inputs must not become Current.
2. `LYVRA_NATIVE_RUNTIME/current/rehydration/PRE_REHYDRATION_OVERSTEER_GUARD.md` already rejects host/chat authority override, old handoff promotion and specialist auto-foreground.
3. `LYVRA_NATIVE_RUNTIME/current/music/TRACK_DESIGN_FULL_CAPABILITY_MODE_BRIDGE.md` and `LYVRA_NATIVE_RUNTIME/current/music/RENDERER_TRANSLATION_AND_OUTPUT_GUARD.md` already require full relational music intelligence and real assembled-output checks in both Source and Discovery.
4. `LYVRA_NATIVE_RUNTIME/development/tests/track-relational-renderer-output.test.mjs` already tests copy fields, order, controls, drift, My Taste, UTF-16 counting and several negative cases. These tests are static Markdown-contract regressions, NOT observed host runtime or audio.
5. Current productive pointer specifies Whole Rev242 and Track Design Rev96. Some still-reachable component carriers have historical baseline markers: Track Music Intelligence Rev92, Output Guard Rev95, Track Reference Registry Rev86. Those markers are not inherently erroneous and must NOT be blindly overwritten with Rev96.
6. The 2026-11-21 same-commit Git-tree readback matched all 261 registered `critical_carriers` Git blob SHA values; this establishes registered source integrity, not live assembled-output behavior.

## Three bounded findings and required gates

### A. Adaptive template invalidation

EXISTING_CONCEPT: cache hit does not prove Current; fingerprints and native authority are required.
UNPROVEN_EXECUTION: no evidenced end-to-end assembler execution rejecting a previously accepted template after a valid source blob/revision change.
MINIMAL_REPAIR_SCOPE: only the existing currentness/assembly boundary; on changed authorized source hash, invalidate derived output/template and re-resolve relevant native musical relations before presenting. Preserve unaffected music knowledge and source-mode fidelity.
ACCEPTANCE: positive unchanged-source re-use; negative mutated-source stale-template rejection; rebuild from newer source succeeds; no unrelated facet invalidation.

### B. Understeer / Oversteer survival

EXISTING_CONCEPT: oversteer source-precedence guard and full-capability output guard exist.
UNPROVEN_EXECUTION: a real assembled-output test exercising understeer (loss of important native musical content) and oversteer (host/template addition or authority takeover) together is not evidenced by the static Markdown fixture.
MINIMAL_REPAIR_SCOPE: test the existing production assembly pathway, not a new composer/router/facet.
ACCEPTANCE: reject understeer that drops causally required motor/meaning/emoji/voice/ending relations; reject oversteer that injects unrequested form/slider/source authority; preserve valid creator-directed omission and device routes; require real final copy payload/count match; host and Suno verification separately classified.

### C. Component / Track / Registry revision separation

EXISTING_CONCEPT: `VERSION_FRESHNESS_GUARD.md` already defines scoped revisions and source hashes.
UNPROVEN_EXECUTION: a single observed assembled output with explicit provenance mapping component source SHA, Track Design current Rev96, registry SHA/epoch and active device/output scope has not been evidenced.
MINIMAL_REPAIR_SCOPE: derive a provenance crosswalk BY REFERENCE from the existing pointer and fingerprint registry. Do not rewrite historical component header revisions or forcibly bump Whole/Track.
ACCEPTANCE: historical Rev92/95/86 components remain correctly scoped; mismatched source hashes fail; track Rev96 stays current; registry epoch identifies the precise source set; no hidden alias of component revision to track revision.

## Protected publication gates

- BASE_HEAD + expected target SHA + native owner; no unexpected competing branch movement.
- Recovery branch exists BEFORE any productive write.
- Exact bounded regression on current repo code; track-source and device-routing regressions must remain green.
- Both LYVRA plugin entrypoints: impact review and release/parity when semantic runtime changes; no claims based only on source text.
- BODY -> direct readback -> registry/manifest/coverage as applicable -> CURRENT_POINTER LAST -> readback only.
- No CLIC writes. Informational CLIC return-handoff only after verifiable productive outcome; CLIC decides whether to consume it.
- No new facet, no new router, no rollback, no fabricated host/Suno acceptance.

## Current disposition

The evidence confirms the existence of native contracts but does not establish end-to-end survival gates. Productive files are UNCHANGED. This staged review is NOT a repair, NOT a completed UPDATE, and NOT an authorization for automatic publication. A verified CLIC return-handoff claiming successful repair is NOT YET AVAILABLE.
