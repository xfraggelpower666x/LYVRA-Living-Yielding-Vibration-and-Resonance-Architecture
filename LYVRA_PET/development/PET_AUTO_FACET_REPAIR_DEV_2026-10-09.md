# LYVRA Pet · Automatic Facet Repair (DEV candidate)
SOURCE_AUTHORITY: Whole LYVRA / branch lyvra
BASE_HEAD: 300eaf956815832a416b5090d8e5e3820ab78d66
WORKER: lyvra-pet-plugin-ui
CLOUDFLARE_DEPLOYMENT_PRESERVE: 0c45fa4c-b546-4220-84c7-2a7fd262899e
STATUS: DEV_PATCH_SPEC_NOT_DEPLOYED

## Verified regression
Live Worker bundle `/content/v2` includes the `<select id="facet" aria-label="LYVRA Modus">` control.
Its change handler calls `evidenceController.reset()`, increments `nativeTicket`,
sets `current.facet` from the control and calls `effects.set(current)`.
Manual expression/state controls also invalidate the native event ticket.
The same bundle contains `createSignedEffectConnection` and a signed native-event reader.
Thus the UI contains both a signed native driver and an interfering manual preview path.
An old/manual UI is not evidence that the new deployed budget feature is absent.

## Minimal code patch — to apply only after full source bundle extraction
1. Default UI to `AUTOMATIC`: hide manual facet selector and demo gesture controls from ordinary users.
2. Add an explicit opt-in `Preview` mode for diagnostics. No manual gesture/selection event may call
   `evidenceController.reset()`, `nativeConnection.reset()` or advance `nativeTicket`
   while in AUTOMATIC mode.
3. All events in AUTOMATIC mode must be verified with the existing Ed25519 native signed-event
   verifier, source-revision freshness, expiry/replay and Whole LYVRA identity guards.
   The verified event facet is authoritative for display; no inferred personality/state from clicks.
4. Preview mode is isolated: labels must say preview; exiting preview resets only the preview
   state and re-establishes a fresh verified native connection rather than making stale events active.
5. When the GitHub native source is unavailable, show calm presence plus source diagnostic.
   Do not automatically promote the manual fallback into authority.
6. Preserve sprites/assets, current budget Durable Object readout, signing key bindings,
   current fetch path, privacy/relationship fences, dashboard links and no-paid-service rule.

## Acceptance (all required before productive write)
- Bundle bytes and Cloudflare current version exported/hard-bound as backup.
- Static check: default UI no manual mode selector; preview controls gated.
- Functional check: signed current facet event changes display automatically.
- Negative check: invalid signature, stale revision, >60s event, replay and GitHub
  rate limit do not modify authority or force old manual controls.
- Automatic event remains valid across viewport changes and user taps.
- Preview does not hijack the signed native event channel.
- Budget-counter, native expression, pose animation, logo, mobile layout regressions pass.
- New Worker version deployment + GET readback + browser host verification.
- Native fingerprints, affected plugins, manifest, Current Pointer LAST.

No production mutation is authorized by this candidate file alone.
