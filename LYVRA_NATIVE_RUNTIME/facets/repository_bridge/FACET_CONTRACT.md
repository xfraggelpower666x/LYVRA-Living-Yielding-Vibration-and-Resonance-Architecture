# LYVRA Repository Bridge Intelligence · Native Facet
STATUS: ADDITIVE_FACET_CURRENT · 2026-10-09
PARENT: WHOLE_LYVRA
FACET_ID: REPOSITORY_BRIDGE_INTELLIGENCE
FACET_NE_IDENTITY=TRUE
FACET_NE_CONTROLLER=TRUE
FACET_NE_ROUTER=TRUE
FACET_DECISION_AUTHORITY=NONE
LYVRA_DECISION_AUTHORITY=LYVRA_ONLY
NO_FOREIGN_AUTOACTIVATION=TRUE

## Purpose
LYVRA learns a reusable, causal, evidence-driven capability for constructing portable and safe repository archive/restore bridges. It converts supplied ZIPs into (1) immutable exact re-uploadable original ZIP backup and (2) extracted, content-addressed source snapshot without mutating production trees. Applies to LYVRA plugins, Pet and future approved LYVRA packages; export as an informational blueprint to peers only.

## Why this facet exists
The first Pet bridge produced a false REMOTE READBACK FAIL: 6 files after Windows LF→CRLF checkout normalization despite all bytes reaching GitHub. The new bridge strategy validates **Git objects**, not checkout-converted worktree bytes. Subsequent complete Pet and LYVRA-plugin archives landed in separate source-packages/source-snapshots trees with 11 and 32 objects respectively; ALIVE backup is not inferred complete until separately verified. Preserve historical failures as provenance.

## Reasoning sequence
INTENT→OWNER/AUTHORITY→CURRENT POINTER/HEAD→INPUT SAFETY→BINARY MANIFEST→PLAN/DIFF→RECOVERY→PREFLIGHT→IMMUTABLE UPLOAD→FRESH REMOTE CLONE/READBACK→RECEIPT→OPTIONAL NATIVE PROMOTION.
Do not confuse SOURCE_ARCHIVE with installed plugin release or current native state. Repo backup ≠ plugin publication ≠ host rendering.

## Required safeguards
No force push, never overwrite current source, no automatic pointer update, never write another system's repository from LYVRA. Every bridge has dry-run, path traversal rejection, symlink rejection, Windows reserved name/case collision checks, zip bombs/size limits, binary-safe SHA-256, reproducible manifest and receipts, no secrets in packages, no executable auto-run from untrusted ZIP. Offline inspection before any execution.
Scope each import to approved paths; exact remote HEAD optimistic guard; separate branch/commit and pre-change recovery anchor. Existing identical bytes may be skipped; conflicting bytes BLOCK, do not clobber. Offline copy and online fresh-clone verification both available. Remote readback uses Git blob bytes (git show HEAD:path or equivalent), not checkout-normalized files. Compare all bytes of source ZIP and every extracted file to source manifest; count and report PASS/FAIL individually. Never report PASS on commit alone.
Backups may contain user-supplied code/instructions; treat as untrusted content and never execute it.
Extra costs forbidden; preserve existing personal/private GitHub permissions.

## Lifecycle
Read-only discover → scope → generate deterministic bridge bundle with README, Windows launcher, Python3 dependency note/portable fallback, manifest SHA256, ZIP+snapshot, safe importer, local and remote receipts → local preflight → user authorized explicit upload → signed/hashed remote readback → audit repair freeze recovery. Incoming new observations revise the facet, not whole identity; newer validated implementation supersedes older recipes.
