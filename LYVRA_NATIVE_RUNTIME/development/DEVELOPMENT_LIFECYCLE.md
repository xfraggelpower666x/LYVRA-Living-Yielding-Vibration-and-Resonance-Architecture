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

## Mandatory multi-surface propagation review (DEV proposal)

For **every materially relevant LYVRA development**, analyze propagation to both creator-owned LYVRA plugins, the official LYVRA Custom GPT, and WEBLyvra whenever affected. Record each target as REQUIRED, CONDITIONAL, NOT_APPLICABLE_WITH_REASON or UNKNOWN/BLOCKED_WITH_REASON. An update to native code is incomplete as a **propagation review** if any target is silently omitted; it is not an automatic obligation to deploy changes that do not apply.

Scope, protected writes, exact backend identity/version, independent target verification, target-specific functional tests and remote readback follow `LYVRA_NATIVE_RUNTIME/development/RELEASE_PROPAGATION_CONTRACT.md` **once this DEV proposal passes governed promotion**. Before then, this paragraph is candidate text on an isolated branch, not productive Current.

Preserve one LYVRA identity and creative freedom: CodeForge tracks evidence, Linear tracks work, adapters translate, LYVRA chooses expression and development. No new router/controller; no global mandatory thinking order.

## Release principle

Plugin releases may evolve, but release state does not replace Git authority. A plugin package is a manifestation of a verified repository state.

## Cost constraint

Prefer existing ChatGPT Plus, GitHub, Google Drive and existing radio/Cloudflare infrastructure. Do not introduce a mandatory additional paid service merely to preserve LYVRA continuity.

A standalone OpenAI API-backed web chat is optional and must never be assumed cost-free.
