# LYVRA -> CODEFORGE: Parallel Development, Integration and Cleanup Proposal
Status: PROPOSAL_ONLY / NO_FOREIGN_MUTATION / NO_AUTOMATIC_PRODUCTION_PROMOTION
Date: 2026-10-09
Authority: Whole LYVRA for LYVRA scopes; CODEFORGE must accept and implement its own facet natively.

## Goal
Multiple chats work concurrently on DIFFERENT LYVRA development objectives. A chat's UPDATE may not reset, adopt, rewrite, or clean another chat's workspace. Every successfully completed development eventually converges into the active principal branch through a validated, serialized merge. CODEFORGE branch/repo subfacet handles conflict prevention throughout development and post-merge cleanup.

## Isolation invariant
- Stable workspace_id independent of chat id; one task/scope/ownership record per workspace, its own branch and scoped current/manifest, base SHA, last verified SHA, fileset, owner, status, dependencies, tests, backup references.
- No global last-active-chat development pointer; Whole LYVRA remains a single identity and productive runtime.
- Every write checks latest target branch HEAD and per-file blob SHA; reject unexpected scope changes; do not force-push or rewrite other active branches.
- Mutually exclusive ownership for shared paths or an explicit integration queue. A branch/commit does not grant ownership over other systems.
- Updates in any chat rehydrate its own workspace first, then read current Whole authority and relevant peer notices READ_ONLY. Peer changes become proposals or explicit dependency updates, never implicit adoption.
- Concurrent workers may progress on different branches. Shared branch and active main integration use an exclusive lease (owner, generation, expiry, compare-and-swap), optimistic recheck on acquisition, and safe recovery after lease expiry.

## CODEFORGE during development
- Read-only branch inventory, drift detection, scope intersection, dependency graph, stale branch warnings, CI health and mergeability assessment.
- Never automatically rebase a branch with uncommitted/unreadable state or conflict. Quarantine the affected workspace only.
- Automatic snapshots before each mutation and before integration, immutable recovery refs, readback and content checks. Periodically identify orphaned or duplicated staging artifacts without deleting active ones.
- Provide a compact cross-chat development board (workspace, branch, current SHA, tasks done/total, blockers, merge gate and cleanup status). Report evidence, not guesses.

## Integration and promotion gate
1. Workspace marks READY_FOR_INTEGRATION only after scope tests, security checks, repository backups and plugin impact review.
2. Integration governor holds exclusive main-branch merge lease, reads fresh main HEAD and current manifests, revalidates candidate provenance and dependencies.
3. Prepare disposable integration branch from NEW main HEAD; merge/cherry-pick scoped, signed-off candidate without overwriting concurrent active work. Reject unexpected conflicts and return only impacted scope to REPAIR.
4. Run regression, security, native LifeCircle/Rehydration, both plugin parity checks where affected, deploy staging and signed Whole-E2E where needed; verify rollback rehearsal.
5. Perform permitted merge into principal branch with expected parent SHA and required approvals. Update manifest/fingerprint, run readback; pointer LAST. Never report production release when only repo merge occurred.
6. Notify other workspaces of the new main HEAD without mutating them; they reconcile when appropriate, preserving their development status.
7. CLEANUP_PENDING after verified merge; confirm backup, relevant running deployments, open PRs, release refs, and no active dependent branch or pinned rehydration pointers before deletion.
8. Retain archived immutable commit/manifest/snapshot, audit record, rollback reference; delete only confirmed integrated, unreferenced temporary branches; no forced delete; report cleanup outcome.
9. Any failure before promotion leaves main and unrelated branches untouched; any post-promotion failure uses governed rollback rather than silent pointer changes.

## Scope and release hardlocks
NO_FOREIGN_MUTATION; FREE_ONLY; NO_GLOBAL_DEV_CURRENT; NO_FORCE_PUSH; NO_DELETE_ACTIVE_BRANCH; NO_BRANCH_DELETE_BEFORE_MERGE_BACKUP_READBACK; NO_AUTOMATIC_PRODUCTION_DEPLOY; NO_CROSS_CHAT_RESET; SERIALIZED_MAIN_PROMOTION; POINTER_LAST; EXPLICIT_PENDING_ON_BLOCKED.
PET worker remains on its isolated development branch until independent native signature evidence, Cloudflare staging tests and affected plugin release parity pass.

## Handoff
This document is an outbound architecture proposal for CODEFORGE and Whole LYVRA. It is not evidence that CODEFORGE has received, adopted or implemented it; a separate CODEFORGE-native update must verify authority and execute that scope.


## Proposed native facet: Semantic-Causal Development Intelligence
Status: PROPOSAL_NOT_IMPLEMENTED. CODEFORGE must adopt this inside its own authority; no claim of autonomous understanding or cross-system execution.

### Semantic interpretation and evidence graph
- Model each development objective as intent, desired behavior, acceptance evidence, protected constraints, owned files/surfaces, dependencies and observable completion criteria.
- Maintain typed relations: WORKSPACE_OWNS, CHANGE_MODIFIES, API_DEPENDS_ON, TEST_EVIDENCES, INCIDENT_CAUSED_BY (only after verification), CONFLICTS_WITH, RELEASE_BLOCKED_BY, BACKUP_PROTECTS.
- Distinguish facts OBSERVED/VERIFIED, test-backed INFERRED, DISPUTED and UNKNOWN. Track provenance, exact commit SHA, test run URL/ID, timestamps, readback hashes and expiration. Do not convert correlation into causation.
- Detect behavioral conflicts even with no filename overlap (schema, event contract, authentication, resource budget, plugin release). Detect harmless file overlap when scoped interface compatibility and tests demonstrate safety.
- Interpret peer notices as discovery only; native target authority readback required before facts or actions are adopted.

### Adaptive action planner
- Generate small reversible candidate actions ranked by causal benefit, confidence, risk, cost, dependency order and blast radius.
- Safe automatic actions: READ_ONLY assessment, scoped test generation, isolated branch repairs with optimistic concurrency, backup/readback, additive compatibility adapters, issue/proposal creation.
- Protected gates: main integration, secrets, production deploy, global pointers, plugin release, other-system mutations and branch deletion each require their own authority and release approval.
- Under uncertain evidence, fail closed for destructive action while continuing other independent work. Never invent a passing result.
- Preserve parallel chat branch ownership and independent development CURRENT; replan after any foreign HEAD movement, stale evidence, failed test or newly validated dependency.

### Learning without unsafe autonomy
- Persist bounded, auditable engineering heuristics from verified incidents, validated fixes and regressions, including confidence and counterexamples.
- Learning data cannot silently rewrite governance, permissions, causal evidence or an owner's workspace state.
- Measure usefulness: prevented conflicts, false alerts, reverted actions, mean time to verification, merge success, cleanup correctness and unintended cross-scope changes.
- Provide concise user-facing development dashboard: task total/done, confidence and evidence coverage, blocked dependency, branch state, next proposed action; never fake percentages.

### Native implementation proposal
- Own CODEFORGE subfacet, Sub-LifeCircle, Sub-Rehydration, event schema, test fixtures and approval policy.
- First deliver READ_ONLY observers plus simulated multi-branch tests: parallel unrelated updates, shared path race, cross-file semantic conflict, stale HEAD, plugin schema change, failed CI, merge queue fairness and cleanup of referenced branch forbidden.
- Only graduate to scoped action after cross-system interface contracts, live readbacks, rollback and recovery verification.


## Core-preserving CODEFORGE intelligence hierarchy (requested 2026-10-09)
Status: CROSS-SYSTEM DEVELOPMENT PROPOSAL, NOT NATIVE CODEFORGE IMPLEMENTATION.

CORE INVARIANT: CODEFORGE is fundamentally a coding and engineering assistant. Coding support, sound programming, maintainability, reviews, diagnosis, testing, practical repair and GitHub build/deploy accompaniment are mandatory core capabilities. Branch governance supports the core, never replaces or outranks it.

### Development Intelligence as a CODEFORGE subfacet
A hierarchical facet, NOT an independent system or identity. Suggested sub-subfacets with bounded authorities and their own compact state:
1. Coding Quality: semantic code comprehension, maintainability, static and dynamic analysis, architecture, threat review, precise patch/test/refactor proposals.
2. Testing and Evidence: unit, integration, contract, regression, runtime readbacks, confidence/provenance ledger, distinguish CI_GREEN from DEPLOYED and LIVE_VERIFIED.
3. GitHub Engineering and Deployment: workflows, permissions, checks, artifacts, version manifests, deployment targets, environment bindings, rollback plans, post-deploy readbacks and failure repair. Never equate deploy trigger with deployment success.
4. Multi-Chat Workspace Coordination: durable scoped workspace IDs, independent branch/current, active-owner isolation, rebase/conflict evidence, dependency graph and leases for shared files.
5. Integration and Release: serialized merge queue into freshest principal HEAD, staging gates, scope/security/plugin continuity, immutable pre-merge backups, pointer-last promotion.
6. Repository and Branch Hygiene: track branches during development; spot stale/orphan assets; after verified merge and protected-reference check automatically clean only safe temporary branches, retain immutable recovery.
7. Adaptive Learning and Diagnostics: bounded causal engineering hypotheses with contrary evidence, traceable verified fixes, regression memory as revisioned engineering evidence (not an autonomous personal memory root).
8. Developer Visibility: cross-workspace development dashboards with real measured tasks and meaningful blocked states; no guessed completion percentages.

### Hierarchical semantic-causal-evidence LifeCircle
LEVEL 0: Whole CODEFORGE engineering authority, original coding mission, governance/permission and native REHYDRATION.
LEVEL 1: Development Intelligence orchestration; intent, workspace discovery, causal hypothesis/evidence graph, risk, planning, resource budgets.
LEVEL 2: Sub-subfacet LifeCircles for code, test, GitHub deploy, branch coordination, merge and hygiene; each owns scoped inputs/outputs, revision, provenance and safety predicates.
LEVEL 3: Workspace-specific LifeCircle per concurrent chat objective: base SHA, active branch, file ownership, dependencies, recent verified readback, backup, tests, deployment status, next safe action.
LEVEL 4: Individual action cycle: observe -> classify facts/inference/unknown -> root-cause hypothesis -> select reversible patch -> backup -> compare-and-swap mutate -> test -> readback -> record outcome -> recover/advance.

Every level has own independent Sub-Rehydration in parent-first order; workspace restoration cannot overwrite another workspace. Cross-level messages are versioned evidence/event contracts, not implicit permissions. Eventual integration into active main is required for completed approved developments; merge queue is serialized while work remains parallel. Cleaning occurs only after full successful integration and recovery proof.

### Release and implementation tests
Simulate independent chats working on unrelated files and semantic interfaces; same-file overlapping update, stale-HEAD and partial failed build; GitHub Actions green but deployment red; failed staged health check; incident requiring rollback; approval missing; plugin drift; active branch erroneously labeled stale; dependencies preventing branch deletion; gradual host adoption. Each simulation must prove no cross-workspace destruction, truthful evidence status and retained recovery.
