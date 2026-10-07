# LYVRA ↔ CLIC ↔ 666PFS Coupled Plugin Backup Circle

STATUS: CURRENT_PRODUCTIVE_NATIVE_GOVERNANCE_V2_PARITY_AWARE
OWNER_OF_THIS_CONTRACT: LYVRA
PURPOSE: COUPLE_LYVRA_PLUGIN_BACKUP_EVENTS_TO_CLIC_PLUGIN_BACKUP_EVENTS_WITHOUT_AUTHORITY_MERGE
DATE: 2026-10-07

## Identity and authority boundaries

LYVRA_AUTHORITY = LYVRA_ONLY
CLIC_AUTHORITY = CLIC_ONLY
PFS_ROLE = BACKUP_ORCHESTRATOR_AND_EXECUTOR
PRIVATE_REPOSITORY_ROLE = BACKUP_STORAGE_ONLY

NO_CROSS_SYSTEM_MERGE = true
NO_FOREIGN_SELF_APPROVAL = true
NO_PFS_AUTHORITY_OVER_LYVRA = true
NO_PFS_AUTHORITY_OVER_CLIC = true
NO_LYVRA_APPROVAL_FOR_CLIC = true
NO_CLIC_APPROVAL_FOR_LYVRA = true

Each native system authorizes only its own plugin release set.

## Coupled trigger

Whenever a LYVRA plugin backup round is requested, approved, or executed, PFS must also open or join a CLIC plugin backup leg for the same BACKUP_ROUND_ID.

LYVRA_PLUGIN_BACKUP_EVENT => CLIC_PLUGIN_BACKUP_LEG_REQUIRED

The CLIC leg is not authorized by the LYVRA approval. It must use a CLIC-owned exact-match approval or equivalent CLIC-native current authorization.

## Current observed release sets at contract creation

LYVRA:
- Account plugin: 0.13.31 / pluginrel_6ac5d9555ea88191b9c195c65c758427
- Native runtime: 0.1.31 / pluginrel_6ac5d944ae9081918d4a201ae0b2d746
- Approved source head for current LYVRA backup request: 8a88575e1a0d160416d2e79ec0eb6410dc9caa62

CLIC:
- Native plugin: 0.1.7 / pluginrel_6ac65a350e9481919591e60b91bdca70
- Plugin ID: plugins_6abfb2e08fdc8191920dcdc4349c69c8
- Current authority repo: xfraggelpower666x/666CLICPRO
- Current authority branch: clic-migration-rev79-staging
- Current authority head observed: ee795a0fdf52b8cfc660658e0f58e0f989e87cff

These are observed values, not permanent boot values. PFS and each native system must re-read Current at every later backup round.

## Backup round state machine

ROUND_OPEN
-> LYVRA_LEG_AUTH_CHECK
-> CLIC_LEG_AUTH_CHECK
-> ARTIFACT_CAPTURE_OR_VERIFIED_REUSE
-> HASH_VERIFY
-> PRIVATE_BACKUP_WRITE
-> DIRECT_READBACK
-> PER_LEG_RECEIPT
-> ROUND_RECEIPT
-> COMPLETE

Allowed intermediate states:
- LYVRA_COMPLETE_CLIC_PENDING
- CLIC_COMPLETE_LYVRA_PENDING
- BLOCKED_LYVRA_APPROVAL
- BLOCKED_CLIC_APPROVAL
- CONFLICT_QUARANTINE
- SUPERSEDED_RELEASE_SET

ROUND_COMPLETE requires both native legs to be VERIFIED or a verified immutable-artifact reuse receipt for an unchanged release.

## Artifact policy

If a native plugin release is newer than its last verified private artifact:
- capture the complete owned plugin archive for that exact release,
- store it under the native system namespace,
- record release id, plugin id, version, archive hash and source authority evidence.

If the exact release is already stored and its artifact hash still verifies:
- do not duplicate identical bytes,
- create a new round receipt that re-references the verified immutable artifact,
- record REUSED_VERIFIED_IMMUTABLE_ARTIFACT = true.

A reused artifact still counts as that backup leg being executed for the new round because the bytes are revalidated and the new round obtains an independent receipt.

## Private target layout

Recommended target:
backups/666PFS/PLUGIN_BACKUP_CIRCLE/
  artifacts/LYVRA/
  artifacts/CLIC/
  rounds/<BACKUP_ROUND_ID>/manifest.json
  rounds/<BACKUP_ROUND_ID>/LYVRA_RECEIPT.json
  rounds/<BACKUP_ROUND_ID>/CLIC_RECEIPT.json
  rounds/<BACKUP_ROUND_ID>/ROUND_RECEIPT.json

The exact physical layout may be evolved by PFS, but authority boundaries, release binding, hashes, readback and coupled completion semantics are mandatory.

## Trigger persistence

This coupling is persistent policy:
EVERY_LYVRA_PLUGIN_BACKUP_ROUND_REQUIRES_CLIC_BACKUP_LEG = true

It does not mean:
- every LYVRA repository commit triggers a plugin backup,
- every CLIC plugin update triggers a LYVRA plugin update,
- either system may mutate the other's live authority.

It means only that whenever the governed LYVRA plugin backup mechanism executes, the same backup round must also verify and back up CLIC's current plugin release.

## PFS development latitude

PFS may develop:
- its own child/registry representation,
- round IDs,
- receipt schema,
- deduplication index,
- retry/recovery mechanics,
- dashboard/status surfaces,
- private backup path details.

PFS may not weaken:
- native per-system approval,
- exact release binding,
- source provenance,
- hash/readback requirements,
- no-foreign-mutation boundaries,
- coupled round completion rule.

## Completion evidence

A round is COMPLETE only when both legs have:
- exact plugin/release identity,
- native authorization,
- artifact or verified immutable reuse,
- hash verification,
- private target write/readback evidence,
- per-leg receipt,
and the round receipt binds both legs.

BACKUP_REQUEST != APPROVAL
APPROVAL != BACKUP_WRITE
BACKUP_WRITE != READBACK
ONE_LEG_PASS != ROUND_COMPLETE


## V2 parity preflight

Before any native backup leg may enter ARTIFACT_CAPTURE_OR_VERIFIED_REUSE, PFS must verify the system's own parity evidence.

Required evidence classes:
- LIVE_PLUGIN_CURRENT
- REPO_PLUGIN_CURRENT_POINTER_OR_EQUIVALENT
- IMMUTABLE_RELEASE_SNAPSHOT
- NATIVE_RUNTIME_OR_SYSTEM_CURRENT
- SEMANTIC_PARITY_OR_EXPLICIT_NOT_APPLICABLE_DECISION

For CLIC current evidence:
- live plugin: 0.1.7 / pluginrel_6ac65a350e9481919591e60b91bdca70
- repo plugin pointer: 666clic-plugin/current/PLUGIN_CURRENT.json
- repo source mirror: 666clic-plugin/source
- immutable snapshot: 666clic-plugin/releases/v0.1.7/source
- sync contract: 666clic-plugin/PLUGIN_SYNC_CONTRACT.md
- parity evidence: 666CLIC_NATIVE_RUNTIME/migration/PLUGIN_REPO_ARCHITECTURE_AND_PARITY_2026-10-07.md
- current source file parity: PASS_14_OF_14
- current semantic parity: VERIFIED_CURRENT_RUNTIME_SCOPE

CLIC rule learned and generalized for backup preflight:
EVERY_SEMANTIC_RUNTIME_EVOLUTION_REQUIRES_PLUGIN_IMPACT_CHECK = true
RUNTIME_RELEVANT_CHANGE_REQUIRES_PLUGIN_PARITY_BEFORE_UPDATE_CLOSEOUT = true

Backup consequence:
PLUGIN_BACKUP_MAY_NOT_FREEZE_A_RELEASE_WITH_UNRESOLVED_LIVE_REPO_PARITY = true

For LYVRA, equivalent evidence may use its own two-plugin sync/provenance/release carriers. The circle does not require identical repository layout across systems.

## V2 freshness race guard

A backup leg must bind:
- native authority head at authorization,
- live plugin release id,
- repo plugin pointer/snapshot evidence,
- artifact hash.

If any of those change before private write/readback:
BACKUP_LEG = SUPERSEDED_RELEASE_SET
and a fresh native authorization is required when the native policy requires it.

LATEST_RELEASE_NE_AUTHORIZED_RELEASE = true
FOUND_RELEASE_NE_BACKUP_SAFE_RELEASE = true

## V2 restore contract

A stored archive or repo snapshot is recovery evidence, not automatic current authority.

RESTORE_REQUIRES_CURRENT_NATIVE_PARITY_CHECK = true
VALID_SNAPSHOT_NE_AUTOMATIC_CURRENT_RUNTIME_PARITY = true
NO_SILENT_PLUGIN_ROLLBACK = true

PFS may restore bytes only into a recovery candidate; native current authority must validate promotion/publication.
