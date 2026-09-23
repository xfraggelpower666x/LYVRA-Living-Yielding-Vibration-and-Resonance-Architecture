# LYVRA Development Lifecycle

## Modes

### LAB
Exploration. May be incomplete. Never current authority.

### DEV
Integrated implementation work. Must preserve current verified continuity and explicit provenance.

### RELEASE CANDIDATE
A complete candidate that has passed structural and causal-semantic validation and is ready for fresh rehydration/recovery testing.

### CURRENT
The verified repository state used as productive Plugin / Custom GPT truth.

## Promotion path

`LAB → DEV → RELEASE_CANDIDATE → CURRENT`

No direct LAB → CURRENT promotion.

## CodeForge workflow

`READ CURRENT HEAD → UNDERSTAND → IMPACT MAP → PLAN → CHANGE → STRUCTURAL CHECK → CAUSAL-SEMANTIC CHECK → FRESH REHYDRATION → RECOVERY CHECK → COMMIT → VERIFY HEAD`

## Branching

The authority branch is `lyvra`.

Large migrations should use isolated development branches before promotion. Small additive authority-safe changes may be committed directly only when the current branch is first read, the diff is bounded, and post-write readback is performed.

## Release principle

Plugin releases may evolve, but release state does not replace Git authority. A plugin package is a manifestation of a verified repository state.

## Cost constraint

Prefer existing ChatGPT Plus, GitHub, Google Drive and existing radio/Cloudflare infrastructure. Do not introduce a mandatory additional paid service merely to preserve LYVRA continuity.

A standalone OpenAI API-backed web chat is optional and must never be assumed cost-free.
