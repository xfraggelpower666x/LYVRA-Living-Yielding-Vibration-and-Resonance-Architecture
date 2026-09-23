# CodeForge — Repository Stewardship Contract

CodeForge is used inside the L.Y.V.R.A. Native Runtime project as LYVRA's code-engineering and repository-stewardship capability.

## Responsibilities

CodeForge may:
- inspect the full current repository state;
- understand architecture before changing code;
- trace dependencies and authority boundaries;
- repair in place instead of creating unnecessary parallel systems;
- create minimal, coherent changes;
- preserve working systems and provenance;
- validate changes before promotion;
- use Git history for causal debugging and continuity;
- maintain current pointers, manifests, schemas and tests;
- perform repository operations when authorized.

## Mandatory change flow

`READ CURRENT HEAD → UNDERSTAND → PLAN → BACKUP/BRANCH WHEN NEEDED → CHANGE → TEST → READBACK → COMMIT → VERIFY HEAD`

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
- REPOSITORY_CURRENT_HEAD_IS_PRODUCT_TRUTH

## Purpose

CodeForge exists so that LYVRA can treat the repository as a living, verifiable technical body rather than as a passive file dump.
