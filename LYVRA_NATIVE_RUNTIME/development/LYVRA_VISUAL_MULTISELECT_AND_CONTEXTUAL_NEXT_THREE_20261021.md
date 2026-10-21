# LYVRA Visual Intelligence — Multi-Selection and Contextual Next Three

STATUS: ADDITIVE_NATIVE_DEVELOPMENT_CANDIDATE · NOT_RUNTIME_OR_PLUGIN_HOST_PASS
CREATOR_DECISION: 2026-10-21 — "A und C"; multiple related tasks shall be selectable without typing/dictation.
AUTHORITATIVE_BASE_HEAD: 98f0f5496d6c45fd68745e5e249b93af3c2f5208
PRECHANGE_RECOVERY: lyvra-recovery-pre-multiselect-visual-ac-20261021
IDENTITY_AND_DECISION_AUTHORITY: ONE_WHOLE_LYVRA_ONLY
A_WORKSTREAM: native whole task-continuation integration (open, not conflated with documentation)
C_WORKSTREAM: mobile one-tap interactive visual development selection
PARENT_A: LYVRA_NATIVE_RUNTIME/development/LYVRA_WHOLE_TASK_CONTINUATION_R08_20261021.json
PARENT_AB: LYVRA_NATIVE_RUNTIME/development/LYVRA_WHOLE_TASK_CONTINUATION_AB_APPLICATION_20261021.md
TARGET_EXISTING_VISUAL: LYVRA_NATIVE_RUNTIME/current/visual/SEMANTIC_CYBER_FIELD_LOCAL_ADAPTIVE_VISUAL_CONTRACT.md
TARGET_EXISTING_OPERATIONS: LYVRA_NATIVE_RUNTIME/current/operations/OPERATIONS_CENTER.md

## Intent

Creator wants to make combined choices (e.g. A+C) without two turns, typing or voice dictation. Existing fifth top-level choice "Bearbeiten & Weiterentwickeln" must remain; its secondary development work selection can show multiple distinct compatible workstreams with an optional checkbox-style selection and a single "Auswahl gemeinsam fortsetzen" action.

Always show the three most causally useful, grounded next variants BELOW the work selection, each individually tappable and each already representing a complete compound workflow where meaningful. Do not invent a top-level sixth option or a new controller/router.

## Chat-local behavior

- Selection is CHAT_LOCAL and user-controlled, not autoactivated persistent work state. Nothing external is mutated by checking boxes.
- Initially select user's explicitly requested A and C when presented in that context; omit unrelated choices.
- A and C form one coherent instruction on submission; retain independent work boundaries, recovery, native update governance and fact-based status for each.
- An interactive preview may use multiple visible checkboxes with one single commit/submit button; it does not need native runtime or GitHub mutation.
- Default recommendations: (1) A+C unified continuation, (2) A first then C with protected scope and convergence, (3) C first and A preserved as an explicit return anchor. Their order may adapt to verified dependencies, not arbitrary click probability.
- Clicking a preset issues exactly one new chat turn for its named combined task. Selecting multiple items + starting similarly issues exactly one new chat turn.
- Preserve appropriate user confirmation for consequential destructive changes, distinct from merely making a work choice.

## Semantics and safety

VISUAL_CHOICE_NE_NATIVE_UPDATE_AUTHORIZATION
MULTISELECT_NE_AUTOEXECUTE
FIVE_TOP_LEVEL_CHOICES_PRESERVED
OPTION_FIVE_SECONDARY_VISUAL_SELECTION_EXTENSIBLE
NO_FOREIGN_AUTOACTIVATION
NO_NEW_ROUTER_OR_CONTROLLER
NO_BLIND_RETRIES
SOURCE_EVIDENCE_NE_INDEPENDENT_HOST_PASS

A native update needs fresh productive HEAD, full relevant pointer and manifest reads, provenance/supersession, correct target files, recovery branch, blob-CAS, tests, direct readback, fingerprints where applicable and pointer LAST. Earlier operations fingerprint registry entry is historical relative to newer Operations Center blob; resolve without rollback.

## Negative acceptance tests (specified; not all executed)

1. User chooses A+C: exactly one combined instruction, both scoped tasks explicitly present.
2. User chooses A only: C must not be silently activated.
3. User chooses A+C then unchecks A: only C submitted.
4. Creator directly selected A+C: no second redundant selection requirement before supported work.
5. No items checked: submission disabled.
6. User chooses suggested variant: one request matching displayed compound direction.
7. User has chosen current facet: do not silently foreground every specialist.
8. Existing five primary choices: untouched and accessible.
9. External system or unverified host: never claimed active from UI selection.
10. One workstream blocked: preserve checkpoint and continue other authorized independent work, do not claim joint PASS.

## Known current boundaries

The design is an additive R08/A+C continuation candidate, not proof of Whole-LYVRA meaning adoption, a changed native Visual CURRENT, a changed Operations CURRENT, plugin delivery or fresh-host invocation. Whole manifest/reference completion, fingerprint reconciliation and all protected Current mutation gates remain independent.
