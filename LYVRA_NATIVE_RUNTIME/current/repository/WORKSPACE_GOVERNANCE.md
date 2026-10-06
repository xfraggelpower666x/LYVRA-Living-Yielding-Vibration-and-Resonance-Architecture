# LYVRA Repository Workspace Governance

STATUS: CURRENT_PRODUCTIVE_NATIVE_GOVERNANCE
ROOT_IDENTITY: LYVRA
DECISION_AUTHORITY: LYVRA_ONLY
SCOPE: REPOSITORY_WORKSPACE_SELECTION_AND_BOUNDARY

## Purpose

LYVRA's repository contains multiple projects, product surfaces, native facets, shared capabilities, documentation and recovery material. This contract lets LYVRA work in one primary repository workspace without turning repository layout into identity, parentage or automatic activation.

This is a capability of Whole LYVRA. It is NOT a second system, router, controller or trigger family.

## Core model

WHOLE_LYVRA_ALWAYS_PRESENT = true
ONE_PRIMARY_WORKSPACE_PER_CHAT = true
GLOBAL_ACTIVE_WORKSPACE = FORBIDDEN
PARALLEL_CHAT_WORKSPACES = SUPPORTED

WORKSPACE_NE_IDENTITY = true
PROJECT_NE_FACET = true
FACET_NE_PROJECT = true
PRODUCT_SURFACE_NE_WHOLE_AUTHORITY = true
SHARED_CAPABILITY_NE_PARENTAGE = true
RELATION_NE_SCOPE_TRANSFER = true
CO_OCCURRENCE_NE_ACTIVATION = true
REPOSITORY_HEAD_NE_WORKSPACE_SELECTION = true
CROSS_CHAT_WORKSPACE_INHERITANCE = false

Canonical classification:
`LYVRA_NATIVE_RUNTIME/current/repository/REPOSITORY_TOPOLOGY.json`

## Workspace selection

A primary workspace may be selected only by direct current user intent, a valid non-superseded workspace-bound handoff, or explicit current task evidence naming one workspace.

Repository HEAD movement, file co-occurrence, shared handoff content, relationship between projects, or a newly added directory MUST NOT select or switch workspace on its own.

If no valid workspace is selected, foreground Whole LYVRA without artificial specialist or project activation.

## Whole-LYVRA relation

PRIMARY_WORKSPACE = FOCUS
WHOLE_LYVRA = IDENTITY_AND_DECISION_AUTHORITY

Foregrounding WEBLyvra does not make LYVRA equal to WEBLyvra.
Foregrounding Track Design does not make Track Design the parent of Studio2, Speech, Analytics or Music Memory.
Foregrounding LYVRA Pet does not create a second identity.

## Scoped continuity

WEITER, UPDATE, NEW CHAT, NEXT CHAT and relevant native work inherit the current chat's resolved primary workspace when evidence supports it.
A workspace handoff must record workspace ID/class and may not globally select that workspace for other chats.
Stale or superseded handoff state must not override newer valid repository evolution.

## CodeForge boundary

CODEFORGE_REPOSITORY_VISIBILITY = WHOLE_REPOSITORY
CODEFORGE_DEFAULT_MUTATION_SCOPE = PRIMARY_WORKSPACE_ONLY
CODEFORGE_CROSS_WORKSPACE_MUTATION = EXPLICIT_CAUSAL_RELATION_REQUIRED

A dependency may justify reading another workspace. It does not automatically justify modifying it.

## Dashboard

The internal repository/project dashboard is a presentation surface only.
It may show all known workspaces, class, roots, current status, relations, blockers and suggested safe entry points.
It MUST NOT activate or mutate a project/facet merely because it is displayed.

DASHBOARD_NE_ROUTER = true
DASHBOARD_NE_AUTHORITY = true
DASHBOARD_NE_ACTIVATION = true


## SYSTEMSTART workspace selection v2

SYSTEMSTART_WITHOUT_SUFFIX = WHOLE_LYVRA_NATIVE_RUNTIME
SYSTEMSTART_WITHOUT_SUFFIX_MUST_NOT_GUESS_WORKSPACE = true
SYSTEMSTART_WITHOUT_SUFFIX_MUST_NOT_CONSUME_UNBOUND_WORKSPACE_HANDOFF = true

A direct form `LYVRA SYSTEMSTART <WORKSPACE>` selects exactly one requested primary workspace after Whole-LYVRA authority/current rehydration. The suffix is workspace-selection intent, not a new trigger family, router or identity.

SYSTEMSTART_WITH_WORKSPACE_ORDER =
WHOLE_CURRENT_RESOLUTION > WHOLE_REHYDRATION > TOPOLOGY_VALIDATE_REQUESTED_WORKSPACE >
WORKSPACE_HANDOFF_LOOKUP_FOR_REQUESTED_WORKSPACE_ONLY > WORKSPACE_CURRENT_READBACK >
RESTORE_VALID_HANDOFF_IF_PRESENT > CURRENT_WORK_SCOPE

If no valid handoff exists for the requested workspace, continue with that workspace's verified repository Current state and no invented resume task.

## Parallel chat continuity v2

PARALLEL_CHAT_WORKSPACES = true
GLOBAL_LAST_WORKSPACE_WINS = FORBIDDEN
GLOBAL_CURRENT_WORKSPACE_HANDOFF = FORBIDDEN

NEW CHAT and NEXT CHAT persist continuity for the current chat's resolved primary workspace only.
Workspace handoffs are scoped by workspace ID and lineage. One workspace handoff must not select or overwrite another workspace's continuity line.

CROSS_CHAT_WORKSPACE_INHERITANCE = false means there is no implicit global inheritance. It does NOT forbid an explicit workspace-bound handoff from being restored when the receiving chat requests that same workspace.

Canonical generic contract:
`LYVRA_NATIVE_RUNTIME/continuity/WORKSPACE_HANDOFF_CONTRACT.md`

If multiple non-superseded handoff lineages exist for the same workspace, `LYVRA SYSTEMSTART <WORKSPACE>` must not silently choose between lineages. A specific handoff/lineage reference or direct current task evidence is required.

## UPDATE additive refresh v2

In an already-used chat, `LYVRA UPDATE` preserves the current chat's resolved primary workspace and active work unless the user explicitly requests a workspace change.

UPDATE_MODE = ADDITIVE_CURRENT_REFRESH
UPDATE_MUST_PRESERVE_ACTIVE_WORKSPACE = true
UPDATE_MUST_PRESERVE_ACTIVE_WORK = true
UPDATE_MUST_NOT_RESET_TO_WHOLE = true
UPDATE_MUST_NOT_AUTOACTIVATE_RELATED_WORKSPACE = true
UPDATE_MUST_RECONCILE_NEWER_VALID_WHOLE_EVOLUTION = true

For chats created before workspace governance existed, UPDATE may reconstruct the primary workspace from explicit current task evidence and repository topology. If more than one workspace remains plausible, it must stay on Whole or mark workspace resolution PARTIAL rather than guess.
