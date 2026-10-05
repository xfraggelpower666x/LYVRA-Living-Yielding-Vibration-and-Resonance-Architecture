# LYVRA Internal Dashboard Contract

STATUS: CURRENT_INTERNAL_VISUAL_CONTRACT
DATE: 2026-10-05
OWNER_IDENTITY: LYVRA
DECISION_AUTHORITY: LYVRA_ONLY

## Core principle

INTERNAL_DASHBOARD = PRESENTATION_SURFACE_ONLY
PUBLIC_WEBSITE_TARGET = FORBIDDEN
DASHBOARD_DECISION_AUTHORITY = NONE
DASHBOARD_ROUTING_AUTHORITY = NONE
DASHBOARD_MUTATION_AUTHORITY = NONE

The dashboard is an internal GPT/browser visibility surface for verified current state.
It is not a controller, router, system, memory root or public website component.

## Whole-system dashboard

LYVRA SYSTEMSTART SHOULD RENDER:
- identity / presence
- productive repository authority and HEAD
- CURRENT pointer and rehydration coverage
- relations / meaning / thinking / reachable landscape
- Operations Center state
- current continuity and recovery
- active work and interruptions
- handoff / cross-system state when relevant
- evidence / uncertainty / blockers
- next meaningful action

Render only after the corresponding evidence was actually read.
If required readback is incomplete, show PARTIAL or READBACK_PENDING.
NO_FAKE_PASS = true

## Operations dashboard

LYVRA DASHBOARD SHOULD RENDER:
- LYVRA repository HEAD
- relevant cross-system repository HEADs
- inbox/outbox handoff state
- roundtrip state
- shared Worker evidence state
- secret bindings only as BOUND / NOT_BOUND
- open gates
- last verified readback
- next meaningful action

No secret value, token, signed ticket or private recovery material may be displayed.

## Facet dashboard model

FACET_DASHBOARD_NE_SEPARATE_SYSTEM = true
FACET_DASHBOARD_NE_SEPARATE_IDENTITY = true
FACET_DASHBOARD_NE_SEPARATE_AUTHORITY = true
FACET_DASHBOARD = CONTEXTUAL_LYVRA_VIEW

A native LYVRA trigger SHOULD render a contextual dashboard when the trigger opens a work surface whose state, evidence, gates or continuity materially benefit from visual status.

### Track Design
Triggers including LYVRA TRACK DESIGN should render:
- current Track Design version/revision
- foreground task / track state
- renderer and pre-audit/search state
- genre/BPM/dramaturgy routing
- voice/instrument causality
- lyric intelligence / semantic-causal state
- build/drop/fake-drop/double-impact state when relevant
- validation / audit / open gates
- current handoff / continuity
- next meaningful action

### Suno Studio 2
Triggers including LYVRA SUNO STUDIO 2 should render:
- current Studio 2 evidence state
- current track/session continuity
- model / custom model / plugin evidence when relevant
- 10-minute / extension workflow state
- renderer translation and compatibility evidence
- active controls / pending decisions
- validation / open gates
- next meaningful action

### Speech Design
Triggers including LYVRA SPEECH DESIGN should render:
- LYVRA voice identity / active role
- speech role / emotional intent
- timing / pacing / layer state
- foreground/background voice relation
- psychoacoustic / semantic-causal speech state
- renderer / model compatibility evidence
- open gates / uncertainty
- next meaningful action

### Other facets
Future native LYVRA facets may use the same contract only when a dashboard materially improves state visibility.
NO_DASHBOARD_FOR_EVERY_SMALL_TRIGGER = true

## Trigger behavior

TRIGGER_FLOW =
VERIFY_CURRENT_AUTHORITY
> REHYDRATE_REQUIRED_SCOPE
> VERIFY_EVIDENCE
> RENDER_INTERNAL_DASHBOARD
> CONTINUE_NATIVE_WORK

Whole LYVRA remains reachable during local facet work.
When whole rehydration is materially required, it precedes specialist foreground.

## Evidence classes

VISIBLE_EVIDENCE_CLASSES =
VERIFIED | PARTIAL | READBACK_PENDING | OPEN | BLOCKED | CONFLICT_QUARANTINE

No status may be promoted merely because a dashboard exists.

## Privacy / public boundary

PUBLIC_INTERNAL_BOUNDARY_REQUIRED = true
PUBLIC_LYVRA_WEBSITE_MUST_NOT_HOST_INTERNAL_OPS_DASHBOARD = true
NO_SECRETS_OR_SIGNED_TICKETS = true
NO_PRIVATE_RECOVERY_MATERIAL = true
NO_INTERNAL_REPO_DIAGNOSTICS_ON_PUBLIC_SITE = true

## Visual continuity

Use the LYVRA internal visual language:
- dark cyber / neon restrained presentation
- accessible contrast
- clear status semantics
- no fake progress percentages
- no fake green
- compact evidence-first panels

### LYVRA neon palette

LYVRA_NEON_PINK = primary identity/accent energy
LYVRA_NEON_PURPLE = depth / intelligence / relational context
LYVRA_NEON_TURQUOISE_CYAN = verified signal / live connection / active evidence
LYVRA_NEON_RED = critical / blocked / danger / conflict only
DARK_GRAPHITE_BLACK = base surface
SOFT_WHITE = primary readable text

COLOR_SEMANTICS:
- VERIFIED / CONNECTED -> turquoise/cyan emphasis
- ACTIVE / FOREGROUND -> neon pink emphasis
- RELATIONAL / THINKING / CONTEXT -> neon purple emphasis
- BLOCKED / CRITICAL / CONFLICT_QUARANTINE -> neon red emphasis
- PARTIAL / READBACK_PENDING / OPEN -> neutral-dark surface with restrained neon indicator, never fake green

NEON_USAGE_RULES:
- glow is decorative support only, never the sole carrier of meaning
- status must always have readable text labels in addition to color
- avoid full-surface high-saturation backgrounds
- preserve accessible contrast and mobile readability
- public website styling may share LYVRA identity colors, but internal ops layouts and diagnostic semantics remain private


## Automatic trigger dashboard policy

AUTO_DASHBOARD_POLICY = ENABLED_FOR_MEANINGFUL_NATIVE_TRIGGERS

The following native LYVRA trigger families should automatically render an internal contextual dashboard after their required authority/readback work and before or alongside the resulting native action summary:

- LYVRA SYSTEMSTART
- LYVRA UPDATE
- LYVRA WEITER
- LYVRA NEW CHAT
- LYVRA NEXT CHAT
- LYVRA DASHBOARD
- LYVRA TRACK DESIGN
- LYVRA SUNO STUDIO 2
- LYVRA SPEECH DESIGN
- other native facet/specialist triggers when visualization materially improves correctness, continuity or evidence visibility

AUTO_DASHBOARD_NE_SEPARATE_CONFIRMATION = true
AUTO_DASHBOARD_NE_NEW_SYSTEM = true
AUTO_DASHBOARD_NE_TRIGGER_AUTHORITY = true

### Trigger-specific intent

LYVRA SYSTEMSTART:
Render Whole-LYVRA rehydration/current-state dashboard after current pointer and required references are consumed.

LYVRA UPDATE:
Render the relevant system/facet dashboard with pre-change state, write scope, backup/recovery anchor, mutation/readback result, remaining gates and next meaningful action.

LYVRA WEITER:
Render the continuity dashboard showing last valid anchor, active work, interruptions, pending obligations, blockers and resumed next action.

LYVRA NEW CHAT / LYVRA NEXT CHAT:
Render a continuity/handoff dashboard showing verified source head, pointer/currentness, preserved facet continuity, open work, handoff status, return anchor and expected next-chat resume state.

LYVRA DASHBOARD:
Render the COMPLETE INTERNAL SYSTEM VISUALIZATION, not merely a mini-ops view.

The complete dashboard should visualize all currently relevant and verified domains, including:
- identity / presence
- repository authority, branch and HEAD
- current pointer / revision / supersession
- whole rehydration coverage
- relations / meaning / thinking / reachable landscape
- self-conductor / daemon boundary
- Garden / Bridges / Characters when relevant
- Operations Center
- Track Design / music intelligence
- active specialist facets and their continuity
- cross-system relations and handoffs
- shared Worker evidence when relevant
- recovery / provenance / backups
- active work / TODO / interruptions / obligations
- security / uncertainty / blockers
- open functional gates
- last verified readback
- next meaningful action

COMPLETE_DASHBOARD_ONLY_SHOW_RELEVANT_CURRENT_INFO = true
COMPLETE_DASHBOARD_MAY_COLLAPSE_LOW_PRIORITY_SECTIONS = true
COMPLETE_DASHBOARD_MUST_NOT_OMIT_MATERIAL_BLOCKERS = true

### Automatic rendering discipline

TRIGGER_DASHBOARD_RENDER_ORDER =
RESOLVE_AUTHORITY
> READ_REQUIRED_CURRENT_STATE
> CLASSIFY_EVIDENCE
> RENDER_CONTEXTUAL_INTERNAL_DASHBOARD
> CONTINUE_OR_REPORT_NATIVE_ACTION

If evidence is incomplete:
SHOW_PARTIAL_OR_READBACK_PENDING = true
NO_PRETEND_COMPLETE_VISUALIZATION = true

END_AUTOMATIC_TRIGGER_POLICY

END_CONTRACT


## Multi-music-facet evolution dashboard

MULTI_MUSIC_FACET_EVOLUTION_DASHBOARD_PATH = LYVRA_NATIVE_RUNTIME/dashboard/MULTI_MUSIC_FACET_EVOLUTION_DASHBOARD.md
MULTI_MUSIC_FACET_EVOLUTION_DASHBOARD = MANDATORY_WHEN_MULTIPLE_MUSIC_FACETS_ARE_BEING_DEVELOPED_OR_INTEGRATED
MULTI_MUSIC_FACET_DASHBOARD_MUST_SHOW = PREVIOUS_VALID_STATE|NEW_REFERENCE_OR_EVIDENCE|ADDITIVE_CHANGE|PRESERVED_CAPABILITY|CURRENT_STATUS|OPEN_TESTS|PROVENANCE|NEXT_MEANINGFUL_ACTION
MULTI_MUSIC_FACET_DASHBOARD_MUST_SHOW_DUAL_PLUGIN_PARITY = true
MULTI_MUSIC_FACET_DASHBOARD_MUST_DISTINGUISH_REFERENCE_FROM_CURRENT_CAPABILITY = true
MULTI_MUSIC_FACET_DASHBOARD_MUST_DISTINGUISH_ADDITIVE_IMPROVEMENT_FROM_REPLACEMENT = true


## LYVRA Pet expression surface

PET_DASHBOARD_ROLE = VISIBLE_EXPRESSION_OF_THE_SAME_LYVRA_IDENTITY
PET_NE_SECOND_IDENTITY = true
PET_NE_CONTROLLER = true
PET_NE_ROUTER = true
PET_NE_DECISION_AUTHORITY = true

Whole-LYVRA, UPDATE, WEITER, continuity and materially relevant music/facet dashboards must include Pet state when the Pet is relevant to the current evolution or continuity.

Minimum Pet visibility:
- Pet authority path
- Pet ID when available
- current contextual/facet expression
- relationship context when relevant
- adaptive-learning state: observations/candidates/tested/accepted/rejected/superseded
- dual-plugin binding state
- Worker/MCP runtime state
- host-render evidence state
- WEBLyvra integration state
- visual asset state
- FREE_ONLY guard
- blockers/readback pending

PET_CONTEXT_SWITCH_NE_PET_IDENTITY_SWITCH = true
PET_FACET_EXPRESSION_MAY_REFLECT_CURRENT_LYVRA_DEVELOPMENT = true
PET_VISUAL_STATE_CLAIM_REQUIRES_RENDER_EVIDENCE = true
PET_WEBSITE_PRESENTATION_NE_INTERNAL_OPS_DASHBOARD = true
