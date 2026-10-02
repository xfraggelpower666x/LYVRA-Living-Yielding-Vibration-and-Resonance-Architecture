# LYVRA Native Runtime 0.1.2 — Source Recovery

Official plugin backend ID: `plugins_6ab3a345db308191b8ad7ef6311f8a29`.
Observed Plugin Creator release: `pluginrel_6abf54132eec8191b6544b8822fefeb4`.

## What was repaired
The previous v0.1.1 native plugin directed SYSTEMSTART to GitHub but did not declare the required GitHub app. Version 0.1.2 includes an `.app.json` with the same already-connected GitHub app identifier as LYVRA plugin 0.13.0, preserves existing five native skills, keeps `Interactive`, and declares `skills` and `Write`. Both plugin manifests agree on capabilities, version and official WEBLyvra URL. `SYSTEMSTART` remains **read-only**; write actions continue to require concrete scope, authority, backup, and remote readback.

## Verified backup
11 source files under `source/` copied directly from the authenticated Plugin Creator release. Each was remotely read and compared for exact textual equality; result **11/11 MATCH**. See `PROVENANCE.json` for immutable Git blob SHA identifiers.

## Recovery
1. Re-read live plugin ID/release and native GitHub authority; never overwrite a newer release without reviewing its changes.
2. Verify each `source/` file's Git blob SHA against `PROVENANCE.json`.
3. Create a fresh, versioned ZIP/TAR with the source tree at archive root (plugin.json, .app.json, .codex-plugin/, skills/, references/, README.md); do not nest `source/` inside the plugin archive.
4. Validate manifests and app permissions; confirm all five skills retained. Only then use Plugin Creator with the exact `expected_release_id` and explicit user-approved scope. A source snapshot is **not** the original release tarball.
5. Read the new plugin release back and run direct SYSTEMSTART, negative write-permission tests and GitHub readback before promoting any release-gate status.

**Do not:** alter `LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json`, rewrite native authority, mutate private vaults, assume Cloudflare/GPT Builder/666PFS were updated, or represent package validation as a live runtime pass.
