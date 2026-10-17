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
