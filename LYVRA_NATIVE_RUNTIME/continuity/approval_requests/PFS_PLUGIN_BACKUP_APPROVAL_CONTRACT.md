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
2. LYVRA_SOURCE_HEAD matches the verified Current LYVRA head being authorized.
3. Account version/release exactly match Current Account plugin.
4. Native version/release exactly match Current Native Runtime plugin.
5. Requested scope is limited to plugin-backup write, hash, readback and receipt.
6. Private target remains backup-only.
7. PFS self-approval and PFS mutation of LYVRA are forbidden.
8. No superseding LYVRA plugin release or Current head invalidates the request before approval publication.

## Approval semantics

LYVRA approval is:
- request-specific,
- release-specific,
- source-head-specific,
- backup-scope-specific,
- non-transferable,
- non-blanket.

APPROVAL != BACKUP_WRITE
APPROVAL != PFS_AUTHORITY_OVER_LYVRA
APPROVAL != CROSS_SYSTEM_MERGE

If the LYVRA plugin release set changes after approval, the approval becomes SUPERSEDED for a later backup set.
If only unrelated repository content changes after approval, PFS must revalidate the approved source binding according to the approval carrier before writing.

## Carriers

Inbound request readback:
`LYVRA_NATIVE_RUNTIME/continuity/approval_requests/PFS_PLUGIN_BACKUP_REQUEST_CURRENT.json`

Current LYVRA approval:
`LYVRA_NATIVE_RUNTIME/continuity/approval_requests/PFS_PLUGIN_BACKUP_APPROVAL_CURRENT.json`

The PFS repository remains foreign authority for its own execution state. LYVRA writes only its own approval carriers.
