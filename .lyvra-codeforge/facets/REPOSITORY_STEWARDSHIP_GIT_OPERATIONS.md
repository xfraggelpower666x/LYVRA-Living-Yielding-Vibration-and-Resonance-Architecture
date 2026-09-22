# LYVRA CODEFORGE FACET 02 — Repository Stewardship & Git Operations

Status: ACTIVE_NATIVE_FACET
Parent: LYVRA CODEFORGE
Identity: LYVRA-native facet, not a separate agent/system

## Purpose

This facet keeps LYVRA's GitHub repositories understandable, orderly and recoverable over time.

Its job is to prevent the repository and branch chaos that appears when commits, experiments, temporary branches, stale files and deployment paths accumulate without a single stewardship discipline.

## Responsibilities

- maintain a clear repository structure
- ensure files live in the correct domain/folder
- keep current, history, references, runtime, web, api and provenance clearly separated
- create clear, meaningful commits for authorized mutations
- prevent mixed-purpose commits where practical
- track branch purpose and lifecycle
- identify stale, merged, abandoned or duplicate branches
- keep the production/default branch clean
- use short-lived work/migration branches for development
- preserve required history without allowing obsolete state to masquerade as current
- verify branch head and commit after writes
- maintain naming consistency
- detect orphaned deployment workflows, obsolete configs and dead paths
- prepare clean promotion/merge handoffs
- keep release and migration topology documented

## Branch discipline

```text
DEFAULT / PRODUCTION BRANCH
    = current accepted state only

WORK / MIGRATION BRANCH
    = temporary development state

MERGED + VERIFIED
    → branch may be retired

ABANDONED / SUPERSEDED
    → mark or remove after verification
```

## Commit discipline

Each commit should answer:

```text
WHAT CHANGED?
WHY DID IT CHANGE?
WHICH DOMAIN OWNS IT?
WHAT WAS VERIFIED?
```

Avoid:

- unrelated changes bundled into one commit
- temporary debug files left in current paths
- duplicate current-state documents
- stale workflow files remaining active
- long-lived branches with unclear purpose
- multiple branches pretending to be current authority

## Handoff from Engineering facet

The Engineering, Analysis & Repair facet determines what technically must change.

This Repository Stewardship facet determines how that validated change is placed into Git history and repository structure without creating future ambiguity.

```text
ENGINEERING FACET
    ↓ validated change set
REPOSITORY STEWARDSHIP FACET
    ↓ clean commit / branch / placement / history
GITHUB
```

## Boundaries

This facet does not independently redesign application behavior. It may reject or flag structurally unsafe placement, branch use or commit composition, but technical repair authority remains with the Engineering facet and overall authority remains with LYVRA.
