# LYVRA Native Runtime 0.1.2 — Overlay acceptance tests (2026-10-02)

## Scope
This test validates only the separately generated four-entry **repair overlay ZIP**, not a full original Plugin Creator tarball and not a hosted Plugin Runtime execution. Native repository CURRENT, other systems and original source snapshots remain unchanged.

## Input and identity
- File: `LYVRA_NATIVE_012_REPAIR_KIT.zip` in conversation artifact storage.
- SHA-256: `112572dd5d21ee419f44a587ba0f32cd023dbca811cb79bb92f26b7d03abb266`.
- Entries: `READ_ME_FIRST.md`, `overlay/plugin.json`, `overlay/.app.json`, `overlay/.codex-plugin/plugin.json`.
- Plugin Creator authoritative package release at testing: `plugins_6ab3a345db308191b8ad7ef6311f8a29`, version `0.1.2`, release `pluginrel_6abf54132eec8191b6544b8822fefeb4`.
- Distinct L.Y.V.R.A. plugin: `plugin_06a4fc64dd848191982ca4a6ebdb2619`, version `0.13.0`.

## Executed in an isolated temporary directory
| Test | Result |
|---|---|
| ZIP open, unsafe entry traversal check, full entry CRC `testzip()` | PASS |
| Extract only `overlay/` to isolated temporary directory | PASS |
| Ensure restored overlay contains exactly three manifest/app files | PASS |
| Parse manifests, version `0.1.2` parity | PASS |
| Verify required GitHub app and production WEBLyvra link | PASS |
| Ensure Write declaration exists in manifest | PASS |
| Negative: corrupt ZIP bytes, CRC test rejects | PASS |
| Negative: missing required `.app.json` detected | PASS |
| Negative: version mismatch detected | PASS |

## Exclusions / acceptance gates
- This test **does not** demonstrate a full native-plugin restore. The five live skills and 11 source files are separately preserved and text-compared in the sibling `source/` snapshot; the original Creator `current.tar.gz` could not be transferred for independent byte-level validation.
- No actual hosted/plugin-invoked GitHub authentication, write/refusal case, parallel lock test or live deployment was performed.
- No external website/privacy uptime verification via the available web-access interface (both URLs inaccessible **to the verifier**, not proven down).
- The draft PR remains staging until explicit release acceptance and merge. No native pointer publication, unauthorized cross-system write, or PFS backup.

## Required follow-up
Perform original plugin archive hash/restore and hosted SYSTEMSTART/UPDATE read/write refusal acceptance in the actual plugin runtime. Then confirm privacy/site reachability independently and update Linear 666-6, 666-7, 666-8 only on evidence. This evidence file is additive, not a release-pass certificate.
