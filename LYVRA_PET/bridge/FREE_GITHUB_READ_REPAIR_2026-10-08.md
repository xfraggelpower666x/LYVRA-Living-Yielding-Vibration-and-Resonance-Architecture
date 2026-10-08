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
