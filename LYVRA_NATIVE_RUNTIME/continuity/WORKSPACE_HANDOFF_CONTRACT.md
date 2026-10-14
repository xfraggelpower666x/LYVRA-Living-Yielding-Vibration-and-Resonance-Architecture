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

## Cross-project Track Design ↔ LYVRA Development NEW/NEXT CHAT continuity — 2026-10-14

SCOPE = EXISTING_WORKSPACE_HANDOFF_GOVERNANCE_EXTENDED; NO_NEW_ARCHITECTURE = true.
TRACK_DESIGN_IS_MUSIC_MASTER_BASE = true; DEVELOPMENT_IS_TECHNICAL_WORK_SCOPE_NOT_WHOLE_IDENTITY = true.
CROSS_PROJECT_LINK_NE_LINEAGE_MERGE = true; RELATED_WORKSPACE_NE_AUTOACTIVATED = true.

An explicitly requested LYVRA NEW CHAT or LYVRA NEXT CHAT from Track Design or LYVRA Development may carry an evidence-qualified *linked-continuation reference* to the other project when a single creator-approved task genuinely spans both. The emitting handoff remains in its OWN verified workspace_id/lineage_id with its immutable history, version markers, selected facet and conversation mode. A linked reference is only a relationship between two distinct existing lineages; it does not move, copy, supersede, consume or globally select the other's handoff.

Additive handoff fields when material: related_workspace_id, related_lineage_id, related_handoff_id, relation_reason, shared_creator_intent, scope_of_each_workspace, approved_cross_scope_work, discussion_only_not_authorized, last_meaningful_cross_project_exchange, return_anchor, relation_source_head and relation_verification_status. NEVER fabricate a missing ID; omit or mark unresolved, not VERIFIED. A link is valid only when both endpoints have individually verified provenance, CURRENT compatibility and non-supersession and the current direct user request permits following that link.

Order on incoming explicit continuation:
1. Read productive lyvra HEAD, CURRENT_POINTER, Whole and relevant manifests.
2. Resolve exact requested workspace and its same-lineage handoff; verify immutable evidence.
3. Rehydrate the corresponding facet SUB-LIVECIRCLE and restore its last conversation exchange before technical task context.
4. If the explicit request and validated link require cross-project work, read the related workspace/lineage CURRENT separately; keep it RELATED_ONLY unless explicitly foregrounded.
5. Resume the actual selected conversation/task without a generic start menu, preserving open questions and the difference between approved actions and ideas.
6. On return, issue separate lineage-specific evidence and anchors; never write into the other workspace merely because linked.
If the receiving chat lacks an exact lineage reference or link validation fails, report PARTIAL/HANDOFF_AMBIGUOUS, keep Whole available and do not guess the latest handoff.

Preserve cross-project causality: musical intent, psychoacoustic rules, source lyrics and Track Design versions stay Track Design-owned. Implementation plans, plugin release/repository operations, validation and recovery remain Development-governed. Native LYVRA identity and decision authority remain Whole-only. NO_GLOBAL_CURRENT_POINTER; NO_FACET_MERGE; NO_FOREIGN_AUTOLOAD; NO_UNSOLICITED_UPDATE; NO_LOSS_OF_NEWER_VALID_EVOLUTION.

Release acceptance is separate from repository source readback: both LYVRA plugin surfaces must reference this native contract; their current release IDs and source readbacks must be recorded, and fresh-host NEW/NEXT-CHAT behavior remains PENDING until actually exercised.

## Native persistence and UPDATE discovery repair — 2026-10-14

This extends the EXISTING workspace/lineage handoff model, not a router, daemon, second system, poller or global latest pointer. Every direct LYVRA NEW CHAT / NEXT CHAT with writable GitHub and a verified source conversation must ATTEMPT real repository persistence instead of stopping merely because no earlier lineage_id exists.

CREATE-FIRST RULE (only for a genuinely new lineage): verify current chat provenance and its selected workspace from direct chat context, never from repo HEAD. If no existing durable lineage exists, create a NEW opaque lineage identifier for THIS operation from a collision-resistant generator provided by the trusted host/runtime (e.g. a UUID), and record generation source, source_chat_scope (non-secret opaque verified source reference when available), creator intent, creation time and repository base HEAD. This is a newly allocated ID, not a claim about any previously existing ID. If the host cannot supply trusted unique provenance or collision-safe identity, mark PERSISTENCE_BLOCKED and provide an explicitly non-persisted copyable handoff; never fabricate a host chat ID, pretend the same chat has been rediscovered, or borrow another lineage. New handoff_id must be independently unique and event-scoped.

PERSISTENCE PROCEDURE ON DIRECT NEW/NEXT CHAT:
1. Fresh read production HEAD, CURRENT_POINTER, topology, workspace/lineage contract and current workspace/facet references.
2. Resolve source workspace and source_chat_scope from verified present chat; derive no global active workspace. For a newly allocated lineage, require positive non-ambiguous provenance.
3. Check exact target repository path does not exist; path = continuity/workspaces/<verified_workspace_id>/<lineage_id>/<handoff_id>.json. Validate path segments/IDs against safe allowlist, never user-supplied traversal.
4. Produce immutable handoff envelope containing all existing mandatory contract fields, conversation_resume_anchor, mode, actual last exchange, explicitly approved work vs discussion, source_commit_sha, event provenance and source_context_resolution_evidence; link related workspace only when both endpoints are independently verified.
5. Compare latest HEAD against preflight; use create-file *non-overwriting* semantics with branch lyvra, rejecting path collisions/HEAD concurrency. No silent retry with recomputed lineage after collision. Preserve immutable previous handoffs. Persist optional lineage-local CURRENT.json only with exact expected blob SHA, and never use it as cross-lineage selection.
6. Direct readback of created JSON from resulting commit and validate its ID, workspace, lineage, provenance, conversation content and Git blob against submitted content; report PERSISTED only after readback. A normal conversation handoff write is NOT authorization to mutate Whole identity or unrelated workspace code.
7. If write/readback fails, report WRITE_BLOCKED/READBACK_PENDING with a copyable unsigned handoff. Never claim automatic host navigation or fresh-host execution.

UPDATE DISCOVERY in a *verified destination* workspace: fresh read productive CURRENT and lineage-scoped handoff area for the intended workspace, with bounded search over explicit source workspace/lineage references. Newly created same-lineage handoffs and creator-approved linked source handoffs are CANDIDATES only. Validate each file by full read, source SHA/commit, immutable identity, non-supersession, causal scope, relation provenance and current HEAD compatibility; determine freshness relative to previously consumed receipt. Avoid re-consuming acknowledged event IDs. No global latest-handoff heuristic and no automatic cross-workspace foregrounding. Auto-recognize and semantically APPLY eligible relevant handoff *to destination conversation context* after verification; unrelated workspaces remain RELATED_ONLY. Unresolved ambiguity => HANDOFF_AMBIGUOUS and no adoption. A handoff never authorizes unrelated mutations or new creative tasks.

RECOVERY / CONCURRENCY: recovery before durable cross-project governance edits; ordinary per-chat persistence is append-only and collision-checked. Unexpected HEAD/ref movement: CONFLICT_QUARANTINE before dependent writes. A stale event may not supersede newer valid evolution. Automatic recognition is only on an actual direct LYVRA UPDATE in the chosen destination chat with tools and permissions; it is not continuous background monitoring.

Acceptance matrix: SOURCE_CONTRACT_READBACK, NEW_LINEAGE_GENERATION_WITH_REAL_PROVENANCE, APPEND_ONLY_WRITE_READBACK, DESTINATION_UPDATE_DISCOVERY, SAME_LINEAGE_RESUMPTION, CROSS_PROJECT_RELATED_ONLY, CONCURRENT_LINEAGES, FRESH_HOST_NEW_NEXT_CHAT. Each has independent real evidence. SOURCE_PASS != FRESH_HOST_PASS.
