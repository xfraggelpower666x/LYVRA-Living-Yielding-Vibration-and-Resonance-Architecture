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
