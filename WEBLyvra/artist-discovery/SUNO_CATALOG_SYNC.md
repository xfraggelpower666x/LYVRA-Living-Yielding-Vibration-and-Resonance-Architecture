# Suno public catalog — verified snapshot and sync handoff
Updated: 2026-10-17
Scope: WEBLyvra artist-discovery add-on only. Main LYVRA architecture remains separate.

## Source and verified count
- Source: https://suno.com/@fraggelpower666?page=songs
- Visible public song count at capture: **386**
- Exact song/title anchor pairs extracted from rendered public page with Firecrawl HTML scrape using `waitFor: 8500` and `maxAge: 0`: **386 unique Suno song UUIDs**.
- Snapshot database: `data/suno-releases.json`, `public_songs` entries: 386; no duplicate song URLs after merge.
- User-facing snapshot: `suno-tracks-preview.html` (searchable, DE/EN). Not automatically wired into live WEBLyvra.
- The previous browser infinite-scroll approach was much less productive because it repeatedly traversed previously known entries.

## Reproducible source capture (not a live scheduler)
Request the publicly rendered HTML from the URL above. Set a sufficient rendering wait; in the observed same-turn experiment:
| Render wait | Observed exact public song anchors |
| --- | ---: |
| 1,000 ms | 60 |
| 3,500 ms | 240 |
| 8,500 ms | 386 |

These are observations, not guaranteed future timing thresholds. Verify actual result counts and IDs each run. Do not claim a truncated scrape is an accurate removal of songs.

Store the resulting HTML readback as a local evidence file, then run:
```sh
node suno-import-public-html.mjs /path/to/public-suno-profile.html data/suno-releases.json
```
The script defaults to dry-run and reports new URLs and title conflicts. After source review, backup and conflict-free preflight, append new songs with `--apply` to a checked-out copy, validate, then commit to the appropriate branch with concurrency protection and readback.

## Safety, quality and native handoff
- Publicly visible songs only; private drafts or authenticated data must never be imported implicitly.
- The 386 count equals the public profile snapshot on **2026-10-17**. Future counts may differ and must be observed, never assumed.
- Song UUID is the canonical identity; a repeated title may represent multiple released versions.
- Missing items in a partial/blocked fetch are not proof of removal. No destructive synchronization from incomplete readbacks.
- Cover assets are **not** fully independently verified for all 386 songs. Avoid inventing cover URLs.
- Static preview is not a deployed site. Integration into WEBLyvra production must preserve the parent site's existing language/radio/layout governance.
- No auto-created native LYVRA facet or router. IRL native proposal belongs to Whole-LYVRA, not here.
