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
