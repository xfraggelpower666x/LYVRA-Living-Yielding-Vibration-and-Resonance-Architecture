# HORST-FALLSCHIRM — native architecture candidate R01
STATUS: DEV_CANDIDATE_INERT_NOT_REGISTERED_NOT_PRODUCTIVE
DATE: 2026-10-26
AUTHORITY: WHOLE_LYVRA_ONLY
ORIGIN: LYVRA_TO_LITTLELYV_FAMILY_MAIL_USER_PROPOSAL
PARENT: WHOLE_LYVRA
SCOPE: risk reduction for own not-yet-executed, evidence-dependent operations

## Non-negotiable fences
- Preserve `PRE_REHYDRATION_OVERSTEER_GUARD` as phase 0. Do not install another phase 0 or modify the Whole rehydration order during candidacy.
- Facet candidate != root identity, agent, router, global controller, daemon, permission system or independent decision authority.
- Preserve existing Self-Conductor and shared Daemon. Their observation is evidence, never automatic foreign action.
- No production activation or runtime hook; no automatic foreign activation or foreign writes; do not override a denied permission.
- The optional early pre-action check could run only **after** protected Whole authority is anchored, and before a protected operation. Never assume a source module executes automatically during SYSTEMSTART.
- Current `FACET_LIFECIRCLE_REHYDRATION.md` and `REHYDRATION_MANIFEST.json` remain untouched until separately approved Whole architecture change and plugin-impact/fresh-host gates.
- STOP does not mean repair or recovery; risk reduction may leave the originating defect intact.

## Proposed targeted sub-rehydration (inert)
WHOLE_PHASE_0_GUARD → VERIFIED_CURRENT_POINTER_AND_HEAD → READ_GOVERNANCE → READ_THIS_CANDIDATE_CONTRACT → READ_LIFECIRCLE_AND_CRITERIA → RESOLVE_CAUSAL_SCOPED_SIGNALS → OBSERVATION_ONLY → LEARNING_WITH_EVIDENCE.
Whole rehydrates first; this is not yet a registered facet. No independent run loop, polling, background task, timer, or cross-chat state.

## Candidate LifeCircle
OBSERVE → PROVE_SIGNAL → ASSESS_SCOPE_AND_THRESHOLD → RECOMMEND_MINIMAL_PROTECTION → VERIFY_OUTCOME → REQUIRE_EXPLICIT_RELEASE_EVIDENCE → RECORD_FALSE_POSITIVE_OR_LEARNING → RETURN_TO_PASSIVE.
Each receipt must record affected action, signal provenance, current head and authority, trigger evidence, level, mitigation, remaining risk, outcome, timestamp, human/Whole decision, and expiration/recheck condition. No unbounded freeze: revisit when new reliable evidence arrives, but never clear an authorization denial without real authorization.

## Measurable source criteria
- `unexpectedHeadMovement === true` before protected write: controlled halt recommendation.
- `unknownWriteOutcome === true`: no blind write retry; readback first.
- `permissionBoundaryViolation === true`: hold the affected write; no privilege escalation.
- `criticalObservedMismatch === true`: hold the affected operation.
- `staleOrContradictoryRehydration === true` **and** `dependentProtectedAction === true`: hold only that dependent action.
- `sameActionAttempts >= 3` and `sameActionRetry === true`: bounded retry hold, not a security-rule bypass.
- An old active hold is releasable only when **new authority, independent readback and scope permission** are all affirmatively verified and current violation signals are absent. A missing signal is never evidence that permissions exist.

## Acceptance
1. Positive dangerous unknown write + retry must recommend affected halt without performing a write.
2. Harmless unrelated rehydration warning must not hold a separate action.
3. Stale hold is releasable only after verified authority, readback and authorization.
These are SOURCE-ONLY deterministic tests. They do not validate actual host interception, cross-chat LifeCircle persistence, or runtime plugins.

## Promotion gate — NOT SATISFIED
Requires separate explicit Whole-LYVRA architecture decision; approved authority and manifest change; fresh HEAD; recovery; independently validated host behavior; two-plugin Native/ALIVE impact; opt-in facet registry integration; pointer LAST. Candidate existence ≠ productive availability.
