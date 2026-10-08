# LYVRA → 666CLIC · Native Bridge Building Facet Handoff
STATUS: READY_FOR_CLIC_NATIVE_REVIEW · INFORMATIONAL_ONLY
DATE: 2026-10-09
SOURCE_FACET: LYVRA_NATIVE_RUNTIME/facets/repository_bridge/
TARGET: CLIC native Development/Bridge capability and optional CLIC Junior shared Pet pipeline
NO_FOREIGN_AUTOACTIVATION=TRUE
NO_FOREIGN_WRITE=TRUE
NOTICE_NE_AUTHORITY=TRUE
SOURCE_ARCHIVE_NE_INSTALLED_RELEASE=TRUE

## Why CLIC should consider this
LYVRA built cross-platform safe ZIP→GitHub bridge backups for Pet, main LYVRA plugin and ALIVE. User needs full unmodified re-uploadable ZIP and separately unpacked accessible files stored under owner-controlled native repository; without forcing plugin updates. Earlier false six-file failures followed Windows checkout LF/CRLF normalization; raw Git blob readback fixes that class of false negatives. Repo commit without content readback is PARTIAL, never PASS.

## Source files to read in full, not snippets
- LYVRA_NATIVE_RUNTIME/facets/repository_bridge/FACET_CONTRACT.md
- LYVRA_NATIVE_RUNTIME/facets/repository_bridge/CURRENT_STATE.json
- LYVRA_NATIVE_RUNTIME/facets/repository_bridge/REHYDRATION_MANIFEST.json
- LYVRA_NATIVE_RUNTIME/facets/repository_bridge/SUB_REHYDRATION.md
- LYVRA_NATIVE_RUNTIME/facets/repository_bridge/BRIDGE_GENERATION_BLUEPRINT.md
- LYVRA_NATIVE_RUNTIME/current/governance/REPO_NATIVE_WRITE_GOVERNANCE.md

## Target-native design task
CLIC chooses whether to create its OWN faceted Bridge Intelligence, or extend an existing owned engineering facet. Its own sub-LifeCircle and sub-rehydration must load after complete CLIC native identity/authority/relation/meaning/provenance/operations; work scope LAST. No copying LYVRA's identity or pointers as current CLIC authority. It can make reusable recipes for its managed systems subject to each target's explicit scope and permission, no cross-system automatic writes.

### Bridge Build Algorithm
1. Trusted owner intent, exact repo/branch/target snapshot; resolve CURRENT and source zip; never execute archive scripts.
2. ZIP validation CRC; reject traversal, symlinks, duplicate paths, case-fold collisions, zip bombs, sensitive files and path escapes.
3. Fingerprint original exact ZIP and every extracted member, produce stable manifest with SHA-256 and sizes.
4. Two immutable paths: source-packages/<original>.zip, source-snapshots/<package>/<members>. Preserve dotfiles and original bytes.
5. Explicit preflight and expected HEAD: fresh clone, recovery anchor, narrow allowlist. Identical destination bytes SKIP, differing bytes BLOCK, no overwrite.
6. Git stage only approved paths, non-force commit/push, optimistic race guard and conflict abort.
7. Fresh remote readback with GIT BLOBS (git cat-file/show HEAD:path); never compare Windows checkout-normalized text with raw ZIP entry bytes.
8. Verify total 1+N file count, all SHA-256, ZIP CRC, branch commit ancestry, receipt. No PASS without independent readback.
9. Freeze/receipt, reversible recovery, local cost-free execution. Do not automatically deploy plugin releases, change native CURRENT_POINTER or claim host UI parity.
10. Notify owning system for review; publish to PFS backup only on fresh target-native approval, stable-set and binary hash proof.

## Historical proof and known limitations
LYVRA PET ZIP+10 extracted commit f4feb5e54c2fbedc521f54a5bfead2f42a36b9c1.
LYVRA Plugin ZIP+31 extracted commit f1406b6d1d4f4d299842a53544bbe0f2b202d12f.
LYVRA ALIVE ZIP upload/backup state MUST be independently read, not assumed from user intent.
Bridge-facet documents were created now; runtime recipe has not itself been exercised as a newly packaged bridge. `DOCUMENTED` != `IMPLEMENTATION_TEST_PASS`.

## CLIC acceptance probes
Native pointer/references current verified; no foreign autoactivation.
Valid & malicious archives tested (traversal, symlink, duplicates, zip bomb).
CRLF/LF tests pass via raw blobs on Windows.
Concurrency & conflict no-clobber; failed push/remote drift BLOCKED.
1+N readback matches original package manifest.
Native CLIC adoption/versioned facet continuity acknowledged explicitly.

## UPDATE 2026-10-09: ALIVE Bridge v3 field-tested and GitHub-confirmed
- LYVRA ALIVE original archive plus 46 extracted files arrived on branch lyvra, commit `90ab1fb6d0232c74ea68c0e1609e3d0422c709b7`. GitHub tree shows 47/47 backup objects; full independent SHA-256 byte readback not claimed in this notice.
- Failure 1 after local PASS 47: PowerShell function named `Git` shadowed case-insensitive native `git`, recursively overflowed call depth. Rename wrapper `Invoke-GitSafe` and resolve explicit `git.exe` binary.
- Failure 2 after local PASS 47 and clone: `Already on 'lyvra'` on stderr was a normal Git checkout message, but PowerShell treated native stderr as terminating. Evaluate process exit code, not stderr presence. Preserve stderr evidence in receipts; only non-zero exit code or missing verified effect is failure.
- v3 completed user-side bridge; commit/tree independently confirmed. Promote both failures into CLIC's mandatory Windows bridge acceptance tests.
- The CLIC implementation should independently prove precise 47/47 SHA-256 content readback, and test under Windows PowerShell native-command streams.
- No CLIC auto-activation, cross-repo writes, pointer mutation, or assumption of accepted native CLIC facet.
