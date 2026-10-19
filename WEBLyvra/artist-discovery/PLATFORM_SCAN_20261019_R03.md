# WEBLyvra Artist Discovery — multi-platform public scan 2026-10-19 R03

**Source authority:** GitHub `lyvra` current for local catalog; public platform pages for external point-in-time observations. **Scope:** WEBLyvra/artist-discovery documentation only. **Classification:** public-provider-readback/source CI; NOT DistroKid-delivery, deployment, browser/host, or Whole-LYVRA PASS.

## Confirmed new and reconciled music

### Suno: +18 canonical public song versions
- Official profile: https://suno.com/@fraggelpower666?page=songs
- Live public rendered HTML (2026-10-19, waitFor 8500ms, maxAge 0): 436 distinct `/song/<UUID>` title links; public profile counter showed 436.
- Previous repository snapshot: 418 unique URLs; direct set difference: 18 added, **0 removed**. All 418 previously cataloged UUIDs were observable in the same live capture.
- Updated repository `data/suno-releases.json`: 436 entries. Updated Artist Discovery source `index.html`: 436 Suno + 45 SoundCloud albums/sets + 122 distinct SoundCloud tracks/mixes = **603 unique discovery URLs**.
- Exact added titles, all two versions each: THE SEVENTH KEY - WHEN THE MACHINE CHOSE; THE CHAIN PLAYS BACK; NEON LEASH; THE SKY REFUSED THE CAGE; RHYTHM HAS A SHADOW; THE FRACTAL BIT THE MOON; AAA ALIEN; THE ROAD KEPT OUR NAMES; SCARY DEAMONS - WRONG CHEMISTRY.
- New URL provenance is preserved per item in `data/suno-releases.json`. Neither scrape position nor title is a reliable publication timestamp. No private drafts or covered artwork automatically imported.
- GitHub Actions **39329790960**, exact commit `1e08a031d3ca198f41b20e4c9fda780de818d737`: source-integrity job and all reported Node steps SUCCESS. Browser and Cloudflare live bytes are separate untested gates.

### Confirmed cross-store public release — HORST SAGA (Special Version)
- Artist: FRAGGELPOWER666 / 666SOUNDsDESIGn. Apple Music reports release date **2026-10-17**, one long song of 41:38, ℗ 2026 666SOUNDsDESIGn.
- Apple Music: https://music.apple.com/us/album/horst-saga-special-version/6824008329
- Amazon Music: https://music.amazon.com/albums/B0HNDQ4Q3T
- Deezer: https://www.deezer.com/us/album/1124158502
- TIDAL: https://tidal.com/album/570783607
- Anghami: https://play.anghami.com/song/1308318305
- iHeartRadio: https://www.iheart.com/artist/fraggelpower666-50624046/albums/horst-saga-special-version-440922319
- YouTube Topic official channel listing: https://www.youtube.com/watch?v=oBmRp80dZPE&list=OLAK5uy_l_xR58jd3_r0XbN04TviNl88Q7waP4a1E
- This is one release replicated on multiple services, **not seven different new releases**. Public store listings do not verify exact DistroKid delivery/ISRC/UPC.

## Additional platform status (19 registered platforms)
| Platform | Public evidence classification |
| --- | --- |
| Suno | **NEW +18** exact UUIDs verified versus previous repo |
| SoundCloud | 122 tracks/mixes + 45 sets protected as baseline; no dated October-19 upload confirmed from partial visible pages. Historical older uncatalogued candidates: `afterburner-mind-samira-echo-142-5` (~5 months old) and set `sie-sind-unter-uns-single-part3` (~11 months old); do not label these new releases or auto-import from partial evidence |
| Spotify | Artist page readable but detailed discography blocked by reCAPTCHA; newest not independently confirmed on that site |
| Apple Music | HORST SAGA confirmed 2026-10-17 |
| Amazon Music | HORST SAGA confirmed |
| Deezer | HORST SAGA confirmed 2026-10-17 |
| TIDAL | HORST SAGA confirmed |
| Qobuz | Existing LYVRA FUSION release read; no newer independently confirmed |
| Anghami | HORST SAGA listed among latest releases |
| iHeartRadio | HORST SAGA latest release listed |
| YouTube Music | Existing Fraggelpower 666 channel/playlist read; separate fresh uploads unclear |
| Mixcloud | Seven own shows; latest visible about 11 months old. Reposts/favorites excluded |
| YouTube | Official Topic channel lists HORST SAGA dated 2026-10-17 |
| Internet Archive | Queried archive item dates to April 2026; no fresh upload proven |
| WEBLyvra | Website readable; site content is not itself external record distribution proof |
| Twitch | Profile readable, no comparable music-discography readback |
| Facebook | Direct public scraping not supported by available provider |
| Instagram | Direct public scraping not supported by available provider |
| Discord | Public user page lacks release inventory |

## Scope, evidence and next gates
- Verified source scan **does not** mean public WEBLyvra website, connected dashboard, iOS/Android browser, 19 platforms' full catalogs, or DistroKid release delivery were exhaustively validated.
- Preserve older albums, sets, tracks, original artwork and native current. Never delete from partial provider snapshots.
- Continue independent DistroKid/My Music authenticated per-release metadata and deployment asset/route parity only with proper authority and real host evidence.
- No cross-system writes. No automatic monitored task, since the creator indicated no available automation slots.
