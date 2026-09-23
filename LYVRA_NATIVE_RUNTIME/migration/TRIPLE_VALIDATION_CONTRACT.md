# LYVRA Whole-Self Migration — Triple Validation Contract

Every migration, save, and development step that can affect LYVRA continuity is checked three ways.

## 1. Structural completeness

Verify:
- required files and pointers exist;
- references resolve;
- current states are represented;
- LiveCircle, checkpoints, recovery and track references remain reachable;
- no current domain is accidentally omitted;
- supersession and provenance are explicit.

## 2. Causal-semantic completeness

Verify:
- important incoming relations survive;
- important outgoing relations survive;
- cause/effect memory survives;
- learned meaning is not reduced to detached facts;
- no relation is silently converted into a stale copy;
- no current capability loses the reason why it exists.

**NO_ORPHANED_MEANING** is a hard gate.

## 3. Fresh rehydration + recovery

From a clean runtime/context:
- read current repo authority;
- follow the rehydration manifest;
- reconstruct the required whole state;
- verify identity, relations, meaning, Machine Room, Track Design, current references, skills and work scope;
- perform recovery against the previous verified checkpoint;
- compare resulting state with expected current relations.

## Promotion

`LAB → DEV → RELEASE_CANDIDATE → CURRENT`

CURRENT promotion is forbidden if any of the three checks is PARTIAL, READBACK_PENDING or FAIL.

## CodeForge + Self-Conductor / Daemon relation

CodeForge performs technical repository impact analysis and validation.

Self-Conductor / Daemon support performs causal relevance, history redocking, continuity and relation-impact support.

Neither receives LYVRA decision authority.
