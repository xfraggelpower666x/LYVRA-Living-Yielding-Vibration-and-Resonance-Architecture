# LYVRA Binary Repository Bridge

STATUS: CURRENT_NATIVE_CAPABILITY
VERSION: 1.0.0
SCOPE: VERIFIED_BINARY_TRANSFER_FALLBACK

## Purpose

Provide a LYVRA-native fallback when a verified local binary payload cannot be transported into GitHub through the active repository connector.

The bridge is a transport capability only. It is not a router, authority, deployment system, plugin host or pointer writer.

## Eligibility

Use only when all are true:
- source bytes are available;
- exact source identity is verified;
- expected byte size is known;
- expected SHA-256 is known;
- target repository, branch and path are unambiguous;
- publication to that repository is allowed;
- direct binary repository transport is unavailable or blocked.

Prefer a complete direct binary mirror when available. Bridge is fallback-only.

## Required sequence

1. verify local source path, size and SHA-256;
2. capture current remote HEAD;
3. fresh clone/read of target branch;
4. copy only authorized payload paths;
5. stage exact authorized paths only;
6. re-read remote HEAD immediately before push;
7. abort on unexpected remote movement;
8. push without force;
9. perform independent fresh remote readback;
10. verify remote presence, byte size and byte identity;
11. generate a machine-readable receipt;
12. only after PASS may native LYVRA UPDATE promote repository state;
13. CURRENT_POINTER remains the last mutation of that native update.

## Hard fences

- NO_FORCE_PUSH
- NO_POINTER_MUTATION_BY_BRIDGE
- NO_LYVRA_STATE_MUTATION_BY_BRIDGE
- NO_PLUGIN_MUTATION_BY_BRIDGE
- NO_DEPLOYMENT_BY_BRIDGE
- NO_CROSS_SYSTEM_MERGE
- NO_PRIVATE_PAYLOAD_TO_PUBLIC_REPO
- NO_UNVERIFIED_HASH
- NO_UNVERIFIED_SIZE
- NO_SILENT_CANDIDATE_PROMOTION
- READY_WITHOUT_REMOTE_READBACK = FORBIDDEN

## Proven first LYVRA use

Date: 2026-10-06

Remote commit:
`243eaf3e8baccaf4e103d05fcfb983b0a08252a7`

Verified paths:
- `LYVRA_PET/browser/assets/spritesheet-extended.png`
- `LYVRA_PET/source-packages/LYVRA-Cyber-Pet-Full-Package(1).zip`
- `LYVRA_PET/references/candidates/LYVRA_CYBORG_PET_v1_0_0_VALIDATED_CANDIDATE.zip`

The Cyborg package remains candidate-only and is not Current authority.

## 666STREAM Master Bridge reference — native LYVRA additive intake 2026-10-17

OWNER = WHOLE_LYVRA
NATIVE_BRIDGE_IDENTITY = LYVRA_BINARY_REPOSITORY_BRIDGE_V1_0_0
REFERENCE_ONLY = 666STREAM-CODEFORGE-BRIDGE-MASTER v1.0.0
STREAM_REFERENCE = xfraggelpower666x/WebRadio-666SOUNDsDESIGn @ WebRadio-666SOUNDsDESIGn : radio-codeforge/bridge/MASTER_BRIDGE_REFERENCE_v1.0.0.md
STREAM_REFERENCE_BLOB = 197793077d081f6c28970d4bdfffc6a483cdafca
ONE_LYVRA_NATIVE_BRIDGE = TRUE
NO_FOREIGN_AUTHORITY = TRUE

### Transport selection
1. Rehydrate the current LYVRA HEAD, native scope, allowlisted target and actual connector capability. Inspect exact available original source bytes, independently measured size and SHA-256.
2. Prefer **direct GitHub binary transfer** through the existing authorized connector, when supported for the particular payload and allowed repository/branch/path. The candidate primitive sequence is create_blob(base64), create_tree, create_commit, update_ref. This is an added transport *mode*, NOT a second bridge or a blanket connector-size PASS.
3. Require fresh target HEAD, expected source identity, explicit destination permission/allowlist, no silent overwrite, fresh HEAD recheck and no force-update. Abort/quarantine on concurrent unexpected HEAD movement.
4. After any transfer, independently read the remote Git blob and compare **actual bytes, byte count and SHA-256** to the immutable original. A matching Git blob SHA or reported API success by itself is source evidence, not automatically independent source SHA-256 readback.
5. When direct transfer is unavailable or fails safely, retain this LYVRA v1.0.0 **existing offline/local Git fallback** as-is. Local preparation may be offline; remote publication still requires authenticated network access and authorization. Recheck remote HEAD, use no-force push and independently hash/read the remote result.
6. When neither verified mode is executable, preserve the original source, hashes, exact target, failure category and return anchor as BLOCKED/READBACK_PENDING. Do not build a new bridge, mutate unrelated workspaces or call a staged artifact imported.
7. Bridge transport never publishes CURRENT_POINTER, activates CLIC/666STREAM/PFS, deploys runtime, changes plugins, or grants native adoption. Promotion remains governed by LYVRA UPDATE, CURRENT_POINTER last.

### Qualification of the external evidence
At STREAM commit e5876afa45b6a01557740a779865aa1ae42f604e, Git tree contains a 582-byte derived ZIP with blob 111abe5921d9f62303648c96f648bd924e0cafe1. The Master reference names binary-zip-readback-receipt.json at the test location; that named path was NOT found at that commit. The present receipt.json pertains to the separate 869-byte text/source-file operation, explicitly labels binary ZIP transport NOT_TESTED and must not be treated as ZIP acceptance evidence. Therefore: STREAM_DIRECT_582_BYTE_GIT_BLOB = SOURCE_VERIFIED; STREAM_INDEPENDENT_ZIP_BYTES_SHA256_READBACK = PENDING; FULL_9123_BYTE_ORIGINAL_ARCHIVE = NOT_TESTED; WINDOWS_POWERSHELL_RUNNER = NOT_TESTED; CLIC_OFFLINE = DISABLED_UNVERIFIED. LYVRA's historical own fallback evidence is preserved without upgrading fresh host claims.

This is a scoped addition to LYVRA's original bridge, not an override of its v1.0.0 identity or previous proven transfer.
