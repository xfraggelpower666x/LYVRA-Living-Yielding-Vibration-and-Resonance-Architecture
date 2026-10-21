# WEBLyvra Artist Discovery — Public platform scan 2026-10-21 R04

**Scope:** WEBLyvra/artist-discovery, read-only external provider scans plus catalog-only repository refresh. **Prior scan:** PLATFORM_SCAN_20261019_R03.md. **Authority:** current GitHub branch `lyvra` for stored catalog, original public provider pages for individual observations. **Class:** bounded public page readback; this is NOT authenticated DistroKid distribution, all-platform inventory, search popularity, provider API authority, whole-system rehydration, or independent production deployment proof.

## Key source finding — SUNO +14

- Official public profile: https://suno.com/@fraggelpower666?page=songs
- Fresh rendered profile on 2026-10-21 showed **450 songs**.
- This bounded page read exposed **160 distinct exact Suno song URLs** in recent visible listing. Comparing with repository's 436 previously stored unique UUID URLs gave **14 unseen URLs**, **146 old URLs visible**.
- The 436 old URLs remain stored. The fresh 160-link sample does **not** prove the other old URLs still exist live and does not establish a full independent 450-URL page enumeration. Do not claim absent songs or deletion.
- Repository catalog after additive update: **450 Suno URLs + 45 SoundCloud sets/albums + 122 SoundCloud individual tracks/mixes = 617 unique discovery links**.
- Recent appearance order is not a trustworthy release date, nor is Suno profile counter evidence of actual distribution through stores.

| Public song title | New distinct Suno UUIDs |
| --- | ---: |
| CHAOS FULL OF SUPERNOVAS | 2 |
| Soulfall | 2 |
| Soulfall - 闇を越えて- Fraggel | 2 |
| LYVRA MYCELIUM - THE WORLD BENEATH THE SOUND | 4 |
| THE SOFT FLAME - FIRE BENEATH THE SILENCE | 2 |
| Chaos With Direction pc | 2 |
| **Total** | **14** |

Exact canonical URLs are retained in `data/suno-releases.json` with source and observation provenance. Song titles are not assumed to be unique release identifiers.

## Cross-platform fresh public checks

| Provider | Evidence on 2026-10-21 | Disposition |
| --- | --- | --- |
| Suno | Profile read, 450 public-song counter, 160 links captured, 14 new UUIDs matched | Source catalog additive update |
| Apple Music | Artist page directly read; Latest Release remains HORST SAGA (Special Version), Oct 17 2026 | No later public store release proven |
| TIDAL | Artist page directly read; HORST SAGA and LYVRA FUSION referenced | Artist listing confirmed; no new title independently proven |
| Deezer | Artist page directly read; catalog present, HORST SAGA and LYVRA FUSION referenced | Existing presence confirmed |
| Amazon Music | Artist page directly read; HORST SAGA and LYVRA FUSION referenced | Existing presence confirmed |
| Qobuz | LYVRA FUSION album direct read | Existing release confirmed |
| SoundCloud | Public /tracks view directly read; list is partial relative to archive; no new canonical import established | Retain stored 45 sets + 122 tracks |
| Mixcloud | Public artist profile directly read; no independent new release found in inspected content | Existing provider unchanged |
| WEBLyvra | Public standalone Artist Discovery read, old 603 link catalog present before update | Source update pending independent deployment/host readback |
| Spotify | Full latest discography not directly validated in this pass | INDEXED / PARTIAL, no upgrade |
| YouTube Music | No independent current catalog enumeration | PARTIAL |
| Anghami | No independent fresh readback obtained in this pass | HISTORICAL_ONLY |
| iHeartRadio | No independent fresh readback obtained in this pass | HISTORICAL_ONLY |
| YouTube official/social | No new fresh independent listing confirmed | HISTORICAL_ONLY |
| Internet Archive | No fresh canonical media check completed | HISTORICAL_ONLY |
| Twitch | No current media catalog verification | HISTORICAL_ONLY |
| Facebook | Public read limited / unavailable | BLOCKED_OR_UNVERIFIED |
| Instagram | Public read limited / unavailable | BLOCKED_OR_UNVERIFIED |
| Discord | No public music-release catalog readback | NOT_APPLICABLE_TO_RELEASE_INVENTORY |

**Provider count:** the existing 19 registered platforms are catalogued as distinct discovery channels, not 19 independent live successes. Login/connector/tool failures and blocked pages are not evidence of absence.

## Open acceptance and safety

- DistroKid delivery, account-only UPC/ISRC, TikTok sounds, Meta audio library and Spotify latest albums remain unverified.
- Screenshots, mobile responsive checks, dashboard parity and actual cloud deployment must be checked separately.
- No unverified ranking, fake Google Search Console traffic, or inferred popularity.
- Preserve 436 previously known Suno UUIDs and all prior SoundCloud URLs, original art and radio.
- CI result, source commit SHA, Cloudflare deployment revision and actual public page readback are separate evidence gates.
- This is WEBLyvra-only catalog work; Whole-LYVRA native pointer and other systems are not mutated.
