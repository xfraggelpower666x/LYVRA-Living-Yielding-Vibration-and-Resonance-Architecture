# LYVRA PET — Free-only GitHub read repair candidate

Status: PARTIAL / NOT_DEPLOYED / SECRET_PENDING / GLOBAL_BUDGET_PENDING
Authority: Whole LYVRA on production branch `lyvra`.
Work branch: `lyvra-pet-free-auth-budget-20261008`.

## Changes completed

- Repository-event-source now requires a GitHub read credential supplied by the Worker.
- Authorization header is server-side only; no credential is written to a file, log or browser.
- Without a credential the source returns `AUTH_NOT_CONFIGURED` before any GitHub network request.
- Existing signature verification, commit lineage, freshness check and cooldown remain.
- Worker passes `env.LYVRA_GITHUB_READ_TOKEN` to the producer.
- No production script, plugin, asset, radio or current pointer modified.

## Unfinished release gates

1. Provision a repository-scoped read-only fine-grained GitHub access token as Cloudflare secret `LYVRA_GITHUB_READ_TOKEN`. Never put the value in GitHub, chat or client UI.
2. Implement a *globally shared*, strongly consistent budget regulator. Target <=300 PET-originated REST requests per rolling hour, with a margin for all other apps sharing GitHub credentials. Cache and request coalescing alone are not a hard hourly budget.
3. Ensure the regulator gates *every* api.github.com call and fail-closes on unknown counter state. No retries on 403/429 until the supplied reset/retry deadline.
4. Verify the Cloudflare Free-plan availability and actual resource quotas before adding a Durable Object binding; do not enable paid capacity.
5. Update bundle/build outputs and verify source-to-deployed Worker parity.
6. Run missing-secret / unauthorized / success / parallel-burst / rolling-window / reset / no-private-data / signed-event / stale-head tests.
7. Bind the Cloudflare secret, stage a nonproduction Worker and read back the live response and request counter.
8. Verify approved event path end-to-end before protected production publication. Current pointer last, readback after publication.

## Non-goals

No forged approved event, no existing sprite mutation, no public token, no unsafe deployment, no separate personality, no auto activation of PFS or the radio.

**Security note:** 5,000 requests/hour is a GitHub account-level nominal authenticated allowance, not a per-Worker guarantee. This candidate prevents *anonymous fallback* but does not yet provide a certified global 300/hour limit.

## Development continuation 2026-10-08

- New `github-budget.mjs` implements a single SQLite-backed Durable Object rolling-window counter, with a ceiling of 300 PET-originated GitHub REST reservations per hour.
- Both Worker paths (`/native-expression` and MCP `open_lyvra_pet`) call `petBudgetedFetcher(env)`.
- Absence or failure of `LYVRA_PET_GITHUB_BUDGET` is fail-closed before any GitHub REST call.
- This is a SOURCE READBACK ONLY. No executed concurrency test, deployed object, configured secret or live authenticated read has been confirmed.
- Before staging, configure a SQLite DO migration `new_sqlite_classes: ["PetGithubBudget"]` and Durable Object binding `LYVRA_PET_GITHUB_BUDGET` targeting the exported class.
- This single object only enforces the PET budget. Other GitHub users sharing the token can consume the account's separate 5,000/h quota.
- Regenerate the production Worker bundle before deployment: source-only GitHub updates do not update the deployed script.

## Maximal continuation: global cooldown, security and staging handoff

- `github-budget.mjs` now stores 403/429 GitHub cooldown deadlines in the same SQLite-backed Durable Object as the 300-per-rolling-hour reservations.
- Each REST request reserves before upstream; while a stored cooldown is active, the reservation endpoint refuses it even when another Worker isolate calls it.
- Token-bearing REST requests use only `api.github.com`; raw asset reads do not receive `Authorization`.
- Budget recognizes string, URL and Request inputs by exact HTTPS GitHub REST host.
- Two further regression cases cover cooldown persistence and reject invalid (>24h) deadlines; the test harness now models the cooldown SQLite table.
- Direct source and test blob readback: PASS. Execution of the NEW cooldown/auth tests on a full Node/Cloudflare bundle: **NOT VERIFIED**.
- Production settings readback still shows only `LYVRA_PET_KEY_ID`, `LYVRA_PET_PUBLIC_KEY`, `LYVRA_PET_SIGNING_KEY`: no GitHub secret and no SQLite Durable Object binding.
- 300-per-hour PET budget must NOT be described as full GitHub account protection; other clients consume their own share.
- Staging gates: Cloudflare Free only; secrets entered privately in Cloudflare (never chat); new worker script name for staging, no production overwrite; SQLite migration + binding; regenerate full bundle; execute Node tests and real DO burst/cooldown tests; test 403/429; production release only after PASS.

CAUTION: A timeout or crash after an upstream 403 but before persisting the shared cooldown can still allow a subsequent request. Keep a conservative 300/hour reservation ceiling and add a failure-injection/partial-request test before claiming full global rate-limit correctness. No real network or paid capacity was exercised by this candidate.

## 2026-10-08 staging credential evidence

- Cloudflare GET settings confirmed staging script `lyvra-pet-read-staging` has binding `LYVRA_GITHUB_READ_TOKEN` of type `secret_text` (value was not accessed).
- The productive `lyvra-pet-plugin-ui` retains its original three bindings only.
- GitHub production HEAD remains `3f39c8b1683b153eba29c3f7c9f9a4b11882444c`.
- Staging remains scaffold only: not yet a working authenticated GitHub consumer, no DO migration/binding, no active 300/h central limiter. Do NOT claim operational rate protection.
- Next: build deployable module bundle with `PetGithubBudget` SQLite DO migration and bound secret preserved, isolate staging, run authenticated read and concurrency tests, readback. No token in repository/chat.
