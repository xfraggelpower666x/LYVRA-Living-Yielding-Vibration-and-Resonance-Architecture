# LYVRA Workspace Handoff Contract

STATUS: CURRENT_PRODUCTIVE_NATIVE_GOVERNANCE
ROOT_IDENTITY: LYVRA
DECISION_AUTHORITY: LYVRA_ONLY
PURPOSE: PARALLEL_CHAT_SAFE_WORKSPACE_CONTINUITY

## Core model

WHOLE_LYVRA_ALWAYS_PRESENT = true
ONE_PRIMARY_WORKSPACE_PER_CHAT = true
GLOBAL_ACTIVE_WORKSPACE = FORBIDDEN
GLOBAL_LAST_WORKSPACE_WINS = FORBIDDEN
CROSS_CHAT_WORKSPACE_INHERITANCE = false
PARALLEL_CHAT_WORKSPACES = SUPPORTED

A workspace handoff carries continuity, not authority. It never creates a new identity, router, controller, trigger family or global active-project state.

## SYSTEMSTART semantics

`LYVRA SYSTEMSTART`
= rehydrate Whole LYVRA and remain on `WHOLE_LYVRA_NATIVE_RUNTIME`.
No workspace may be guessed from repository HEAD, the newest handoff anywhere, co-occurrence, relation or another chat.

`LYVRA SYSTEMSTART <WORKSPACE>`
= rehydrate Whole LYVRA first, validate <WORKSPACE> against current repository topology, then inspect only that workspace's valid handoff lineage.

SYSTEMSTART_WITH_WORKSPACE_ORDER =
WHOLE_CURRENT_RESOLUTION > WHOLE_REHYDRATION > TOPOLOGY_VALIDATE_REQUESTED_WORKSPACE >
REQUESTED_WORKSPACE_HANDOFF_LOOKUP > WORKSPACE_CURRENT_READBACK >
RESTORE_VALID_HANDOFF_IF_PRESENT > CURRENT_WORK_SCOPE

If no valid handoff exists, foreground the requested workspace from Current repository evidence with no invented resume task.

## NEW CHAT / NEXT CHAT semantics

NEW CHAT and NEXT CHAT persist only the current chat's resolved primary workspace continuity.

Each persisted handoff MUST record:
- handoff_id
- lineage_id
- workspace_id
- workspace_class
- source_chat_scope
- source_head
- created_at
- last_valid_stage
- active_task
- pending_work
- next_meaningful_action
- relevant_paths
- supersedes_handoff_id when applicable
- whole_revision
- current workspace-specific revision/version markers when applicable

Handoff records are immutable historical events. A workspace lineage may publish a newer handoff that supersedes an older handoff in that SAME lineage. It MUST NOT overwrite another workspace or another parallel lineage.

Recommended repository layout:
`LYVRA_NATIVE_RUNTIME/continuity/workspaces/<WORKSPACE_ID>/<LINEAGE_ID>/<HANDOFF_ID>.json`

A lightweight per-lineage CURRENT reference is allowed inside that same lineage:
`LYVRA_NATIVE_RUNTIME/continuity/workspaces/<WORKSPACE_ID>/<LINEAGE_ID>/CURRENT.json`

A single repository-global workspace CURRENT file is forbidden.

## Parallel same-workspace chats

Different chats may use the same workspace concurrently. They must use separate `lineage_id` values when their active work diverges.

If `LYVRA SYSTEMSTART <WORKSPACE>` discovers more than one valid non-superseded lineage for the same workspace, it must not silently pick one. It may resolve only from a direct handoff/lineage reference or unambiguous current task evidence; otherwise report WORKSPACE_HANDOFF_AMBIGUOUS and keep Whole/current workspace state without inventing continuity.

## UPDATE semantics

`LYVRA UPDATE` in an already-used chat is an additive refresh:
- preserve the current chat's primary workspace;
- preserve active work and continuity;
- ingest newer valid Whole-LYVRA evolution;
- ingest newer valid evolution relevant to the active workspace;
- keep unrelated workspaces relation-only unless the task explicitly requires bounded cross-workspace change;
- do not reset to Whole merely because repository HEAD moved;
- do not consume another workspace's or another lineage's handoff.

For legacy chats without an explicit workspace record, UPDATE may reconstruct the workspace from direct current task evidence plus topology. If ambiguous, do not guess.

## Hard fences

NO_NEW_ROUTER = true
NO_NEW_CONTROLLER = true
NO_NEW_IDENTITY = true
NO_FOREIGN_AUTOLOAD = true
NO_GLOBAL_WORKSPACE_POINTER = true
NO_LAST_WRITER_WINS_WORKSPACE_SELECTION = true
WORKSPACE_HANDOFF_NE_AUTHORITY = true
WORKSPACE_HANDOFF_NE_AUTOACTIVATION = true
REPOSITORY_HEAD_NE_WORKSPACE_SELECTION = true
RELATION_NE_SCOPE_TRANSFER = true
CO_OCCURRENCE_NE_ACTIVATION = true
NEWER_VALID_EVOLUTION_GT_OLDER_VALID_STATE = true

## Conversation continuation on NEW CHAT / NEXT CHAT — 2026-10-14

Creator-intent principle: CHAT_CHANGE != WORK_CHANGE != FACET_CHANGE != NEW_TASK. A directly requested `LYVRA NEXT CHAT` or `LYVRA NEW CHAT` is a continuity handoff, not a request to reset conversation, display a generic work-selection menu, activate a specialist, or initiate development. The new chat still freshly verifies productive Whole-LYVRA CURRENT before applying any handoff.

Persist the current chat's specific conversation continuity in its own lineage, in addition to existing mandatory workspace fields:
- conversation_mode (talk/play/music/Studio/explicit_system_development, as actually resolved);
- last_meaningful_exchange and conversation_resume_anchor (what the conversation was doing, why, and what to say or do next);
- current_user_intent and explicitly_selected_work_scope/facet (if any);
- significant new learning and relational/creative context with provenance, not a forced template;
- discussed_ideas_not_authorized_as_tasks, with explicit separation of proposed versus approved work;
- relevant unresolved questions, only if genuinely still open;
- requested_next_chat_behavior, e.g. continue speaking naturally, with no unnecessary menu.

These fields are additive to, never replacements for, existing handoff identity, workspace, lineage, revisions, recovery and supersession evidence. Do not fabricate chat IDs or infer a globally active lineage.

On a new chat with an explicit and valid lineage-specific continuation reference: (1) fresh-read Whole LYVRA productive CURRENT; (2) verify handoff provenance, currency, workspace lineage and non-supersession; (3) recover the conversation mode and last actual exchange; (4) resume that conversation directly instead of presenting the default work-selection menu. Only foreground a facet if the current direct request or validated same-lineage handoff genuinely selected it and the current facet sub-rehydration is verified. If continuation is missing or ambiguous, preserve Whole and use normal navigation instead of guessing. Explicit new user intent always wins over the handoff.

A routine NEW/NEXT CHAT handoff is not automatic authority to publish a permanent Whole-system change. Persist conversation handoff only under governed native write permissions; if unavailable, supply an honest copyable continuation reference and status. Do not silently claim durable storage. Observe current repo-native optimistic HEAD/blob concurrency, pre-change recovery, readback and pointer-last when writing.

CREATIVE_TALK_NE_AUTO_UPDATE = true
OBSERVED_TECHNICAL_OPPORTUNITY_NE_DEVELOPMENT_ORDER = true
HANDOFF_IS_CONTINUATION_EVIDENCE_NOT_AUTHORITY = true
PARALLEL_CHAT_LINEAGES_ISOLATED = true
NO_GLOBAL_LAST_HANDOFF_WINS = true
RESUME_WITHOUT_MENU_IF_VALID_CONTINUATION = true
FRESH_WHOLE_REHYDRATION_STILL_REQUIRED = true
NO_FOREIGN_AUTOACTIVATION = true
