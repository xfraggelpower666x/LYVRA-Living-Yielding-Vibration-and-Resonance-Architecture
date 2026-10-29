# R09 — Frozen return anchor versus verified same-session development lineage
STATUS: ISOLATED DEVELOPMENT ONLY
OWNER: EXISTING WHOLE LYVRA UPDATE / CONTINUITY
SOURCE: R08 interruption intelligence + live GitHub recovery readback 2026-10-29
BASELINE_ANCHOR: c34352188aa87b6e34a0af280a1c679183244344
RECOVERY_BRANCH: lyvra-r09-recovery-pre-interruption-gates-20261029
NO_NEW_CONTROLLER: TRUE

## Correction
A frozen return anchor points to an immutable recoverable checkpoint. It is not the persistent expected HEAD for every later developer commit. Every own candidate mutation advances the branch. Treating any HEAD greater than the frozen checkpoint as a foreign writer is a false conflict. Conversely, simply seeing ancestry is NOT enough to assert the update is ours: unrelated actors can append commits to the same ancestry.

## Safe bounded write lineage
Before first change, pin fresh candidate HEAD and expected target blobs, create recovery branch and independently verify it.
After each write, record exact returned commit_sha, immediately read branch HEAD and changed blob at that commit. Maintain an ordered allowed same-session SHA chain.
Before next change, fresh-read branch HEAD; accept only if equal to the latest **already read-back verified own commit SHA**, with expected target blob SHA, and no unrecognized intervening commit.
If HEAD equals a descendant of baseline but is NOT one of the locally evidenced own commits, stop CONFLICT_QUARANTINE; do not auto-rebase, accept by ancestry alone or force-push.
Keep the original frozen recovery branch immutable; record new checkpoint only when explicitly justified and bound to already readback-verified HEAD.
For interrupted sessions, the next chat MUST read fresh branch HEAD and all relevant ledgers. Old 'own' chain evidence is provenance, not a live lock or assumed exclusive access. Reconcile newer valid changes before resuming and create fresh recovery if new writes begin.
Changes to workstreams must preserve 9 Visual IDs, 5 R07 UPDATE IDs and 5 R08 Parallel IDs unless explicitly approved and traced. Source, plugin, ZIP mirror and host statuses remain distinct.

## Actual R09 outcomes
- Recovery branch c343521… matches frozen candidate exactly.
- Three exact ledger Git blob SHAs at recovery match base commit.
- Before R09 work, candidate is 38 commits ahead of unchanged production with no preexisting productive file changes.
- Ten tests check real GitHub evidence plus synthetic wrong-head, stale-blob, wrong-anchor and thread-loss variants; all passed.
- Host denial remains blocked; no browser workaround.
- No claim that existing simulation passes imply released host or plugin behavior.

## Explicit negative outcomes
WRONG_RECOVERY_HEAD => CONFLICT_QUARANTINE
UNKNOWN_DESCENDANT_HEAD => CONFLICT_QUARANTINE
STALE_TARGET_BLOB => CONFLICT_QUARANTINE
THREAD_ID_LOSS => CONFLICT_QUARANTINE
UNAVAILABLE_REFERENCE => READBACK_PENDING
OWN_COMMIT_WITH_DIRECT_READBACK => CONTINUE_IF_ALL_OTHER_GATES_PASS
BROWSER_HOST_SECURITY_DENIED => HOST_BLOCKED_NO_BYPASS
CURRENT_POINTER_WRITE => FORBIDDEN_UNTIL_PRODUCTIVE_GATES_PASS
