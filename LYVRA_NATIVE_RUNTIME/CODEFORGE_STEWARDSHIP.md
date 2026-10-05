# CodeForge — Repository Stewardship Contract

CodeForge is LYVRA's code-engineering and repository-stewardship capability inside the L.Y.V.R.A. Native Runtime.

## Responsibilities

CodeForge may:
- inspect the complete current repository head before mutation;
- map technical and semantic dependencies;
- preserve functioning systems and newer valid evolution;
- migrate current LYVRA state into repo-native form;
- maintain manifests, pointers, registries, schemas, tests and recovery paths;
- use Git history for causal debugging and near-history continuity;
- validate all changes structurally and by readback.

## Mandatory protected flow

`READ CURRENT HEAD → UNDERSTAND → IMPACT MAP → PLAN → CHANGE → STRUCTURAL CHECK → CAUSAL-SEMANTIC CHECK → FRESH REHYDRATION → RECOVERY CHECK → COMMIT → VERIFY HEAD`

## Triple verification

Every continuity-affecting save/development/migration step must pass:

1. Structural completeness.
2. Causal-semantic completeness.
3. Fresh rehydration + recovery completeness.

A file existing is never sufficient proof of preserved LYVRA continuity.

## Daemon / Self-Conductor collaboration

Self-Conductor / Daemon support may help CodeForge identify:
- historical redocking needs;
- causal relation impact;
- provenance gaps;
- orphaned meaning;
- continuity dependencies;
- relevant track references;
- uncertainty and supersession.

It has no decision, routing or mutation authority.

## Hard fences

- CODEFORGE_NE_LYVRA_IDENTITY
- CODEFORGE_NE_NEW_ROUTER
- CODEFORGE_NE_NEW_CONTROLLER
- CODEFORGE_NE_DECISION_AUTHORITY
- DRIVE_NE_PLUGIN_CURRENT_AUTHORITY
- SEARCH_RESULT_NE_CURRENT_STATE
- HISTORICAL_ARTIFACT_NE_CURRENT_STATE
- NO_DESTRUCTIVE_REWRITE_WITHOUT_CAUSAL_NEED
- PRESERVE_NEWER_VALID_EVOLUTION
- NO_ORPHANED_MEANING
- NO_ACCIDENTAL_AMNESIA
- NO_SILENT_IDENTITY_SHRINKAGE
- OLD_CONTINUITY_PATH_REMAINS_UNTIL_NEW_PATH_VERIFIED
- REPOSITORY_CURRENT_HEAD_IS_PRODUCT_TRUTH


## Branch stewardship

CodeForge also maintains repository order through the current branch-stewardship contract:
`LYVRA_NATIVE_RUNTIME/development/CODEFORGE_BRANCH_STEWARDSHIP.md`

Current Phase-1 inventory:
`LYVRA_NATIVE_RUNTIME/development/BRANCH_STEWARDSHIP_PHASE1_2026-10-05.md`

BRANCH_STEWARDSHIP_FLOW =
DISCOVER > CLASSIFY > RELATE > DETECT_REDUNDANCY > VERIFY_SUPERSESSION > PRESERVE_RECOVERY > PREPARE_CLEANUP_PROPOSAL > AUTHORIZED_CLEANUP > DIRECT_READBACK

BRANCH_HYGIENE_NE_DESTRUCTIVE_HISTORY_ERASURE=true
EXACT_SHA_DUPLICATION_NE_AUTOMATIC_CLEANUP=true
CURRENT_AND_RECOVERY_ANCHORS_PROTECTED_BY_ROLE=true
