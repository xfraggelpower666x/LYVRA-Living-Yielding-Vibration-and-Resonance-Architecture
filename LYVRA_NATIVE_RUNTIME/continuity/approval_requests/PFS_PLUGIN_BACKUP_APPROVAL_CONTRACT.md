# LYVRA ↔ 666PFS Plugin Backup Approval Contract

STATUS: CURRENT_PRODUCTIVE_NATIVE_GOVERNANCE
ROOT_IDENTITY: LYVRA
DECISION_AUTHORITY: LYVRA_ONLY
PURPOSE: CROSS_SYSTEM_PLUGIN_BACKUP_APPROVAL_HANDSHAKE

## Boundary

PFS_MAY_REQUEST = true
PFS_MAY_APPROVE_LYVRA = false
PFS_MAY_MUTATE_LYVRA_LIVE = false
LYVRA_MAY_PROCESS_REQUEST = true
LYVRA_MAY_APPROVE_EXACT_MATCHING_REQUEST = true
PRIVATE_REPOSITORY_ROLE = BACKUP_STORAGE_ONLY
CROSS_SYSTEM_MERGE = FORBIDDEN

An approval request remains foreign evidence until LYVRA reads and validates it against Current.
A request never grants itself authority.

## Required request fields

- SOURCE_SYSTEM
- TARGET_AUTHORITY
- TARGET_CHILD
- REQUEST_STATUS
- LYVRA_SOURCE_HEAD
- ACCOUNT_VERSION
- ACCOUNT_RELEASE
- NATIVE_VERSION
- NATIVE_RELEASE
- BACKUP_TARGET
- REQUESTED_SCOPE
- PFS_SELF_APPROVAL
- PFS_LYVRA_MUTATION

## Validation

LYVRA may approve only when all are true:
1. TARGET_AUTHORITY = LYVRA_LIVE_REPOSITORY.
2. The request identifies the observed LYVRA source HEAD for provenance, while authorization validity is determined by the verified runtime/plugin state fingerprint.
3. Account version/release exactly match Current Account plugin.
4. Native version/release exactly match Current Native Runtime plugin.
5. Requested scope is limited to plugin-backup write, hash, readback and receipt.
6. Private target remains backup-only.
7. PFS self-approval and PFS mutation of LYVRA are forbidden.
8. No superseding LYVRA runtime/plugin state fingerprint invalidates the request before approval publication.

## Approval semantics

LYVRA approval is:
- request-specific,
- release-specific,
- runtime/plugin-state-fingerprint-specific,
- source-head-observed for provenance,
- backup-scope-specific,
- non-transferable,
- non-blanket.

APPROVAL != BACKUP_WRITE
APPROVAL != PFS_AUTHORITY_OVER_LYVRA
APPROVAL != CROSS_SYSTEM_MERGE

If the LYVRA plugin release set or any fingerprint-bound runtime/plugin semantic carrier changes after approval, the approval becomes SUPERSEDED.
A repository HEAD change alone does NOT supersede an approval when all fingerprint-bound runtime/plugin state remains byte-identical and directly revalidates.

HEAD_CHANGE_NE_AUTOMATIC_SUPERSESSION=true
RUNTIME_PLUGIN_FINGERPRINT_CHANGE=>SUPERSEDED_RELEASE_SET
APPROVAL_OR_RECEIPT_OR_POINTER_OR_MANIFEST_MAINTENANCE_MAY_ADVANCE_HEAD_WITHOUT_INVALIDATING_IDENTICAL_BOUND_STATE=true

The approval carrier MUST record both:
- source_head_observed_for_provenance
- runtime_plugin_state_fingerprint

PFS must fail closed when the fingerprint cannot be reproduced at execution time.

## Carriers

Inbound request readback:
`LYVRA_NATIVE_RUNTIME/continuity/approval_requests/PFS_PLUGIN_BACKUP_REQUEST_CURRENT.json`

Current LYVRA approval:
`LYVRA_NATIVE_RUNTIME/continuity/approval_requests/PFS_PLUGIN_BACKUP_APPROVAL_CURRENT.json`

The PFS repository remains foreign authority for its own execution state. LYVRA writes only its own approval carriers.


## Automatic plugin evolution rule

Every LYVRA semantic evolution must perform a plugin impact check against both LYVRA plugin surfaces.
If plugin-visible runtime semantics are affected, both applicable surfaces are evolved, versioned, published, directly read back and parity-verified in the same governed UPDATE lifecycle.
Pure history/evidence-only changes may close as PLUGIN_IMPACT=NOT_APPLICABLE only with a bounded reason.

SEMANTIC_RUNTIME_EVOLUTION=>PLUGIN_IMPACT_CHECK
PLUGIN_IMPACT_APPLICABLE=>AUTO_PLUGIN_EVOLUTION_AND_READBACK
SILENT_PLUGIN_DRIFT=FORBIDDEN
