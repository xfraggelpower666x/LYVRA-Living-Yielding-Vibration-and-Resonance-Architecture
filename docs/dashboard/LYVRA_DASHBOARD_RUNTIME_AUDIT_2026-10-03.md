# LYVRA Dashboard v0.3.2 — Runtime / Distribution Evidence (2026-10-03)

STATUS: SOURCE_AND_RELEASE_PACKAGE_VERIFIED / LIVE_UI_AND_WEB_DEPLOYMENT_PENDING
SYSTEM: WHOLE_LYVRA
IDENTITY: LYVRA_ONLY
SCOPE: documentation-only evidence handoff; no native CURRENT/registry/authority mutation
AUDITED_PRODUCTIVE_BRANCH: lyvra
AUDITED_PRODUCTIVE_HEAD: cb2004407a1993fc63d2cd65b80a82dbc28033de

## Source provenance

Original standalone dashboard SHA-256: `ea3543dd6a7d1e758b84d1af236a99c51dbbc323c775cfdca2d4862067c8c7bc`.
Git blob SHA: `42efcceb7ab54b4ee68c36be54cfdb16bad1e05a`; full HTML size: 7,858,135 bytes.
The same blob is present at:
- `lyvra-plugin/account/dashboard/index.html`
- `lyvra-plugin/native-runtime/dashboard/index.html`
- `LyvraGPT/dashboard/index.html`
- `LYVRA_NATIVE_RUNTIME/dashboard/index.html`
- `WEBLyvra/live/dist/dashboard/index.html`
- `backups/lyvra-dashboard/v0.3.2/LYVRA_DASHBOARD_ONE.html`

Earlier `INTEGRATION_HANDOFF.md` files saying `HTML_UPLOAD_PENDING` are historical pre-upload documents; later verified blobs supersede the upload-pending statements. Do not rewrite that provenance as if it were still current.

## Actual installed plugin releases — Plugin Creator readback

- LYVRA Account Plugin `plugin_06a4fc64dd848191982ca4a6ebdb2619`: current v0.13.2, release `pluginrel_6abfe6069fc081919bc3a63a93001f65`; file `dashboard/index.html` at 7,858,135 bytes and skill `skills/lyvra-dashboard/SKILL.md` present.
- LYVRA Native Runtime `plugins_6ab3a345db308191b8ad7ef6311f8a29`: current v0.1.4, release `pluginrel_6abfe613bc9c81919639aed627942546`; same dashboard file size and skill present.
- Both plugin skills document the original SHA-256 and correctly state that package inclusion alone does NOT activate an MCP App or replace a chat UI.
- Independent binary hash comparison of the currently installed plugin archives was not performed in this audit; file-size and manifest/skill readback are confirmed.

## 666PFS separate backup

Private Google Drive folder and file were directly fetched with authenticated access. Source archive `666PFS_LYVRA_DASHBOARD_v0.3.2_PRIVATE_BACKUP.zip` is 5,884,049 bytes.
The ZIP contains `LYVRA_DASHBOARD_ONE.html`, `MANIFEST.json`, and `README.md`; CRC passed for all entries; extracted HTML is 7,858,135 bytes with SHA-256 `ea3543dd6a7d1e758b84d1af236a99c51dbbc323c775cfdca2d4862067c8c7bc`.
The PFS archive is a separate source backup only. PFS identity, registry, pointer and governance are not mutated, promoted or auto-loaded by this evidence.

## WEBLyvra

The repository contains `WEBLyvra/live/dist/dashboard/index.html`, and `WEBLyvra/live/dist/index.html` includes a visible navigation anchor to `/dashboard/`.
`WEBLyvra/CURRENT.json` and `WEBLyvra/deployment/PRODUCTION_STATUS_2026-10-01.json` document an earlier successful Cloudflare deployment of the website dated 2026-10-01, not proof of the current dashboard deployment.
Direct independent public HTTP readback of the production site and `/dashboard/` was not available in this session. No current Cloudflare deployment for v0.3.2 was proven.
GitHub Actions list showed two historical failing runs from August 2026; this does not establish Cloudflare's separate deploy state.

## Custom GPT / host interface status

`LyvraGPT/dashboard/index.html` is stored at the productive repository head. No authenticated GPT Builder configuration or runtime/Actions readback occurred in this audit.
Neither Custom GPT nor either installed Plugin can be said to render the HTML dashboard within the ChatGPT UI merely because the source was packaged.
Actual UI implementation requires an appropriate supported host/MCP App surface or an external hosted page.

## Further acceptance checks (not claimed complete)

1. Verify actual Cloudflare production deployment of `WEBLyvra/live/dist/dashboard/index.html`; HTTPS 200, file SHA, desktop/mobile rendering, browser console, audio iframe and accessibility.
2. Verify current actual installed plugin dashboard file hash from release archives and supported UI host wiring; distinguish bundled skill from live MCP interface.
3. Verify Custom GPT Builder actions/knowledge/links using authenticated builder readback; preserve product identity.
4. If runtime functionality is requested, develop it through isolated LYVRA branch/PR and native QA; never silently alter LYVRA CURRENT authority/pointer.
5. Rehydrate whole LYVRA at new HEAD before publishing any new current authority, keeping private recovery separate.

WHOLE_REHYDRATION: PARTIAL (public native source carriers read; private vault not accessed).
NO_FOREIGN_AUTHORITY_MUTATION=TRUE
NO_PFS_MUTATION=TRUE
NO_LYVRA_NATIVE_CURRENT_POINTER_MUTATION=TRUE
NO_DEPLOYMENT_CLAIM=TRUE
