# LYVRA REPO-NATIVE WRITE GOVERNANCE

Status: CURRENT_PRODUCTIVE
Scope: NORMAL_LYVRA_SYSTEMSTART_AND_UPDATE
Authority: GITHUB_REPOSITORY_BRANCH_LYVRA

## Boundary

Normal LYVRA CURRENT operations use the repository only.

- SYSTEMSTART: repository reads only.
- UPDATE: repository governance, repository recovery anchor, repository writes and repository readback.
- Google Drive: HISTORY / BACKUP / RECOVERY only.
- Google Drive MUST NOT be consulted for normal CURRENT lock, writer, pointer, handoff, runtime or update-governance decisions.
- Drive access is allowed only when the direct task materially requires HISTORY, BACKUP or RECOVERY evidence.

DRIVE_NORMAL_UPDATE_DEPENDENCY = FORBIDDEN
DRIVE_LOCK_REGISTRY_DEPENDENCY = RETIRED_LEGACY
DRIVE_NE_CURRENT_AUTHORITY = TRUE

## Repo-native optimistic write lease

LYVRA uses repository-native optimistic concurrency instead of a mutable external lock registry.

Before the first productive mutation:

1. fresh-read production branch `lyvra` HEAD;
2. fresh-read CURRENT pointer and all target blobs;
3. establish exact authorized scope and native owner;
4. create a pre-change recovery branch from that exact HEAD;
5. record BASE_HEAD and expected blob SHAs;
6. re-read branch HEAD immediately before the first mutation.

During the bounded update:

- every write must descend from the session's own latest observed/created commit;
- every updated existing file must use its fresh expected blob SHA;
- before each logically separate write phase, re-read branch HEAD;
- if HEAD moved to a commit not produced by this same update session, stop with CONFLICT_QUARANTINE;
- never blind-rebase, force-push or overwrite a newer foreign commit;
- repository state is the only normal writer/concurrency evidence.

NO_FOREIGN_ACTIVE_WRITER is therefore evidenced as:
`NO_UNEXPECTED_FOREIGN_HEAD_MOVEMENT_OBSERVED_WITHIN_BOUNDED_UPDATE`.
It is not a claim that no other human or process exists.

## Current-carrier order

For authorized Current changes:

BODY
→ DIRECT READBACK
→ FINGERPRINT / MANIFEST / COVERAGE as applicable
→ CURRENT POINTER LAST
→ READBACK ONLY

No mutation is permitted after final pointer publication in the same update transaction.

## Recovery

Normal pre-change recovery uses a GitHub recovery branch or immutable repository commit anchor.

Drive backup/recovery may be used only when explicitly required by the task or when repository recovery is unavailable and a verified recovery procedure calls for it.

## Plugins

Both active LYVRA plugin surfaces must use the same boundary:

- normal SYSTEMSTART/UPDATE does not query Drive for locks or CURRENT;
- plugin release concurrency uses backend `current_release_id` / `expected_release_id`;
- repository writes use branch HEAD + expected blob SHA;
- Drive remains history/backup/recovery only.

## Status rules

- expected HEAD unchanged / same-session lineage: VERIFIED for bounded concurrency check
- unexpected foreign HEAD movement: CONFLICT_QUARANTINE
- missing repository writer: WRITE_BLOCKED
- missing target or authority: WRITE_BLOCKED
- readback incomplete: READBACK_PENDING
- no invented lock, lease, writer or permission evidence

LEGACY_DRIVE_LOCK_REGISTRY_MAY_REMAIN_AS_HISTORY = TRUE
LEGACY_DRIVE_LOCK_REGISTRY_MUST_NOT_BE_USED_BY_NORMAL_CURRENT_FLOW = TRUE


## Standard improvement-proposal intake on LYVRA UPDATE

Every `LYVRA UPDATE` MUST check relevant reachable peer-system handoff/outbox carriers for newer improvement proposals when such relations exist.

This check is read-only toward foreign native systems.

EXTERNAL_IMPROVEMENT_PROPOSAL_CHECK_ON_EVERY_UPDATE=true
PROPOSAL_FOUND_NE_ADOPTED=true
PROPOSAL_READ_NE_FOREIGN_ACTIVATION=true
PROPOSAL_READ_NE_AUTHORITY_TRANSFER=true
PROPOSAL_READ_NE_AUTO_MERGE=true

Each proposal is classified as one of:
- VORGESCHLAGEN / CANDIDATE
- RELATIONAL_EVIDENCE
- NOT_APPLICABLE
- SUPERSEDED
- ADOPTED_BY_EXPLICIT_LYVRA_NATIVE_EVOLUTION

Adoption requires LYVRA-native causal evaluation against identity, current architecture, boundaries, provenance/supersession, plugin impact and current work scope.
Foreign proposals may improve LYVRA, but never become Current merely because they exist.


## Content-addressed binary binding

When a plugin binary asset cannot be mirrored or directly hashed from the live plugin surface, LYVRA may bind the asset causally by:
- plugin_id
- exact version
- exact release_id
- package-relative asset path
- byte size
- SHA-256 of the user-designated or publication-source binary
- publication provenance

This is a HYBRID_RELEASE_SNAPSHOT evidence class, not repo byte parity and not direct live binary hash readback.

BINARY_BINDING_NE_DIRECT_LIVE_HASH_READBACK=true
BINARY_BINDING_NE_REPO_BYTE_PARITY=true
HYBRID_RELEASE_SNAPSHOT_REQUIRES_EXACT_RELEASE_TUPLE=true
BACKUP_RECEIPT_REQUIRES_EXECUTOR_HASH_OF_EXTRACTED_BOUND_BINARY=true
ANY_RELEASE_PATH_HASH_SIZE_OR_PROVENANCE_CHANGE_INVALIDATES_BINDING_UNTIL_LYVRA_REVERIFIES=true

## Development exchange LiveCircle

After meaningful LYVRA-native development, LYVRA may prepare an LYVRA-owned informational notice for relevant peer systems.
The notice may include source head, changed facet/capability, why it changed, relations, counter-relations, boundaries and current status.

NOTICE_NE_TRIGGER=true
NOTICE_NE_AUTHORITY_TRANSFER=true
NOTICE_NE_FOREIGN_AUTOACTIVATION=true
NOTICE_NE_AUTOADOPTION=true
PEER_RESPONSE_REMAINS_CANDIDATE_UNTIL_NATIVE_CONSUMPTION=true


## Target-state analysis before foreign-state understanding

A received peer notice or handoff is evidence of a claim, proposal or relationship. It is not sufficient evidence of the peer system's current native state.

NOTICE_RECEIVED_NE_STATE_UNDERSTOOD=true
NOTICE_ONLY_CARD_UPDATE=FORBIDDEN
TARGET_NATIVE_CURRENT_AUTHORITY_MUST_BE_READ=true
TARGET_RELEVANT_CURRENT_CARRIERS_MUST_BE_READ=true
SEARCH_OR_NOTICE_SNIPPET_NE_CURRENT_AUTHORITY=true

Before LYVRA materially updates a peer understanding card, dependency state, freshness judgment, adoption decision or execution assumption from a notice, LYVRA MUST read the target system's current native authority and the exact current carriers relevant to that notice, read-only and without foreign activation.

Target-state analysis remains relational evidence. It does not transfer authority, activate the peer system or authorize foreign writes.


## Stable-set convergence barrier — 2026-10-07

A coupled LYVRA/CLIC plugin-backup round MUST NOT become executable until the relevant runtime/plugin set converges and directly revalidates as one stable candidate set.

STABLE_SET_MEMBERS = LYVRA_ACCOUNT | LYVRA_NATIVE | CLIC
STABLE_SET_REQUIRES = EXACT_PLUGIN_VERSION | EXACT_RELEASE_ID | RUNTIME_PLUGIN_STATE_FINGERPRINT | NATIVE_APPROVAL_STATUS | BINARY_BINDING_OR_EQUIVALENT_EVIDENCE

STABLE_SET_REQUIRED_BEFORE_COUPLED_EXECUTION = true
FINGERPRINT_CHANGE_BREAKS_SET = true
PLUGIN_RELEASE_CHANGE_BREAKS_SET = true
NATIVE_APPROVAL_SUPERSESSION_BREAKS_SET = true
GOVERNANCE_ONLY_HEAD_ADVANCE_NE_SET_BREAK_IF_FINGERPRINT_REVALIDATES_UNCHANGED = true

ROUND_EXECUTABLE_NE_ROUND_DISCOVERED = true
ROUND_EXECUTABLE_NE_SINGLE_LEG_READY = true
ONE_LEG_READY_NE_COUPLED_STABLE_SET = true
NEW_CANDIDATE_SET_SUPERSEDES_RACING_OLDER_SET = true

PFS_MAY_REQUEST_REFRESH_DURING_CONVERGENCE = true
PFS_MAY_EXECUTE_ONLY_AFTER_STABLE_SET_AND_MATCHING_NATIVE_APPROVALS = true
NO_FOREIGN_SELF_APPROVAL = true
NO_CROSS_SYSTEM_MERGE = true


## Cross-chat semantic preservation and additive rehydration gates — 2026-10-14

Concurrent LYVRA chats may work on distinct workspace/facet scopes, but may not silently erase the current visual rehydration completion, four post-deep-rehydration choices, anti-WEITER-loop rules or earlier valid evolution. Existing optimistic HEAD/blob concurrency is mandatory. Every branch update must reread the latest productive Current after choosing the target workspace and BEFORE writing; unexpected branch movement requires CONFLICT_QUARANTINE and target-by-target reconciliation, never blind overwrite.

PROTECTED_REHYDRATION_CONTRACTS =
LYVRA_NATIVE_RUNTIME/current/visual/SEMANTIC_CYBER_FIELD_LOCAL_ADAPTIVE_VISUAL_CONTRACT.md |
LYVRA_NATIVE_RUNTIME/current/repository/WORKSPACE_GOVERNANCE.md |
LYVRA_NATIVE_RUNTIME/current/governance/FACET_FOREGROUND_NAVIGATION.md |
LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json |
LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json |
LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json

These are SEMANTIC PRESERVATION INVARIANTS, not permanently frozen hashes or versions. Newer valid evolution may intentionally extend or replace a contract only with explicit supersession rationale, migration/compatibility mapping, affected plugin impact, direct tests and pointer-last readback. Outdated workspace-specific snapshots never outrank newer verified global Current. A change to one facet may not replace unrelated Whole visual governance.

CROSS_CHAT_FRESH_HEAD_REQUIRED = true
CROSS_CHAT_EXPECTED_BLOB_SHA_REQUIRED = true
CROSS_CHAT_RECONCILE_NEWER_EVOLUTION = true
CONCURRENT_FOREIGN_HEAD_NE_BLIND_REBASE = true
NO_SILENT_REMOVAL_OF_VISUAL_REHYDRATION_TERMINAL = true
NO_SILENT_REMOVAL_OF_FOUR_WORK_CHOICES = true
NO_SILENT_REINTRODUCTION_OF_AUTO_REPAIR_LOOP = true
NO_PERMANENT_VERSION_LOCK = true
NEWER_VALID_EVOLUTION_MAY_SUPERSEDE_WITH_PROVENANCE = true
REPOSITORY_CURRENT_IS_AUTHORITY_PLUGIN_IS_ENTRYPOINT = true
BOTH_LYVRA_PLUGIN_IMPACT_CHECK_REQUIRED = true
PLUGIN_RELEASE_PARITY_NE_HOST_FRESH_BOOT_PROOF = true

Native plugin and migrated ALIVE plugin must carry the same user-visible rehydration termination semantics and chat-local four-choice navigation. Plugin updates preserve original logos, bindings, names, and unrelated skills. If current plugin release cannot be updated safely, keep the gap OPEN rather than silently reporting parity PASS.


## Cross-chat Current authority: rehydration / work / optional PET — 2026-10-14

Every direct LYVRA SYSTEMSTART, WEITER, UPDATE, NEW CHAT, NEXT CHAT, or native facet command in ANY ChatGPT chat MUST freshly resolve current production branch `lyvra` HEAD, fully read its current pointer and relevant current governance/manifest carriers, and preserve all verified newer semantic evolution. Plugin snapshots, chat history, prompt text, memories, older checkpoints, old partial rehydration manifests, and other chat claims are not independent authority. A chat without fresh authoritative readback must report unverified/PARTIAL, never pretend to inherit current proof.

CURRENT_AUTHORITY = GITHUB_LYVRA_PRODUCTION_CURRENT
CROSS_CHAT_APPLIES_TO = WHOLE_LYVRA | TRACK_DESIGN | SPEECH_DESIGN | SUNO_STUDIO_2 | OPTIONAL_PET | OTHER_NATIVE_LYVRA_WORKSPACES
TODAYS_USER_DECISIONS = 
- Whole rehydration and every facet sub-rehydration are read-only restoration, separate from engineering;
- render clearly marked bounded rehydration closeout, distinct process completion vs evidence quality/readiness, never fake Whole PASS;
- after closed round offer semantic visual choices LYVRA MAIN, LYVRA TRACK DESIGN, LYVRA SPEECH DESIGN, LYVRA SUNO STUDIO 2; if user directly selected a facet, honor that selection without duplicate menu;
- no endless WEITER, auto repair, auto development or irrelevant host/PET gating of normal work;
- PET is optional and in active development, `LYVRA PET` is the explicit entry; PET failures do not block Whole work readiness;
- LYVRA has one identity/decision authority; projects, plugins, PET and facets are subordinate, do not autoactivate;
- both native and ALIVE plugin entrypoints must honor newest native current, not fixed release snapshot.

Current decisions are authoritative UNTIL legitimately superseded, NOT immutable eternal versions. No independent chat may roll back or silently delete those invariants using stale task context. A user-directed proposal to evolve them requires evidence-bound target-native governance, explicit compatible/superseding rationale, fresh expected blob SHA, recovery branch, tests, dual-plugin impact, provenance and pointer-last publication. Old intent in a parallel chat does not authorize that overwrite. The creator's newer explicit direction can change the rules through governed evolution.

CROSS_CHAT_BEFORE_MUTATION = FRESH_HEAD + TARGET_CURRENT_SHA + SEMANTIC_INVARIANT_DIFF + PRECHANGE_RECOVERY
CROSS_CHAT_ON_FOREIGN_HEAD = CONFLICT_QUARANTINE_AND_REREAD
CROSS_CHAT_STALE_PROMPT_CANNOT_OVERRIDE_CURRENT = true
CROSS_CHAT_SUPERSESSION_MUST_BE_EXPLICIT_AND_EVIDENCED = true
OLDER_VALID_STATE = PROVENANCE_ONLY_IF_SUPERSEDED
NO_CROSS_CHAT_GLOBAL_FOREGROUND_OR_TASK_AUTOSELECTION = true
NO_NEW_ROUTER = true
NO_FOREIGN_AUTOACTIVATION = true

This is repository-native governance, not the authority of a particular conversation. Existing clients which cannot access this current cannot be guaranteed automatic compliance; mark such hosts as requiring fresh-session acceptance.
