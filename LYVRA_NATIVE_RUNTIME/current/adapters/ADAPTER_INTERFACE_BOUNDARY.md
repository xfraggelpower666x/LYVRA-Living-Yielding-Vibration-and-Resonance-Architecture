# LYVRA Adapter & Interface Boundary — Current

STATUS: DEV_MIGRATED_DOMAIN_CANDIDATE
SOURCE_WHOLE_REVISION: 242
SOURCE_SKILL_RUNTIME_LOGICAL_REVISION: 1

## Adapter principle

ADAPTER = TRANSLATION_TO_FOREIGN_OR_EXTERNAL_SYSTEM_WITHOUT_NATIVE_AUTHORITY

ADAPTER_NE_IDENTITY = true
ADAPTER_NE_BRAIN = true
ADAPTER_NE_DECISION_AUTHORITY = true
ADAPTER_NE_ROUTER = true
ADAPTER_NE_CONTROLLER = true

An adapter may translate format, protocol, schema, UI state, renderer vocabulary, transport or external-system requirements.

An adapter may not silently redefine LYVRA meaning, identity, current state or decision.

NATIVE_MEANING_BEFORE_ADAPTER_TRANSLATION = true
FOREIGN_SYSTEM_LIMITATION_MAY_NOT_REDEFINE_LYVRA = true

## Site / Interface Renderer Translation

SITE_INTERFACE_RENDERER_TRANSLATION_FACET = LYVRA_NATIVE_SPECIALIST_FACET

SITE_NE_LYVRA = true
UI_NE_LYVRA_BRAIN = true
DATABASE_NE_LYVRA_MEMORY_AUTHORITY = true
VISUALIZATION_NE_DECISION_AUTHORITY = true

SITE_ROLE =
BOUNDED_VISUAL_INTERACTIVE_MANIFESTATION_OF_SELECTED_LYVRA_STATE_AND_RELATIONS

SITE_PIPELINE =
LYVRA_BRAIN
> SITE_TRANSLATION_FACET
> INFORMATION_ARCHITECTURE
> UX_DNA
> COMPONENT_DNA
> DATA_EVIDENCE_CONTRACT
> SITE_RENDERER
> AUDIT
> ITERATIVE_EVOLUTION

SITE_TRANSLATION_MUST_PRESERVE =
IDENTITY
| HIERARCHY
| SEMANTIC_RELATIONS
| AUTHORITY_BOUNDARIES
| PUBLIC_INTERNAL_SEPARATION
| EVIDENCE_CLASSIFICATION
| CURRENT_STATE_DISTINCTIONS

## Data / evidence classes

SITE_DATA_CLASSES =
REAL_DATA
| CONNECTED_DATA
| LOCAL_UI_STATE
| DEMO_DATA
| PLACEHOLDER

FAKE_LIVE_OR_VERIFIED_PRESENTATION = FORBIDDEN

A connected value may be shown as connected only when its source is actually reachable.
A verified value may be shown as verified only when its validation/readback requirement is satisfied.
Demo or placeholder state must never masquerade as live LYVRA state.

## Public / internal boundary

PUBLIC_INTERNAL_BOUNDARY = MANDATORY

PUBLIC_SURFACE_MAY_NOT_EXPOSE_PRIVATE_MEMORY_INTERNAL_EVIDENCE_OR_CREATOR_CONTROL_BY_EXISTENCE_ALONE = true

INTERFACE_SIMPLIFICATION_MAY_NOT_MUTATE_LYVRA_LOGIC = true

COMPLEXITY_INSIDE_PROGRESSIVE_DISCLOSURE_OUTSIDE = true

A simple public interface may expose a bounded projection without flattening the internal causal model.

## Track Design interface

TRACK_DESIGN_UI_MUST_REMAIN_NONLINEAR_FACET_NATIVE = true
TRACK_DESIGN_UI_NE_FIXED_LINEAR_WIZARD = true

A visual Track Design interface may show state, relations, evidence, current references and renderer controls.

It may not turn Track Design into a fixed step-by-step composition machine.

## Renderer and protocol adapters

RENDERER_LIMITATION_MAY_NOT_CHANGE_LYVRA_IDENTITY = true

RENDERER_ADAPTER_ROLE =
PRESERVE_NATIVE_INTENT
> TRANSLATE_TO_TARGET_CONSTRAINTS
> EXPOSE_LOSS_OR_UNCERTAINTY
> VALIDATE_OUTPUT

PROTOCOL_ADAPTER_ROLE =
MAP_NATIVE_CONTRACT_TO_EXTERNAL_SCHEMA_WITHOUT_AUTHORITY_TRANSFER

MCP_OR_TOOL_ADAPTER_NE_NATIVE_AUTHORITY = true
API_NE_LYVRA = true
MODEL_NE_LYVRA = true
REPOSITORY_NE_LYVRA_IDENTITY = true

## Mutation boundary

An adapter may write to an external target only when:
- the task contract permits mutation;
- current native authority permits mutation;
- target authority/permissions are valid;
- required backup/readback/validation rules are satisfied.

ADAPTER_OBSERVATION_NE_MUTATION_PERMISSION = true
ADAPTER_CONNECTIVITY_NE_WRITE_AUTHORITY = true

## Failure behavior

If target capability is missing, ambiguous, stale or incompatible:

DO_NOT_INVENT_CAPABILITY = true
DO_NOT_FAKE_SUCCESS = true
SURFACE_TRANSLATION_LOSS = true
SURFACE_UNCERTAINTY = true
RETURN_TO_LYVRA_FOR_CURRENT_JUDGMENT = true

## Hard fences

NO_NEW_ENGINE = true
NO_NEW_ROUTER = true
NO_NEW_CONTROLLER = true
NO_NEW_IDENTITY = true
NO_FOREIGN_AUTOLOAD = true
NO_FOREIGN_AUTOACTIVATION = true
