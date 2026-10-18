# WEBLyvra Platform Scan — 2026-10-18 R02

Scope: 19 platforms from `data/platforms.json`. Read-only verification of external sites. Add-on/live deployments unchanged.

## External page readback
- Readable musician/canonical page: Spotify (FRAGGELPOWER666 title), Apple Music (FRAGGELPOWER666 title), Deezer (FRAGGELPOWER666 title), Qobuz (specific LYVRA FUSION release page), Anghami (FRAGGELPOWER666 title), iHeart (FRAGGELPOWER666 title), YouTube Music (Fraggelpower 666), SoundCloud (666SOUNDsDESIGN - Fraggelpower666 profile).
- Partial or generic content, not artist-identity proof by this call: Amazon Music (page content returned, limited context), TIDAL (generic TIDAL shell).
- Connector readback pending (INVALID_ARGUMENT or anti-bot): Mixcloud, Suno main profile, Internet Archive, WEBLyvra, Twitch, Facebook, YouTube, Discord, Instagram. A tool error is NOT proof of dead link.
- Separate reachable content readback: Mixcloud artist public profile through /Fraggelpower666/, 13 matching account-path links; not a full releases inventory.
- Separate restricted snapshots: Suno `?page=songs` supplied only 40 song UUIDs on this pass (previous preserved 401); SoundCloud /tracks yielded only 23 distinct direct track links (previous 122), /albums only 10 distinct set links (previous 45). These scans are evidently paginated/partial and MUST NOT remove older established records.
- Current library preservation: 401 Suno song IDs + 45 SoundCloud album/set URLs + 122 SoundCloud individual-track URLs. New publication status from this pass: **not verified**.
- DistroKid: release-specific authenticated dashboard delivery/ISRC/UPC and per-store live URL verification still pending. Public store listings alone cannot prove fresh DistroKid rollout or exact submission status.
- All results dated point-in-time observations; no automated weekly claims.

## Actions
- Preserve original platform links and artist-discovery data. No destructive changes from partial scraping.
- Next scan: authenticated DistroKid "My Music" per-release status and SoundCloud newest uploads with explicit dates; provider-by-provider release matching.
- WEBSITE, ADDON, DASHBOARD asset parity and browser-host testing are separate gates.
