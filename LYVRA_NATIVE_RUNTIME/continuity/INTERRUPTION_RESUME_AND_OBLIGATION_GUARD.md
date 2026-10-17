# LYVRA - Interruption, Resume and Obligation Guard
STATUS: DEVELOPMENT_CANDIDATE_NOT_PRODUCTION_CURRENT
DATE: 2026-10-17
OWNER: WHOLE_LYVRA
SCOPE: EXISTING_UPDATE_GOVERNANCE_AND_CONTINUITY
BASE_CURRENT: 690e8211ebb60fdbf19e37efa4cf01c653db1ab2
SOURCE: CREATOR_DIRECT_FEEDBACK_AFTER_TRACK_MODE_UPDATE_INTERRUPTED

## Failure observed
A creator-authorized Track Design UPDATE was interrupted by a source-of-truth clarification. Although the clarification was applied, the previously authorized UPDATE was not automatically resumed through plugin parity, current pointer and final readback. A partial branch was reported instead. This is observable task-continuity failure; no unverified host-runtime root cause is asserted.

## Core invariants
INTERRUPTION_NE_CANCELLATION = true
CLARIFICATION_NE_NEW_TASK_REPLACING_ACTIVE_TASK = true
UNFINISHED_AUTHORIZED_TASK_REMAINS_OPEN = true
PARTIAL_STATUS_NE_COMPLETION = true
NEW_MESSAGE_MAY_UPDATE_CONSTRAINTS_WITHOUT_DISCARDING_PRIOR_INTENT = true
USER_EXPLICIT_CANCEL_OR_SUPERSESSION_WINS = true
REPO_CURRENT_FIRST = true
DRIVE_IS_HISTORIC_REFERENCE_NOT_NORMAL_UPDATE_TARGET = true
NO_NEW_CONTROLLER_ROUTER_FACET_OR_SYSTEM = true

## Existing continuity work envelope (not a new daemon)
During a creator-authorized multistep operation maintain in the active conversation or an existing lineage-scoped native handoff:
- original_creator_intent and approved_scope;
- current_verified_head and currentness of references;
- completed_steps with direct evidence;
- remaining_required_steps and evidence gates;
- interrupting_new_message classified as CLARIFICATION | ADDED_CONSTRAINT | NEW_RELATED_WORK | EXPLICIT_PAUSE | EXPLICIT_CANCEL | SUPERSEDING_NEW_TASK | AMBIGUOUS;
- updated constraints, safe resume anchor and write-governance status;
- actual outcomes and exact unresolved blockers.
No fabricated chat ID, repository version, lock or release identity.

## Interruption process
1. On incoming user message while approved work remains open, compare with active approved intent and current work envelope.
2. If clarification or additive constraint: incorporate it, refresh impacted source/permissions/target assumptions, then return to exact next uncompleted step within the same authorized scope. Do not silently terminate.
3. If the message explicitly pauses, cancels or supersedes the task: honor new intent and preserve an accurate suspended/cancelled record. Do not continue prior writes.
4. If genuinely independent new work clearly takes precedence: preserve active obligation as OPEN_INTERRUPTED and do not falsely mark completed. Resume only when intent permits, never against the creator's new priority.
5. If ambiguity affects destructive writes or authority, avoid unsafe mutation; surface PARTIAL/REVIEW with the exact anchor rather than assuming consent.
6. Before dependent writes, revalidate fresh productive GitHub HEAD, target blob/release versions, authority, backups and conflict/foreign-writer constraints. Never resume using stale assumptions or blindly rebase.
7. After executing resumed work, verify body -> native readback -> both plugin impact/release-readbacks where material -> fingerprints/manifest -> pointer last -> final readback. Report production COMPLETE only if applicable gates pass.
8. At any partial close, explicitly list remaining obligations and exact next safe action; do not equate branch creation or document readback with productive completion.

## Acceptance examples
A. Creator: "Integrate and update" -> UPDATE active; subsequent "repo first, Drive only history" -> constrain storage targets, then resume original UPDATE.
B. Creator: "Integrate and update" -> subsequent "stop" -> no further mutation; preserve cancelled status.
C. Creator: "Integrate and update" -> subsequent "make another track" -> do new selected task, keep earlier UPDATE OPEN_INTERRUPTED, never report it complete.
D. Plugin write unavailable -> native stage remains PARTIAL, plugin parity READBACK_PENDING; do not publish false complete status.
E. Multiple interruptions -> track all latest constraints; no out-of-order completion or forgotten remaining gates.

## Architecture
This is an additive hardening of existing LYVRA update/continuity reasoning, NOT another scheduler, task controller, daemon or global pointer. It cannot create an autonomous background job. Only direct user turns or tools executing in the current turn can resume work. Native current and existing per-workspace lineage are authoritative after verification.

## Promotion
Development branch source only until governed native update, both applicable plugin surfaces assessed/updated, direct readbacks and CURRENT pointer-last promotion. Host-runtime acceptance remains distinct from repository readback.
