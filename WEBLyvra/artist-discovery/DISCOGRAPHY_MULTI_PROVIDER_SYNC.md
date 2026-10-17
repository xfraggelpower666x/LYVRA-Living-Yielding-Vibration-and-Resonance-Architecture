# WEBLyvra Discography — Multi-provider incremental synchronization
Date: 2026-10-17
Status: DESIGN HANDOFF · NOT SCHEDULED · NOT LIVE INTEGRATED
Scope: WEBLyvra artist-discovery addon; native Whole-LYVRA IRL is separately owned by main LYVRA.

## Objective
Artist-first discography spanning public platforms: Suno, SoundCloud and distributor/streaming provider storefronts. Preserve both distinct platform releases and cross-provider equivalence only when backed by evidence; never merge songs solely by title. Product navigation: Albums/EPs, Published Tracks, Playlists, Providers; DE/EN via native WEBLyvra language authority.

## Existing verified input
- Suno: 386 public song URLs/title+UUID records from the profile Songs page (2026-10-17), `data/suno-releases.json`. Variants with same title are separate song UUIDs.
- SoundCloud: 30 observed album/EP entries from the /albums listing and one separately verified set; `data/soundcloud-albums.json`. Completeness not established.
- Distributor/store sources: separately verify ownership, release IDs and external links. No assumption that an artist landing page is proof of a published release.

## Existing artist-universe data — mandatory preservation and non-regression
**This is an extension of the existing Artist Discovery add-on, not a replacement.** The canonical staged source for provider links, radio and community navigation is `data/platforms.json` (schema 1.2, last reviewed 2026-10-16). Preserve that file and its source/status/provenance fields exactly unless a separately evidenced update is approved.

- **Radio & Live:** keep the `radio` object, its source registry `666STREAM_RADIO_LINK_REGISTRY_v2_2026-10-16.json`, all six radio entry points (Webradio, Twitch Broadcast, Veluna Radio, MiniPlayer, TuneIn Deutschland, TuneIn USA), six system/status panels (signal/health, now playing, AutoDJ, player alerts, Discord connectivity, audio stream), and the original explanatory text. Retain the TuneIn USA `unavailable` status, `previously_reachable` panel evidence and `unverified_stream` qualifier; never turn historic status into current online claims.
- **Social & community:** preserve the currently stored Facebook, YouTube, Discord and Instagram URLs, plus Twitch Live and the WEBLyvra site link. Preserve every existing `group=web/social` entry and future evidence-qualified social sources. Do not infer music catalog distribution from social profiles.
- **Listening / buying:** preserve existing provider URLs for Spotify, Apple Music, Amazon Music, TIDAL, Deezer, Qobuz, Anghami, iHeartRadio and YouTube Music, including `indexed_artist`, `direct_readback`, `album_readback` qualifications. Keep SoundCloud, Mixcloud, Suno and the Internet Archive performance link in their existing independent/discovery groups.
- **Existing six navigation groups:** preserve `web`, `radio`, `social`, `music`, `independent`, `discovery` and the original user-facing titles, hints and display notes. The new discography section is an additive child or adjacent view inside **one coherent centered module**, never another competing list of platform cards.
- **Source-of-truth precedence:** the new discography ingests from `data/suno-releases.json` and `data/soundcloud-albums.json`; `data/platforms.json` remains the authoritative staged input for radio/social/store entry points. No sync job is permitted to delete/rewrite unrelated sections.
- **Acceptance tests:** compare before/after IDs and exact URLs for every `platforms` entry, each `radio.players` entry and `radio.panels` status. Require equality when the task changes discography only. Explicitly test DE/EN headings, player separation, status disclaimers, mobile layout and no duplicate cards.

## Source adapters and workflows
| Provider | Initial source | Type | Change detection |
| -- | -- | -- | -- |
| Suno | https://suno.com/@fraggelpower666?page=songs | Published public songs, playlists separately | Compare exact song UUIDs and titles to snapshot; full-render HTML verified with observed 8500ms wait, not a guaranteed future duration |
| SoundCloud | https://soundcloud.com/fraggelpower666/albums | Albums/EPs; other sets flagged separately | Interactive full listing where necessary; compare stable /sets IDs/links |
| DistroKid | Public verifiable release/HyperFollow pages; authenticated delivery data only if approved | Release and store availability | Compare verified release identifiers/links; authentication gated |
| Spotify/Apple Music/Tidal/YouTube Music/etc. | Each approved official artist landing/store source | Public store records | Provider-specific adapters only when source access and identity matches verified |

Each adapter returns a normalized *proposed observation batch* with provider, source URI, observation time, stable provider IDs, exact URL, title, type, optional release date/artwork, and evidence grade.

## Independent data model
```json
{
  "provider": "suno",
  "provider_item_id": "<verified-source-id>",
  "url": "<exact-public-source-url>",
  "title": "<observed>",
  "kind": "track",
  "availability": "public_observed",
  "observed_at": "<ISO-8601>",
  "evidence": {"method":"rendered_html","source":"<source>","status":"DIRECT_READBACK"},
  "cross_provider_release_id": null
}
```
Use (provider + provider_item_id) as ingestion identity. Preserve variants and provider-specific versions. Cross-provider linking requires reliable identifiers (ISRC/UPC when verified), explicit release mapping, or human review. Never assume matching titles imply identical recording or release.

## Scheduled update design, gated
1. Trigger platform scans independently with conservative cadence and rate limits.
2. Read provider public sources. Mark full/partial/blocked; retain original evidence and response metadata.
3. Validate identities and source ownership. Deduplicate by provider key; record unresolved conflicts.
4. Produce diff: new / changed / disappeared-in-partial-read / verified removed.
5. **Do not delete or unpublish** based on missing items in incomplete scans. Keep review queue for unexpected changes and questionable links.
6. For verified new public tracks, append idempotently to staged snapshot; user-approved policy controls auto-publication.
7. Commit via existing GitHub governance: pre-change recovery, expected SHA/concurrency, tests, independent readback, pointer-last *only where native authority permits*.
8. Refresh discography JSON/HTML artifacts and report counts, sources, scan errors and provenance. Keep publication separate from data collection.

## UI
Single centered cyber-neon section consistent with WEBLyvra; filter provider/type/genre, search and sort, responsive gallery, original cover where verified, direct provider link and accessible fallbacks. Distinguish `Last scanned` from `Last confirmed published`. DE/EN from WEBLyvra i18n; no competing language state. Never duplicate the existing radio or main player.

## Phased delivery
1. Unify existing Suno and SoundCloud data in read-only merged discography preview; leave individual platform sources intact.
2. Implement source adapters with capture receipts; prove count/identity validation on public snapshots.
3. Add persisted delta registry and GitHub-safe idempotent update job; test added/unchanged/missing/blocked/conflict.
4. Expand provider by provider: DistroKid and verified store deep links; preserve provenance per store.
5. Wire the built addon into production WEBLyvra only via its own integration handoff, replacing duplicate cards in one controlled change.

## Acceptance gates
- [ ] Representative adapter run+negative tests for each provider
- [ ] Legitimate new item discovered, stable ID and exact URL evidence
- [ ] Partial/captcha/failure cannot cause destructive changes
- [ ] Separate staged-source-PASS, GitHub-readback-PASS, scheduled-job-PASS and actual WEBLyvra-host-PASS
- [ ] Artwork and publishing rights source-checked; responsive, a11y, DE/EN
- [ ] No unauthorized credential use, platform circumvention or foreign-system activation

This is a design handoff, not evidence of an operating schedule or live sync.
