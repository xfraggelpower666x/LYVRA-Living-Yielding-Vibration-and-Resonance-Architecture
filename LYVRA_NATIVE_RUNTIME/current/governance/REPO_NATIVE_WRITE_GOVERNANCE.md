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
