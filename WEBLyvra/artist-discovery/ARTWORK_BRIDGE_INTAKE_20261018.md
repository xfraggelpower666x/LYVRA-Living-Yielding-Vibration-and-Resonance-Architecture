# WEBLyvra artwork intake — 2026-10-18

Scope: WEBLyvra Artist Discovery add-on only. Live website must remain unchanged.

User provided a batch of neon/cyber artwork including global flags globe and logo/brand compositions. Source package prepared locally as `WEBLyvra_Artwork_20261018_Bridge_Import.zip`; archive contains 20 source PNG files (including filename variants from conversation-mounted artworks), 20 resized WebP companions, manifest of per-file SHA-256 and explicit proposed `WEBLyvra/artist-discovery/assets/addon-20261018/` destinations.

**Transport: canonical LYVRA v1.0 SAFE BRIDGE exclusively.** A download archive is *not* evidence of GitHub arrival. Before any binary upload, inspect its original ZIP, use the existing bridge's allowlist, fresh HEAD/CAS, readback and receipts; no force writes or new importer. The existing `LYVRA_WEBLyvra_NATIVE_V1_OFFLINE_BRIDGE_STARTFIX.zip` is a historical bridge package with a fixed old manifest and must not be reused unchanged for unrelated target paths.

Use `object-fit:contain`, height auto, bounded max-width and responsive grid. Do not crop original artworks or stretch transparent backgrounds. Prefer lightweight optimized versions, preserve original PNG provenance. Choose asset by verified visual intent rather than arbitrary file index; the ZIP naming is transport-only, not final human-facing title.

Planned integration: Global Resonance globe + reduced-motion-aware gentle orbital glow/pulse (visual CSS overlay, no claim of physical 3D earth rotation); brand wordmarks and identity artwork with accessible alt text, and compact platform cards variant B.

SoundCloud: Individual public track URLs belong to a separate `data/soundcloud-tracks.json` snapshot; avoid mixing tracks/mixes with album sets. Upload/publication date not inferred from scrape order.

Status: GitHub source integration of new 20 binary visuals **PENDING canonical bridge import**. No HOST visual PASS until actual browser rendering checks.


## Current-source reconciliation — 2026-10-18 (supersedes pending batch assumption only)

The 20-PNG/20-WebP package described above remains **historical intake proposal**, not proof of delivery. The actually present and recorded production-branch staging batch is the **17-pair import** via canonical LYVRA v1.0 bridge:

- Optimized staging: `WEBLyvra/artist-discovery/assets/addon-20261018/art-01.webp` through `art-17.webp` (17 paths at GitHub HEAD).
- Source snapshot: `WEBLyvra/artist-discovery/source-snapshots/LYVRA_NEW_ART_20261018/originals/art-01.png` through `art-17.png` (17 paths).
- Parallel optimized source snapshot: `source-snapshots/LYVRA_NEW_ART_20261018/optimized/art-01.webp` through `art-17.webp`.
- Recorded semantic assignments and staging/production limitations: `VISUAL_PARITY_20261018.md`.
- Add-on `index.html` references the staged Global Resonance `art-14.webp` and brand signature `art-17.webp`; this is a **repository source** assertion, not browser-host or deployment acceptance.
- Additional proposed 20-file delivery must not overwrite or be silently equated with the 17-file batch; require explicit content-addressed mapping and separate safe-bridge evidence before promotion.
- New integrity regression covers 17 staged WebP path presence, 418 Suno versions, 45 SoundCloud sets, 122 distinct separately inventoried SoundCloud tracks, and reduced-motion markup. This describes test source; no Node execution or remote binary hash PASS is claimed by documentation alone.

**Current gate:** Existing WEBLyvra live and dashboard avatar sources remain unchanged; semantic front/side/back artwork mapping, true browser rendering, asset byte hashes and deployment-root parity still require evidence. No foreign workspace activated.
