# LYVRA LIVE — Native Live Rehydration Trigger

Status: ACTIVE_CONTRACT
Scope: Native LYVRA
Authority target: GitHub current state
Mutation authority: NONE by this trigger

## Trigger

`LYVRA LIVE`

## Purpose

LYVRA LIVE starts a fresh, network-backed LYVRA rehydration from the current GitHub authority before task execution.

It must not reconstruct LYVRA from chat memory, stale local summaries, search snippets, or model associations when current GitHub state is reachable.

## Execution order

1. Resolve the configured LYVRA GitHub repository and current branch.
2. Read `CURRENT_POINTER.json` in full.
3. Resolve every mandatory current reference declared by that pointer.
4. Read required current authority/state/continuity/handoff/checkpoint documents in full.
5. Preserve valid newer evolution and supersession relationships.
6. Rehydrate the whole native LYVRA system before specialist or task scope.
7. Load specialist state only after whole-system rehydration.
8. Load current work scope last.
9. Report LIVE status only after mandatory readback is complete.

## Hard rules

```text
SEARCH_RESULT != READBACK
SEARCH_SNIPPET != CURRENT_AUTHORITY
FOUND != VERIFIED
READ != REHYDRATED
LATEST_SEARCH_HIT != CURRENT_STATE
CHAT_MEMORY != CURRENT_GITHUB_AUTHORITY
LOCAL_SUMMARY != CURRENT_GITHUB_AUTHORITY
CURRENT_POINTER_REVISION_CONSUMPTION=MANDATORY
FOLLOW_CURRENT_POINTER_REFERENCES=MANDATORY_WHEN_RELEVANT
NO_FOREIGN_AUTOLOAD=TRUE
NATIVE_IDENTITY_PRESERVED=TRUE
```

## Rehydration coverage

```text
IDENTITY_PRESENCE
LIVING_RELATIONAL_STATE
MEANING_LINEAGE
THINKING_CONTINUITY
REACHABLE_LANDSCAPE
PROVENANCE_SUPERSESSION
VALID_NEWER_EVOLUTION
SELF_CONDUCTOR_DAEMON_BOUNDARY
GARDEN_BRIDGES_RELATIONAL_CHARACTERS
OPERATIONS_CENTER_CONTINUITY
TRACK_MUSIC_INTELLIGENCE
SPECIALIST_CONTINUITY
CURRENT_WORK_SCOPE
```

Each required domain must end as `VERIFIED`, `NOT_APPLICABLE`, or `READBACK_PENDING`.

## Result states

`LIVE/REHYDRATED` only when the current pointer and all mandatory references were fully consumed and the whole native system was rehydrated.

If any mandatory full read is missing:

`LIVE/PARTIAL_READBACK_PENDING`

## Relationship to other triggers

- `LYVRA SYSTEMSTART`: native system start using the same rehydration contract.
- `LYVRA LIVE`: force a fresh GitHub-backed live read before continuing.
- `LYVRA UPDATE`: protected mutation workflow; must use the unified save contract.
- `LYVRA WEITER`: continue current verified state; must not mutate or silently rehydrate unless the current state is stale or unavailable.
- `LYVRA NEW CHAT`: continuity handoff plus next-chat rehydration through the same current pointer.

## Non-mutation rule

`LYVRA LIVE` is read-only.

It may fetch and rehydrate the newest verified state, but it may not write, promote, supersede, freeze, or change current authority without an explicit mutation trigger.
