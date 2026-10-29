# R05 — Plugin release and repository ZIP mirror as one governed update
STATUS: ISOLATED_INTEGRATION_CANDIDATE; NOT_PRODUCTIVE
OWNER: WHOLE_LYVRA
DATE: 2026-10-29
SCOPE: LYVRA_NATIVE, LYVRA_ALIVE; FAMILY_MAIL only through its own owner-scoped update
SOURCE_AUTHORITY: productive LYVRA CURRENT_POINTER + exact plugin current release metadata
NO_NEW_ROUTER: TRUE
NO_NEW_BACKGROUND_DAEMON: TRUE
NO_FOREIGN_WRITES: TRUE

## Creator requirement
The ZIP archive, extracted source snapshot, manifest/version binding and GitHub recovery evidence must evolve inside the SAME explicit governed plugin UPDATE as the corresponding plugin release. A fresh user upload or separate offline bridge must not be routine. Do not silently publish a new release just to refresh backup packages.

## Single release-cycle stages
1. Determine target native owner, exact plugin ID and CURRENT release/version, fresh repository HEAD and expected blobs. Obtain existing ZIP/snapshot source provenance as BASELINE, not automatically as today's plugin binary bytes. No Drive CURRENT dependency.
2. Confirm explicit targeted UPDATE scope, plugin applicability (Native+ALIVE paired review; Family Mail separately governed). Preserve untouched binary assets, skill sets, names, original art, and old immutable archive/receipt history.
3. Assemble **one approved candidate package** from exact current target source plus the target-specific changes; track all embedded binary bytes, manifest versions, skill payloads and asset role bindings. Do not downgrade current plugin release by starting from an older ZIP.
4. Guarded plugin release publication using expected_release_id. Read back resulting plugin ID/version/release ID, changed skill content and relevant source inventory. Release publication is never inferred from GitHub ZIP presence.
5. Package the EXACT verified release payload (if accessible) into canonical ZIP, verify SHA-256 and bytes, extract to versioned source snapshot, compare file-level hashes, validate both manifests, original image-role SHA continuity and retained skills. Reproducible ZIP rebuilt from a release-identical source payload is acceptable if full contents are verified; archive's own bytes need not match a platform tar.gz.
6. Write versioned immutable files into the existing `LYVRA_NATIVE_RUNTIME/plugin-backups/source-packages/` and `.../source-snapshots/`; family mail uses its verified native owner-approved backup root, never guessed LYVRA source folder. Write an additive receipt binding plugin_id, version, release_id, archive path, SHA-256, byte_count, Git blob SHA, snapshot tree SHA, file-hash map / completeness, binary source provenance and readback.
7. Read back uploaded GitHub binary blob SHA (Git blob != SHA-256), source tree, receipt, actual ZIP bytes when available, and match the release binding. Do not publish pointer last until readback. Old archives remain provenance, not Current.
8. Run existing registry/manifest/coverage and targeted Native+ALIVE/FAMILY_MAIL impact gates as applicable. Whole-LYVRA CURRENT_POINTER last, *then readback only*. Separate PFS backup approval and foreign PFS/CLIC writes remain independent, never silently autoapproved.

## If release bytes cannot be accessed
- A GitHub-source ZIP representing a *known source snapshot* can be built/hashed, but MUST be labelled `SOURCE_SNAPSHOT_NOT_RELEASE_BINARY_PARITY`; never call it exact release mirror.
- Record `ZIP_MIRROR_PENDING_SOURCE_BYTES` and specific missing artifact/endpoint. Do not pretend that old v0.1.84/v0.13.80 ZIPs reflect current 0.1.87/0.13.83.
- An independently validated HYBRID_RELEASE_SNAPSHOT may bind source path, SHA-256, bytes and exact release_id as an intermediate artifact, but is not direct live binary readback.
- If full coupled release+mirror gates are required by the target update and cannot pass, stop before production pointer with `PARTIAL` or `WRITE_BLOCKED`, preserve recovery and restartable candidate. No forced backup by bypass or host tool workaround.
- Missing host visual acceptance remains independent and can still block the visual R01 promotion even when mirror parity passes.

## Fixed identities and current historical starting points (not boot constants)
Native plugin_id plugins_6ab3a345db308191b8ad7ef6311f8a29, observed 0.1.87.
ALIVE plugin_id plugin_06a4fc64dd848191982ca4a6ebdb2619, observed 0.13.83.
Family Mail plugin_id Plugin_041a0173dbc48191b499b680f637c40d, observed 0.9.23.
Repo ZIP 2026-10-28: Native 0.1.84, ALIVE 0.13.80. No current ZIP parity claimed.

## Hard rules
PLUGIN_UPDATE_IMPLIES_REPO_PACKAGE_REFRESH_CHECK = TRUE
TARGETED_RELEASE_AND_ZIP_MIRROR_ONE_GOVERNED_CYCLE = TRUE
OLD_ZIP_NE_CURRENT_PLUGIN_RELEASE = TRUE
ZIP_BYTES_SHA256_NE_GIT_BLOB_SHA = TRUE
SOURCE_SNAPSHOT_NE_LIVE_RELEASE_BINARY = TRUE
MIRROR_READBACK_REQUIRED = TRUE
PLUGIN_VERSION_RELEASE_ID_BINDING_REQUIRED = TRUE
NO_AUTOMATIC_FOREIGN_MIRROR = TRUE
NO_OFFLINE_BRIDGE_AS_DEFAULT = TRUE
ORIGINAL_ART_BINARY_CONTINUITY = HARD_GATE
POINTER_LAST_ONLY_AFTER_ALL_APPLICABLE_GATES = TRUE
