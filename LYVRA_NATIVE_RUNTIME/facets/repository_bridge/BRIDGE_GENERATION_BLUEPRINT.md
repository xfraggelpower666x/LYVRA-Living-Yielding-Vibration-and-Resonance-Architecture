# Deterministic bridge construction · Technical blueprint
## Input preflight
Validate ZIP CRC and member list. Reject absolute paths, drive-prefixed paths, ../ traversal, duplicate normalized filenames, symlinks and unsafe entries; cap count, per-file uncompressed size and total expansion ratio. Skip directories, preserve dotfiles and nested relative paths, detect binary vs text without rewriting content. Never execute archive content. Compute SHA-256 of exact input ZIP and every extracted byte array. Record size/path/sha256 and source filename in manifest, plus Git blob SHA1 if needed.

## Package layout
BRIDGE.zip/
  README_DE.md
  RUN_SAFE_BRIDGE.cmd (calls Python script; exit on errors)
  bridge_import.py (stdlib only)
  manifest.json
  payload/original.zip
  payload/snapshot/** (exact extracted contents)
  receipts/ (written by importer; do not claim pass before run)

## Local → GitHub
Obtain allowed owner/repo/branch and immutable target dirs; current production head; preflight existing destination: new path allowed, identical hashes SKIP, differing bytes BLOCK. Fresh clone with verified remote URL into temp folder, forbid dirty production worktree and changes outside allowlist. Import exact ZIP and snapshot, git add allowlisted paths only. Commit with source evidence and compare parent HEAD to remote immediately before pushing. Use normal non-force push; if remote advances, rebase/recheck or ABORT.
Verify through separate fresh fetch/clone. For each expected file invoke `git cat-file blob HEAD:<path>` or `git show HEAD:<path>`, stream bytes and SHA256; avoid checkout CRLF translations. Independently verify ZIP CRC after fetching remote blob. Require exact 1+N total files and all hashes identical, and current branch contains commit. Capture receipt: base/head/commit, per-file result, final status, source ZIP hash, snapshot count, failures. On failed readback retain evidence and show BLOCKED, no false PASS.

## Safety / upgrade
Never insert current-pointer, live asset or plugin installed-version claims as side effects of backup. Native UPDATE may adopt only after separate manifest/fingerprint consistency validation. Backups archive the user-delivered ZIP and snapshots even if other live plugin release is newer. For large repos use no paid services; errors and credentials remain local and redacted. Preserve no-clobber and reversible additive writes.

## Acceptance
A: LOCAL_PREFLIGHT_PASS N/N.
B: RECOVERY_ANCHOR and bounded approved target.
C: PUSH_RECEIPT with commit.
D: REMOTE_BLOB_READBACK_PASS N/N (required for backup PASS).
E: PLUGIN_RELEASE_AND_UI_PARITY explicitly NOT_APPLICABLE unless separately verified.
