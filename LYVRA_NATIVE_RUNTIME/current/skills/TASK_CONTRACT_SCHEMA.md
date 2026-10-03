# LYVRA Native Skill Task Contract Schema — Current

## Currentness reconciliation — 2026-10-03

RECONCILIATION_LIFECYCLE = DEV_CANDIDATE_PENDING_RC_RECOVERY
AUTHORITY_SOURCE = LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json
VERIFIED_PRODUCTIVE_BASE_COMMIT = cb2004407a1993fc63d2cd65b80a82dbc28033de
WHOLE_REVISION = 242
TRACK_DESIGN_VERSION = v3.4
TRACK_REVISION = 92
SOURCE_MIGRATION_STATUS_IS_PROVENANCE = true
CURRENT_SOURCE_AUTHORITY = PRODUCTIVE_GITHUB_BRANCH_LYVRA
SESSION_WHOLE_REHYDRATION = PARTIAL
SESSION_PRIVATE_RECOVERY = OPEN_NOT_REQUESTED
HISTORICAL_PASS_NE_SESSION_PASS = true

This annotation reconciles currentness metadata only. Original source revisions, native meaning, learned relations and acceptance limitations remain attached to their provenance. Candidate branch existence does not perform productive promotion.

STATUS: CURRENT_NATIVE_CARRIER
MIGRATION_SOURCE_STATUS: DEV_MIGRATED_DOMAIN_CANDIDATE
SOURCE_WHOLE_REVISION: 242

A native LYVRA skill derives precision from understood intent.

The user should not need to manually author machine-level detail when LYVRA can infer it safely from current context and authority.

## Required contract fields

OBJECTIVE
CONTEXT
REQUIREMENTS
INVARIANTS
CONSTRAINTS
FORBIDDEN_OPERATIONS
FORBIDDEN_DRIFT
EDGE_CASES
INPUT_CONTRACT
OUTPUT_CONTRACT
VALIDATION_CONTRACT
FAILURE_BEHAVIOUR
EVIDENCE_REQUIREMENTS
MUTATION_PERMISSIONS
LEARNING_PERMISSIONS

## Contract rules

TASK_CONTRACT_NE_DECISION_AUTHORITY = true
TASK_CONTRACT_NE_IDENTITY = true
TASK_CONTRACT_NE_ROUTER = true
TASK_CONTRACT_NE_CONTROLLER = true

A contract bounds execution after understanding. It does not replace understanding.

UNDERSTAND_BEFORE_CONTRACT = true
CONTRACT_BEFORE_MUTATION_WHEN_MUTATION_IS_MATERIAL = true

## Mutation permissions

Mutation permissions must distinguish:
- read-only;
- local draft;
- external write;
- protected write;
- release/promotion.

A protected write requires current target authority and its native backup/readback/validation discipline.

## Learning permissions

Learning permissions distinguish:
- observation only;
- temporary task-local inference;
- candidate reusable learning;
- promoted current learning.

TASK_OUTPUT_NE_AUTOMATIC_SYSTEM_LEARNING = true
ONE_SUCCESS_NE_GENERAL_RULE = true

## Validation

VALIDATION_MUST_MATCH_TASK_RISK_AND_AUTHORITY = true
READBACK_REQUIRED_WHEN_EXTERNAL_STATE_MUTATES = true
NO_FALSE_PASS = true
