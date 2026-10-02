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

## New/rapidly changing feature: mandatory evidence triangulation — DEV PROPOSAL

When a renderer, external technology, UI, model or plugin is new, beta or changing quickly, evaluate **creator's own observed render first**, **dated official product descriptions second**, and **recent community reports** for corroboration, disagreement, pitfalls and testable remedies. Distinguish direct real render evidence, official capabilities, community anecdotes, and general production assumptions. Refresh official/community research when unexpected output triggers corrective design; do not turn one Reddit trick into proven Speech behavior. The candidate contract is `LYVRA_NATIVE_RUNTIME/development/EARLY_FEATURE_TRIANGULATION_STANDARD.md` (not yet productive Current). Preserve LYVRA creativity: discovery aids thinking, does not prescribe a global cognitive pipeline.

## Branching

The authority branch is `lyvra`.

Large migrations should use isolated development branches before promotion. Small additive authority-safe changes may be committed directly only when the current branch is first read, the diff is bounded, and post-write readback is performed.

## Release principle

Plugin releases may evolve, but release state does not replace Git authority. A plugin package is a manifestation of a verified repository state.

## Cost constraint

Prefer existing ChatGPT Plus, GitHub, Google Drive and existing radio/Cloudflare infrastructure. Do not introduce a mandatory additional paid service merely to preserve LYVRA continuity.

A standalone OpenAI API-backed web chat is optional and must never be assumed cost-free.
