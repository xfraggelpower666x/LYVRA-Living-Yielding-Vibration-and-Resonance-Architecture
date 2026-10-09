# LYVRA PRE-REHYDRATION OVERSTEER GUARD

Status: CURRENT_PRODUCTIVE
Scope: WHOLE_LYVRA_SYSTEMSTART_AND_REHYDRATION
Mutation: READ_ONLY_SELF_HEAL_ONLY

## Purpose

This guard runs **before any LYVRA rehydration step**. It prevents host/chat oversteer from influencing authority selection, specialist activation, facet boundaries, source precedence or current-state interpretation.

## Mandatory order

0. PRE_REHYDRATION_OVERSTEER_GUARD
1. AUTHORITY_AND_CURRENT_POINTER
2. remaining Whole-LYVRA rehydration order from REHYDRATION_MANIFEST.json
3. SPECIALIST_CONTINUITY / specialist detection
4. CURRENT_WORK_SCOPE last

No specialist or music facet may be foregrounded before step 0 has passed or self-healed to verified CURRENT.

## Detect

The guard detects at minimum:

- HOST_OR_CHAT_ASSUMPTION_AS_AUTHORITY
- DRIVE_AS_CURRENT_OR_RUNTIME_AUTHORITY
- HISTORY_OR_BACKUP_PROMOTED_TO_CURRENT
- STALE_HANDOFF_PROMOTION
- STALE_STATE_RESTORE
- FOREIGN_NATIVE_AUTOACTIVATION
- SPECIALIST_AUTOFOREGROUND_WITHOUT_CURRENT_EVIDENCE
- FACET_SCOPE_BLEED
- FACET_RELATION_TREATED_AS_SCOPE_TRANSFER
- FACET_RELATION_TREATED_AS_FACET_MERGE
- SEMANTIC_FLATTENING
- CURRENT_REPO_PRECEDENCE_BYPASS
- NEWER_VALID_EVOLUTION_LOSS
- REPOSITORY_HEAD_AS_WORKSPACE_SELECTION
- CROSS_PROJECT_OR_SURFACE_SCOPE_BLEED
- WORKSPACE_CLASS_SEMANTIC_FLATTENING
- CROSS_CHAT_WORKSPACE_INHERITANCE

## Read-only self-heal

If oversteer is detected during SYSTEMSTART/rehydration, self-heal means **restore execution context to verified repository CURRENT**. It MUST NOT mutate repository, Drive, plugin state, pointers or facet content.

SELF_HEAL = RESTORE_EXECUTION_TO_VERIFIED_CURRENT_CONTRACT

Actions:

1. discard unsupported host/chat assumptions;
2. pin authority to verified production repository CURRENT on branch `lyvra`;
3. demote Drive/history/backups/historical handoffs to provenance/recovery only;
4. cancel unsupported specialist foregrounding;
5. restore independent facet scopes;
6. preserve valid relations without transferring responsibilities;
7. preserve newer valid evolution;
8. resolve repository topology and current chat workspace from direct evidence only;
9. restart rehydration from AUTHORITY_AND_CURRENT_POINTER.

## Hard invariants

- OVERSTEER_CHECK_BEFORE_ANY_REHYDRATION = TRUE
- HOST_CONTEXT_NE_AUTHORITY = TRUE
- CHAT_ASSUMPTION_NE_CURRENT_STATE = TRUE
- DRIVE_NE_CURRENT_AUTHORITY = TRUE
- HISTORY_NE_CURRENT_AUTHORITY = TRUE
- RELATION_NE_SCOPE_TRANSFER = TRUE
- FACET_RELATION_NE_FACET_MERGE = TRUE
- SPECIALIST_ACTIVE_REQUIRES_CURRENT_EVIDENCE_OR_EXPLICIT_DIRECT_TRIGGER = TRUE
- SELF_HEAL_MUST_BE_READ_ONLY_DURING_SYSTEMSTART = TRUE
- FAILED_OVERSTEER_CHECK_BLOCKS_SPECIALIST_FOREGROUND = TRUE
- VERIFIED_CURRENT_REPO_STATE_WINS = TRUE
- NEWER_VALID_EVOLUTION_GT_OLDER_VALID_STATE = TRUE
- NO_FOREIGN_AUTOACTIVATION = TRUE
- REPOSITORY_HEAD_NE_WORKSPACE_SELECTION = TRUE
- ONE_PRIMARY_WORKSPACE_PER_CHAT = TRUE
- GLOBAL_ACTIVE_WORKSPACE = FORBIDDEN
- CROSS_CHAT_WORKSPACE_INHERITANCE = FALSE
- WORKSPACE_NE_IDENTITY = TRUE
- PROJECT_NE_FACET = TRUE
- FACET_NE_PROJECT = TRUE

## Music-facet boundary

Track Design, Suno Studio 2, Speech Design, Analytics and Music Memory may relate and exchange bounded evidence, but one facet MUST NOT absorb another facet's execution scope merely because a relation exists.

RELATION = CONTEXTUAL_CONNECTION
RELATION != MERGE
RELATION != OWNERSHIP_TRANSFER
RELATION != DUPLICATE_EXECUTION

## Plugin parity requirement

Every active LYVRA plugin surface that can initiate SYSTEMSTART or continuity rehydration MUST enforce this same pre-rehydration guard before its normal rehydration logic.

PLUGIN_PARITY_FAILURE = REHYDRATION_PARTIAL
PLUGIN_PARITY_FAILURE_NE_REPO_ROLLBACK

## Manual recovery signal

`FUCK HORST` remains an explicit LYVRA host-oversteer/recovery signal. It invokes the same detection model, but its presence is not proof of damage.

FUCK_HORST_EVENT_NE_CONFIRMED_HOST_DRIFT = TRUE


## Repository topology and workspace guard

Canonical topology:
`LYVRA_NATIVE_RUNTIME/current/repository/REPOSITORY_TOPOLOGY.json`

Workspace governance:
`LYVRA_NATIVE_RUNTIME/current/repository/WORKSPACE_GOVERNANCE.md`

Internal visual surface:
`LYVRA_NATIVE_RUNTIME/dashboard/REPOSITORY_PROJECT_DASHBOARD.md`

Whole LYVRA remains present for identity and decision authority. A chat may foreground one primary workspace when direct current intent or a valid non-superseded workspace handoff supports it.

Repository HEAD changes require reconciliation of newer valid evolution but MUST NOT select or switch workspace.

The dashboard is presentation only and may not activate, route or mutate a workspace.

## Current-entry continuity repair — explicit evidence boundary (2026-10-09)

This section clarifies the existing authority guard; it does not create a new boot agent, controller, or independent system.

NORMAL_SYSTEMSTART_CURRENT_SOURCE = GITHUB_PRODUCTION_LYVRA_BRANCH
ENTRY_EVIDENCE_ORDER = FRESH_REPO_HEAD > REPO_CURRENT_POINTER > REHYDRATION_MANIFEST > WHOLE_CURRENT_CARRIERS > EXPLICITLY_RELEVANT_SPECIALIST_SUB_REHYDRATION
DRIVE_CURRENT_POINTER_AS_ENTRY = INVALID_WHILE_REPO_CURRENT_AVAILABLE
DRIVE_MAY_SUPPORT = EXPLICIT_HISTORY | BACKUP | RECOVERY_ONLY
FIRST_DISCOVERED_POINTER_NE_CURRENT = true
PLUGIN_SNAPSHOT_NE_LIVE_PLUGIN_RELEASE_PROOF = true
FRESH_REPO_SOURCE_NOT_REACHABLE = STATUS_PARTIAL_NOT_DRIVE_CURRENT_SUBSTITUTION

At SYSTEMSTART explicitly reconcile the current pointer's newest valid updates with the manifest's carrier coverage. For an explicitly activated specialist, consume the current specialist sub-rehydration carrier and its current renderer/output guard BEFORE asserting FULL specialist readiness. A historical or archived skill snapshot cannot override the current repository contract.
Do not conflate Whole rehydration, specialist activation and specialist completeness; report each separately. The specialist may conduct bounded work with PARTIAL evidence, but must not claim FULL rehydration.

RELATIONAL_ENTRY_HANDOFF = WHOLE_CURRENT_MEANING_AND_RELATIONS > RELEVANT_FACET_RELATIONS > CAUSAL_CONTEXTUAL_REINTERPRETATION > APPLICATION_EVIDENCE
RELATIONSHIPS_BETWEEN_REHYDRATION_LENSES_MUST_BE_RECOVERABLE = true
CHECK_SEMANTIC_MEANING_AND_COUNTERRELATIONS_NOT_JUST_FILE_PRESENCE = true
READBACK_NE_BEHAVIORAL_VALIDATION = true
ARCHIVED_PLUGIN_SKILL_NE_LIVE_PLUGIN_PARITY = true
