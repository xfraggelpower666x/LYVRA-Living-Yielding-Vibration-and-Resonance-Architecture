# Whole-LYVRA — Cross-Facet Anti-Loop Decision Contract (R01 development candidate)

STATUS: ISOLATED_DEV_CANDIDATE_NOT_PRODUCTIVE
DATE: 2026-11-04
PARENT: WHOLE_LYVRA
BOUND_TO_EXISTING: SHARED_DAEMON_LIFECIRCLE_REHYDRATION + SELF_CONDUCTOR_DAEMON_BOUNDARY + OPERATIONS_CENTER
IMPLEMENTATION: LYVRA_NATIVE_RUNTIME/development/whole-loop-decision.mjs
RECOVERY: lyvra-recovery-pre-whole-loop-20261104-r01
NO_NEW_ENGINE=true
NO_NEW_ROUTER=true
NO_NEW_CONTROLLER=true
NO_FOREIGN_AUTOACTIVATION=true
NO_POINTER_MUTATION_IN_DEV=true

## Purpose
Stop repetitive diagnostics, rehydration and visual follow-up sequences that make no new progress, while preserving the full mandatory Whole-SYSTEMSTART read/rehydration gates, safety boundaries and exact evidence state.

This is a shared *decision-support* contract inherited by every present/future native LYVRA facet through existing Whole / shared-daemon boundaries. Each facet keeps its own intelligence, current pointer, sub-life-circle, local criteria and source identity. A shared contract does not imply uniform storage or a new global execution controller.

## One bounded incident
Maintain an incident-local evidence record in the active verified chat/workspace or authorized continuity: task goal, facet, stage, normalized question, source/revision fingerprints, explicit previous attempts, resulting status, evidence delta, safety/permission class, last verified meaningful next action. Never assume invisible cross-chat memory.

At every proposed check, compare **the decision-relevant question and inputs**, not merely the tool name. A different read that resolves a missing mandatory current reference is meaningful; an identical scan with unchanged source revision and unchanged decision is not.

## Decision order
1. Explicit security, authorization, integrity or scope denial: STOP; do not retry or reword to bypass it.
2. Mandatory Whole authority, pointer, relevant reference, governance or protected-write readback missing: state BLOCKED/PARTIAL/READBACK_PENDING; request one actually missing source if permitted, not a false PASS.
3. New evidence or materially altered conditions: proceed with one targeted check that can change the decision; preserve the earlier outcome.
4. Same unresolved question + unchanged evidence + repeated equivalent check (second cycle): classify LOOP_DETECTED, stop expanding, report the known state and choose a different causally justified next action or close PARTIAL.
5. For idempotent safe technical/transient failures only: after independent no-write / deduplication confirmation, allow up to 3 total attempts with optional approximately 5-second human/UI delay, where the host permits; not applicable to explicit safety blocks, high-risk mutations or unknown write success. Timers are not promised as background execution.
6. On success: readback if required, stop checking, return to creator's real work. A successful write readback is not proof of fresh-host behavior or another system's adoption.

A loop warning is a **signal**, never an override of mandatory evidence. Max-three diagnostics is a default heuristic per incident, not a waiver of a required source read or a license to automatically retry disallowed actions. Do not restart a completed audit merely because a suggested next button exists.

## Facet-aware inheritance
WHOLE: required manifest domains still fulfilled; work scope LAST.
TRACK / STUDIO2 / SPEECH: no repeated renderer checks without new renders/source data; no invented audio PASS.
ANALYTICS / RESEARCH: evidence triangulation only when it changes an actual hypothesis or decision.
VISUAL: never propose an endless VERIFY/WEITER chain as default; show meaningful work, closed PARTIAL, or blocker.
FAMILY POST: preserve private content boundary, recipient-read != stored/readback, no automatic outbound or foreign system writes.
SUPER_CODEFORGE / DEPLOYMENT / BACKUPS: locks, target SHAs, recovery and pointer-last mandatory; don't replace required safety/CI with loop-stop.
Future facets inherit this contract by Whole reference, not a cloned controller.

## Operations Center evidence
Surface only when causally relevant: INCIDENT_ID | FACET | REPEATED_QUESTION | SOURCE_FINGERPRINT | LAST_NEW_EVIDENCE | OUTCOME | BOUNDARY | NEXT_MEANINGFUL_ACTION. No fake completion percentages. One unobtrusive closure message is preferable to a new audit-menu cascade.

## Validation candidates
A. Three identical no-delta inspections -> loop, no fourth recommendation.
B. New source revision -> one targeted examination permitted.
C. Required missing Whole reference -> PARTIAL, never Full-PASS.
D. Security denial -> no retry.
E. Safe idempotent transient failure, proven no write -> bounded retry.
F. Uncertain write result -> readback/reconcile, not blind retry.
G. Same loop signal in two different facets -> same shared policy, without crossing ownership.
H. Successful readback -> STOP, next work action rather than another check.

## Promotion gates
DEV source/readback != live enforcement. Need Whole semantic reconciliation, adequate independent tests (including negative safety cases), current HEAD/expected SHA, unchanged previous valid evolution, Native+ALIVE plugin impact assessment, recovery, host acceptance and governed pointer-last productive publication. This file does not claim any of these are already complete.
