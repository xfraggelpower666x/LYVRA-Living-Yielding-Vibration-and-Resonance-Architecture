# WEBLyvra / Artist Discovery Add-on

## Current additive Suno import — 2026-10-24

The immutable workspace handoff `a35a5aee-8b41-4865-9caa-a4ca46dbd323` binds **12 directly observed unique Suno song URLs** from a public profile displaying a **462-song counter**. All 450 previously stored UUIDs are preserved. Current source inventory: **462 Suno + 45 SoundCloud sets + 122 SoundCloud tracks = 629 unique public discovery URLs**. The observed 200 recent profile links are not a complete independent reread of all 462. The 2026-10-22 figures below are retained as historical evidence; current public deployment must be independently checked against the exact release commit.

**Current observation:** LIVE STANDALONE ADD-ON · verified 2026-10-22 on public WEBLyvra route.
**Whole authority:** `LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json` (separate; this document is WEBLyvra project documentation only).
**Current source:** `WEBLyvra/artist-discovery/index.html`; repository catalog is source evidence, not an immutable live-service guarantee.

## Public production

- Public add-on: https://weblyvra.666soundsdesign-broadcaster.com/artist-discovery/
- Main WEBLyvra: https://weblyvra.666soundsdesign-broadcaster.com/
- Source staging/build: `WEBLyvra/live/tests/stage-artist-discovery.cjs` copies the independent add-on into `WEBLyvra/live/dist/artist-discovery/` without changing the original add-on.
- Cloudflare Pages project: `weblyvra-live`; build root `WEBLyvra/live`; destination `dist`. A successful deployment and the latest branch HEAD are separate revisions: compare actual commit SHA and read deployed bytes before declaring a particular revision live.
- Source integrity workflow: `.github/workflows/weblyvra-artist-discovery-integrity.yml`.

**Production readback on 2026-10-22:** Fresh public HTML contained the October-21 Suno addition `b9fa99ea-7802-4f16-9a84-2f5142d4a4c9`, `450` Suno-catalog wording and the `617`-entry diskography count. Cloudflare API independently returned a successful deployment for the pre-documentation current commit `1ff087998de6efabb07b670f4d177dcee5fd5ffe`. This is a **point-in-time** readback; it does not prove later deployments or device/browser behavior.

## Catalog snapshot and evidence

| Category | Cataloged entries |
| --- | ---: |
| Suno public song UUID links | 450 |
| SoundCloud albums/sets | 45 |
| SoundCloud standalone tracks/mixes | 122 |
| **Total unique discovery URLs** | **617** |

- `data/suno-releases.json`: canonical song URL inventory and dated provider evidence. The fresh October-21 profile showed a 450-song counter and 160 directly enumerated unique recent links, 14 absent from previous 436. Retained history is NOT proof that all 450 song URLs were re-read individually in the same session.
- `data/soundcloud-albums.json` and `data/soundcloud-tracks.json` are protected independent inventories.
- `data/platforms.json`: 19 catalogued access channels with source/status classifications. Being listed is not equivalent to provider login, catalog completeness, live playback or DistroKid delivery.
- Latest bounded scan: `PLATFORM_SCAN_20261021_R04.md`; previous `PLATFORM_SCAN_20261019_R03.md` retained as provenance. `SUNO_CATALOG_SYNC.md` documents historical 2026-10-18 snapshot, not the current count.

## Google Resonance and Product Reach

The add-on contains a bilingual, responsive Google Resonance panel with a filterable bar chart across platforms, releases and products. **The current bars are evidence grades for the availability of documented public pages, not measured Google position, click volume or web traffic.** No Search Console connection, so impressions, clicks and click-through rates remain blank. Individual "Google prüfen" links issue user-initiated external searches; they are NOT measurements.

## Protected public surfaces

Preserve existing LYVRA visual authorship/artist credits, DE/EN language switching, Radio and player links, Global Resonance, Platform Discovery, Suno, SoundCloud, social and original 22 WebP assets. Neither replacing old homepage cards nor altering main dashboard/radio is implied by this standalone deployment.

The stand-alone add-on is live, while **full replacement of legacy main-site platform cards and real iOS/Android interaction/stream verification remain separate open scopes**.

## How to test

From the source checkout:

```sh
cd WEBLyvra/artist-discovery
node test-addon-integrity.mjs
node verify-original-assets.mjs
cd ../live
node tests/stage-artist-discovery.cjs
python tests/audit_static.py
```

The staging script refuses an already-populated destination and is intended for a fresh build checkout. CI success is **source/staged artifact evidence**, not independent deployment or mobile audio evidence. Exact source SHA, Cloudflare deployment, host page readback and iPhone Edge playback need distinct checks.

## Governance and continuity

No new router, backend, credential storage, fake stream/Google analytics or foreign-system writes. Only promote new public store cards after direct title/source/URL and, if relevant, release-specific DistroKid evidence. Whole LYVRA's Intelligent Research & Learning native facet remains owned by Whole LYVRA; see internal WEBLyvra-to-IRL source proposal under `LYVRA_NATIVE_RUNTIME/continuity/development_exchange/`. The current WEBLyvra workspace remains WEBLyvra even if Whole native evolution advances concurrently.

Historical initial state `STAGED / NOT DEPLOYED` on 2026-10-16 is superseded **for this standalone route**, not an assertion that the entire main homepage was replaced.
