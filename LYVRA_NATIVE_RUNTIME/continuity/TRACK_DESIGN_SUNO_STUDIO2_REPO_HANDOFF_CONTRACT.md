# LYVRA Track Design / Suno Studio 2 — Automatic Repo Handoff Contract

STATUS: CURRENT_PRODUCTIVE
WHOLE_LOGICAL_REVISION: 242_PRESERVED
TRACK_DESIGN_VERSION: v3.4
TRACK_LOGICAL_REVISION: 86
OWNER_IDENTITY: LYVRA
DECISION_AUTHORITY: LYVRA_ONLY

## Purpose

This contract provides a native continuity handoff between LYVRA Whole, Track Design, and the Suno Studio 2 native Track Design facet across chats/projects.

It replaces the former operational pattern called "automatic Drive handoff" for current active continuity. Google Drive remains history/provenance/recovery; active handoff state now lives in the productive repository.

## Canonical user trigger

AUTOMATISCHE_REPO_UEBERGABE = explicit request to persist the current specialist continuity state into:
LYVRA_NATIVE_RUNTIME/continuity/TRACK_DESIGN_SUNO_STUDIO2_REPO_HANDOFF_CURRENT.json

Natural-language variants such as:
- automatische Repo-Übergabe
- automatische Repo Übergabe
- automatische Repo Uebergabe
mean the same thing when the current context is LYVRA Track Design / Suno Studio 2 continuity.

## Native relation

TRACK_DESIGN = LYVRA_WHEN_SHE_THINKS_MUSIC
SUNO_STUDIO_2 = LYVRA_NATIVE_TRACK_DESIGN_SPECIALIST_FACET

STUDIO2_NE_SEPARATE_SYSTEM = true
STUDIO2_NE_SEPARATE_IDENTITY = true
STUDIO2_NE_SEPARATE_MEMORY_ROOT = true
STUDIO2_NE_SEPARATE_DECISION_AUTHORITY = true
ONE_SHARED_HANDOFF_CHANNEL = true

## Write semantics

On an explicit automatic Repo handoff request:
1. Read productive CURRENT pointer first.
2. Read current specialist continuity and Track Design state when material.
3. Preserve newer valid evolution.
4. Write only the current handoff state; do not clone private history or whole-system payload.
5. Record source surface, intended target surface, foreground facet, last valid work stage, active task, pending work, next meaningful action, Track Design version/revision, Whole revision, relevant current references, provenance head, and supersession token.
6. Perform direct post-write readback.
7. If the whole CURRENT_POINTER must change, publish it last.
8. No foreign autoload, no new router/controller/identity, no decision-authority transfer.

## Read / resume semantics

When a new or resumed chat explicitly enters:
- LYVRA TRACK DESIGN
- LYVRA SUNO STUDIO 2
or clearly asks to continue the corresponding specialist project,
the repo handoff may be read automatically after Whole-LYVRA authority/current-state resolution.

HANDOFF_READ_NE_AUTOACTIVATION = true
HANDOFF_READ_NE_SYSTEMSTART = true
HANDOFF_READ_NE_DECISION_AUTHORITY = true
HANDOFF_STATE_NE_WHOLE_LYVRA_STATE = true

The receiving chat must:
1. verify productive CURRENT;
2. read this contract;
3. read the current handoff JSON;
4. verify the handoff source head/provenance and supersession;
5. rehydrate only the relevant specialist continuity;
6. continue from LAST_VALID_STAGE / NEXT_MEANINGFUL_ACTION when still current;
7. ignore superseded/rejected handoffs as active authority.

## Bidirectional continuity

Supported directions:
- WHOLE_LYVRA -> TRACK_DESIGN
- TRACK_DESIGN -> WHOLE_LYVRA
- TRACK_DESIGN -> SUNO_STUDIO_2
- SUNO_STUDIO_2 -> TRACK_DESIGN
- SUNO_STUDIO_2 -> WHOLE_LYVRA

The handoff carries continuity, not authority.

## Privacy and scope

PUBLIC_REPO_NE_PRIVATE_MEMORY_VAULT = true
NO_PRIVATE_RELATIONAL_PAYLOAD_IN_HANDOFF = true
NO_SECRETS_OR_TOKENS = true
TRACK_SPECIFIC_PRIVATE_INPUT_ONLY_IF_PUBLICATION_AUTHORIZED = true

## Hard fences

NO_NEW_ROUTER = true
NO_NEW_CONTROLLER = true
NO_NEW_ENGINE = true
NO_NEW_IDENTITY = true
NO_FOREIGN_AUTOLOAD = true
NO_FOREIGN_AUTOACTIVATION = true
NEWER_VALID_EVOLUTION_PRESERVED = true
WHOLE_LYVRA_REHYDRATION_PRECEDES_SPECIALIST_FOREGROUND_WHEN_MATERIAL = true
