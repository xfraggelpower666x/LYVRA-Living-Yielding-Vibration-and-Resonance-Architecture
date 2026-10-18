# Suno public catalog — current additive snapshot and sync handoff
Updated: 2026-10-18
Scope: WEBLyvra artist-discovery add-on only. Whole-LYVRA authority, productive WEBLyvra website and dashboard are unchanged by this documentation update.

## Current repository state (source, not live-host acceptance)
- Source profile: https://suno.com/@fraggelpower666?page=songs
- Canonical catalog: `WEBLyvra/artist-discovery/data/suno-releases.json`.
- Current repository snapshot: **418 distinct public Suno song UUID/URL entries**, 0 duplicate URLs, reviewed_at `2026-10-18`.
- Previous 401-entry catalog preserved: commit `aaf76f9228792c7eada94fb131c77696bf0a9559`. The additive 418-entry catalog was introduced by `eee1a90196e492d2a6dfdc2063ba46564cd6c94b` and projected to the add-on by `be7b31fd48c1a9c10847bd785681269612fc68fb`; the test expectation was updated by `f5d9a455a8cc90b2653fc7158702155281d2b695`.
- Exact repository comparison of 401 vs 418: **17 added URLs, zero removed URLs**. These 17 version URLs cover **8 distinct title strings** (3 versions of DANCE ON THE FAULTLINE; 2 versions each of seven other titles). Do not confuse title counts with song-version/UUID counts.
- Current `index.html` contains 418 embedded Suno discography entries and preserves 45 SoundCloud album/set entries. SoundCloud singles/tracks/mixes remain a separate 122-entry inventory and must not be silently folded into album/set counts.
- `test-addon-integrity.mjs` currently asserts 418 Suno and 45 SoundCloud set entries, plus preserved UI/radio/language/art surfaces. The existence of a test is not proof of execution; a fresh Node run, browser rendering and deployed-host parity remain separate gates.
- New song entries are marked `direct_page_readback` in the repository catalog. This records the prior source observation; it does not independently prove every public Suno URL still resolves during this update.

## Additive 17-song source delta (2026-10-18)
| Title | New versions | Canonical song UUIDs |
| --- | ---: | --- |
| THE OCEAN TURNED TO LIGHT | 2 | `9c7cacfd-99bd-4fa0-aaf5-34127f106f8b`, `31e05abf-3607-45e6-b771-79058e6e5350` |
| NO REFUNDS ON TOMORROW | 2 | `7b8ab582-4640-42c1-ad0b-b5a36a261f55`, `069daf4c-cabe-49b3-a9cf-604d8f036f0d` |
| THE STORM OWES ME NOTHING | 2 | `503f2cfb-e28f-4501-8486-120b2582ccc7`, `e9d5261c-78f7-4332-99ce-27189bf3146a` |
| DANCE ON THE FAULTLINE | 3 | `0defc468-e89c-4a4a-ac4e-52f6b7143c61`, `a8ca5bdb-ec3b-4c6c-b7cd-093eca00cda7`, `76a82c89-88b7-4e72-bb83-ce9453649948` |
| THE ROOTS HAVE TEETH | 2 | `75da9f81-17cd-4b58-aedf-eab94e43a2a0`, `f5882538-3543-4e75-9812-1f025a6870b1` |
| THE MACHINE LEARNED TO HUNT | 2 | `33596f77-b8c5-4e20-9b9d-c66b59fa316a`, `ea922c29-a43c-444e-8b5a-6bc569d30f43` |
| HEARD AROUND THE WORLD - GLOBAL RESONANCE ACROSS 50 COUNTRIES | 2 | `7de664a1-77ca-4f20-891e-78f86484d591`, `8397f606-902d-43c6-8a6f-98f329ef85da` |
| DAYDREAM - THE DREAMCATCHER LETS GO | 2 | `8190bb6e-48de-4139-a533-5d923de4fe1a`, `c7b867de-47c4-423e-bcde-cf4da0623f1b` |

Each canonical URL is `https://suno.com/song/<UUID>`. Keep same-title variants as separate song versions.

## Preserved 2026-10-17 capture provenance (historical, not current count)
- On 2026-10-17 the public Songs page exposed **386** song/title anchor pairs from rendered HTML using Firecrawl `waitFor: 8500`, `maxAge: 0`. At that time the snapshot contained 386 unique song UUIDs.
- Observed capture yields for that earlier experiment: 1000 ms → 60; 3500 ms → 240; 8500 ms → 386. These are point-in-time observations, not guaranteed future timing thresholds or a fixed current total.
- The prior browser infinite-scroll approach repeatedly traversed known entries; a single truncated or blocked scrape may return far fewer links and is never evidence of deletion.

## Reproducible source capture (not a live scheduler)
Fetch the publicly rendered HTML from the Suno profile with appropriate rendering wait and store the actual source readback. Then use the **existing** non-destructive importer:
```sh
node suno-import-public-html.mjs /path/to/public-suno-profile.html data/suno-releases.json
```
The importer defaults to dry-run and reports new URLs/title conflicts. After source review, prechange recovery and CAS, append confirmed new songs with `--apply` in a checked-out copy; execute the existing integrity tests, commit only the relevant branch, and read back the exact blobs. Never interpret a partial fetch as a removal request.

## Safety, visuals and acceptance
- Import only public songs; never private drafts. Song UUID is canonical identity; duplicate titles can represent separate versions. Playlists are not albums.
- Album/set vs single-track/mix SoundCloud inventories remain separated. Cross-store distribution, artwork cover-byte parity and DistroKid delivery are not proved by these links.
- The artist-discovery `index.html` stages Global Resonance `art-14.webp` and brand art `art-17.webp` with CSS reduced-motion support; character-image parity across production website, add-on and dashboard is still pending deployment-root/semantic-view readback.
- The add-on preview is not the productive site. Productive WEBLyvra, dashboard and plugin release/host adoption require independent execution and deployment evidence.
- SOURCE = repository catalog and add-on source readback; DELIVERY = no new deployment asserted; ADOPTION = existing add-on source projection only; HOST = fresh Node/browser/iPhone checks pending. No fabricated PASS.
- No new importer, facet, router, foreign write or automatic productive deployment.
