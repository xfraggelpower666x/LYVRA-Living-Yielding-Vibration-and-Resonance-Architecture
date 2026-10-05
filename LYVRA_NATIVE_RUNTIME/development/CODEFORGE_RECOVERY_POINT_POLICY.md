# CodeForge Recovery Point Policy

STATUS=CURRENT_CODEFORGE_RECOVERY_POLICY
DATE=2026-10-05
IDENTITY=LYVRA
DECISION_AUTHORITY=LYVRA_ONLY

## Goal

Preserve safe rollback and causal continuity without creating a new Git branch for every bounded write.

PRECHANGE_RECOVERY_POINT_REQUIRED=true
PRECHANGE_RECOVERY_BRANCH_ALWAYS_REQUIRED=false

A Git commit SHA is already an immutable repository object and can be a valid recovery anchor when it is recorded with enough provenance.

## Recovery point classes

### R1 — COMMIT_ANCHOR

Use for low-risk bounded metadata, manifest, checkpoint, dashboard-contract or pointer-preparation changes when:
- the exact pre-change HEAD is known,
- affected files were freshly read,
- the write is additive/minimal,
- direct post-write readback is performed,
- pointer-last discipline remains intact,
- no branch rewrite, migration, deployment replacement or destructive cleanup is involved.

Required record:
PRECHANGE_HEAD
AFFECTED_PATHS
WRITE_SCOPE
READBACK_RESULT
POINTER_LAST_IF_APPLICABLE

### R2 — NAMED_RECOVERY_BRANCH

Use for material multi-file product changes, deployments, migrations, plugin-source changes, broad continuity refactors, branch cleanup, or any operation where a human-readable rollback anchor materially improves recovery.

### R3 — RELEASE/FREEZE RECOVERY

Use for promotion, release candidate, production deployment, large migration, or other high-impact transitions requiring an explicit preserved recovery surface.

## Branch-growth guard

Before creating a recovery branch CodeForge asks:

1. Does the immutable pre-change commit SHA already provide complete rollback?
2. Is a named branch necessary for human recovery/discovery?
3. Is this change material/high-risk enough to justify another branch?
4. Does an equivalent recovery branch already exist at the same SHA and scope?

If answers show a commit anchor is sufficient:
RECOVERY_POINT=R1_COMMIT_ANCHOR
NEW_BACKUP_BRANCH=false

Exact-SHA duplicate branches are never deleted automatically, but this policy prevents unnecessary new duplicates.

## Hard fences

NO_RECOVERY_WEAKENING=true
NO_FORCE_REWRITE=true
NO_AUTOMATIC_BRANCH_DELETION=true
CURRENT_AUTHORITY_ALWAYS_PRESERVED=true
MATERIAL_OR_DESTRUCTIVE_CHANGE_REQUIRES_R2_OR_R3=true
POINTER_LAST_DISCIPLINE_PRESERVED=true
