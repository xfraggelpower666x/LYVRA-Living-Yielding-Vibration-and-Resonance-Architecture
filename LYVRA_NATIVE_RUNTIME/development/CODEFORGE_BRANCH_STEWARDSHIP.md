# CodeForge Branch Stewardship — Repository Order & Hygiene

STATUS=CURRENT_CODEFORGE_STEWARDSHIP_CAPABILITY
ROLE=REPOSITORY_ORDER_RECOVERY_AWARE_BRANCH_HYGIENE
IDENTITY=LYVRA
DECISION_AUTHORITY=LYVRA_ONLY

CodeForge keeps LYVRA's repository understandable, recoverable and causally ordered without flattening or erasing valid history.

## Stewardship flow

DISCOVER
→ CLASSIFY
→ RELATE
→ DETECT_REDUNDANCY
→ VERIFY_SUPERSESSION
→ PRESERVE_RECOVERY
→ PREPARE_CLEANUP_PROPOSAL
→ AUTHORIZED_CLEANUP
→ DIRECT_READBACK

## Branch classes

CURRENT_AUTHORITY
| ACTIVE_DEV
| HISTORICAL_DEV
| RECOVERY_BACKUP
| PRECHANGE_RECOVERY
| RELEASE_CANDIDATE_HISTORY
| AUDIT
| CONTINUITY_RECOVERY
| DEPLOYMENT_HISTORY
| MIGRATION_HISTORY
| SUPERSEDED
| CLEANUP_CANDIDATE
| UNCLASSIFIED_REVIEW

## Core rules

1. Every branch should have a documented reason to exist.
2. Age alone is never enough to classify a branch as obsolete.
3. Exact SHA duplication is a redundancy signal, not automatic cleanup authority.
4. A branch becomes a cleanup candidate only after its provenance, meaning and recovery role are preserved elsewhere.
5. Current authority and active recovery anchors are never cleanup candidates.
6. Historical branches may remain when they preserve meaningful provenance.
7. Cleanup is a separate governed phase from classification.
8. CodeForge must verify branch state again after any cleanup operation.
9. Newer valid evolution must never be lost for cosmetic tidiness.
10. Repository order must reduce ambiguity, not create a new controller layer.

## Repository Health visibility

Operations Center may surface:

CURRENT_BRANCH
| TOTAL_BRANCHES
| ACTIVE_DEV
| RECOVERY_ANCHORS
| DUPLICATE_SHA_GROUPS
| SUPERSEDED
| CLEANUP_CANDIDATES
| UNCLASSIFIED
| BRANCH_PROTECTION
| NEXT_HYGIENE_ACTION

No fake percentage or synthetic health score without an explicit evidence-backed formula.

## Naming guidance for new work

Preferred forms:

- dev/<scope>-<date>
- backup/<scope>-<date>
- audit/<scope>-<date>
- rc/<scope>-<date>
- recovery/<scope>-<date>

Legacy names remain provenance and are not renamed merely for cosmetic consistency.

## Current phase

Phase-1 inventory:
LYVRA_NATIVE_RUNTIME/development/BRANCH_STEWARDSHIP_PHASE1_2026-10-05.md

PHASE_1=MAP_CLASSIFY_RELATE_ONLY
BRANCH_REMOVAL_PERFORMED=false
