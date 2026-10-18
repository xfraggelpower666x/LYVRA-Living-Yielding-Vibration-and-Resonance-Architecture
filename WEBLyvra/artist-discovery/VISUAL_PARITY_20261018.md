# WEBLyvra / Artist Discovery / Dashboard visual parity — 2026-10-18

## Source and provenance
- Latest confirmed repo tree at start: `598a691b881194c4bef463b259479d7ca2ed60f1`.
- Canonical LYVRA v1.0 Bridge imported 17 optimized new WebP visuals at `WEBLyvra/artist-discovery/assets/addon-20261018/art-01.webp` through `art-17.webp`, plus original PNG snapshot and original ZIP.
- Exact semantic map read from `ARTWORK_MAPPING.json` in locally submitted Bridge package.
- This is source/staging, **not public deployment**.

## Deterministic asset assignments
- `art-01.webp`: Cyberneon Androidin LYVRA Emblem / composite
- `art-02.webp`: three-view character sheet (not a single-character avatar)
- `art-03.webp`: platinum-blond cyborg with neon heart, portrait
- `art-04.webp`: rear-view single cyborg
- `art-05.webp`: triple portrait composite (not a single-character avatar)
- `art-06.webp`: profile view
- `art-07.webp`: white exosuit portrait
- `art-08.webp`: illuminated spine, back view
- `art-09.webp`: luminous heart core portrait
- `art-10.webp`: energy core portrait
- `art-11.webp`: LYVRA before Earth, wide composition
- `art-12.webp`: cyborg + neon globe, wide composition
- `art-13.webp`: banner/brand composite (source filename opaque; visually inspect before semantic rename)
- `art-14.webp`: Neon Globe with Flags — 2 Orbits; **stage add-on Global Resonance**
- `art-15.webp`: Global Resonance in Neon Orbit banner
- `art-16.webp`: wide brand visual (source filename opaque; inspect before semantic rename)
- `art-17.webp`: wide brand visual (source filename opaque; inspect before semantic rename)

## Current consumers requiring parity treatment (not yet modified)
- `WEBLyvra/live/dist/avatar-presence.js` still references `assets/lyvra-avatar-{front,side,back}.webp`.
- `WEBLyvra/live/dist/dashboard/index.html` and linked dashboard scripts still reference `assets/runtime-visuals/lyvra-avatar-front.png` and `assets/lyvra-identity/...`.
- `LYVRA_NATIVE_RUNTIME/dashboard/index.html`, `LyvraGPT/dashboard/index.html` are **distinct dashboard targets**; no implicit assumption of identical deployment.
- `WEBLyvra/artist-discovery/index.html` retains previously verified original five art assets and stages new `art-14` globe plus `art-17` decorative brand signature.

## Explicit parity gates before modifying live/dashboard
1. Confirm dashboard target actually rendered at user-supplied dashboard URL and deployment source map.
2. Verify each character asset by semantic view (front/side/back), not filename proximity.
3. For live and dashboard consumers, their `assets/...` relative paths must be reachable at each distinct deployment root. Assets presently exist **only in artist-discovery folder**; a relative CSS/JS link outside that root is not enough.
4. Stage or publish assets through existing canonical bridge/deployment process. Use prechange recovery, concurrency/CAS, no foreign writes. Do not claim browser or host PASS without separate visual checks.
5. Avoid propagating the wide triple-view assets into single-character img slots.
6. Keep original file dimensions/aspect ratios and transparent composition with `object-fit:contain`, `max-width:100%`, `height:auto`.
7. Existing plugin/native and other-system image paths are out of scope absent explicit verified authority.

## Current status
- Add-on Global Resonance source integrated, CSS orbital glow/float respects `prefers-reduced-motion`. The globe image does not literally rotate on its axis. Browser visual host pending.
- Live WEBLyvra: mapping verified, write pending deployment parity.
- Dashboard: mapping found, write pending deployment-root and target confirmation.
