# PFS NEW CHILD — LYVRA PET BACKUP

## Registration proposal

- Requested name: **LYVRA PET — BACKUP**
- ID: `PFS-CHILD-LYVRA-PET-BACKUP-20261008`
- Parent: 666PFS orchestrator, **backup catalog only**
- Native owner and operational authority: **Whole LYVRA**
- Source of truth: LYVRA repository, native `lyvra` branch for production
- Snapshot: `backup/lyvra-pet-approved-staging-20261008`
- Backup manifest: `LYVRA_PET/backups/2026-10-08/APPROVED_STAGING_SNAPSHOT.json`
- State: **HANDOFF_READY / PFS_REGISTRATION_PENDING**
- Approval: user requests backup as *new child*. This is not authorization to start LYVRA externally, change native `lyvra` pointers, merge PR #57, or publish Cloudflare production.

## Capabilities

1. List and hash-verify all six PET artifact files.
2. Register snapshot and source revisions with no invented equivalence between staging and production.
3. Detect divergence and notify PFS/CLIC/Whole LYVRA through normal native processes.
4. Prepare a quarantined restore candidate and conduct safety/functional tests.
5. Restore only after native owner approval, rehydration readback, secure re-provisioning of Cloudflare secrets, and expected-revision verification.

## Hard constraints

- No secret export, GitHub PAT replication, or signing-key copy.
- No productive Worker, radio, Discord or unrelated PFS child mutation.
- No independent LYVRA identity or second personality.
- FREE_ONLY. Do not use premium infrastructure or overrun free quotas.
- Staging remains not fully end-to-end approved.
- Register in *actual* PFS primary registry; do **not** use `666PFS_CSM` as parent.

## Completion criteria

Native PFS registry writes its own child record, readback confirms child id, snapshot branch, hash manifest and restore contract. Until then label **PENDING_PFS_NATIVE_REGISTRATION**.
