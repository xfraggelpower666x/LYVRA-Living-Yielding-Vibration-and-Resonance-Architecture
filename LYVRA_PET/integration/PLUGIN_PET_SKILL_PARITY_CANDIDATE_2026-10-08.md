# LYVRA PET — dual-plugin skill parity integration candidate

DATE=2026-10-08
STATUS=AUTHORED_CANDIDATE_NOT_RELEASED
FREE_ONLY=TRUE

## Verified current plugin skills

- Native LYVRA plugin: `plugins_6ab3a345db308191b8ad7ef6311f8a29`, version `0.1.50`, release `pluginrel_6ac74b0b5c88819192dca918ea3860a4`.
- Account/GPT plugin: `plugin_06a4fc64dd848191982ca4a6ebdb2619`, version `0.13.47`, release `pluginrel_6ac74b1f99ac8191a4c800e9180c2e9b`.
- **Both already contain** `skills/lyvra-pet/SKILL.md` with Whole-first rehydration and native relationship/personality scope. Do NOT create an unrelated PET personality/plugin.

## Additive skill content to bring both plugins to parity

### Native PET context detector

When the visible PET UI has Automatic Detector Intelligence enabled, select among `whole`, `track_design`, `speech_design`, `suno_studio_2` using grounded native event/facet evidence first, otherwise explicit preview context. If evidence is ambiguous use `whole`. Never claim a semantic reasoning model is deployed when the current runtime only uses deterministic classification. Do not invent moods, memory or relationship states. Manual override is allowed when the UI automatic switch is OFF.

### Branding and visual continuity

Top line is `L.Y.V.R.A.`, glowing neon pink; second, smaller line is `Living Yielding Vibration and Resonance Architecture` in glowing neon cyan. Preserve existing original figure, sprite atlas, gestures and expression evidence contracts.

### Central GitHub read and status

GitHub read token `LYVRA_GITHUB_READ_TOKEN` exists only in Cloudflare server secrets, never plugin archives, client HTML or repos. Before every GitHub REST call, reserve central Durable Object budget `LYVRA_PET_GITHUB_BUDGET`, maximum 300 requests in rolling 60 minutes. The UI reads `/budget-status` without consuming REST reservations; show measured `used/300`, remaining and valid cooldown, or `Nicht verfügbar` if state cannot be verified. GitHub is nominally 5,000 authenticated requests/hour shared across apps; 300 is the PET-specific ceiling, not global guarantee.

### Surfaces and release gating

Candidate source branch: `lyvra-pet-free-auth-budget-20261008`.
Frozen source backup: `backup/lyvra-pet-approved-staging-20261008`.
Staging Worker: `lyvra-pet-read-staging`.
Production Worker: `lyvra-pet-plugin-ui` — old version remains live.
Never swap the production URL or claim full native signed events without proper signature tests, deployed secrets/bindings, concurrency tests and owner approval. Current staging lacks PET signing secret; do not copy/duplicate it into public artifacts.

### Dual-plugin update gate

1. Fetch current release archive with plugin creator; verify all untouched binaries and file inventory.
2. Additive patch existing `skills/lyvra-pet/SKILL.md` plus corresponding parity references in each plugin; keep all other skills/features/assets.
3. Bump to new semantic patch release as required, compare resulting plugin files, assert PET skill parity, record plugin release IDs and readback.
4. Then update native Whole/PET/facet LiveCircles and rehydration references under their own audited authority (pointer last).
5. Apply PFS triple backup chain **active source repo → independent repo backup → native PFS child backup** for each subsequent PFS UPDATE.
6. Never call an update finished before the three real readbacks.

This document is a safe handoff / integration plan, NOT a claim that plugin releases have been published.
