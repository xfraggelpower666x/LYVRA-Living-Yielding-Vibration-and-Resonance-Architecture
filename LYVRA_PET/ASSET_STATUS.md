# LYVRA Pet binary asset status

Status: SOURCE_ASSET_VERIFIED / REPO_BINARY_MIRROR_BLOCKED

## Current verified source asset

The active LYVRA Pet atlas is still available in the user's Library and was byte-read back on 2026-10-06.

- Library atlas filename: `spritesheet-extended.png`
- Local materialized SHA-256: `f5129134e46e492bf7ef34da83c0cd4c75f9f0051553cc60880b4ab47e1d6fba`
- Live/stored file SHA-256 reported by the Pet readback: `41bf3f1b943bfebcf470232e9a8db4b79142eed330959f552531f5ca5042886d`
- RGBA pixel comparison: IDENTICAL
- Dimensions comparison: IDENTICAL
- Pet ID preserved: `pet_6ab791129364819183885f44a21497a2`

The differing encoded file hashes do not imply differing artwork because the stored readback explicitly verified identical RGBA pixels.

## Historical package provenance

The previously documented package:

`LYVRA-Cyber-Pet-Full-Package_v3_ADD_REACTION_MUSIC.zip`

has historical SHA-256:

`c49d616f5e068e200c3f1a67b786751bcf80e9db067fc906437061bcb81bf2e6`

A Library package named `LYVRA-Cyber-Pet-Full-Package.zip` is available, but its directly materialized SHA-256 is:

`7ab44a48411556e96590174206923dd7f17b1b9822347cc4a081f0da8a4784ce`

Therefore that Library ZIP MUST NOT be silently declared byte-identical to the historical v3 package.

## Repository mirror status

The current GitHub connector can write UTF-8 repository files but does not expose a cross-tool binary file-reference upload path from the Library/container into GitHub.

REPO_BINARY_MIRROR_STATUS = WRITE_BLOCKED_BINARY_FILE_REFERENCE_TRANSPORT
SOURCE_ASSET_AVAILABILITY = VERIFIED
ACTIVE_PET_ARTWORK = VERIFIED_BY_RGBA_READBACK
EXACT_HISTORICAL_V3_ZIP_BYTE_IDENTITY = UNRESOLVED
SYSTEM_COMPLETION_BLOCKER = FALSE

Pending optional repository mirror targets:
- `final/spritesheet-extended.png`
- `final/spritesheet.png`
- `final-frames/**`
- `references/**`
- `verification/stored-readback.png`
- exact historical source ZIP if its bytes are re-resolved

Do not invent a repository binary mirror and do not overwrite verified current Pet artwork.


## Browser renderer update — 2026-10-06

BROWSER_RENDERER_CODE = VERIFIED_REPOSITORY_CURRENT
BROWSER_RENDERER_PATH = LYVRA_PET/browser/
ACTIVE_RENDERER_ATLAS_SHA256 = f5129134e46e492bf7ef34da83c0cd4c75f9f0051553cc60880b4ab47e1d6fba
ACTIVE_RENDERER_LOCAL_HTTP_TEST = PASS
REPO_BINARY_ATLAS = WRITE_BLOCKED_BINARY_FILE_REFERENCE_TRANSPORT
PLUGIN_BINDING = NONE
DEPLOYMENT = NONE
CYBORG_CANDIDATE_PROMOTED = FALSE

The browser renderer code is current in the repository and was validated locally with the verified active atlas. The PNG binary itself is not claimed as mirrored until a direct repository binary readback exists.
