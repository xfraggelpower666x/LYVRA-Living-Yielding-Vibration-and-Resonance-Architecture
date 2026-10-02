# L.Y.V.R.A. account plugin v0.13.0 — source snapshot and recovery

This is the separate **L.Y.V.R.A. account plugin** \(`plugin_06a4fc64dd848191982ca4a6ebdb2619`\), not the distinct `lyvra-native-runtime` v0.1.2. Both reference the same authoritative productive native LYVRA repository; neither creates another identity/root.

## Verified source
- Current Plugin Creator release: `pluginrel_6abed7676b5881918674b8d2c64e21af` / v`0.13.0`.
- Plugin Creator text files: **17 of 17** copied under `source/` with unchanged relative paths, individually compared against remote GitHub reads. The associated 17 Git Blob SHAs are recorded in `PROVENANCE.json`.
- Current skills: `instructions`, `rehydration-continuity`, `repository-update-recovery`, `track-design`, `suno-studio-2`, `music-analytics` (six skills total).
- Required GitHub app binding is preserved within `source/.app.json`. Manifests and all six `agents/openai.yaml` are included.

## Missing from this snapshot (do not silently skip!)
- The original **Plugin Creator current.tar.gz** binary could not be transferred to the verification environment.
- **13 binary image/icon files** totaling 23263240 bytes are excluded. Their names and original sizes appear in `PROVENANCE.json`; no image bytes or byte-level SHA256 have been verified.
- This is **not** a complete stand-alone restorable package, binary identical export, or independent PFS backup.

## Controlled recovery
1. Verify the plugin backend ID and retrieve current Plugin Creator release metadata again; do not overwrite a newer release.
2. Read `PROVENANCE.json` and verify all 17 Git blob SHAs at the pinned published commit.
3. Obtain the missing 13 binary assets from the authorized original package before forming any complete ZIP/TAR. Preserve all relative paths and icons. Do not fabricate or substitute image bytes.
4. Restore text files with their relative paths at archive root; do not nest `source/` inside the package.
5. Validate both manifests, app binding, all six skills, agent YAML, lookup index and reference guard.
6. Only with actual original assets and a scoped user grant, use Plugin Creator's `expected_release_id` guard; run full host SYSTEMSTART/UPDATE and permission-negative tests after an actual restore.
7. Confirm product HEAD separately; never alter `LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json` solely to publish a source archive. 666PFS Backup is separate and requires its own authorized readback.

Current status: **17/17 TEXT_SOURCE_MATCH**, **BINARY_ASSETS_OPEN**, **FULL_ARCHIVE_OPEN**, **HOST_RESTORE_OPEN**, **PRIVATE_RECOVERY_NOT_ATTEMPTED**.
