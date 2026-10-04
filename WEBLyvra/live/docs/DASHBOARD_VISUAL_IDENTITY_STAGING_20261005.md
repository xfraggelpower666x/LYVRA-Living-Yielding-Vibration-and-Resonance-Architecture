# LYVRA Dashboard Visual Identity — Staging Note
STATUS: STAGING_INSTRUCTIONS_ONLY — NOT DEPLOYED
SOURCE_BRANCH: lyvra
TARGET_BRANCH: lyvra-dev-dashboard-visual-rebase-20261005

Goal: Add five user supplied images additively to WEBLyvra/live/dist/dashboard/index.html. Never overwrite entire dashboard or modify player, banner videos, navigation or psy-engine.

Assets to upload to WEBLyvra/live/dist/dashboard/assets/lyvra-identity/:
- lyvra-neutral.jpeg
- lyvra-core.jpeg
- lyvra-wordmark.jpeg
- lyvra-versus-fraggle.jpeg
- 666soundsdesign-neon.jpeg

Staged package: LYVRA_DASHBOARD_SAFE_UPLOAD_20261005.zip (conversation artifact, not present in GitHub).

Procedure: Freshly clone latest productive lyvra. Create isolated branch. Extract only style id=lyvra-identity-extension-style and section class=lyvraVisualIdentity from candidate package. Insert before head close and after header close respectively. Reject duplicate insertion. Copy five original JPEGs without reencoding. Verify exact five image links, HTML structure, git diff --check, responsive visual playback. Stage only index.html and five assets. Push isolated branch only; do not merge until acceptance.

Evidence: Local static structural check passed; five referenced JPEGs present. Chromium file scheme preview blocked by environment. No binary assets uploaded and no visual or live acceptance established.

Safety: ONE_LYVRA_IDENTITY, NO_NEW_ROUTER, preserve newer evolution, production unchanged.

## 2026-10-05 V3 hardening (safe artifact)
- New conversation artifact: LYVRA_DASHBOARD_NATIVE_SAFE_V3_20261005.zip.
- Removed an extra newline introduced by previous PowerShell insertion.
- Added fail-closed compare proving that removing the two newly injected blocks reconstructs the complete preexisting dashboard HTML exactly.
- Added original JPEG checksum verification both before and after insertion; exact one style, one section, one reference per original image.
- Local archived-baseline dry-run PASS and independent 5-image static validator PASS.
- Caveat: Windows PowerShell execution, screenshot visual inspection, and live website deployment NOT verified. Original JPEG binaries still NOT on GitHub. Do not confuse this documentation update with feature release.
