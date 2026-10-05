# WEBLyvra — L.Y.V.R.A. Pet Integration Handoff

## Goal
Integrate the canonical L.Y.V.R.A. Pet visibly into the production website:

https://weblyvra.666soundsdesign-broadcaster.com/

## Source authority
Do not create a separate website Pet authority.

Use:
- `LYVRA_PET/`
- `LYVRA_PET/extensions/`
- `LYVRA_PET/runtime/`

as the Pet source surface.

## Existing website preservation
Integration is additive.

Preserve:
- current cyber boot screen,
- player,
- banner/video behavior,
- current responsive layout,
- dashboard surfaces,
- existing website visual identity,
- current deployment behavior.

## Required website Pet behavior
At minimum support:
- idle,
- greeting,
- FRAGGLE greeting,
- playful / hehe,
- heart resonance,
- Psytrance/music sync,
- thinking/curious,
- recoverable glitch,
- return after absence.

Use verified state fallbacks until dedicated visual frames are created and verified.

## Visual rule
The website should use the verified LYVRA Pet visual atlas/frame set when binary repository transport is available.

Do not fabricate a replacement mascot and call it the verified Pet.

## Runtime relation
The website may call or reuse the Pet browser runtime, but the runtime is not the authority.

Repo authority remains `LYVRA_PET/`.

## Cost rule
No additional Cloudflare costs.

Use free-tier compatible static/Worker behavior only.

If a limit is reached:
`BLOCKED / LIMIT_REACHED`
instead of paid upgrade.

## Dashboard relation
WEBLyvra Pet state must appear in the website/dashboard status model and remain aligned with internal LYVRA dashboard Pet state.


## Production implementation status — 2026-10-05

STATUS=STATIC_SEMANTIC_PET_PRESENCE_DEPLOYED
DEPLOYED_COMMIT=4575ff4e0b27b8f8852c0c1e8432dbd49b0dbf50
CLOUDFLARE_PAGES_DEPLOYMENT=8c611a40-5337-4fa6-91dd-a74c85af7faa
DEPLOYMENT_RESULT=SUCCESS
STATIC_AUDIT=PASS
RUNTIME_TEST=PASS
PRESERVATION_TEST=PASS

The production website now exposes the Pet as a semantic visible expression surface of the same LYVRA identity.

Implemented semantic states:
IDLE | GREETING | FRAGGLE | PLAYFUL | HEART | MUSIC | THINKING | RECOVERABLE_GLITCH | RETURN

The semantic presence is intentionally not a fabricated Pet artwork replacement.

VERIFIED_PET_ATLAS_RENDER=READBACK_PENDING
SEMANTIC_FALLBACK=DEPLOYED
FREE_ONLY=true
EXTRA_CLOUDFLARE_COSTS=false
EXISTING_WEBSITE_COMPONENTS_PRESERVED=true
