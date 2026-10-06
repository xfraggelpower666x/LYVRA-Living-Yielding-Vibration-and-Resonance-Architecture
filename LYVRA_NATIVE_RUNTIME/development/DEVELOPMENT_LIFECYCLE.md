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

## Accepted-development retention gate

DEVELOPMENT_OBLIGATION_LEDGER = LYVRA_NATIVE_RUNTIME/development/DEVELOPMENT_OBLIGATION_LEDGER.json
FACET_BOUNDARY_AND_PROMOTION_GUARD = LYVRA_NATIVE_RUNTIME/current/governance/FACET_BOUNDARY_AND_PROMOTION_GUARD.md

NO_SILENT_PROMOTION = true
NO_SILENT_DEVELOPMENT_LOSS = true
ACCEPTED_DEV_NE_DISPOSABLE = true

Before SYSTEMSTART / WEITER / UPDATE / NEW CHAT / NEXT CHAT closes or advances material development, inspect unresolved accepted development obligations. Each accepted item must remain one of:
PROPOSED | DEV_ACTIVE | ACCEPTED_PENDING_PROMOTION | DEFERRED_WITH_REASON | REJECTED_WITH_REASON | SUPERSEDED | PROMOTED_CURRENT.

A newer CURRENT revision may preserve an accepted DEV item without promoting it, but may not silently omit or forget it. Promotion still requires the normal lifecycle and governance gates.
