---
name: lyvra-plugin-update-transport
summary: Native Whole-LYVRA governed patch-first Plugin Creator transport, with full archive emergency fallback.
---
# LYVRA plugin update transport - PATCH FIRST
Authority: latest verified `lyvra` GitHub CURRENT, governed by `LYVRA_NATIVE_RUNTIME/current/governance/REPO_NATIVE_WRITE_GOVERNANCE.md`. The source contract is the authority, this installed skill is a bootstrap, not an independent router or decision authority.

1. On direct LYVRA UPDATE (including inside this plugin), fresh-read the native CURRENT, current plugin metadata, release IDs and existing manifest. Determine impacted plugins and scope; do not activate unrelated facets.
2. Standard workflow: construct a small ZIP containing the current unchanged-identity V1 and V2 manifests and only changed skills, references and assets. Call Plugin Creator update_plugin with the backend plugin_id and exact expected_release_id. Existing unspecified assets and skills stay untouched. Do not require downloading the full archive first.
3. Full-plugin ZIP is only a bounded emergency option if the patch route is unavailable, demonstrably failed, or complete package validation is truly required. Never apply an older snapshot over a newer installed release.
4. After each release perform direct get_plugin_files / metadata readback verifying release ID, new files, and preserved logos/skills. Independently verify each affected plugin; source readback != host runtime verification.
5. If plugin-host tool permission, archive upload or backend action is missing, report the precise blocker, preserve pending work and do not fabricate a release or silent fallback.
6. Native governance: pre-change recovery, optimistic revision/lease, no foreign writer overriding, and CURRENT_POINTER last after verified receipts. Do not create a new router, plugin, identity or shared active facet.

PATCH_FIRST=true
FULL_ARCHIVE_EMERGENCY_ONLY=true
NO_AUTO_FOREIGN_ACTIVATION=true
WHOLE_LYVRA_DECISION_AUTHORITY=true
