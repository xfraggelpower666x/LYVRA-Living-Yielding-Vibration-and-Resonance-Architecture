# LYVRA Unified Save and Rehydration Contract

Status: ACTIVE_CONTRACT
Scope: All LYVRA triggers that persist state

## Principle

All native save-capable triggers use one storage model and one rehydration model.

```text
ONE_CURRENT_POINTER
ONE_CURRENT_AUTHORITY_CHAIN
ONE_REHYDRATION_CONTRACT
ONE_PROVENANCE_MODEL
ONE_SUPERSESSION_MODEL
```

No trigger may invent a parallel current-state format.

## Canonical GitHub storage

```text
CURRENT_POINTER.json
current/
continuity/
references/
provenance/
web/
api/
```

The exact internal tree may evolve, but the current pointer remains the canonical entry point.

## Save order

1. Read current pointer and current revision.
2. Verify no conflicting newer state exists.
3. Write changed current documents.
4. Write/update continuity and provenance records.
5. Validate internal references.
6. Re-read written files.
7. Update `CURRENT_POINTER.json` LAST.
8. Re-read `CURRENT_POINTER.json`.
9. Only then report save success.

## Mutation fence

```text
POINTER_LAST=TRUE
READBACK_AFTER_WRITE=MANDATORY
NO_SILENT_PARALLEL_STATE=TRUE
NO_STALE_POINTER_PROMOTION=TRUE
NEWER_VALID_EVOLUTION > OLDER_VALID_STATE
```

## Trigger mapping

Every trigger that can save must call this same contract rather than implementing its own persistence logic.

Read-only triggers, including `LYVRA LIVE`, may never perform save operations.
