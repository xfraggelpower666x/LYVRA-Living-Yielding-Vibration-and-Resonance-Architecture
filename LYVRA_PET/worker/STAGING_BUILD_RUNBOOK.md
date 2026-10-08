# LYVRA PET staging build — FREE_ONLY

Staging worker: `lyvra-pet-read-staging`; production worker is out of scope.
Source: `LYVRA_PET/worker/src/index.js`.
Config: `LYVRA_PET/worker/wrangler.staging.jsonc`.

## Build contract

1. At repository root, use a local Node.js runtime with a pinned, free Wrangler/esbuild toolchain (no subscription). Do not publish until dependency integrity is verified.
2. Bundle `LYVRA_PET/worker/src/index.js`, including the exported `PetGithubBudget` class and its sibling imports. Merely uploading an ES module as a legacy service worker fails.
3. Configure SQLite migration `new_sqlite_classes: ["PetGithubBudget"]` and binding `LYVRA_PET_GITHUB_BUDGET` using the staging-only Wrangler config.
4. Staging contains a Cloudflare secret binding named `LYVRA_GITHUB_READ_TOKEN` (confirmed via settings readback; value never inspected). Never overwrite/remove it when deploying.
5. Ensure endpoint `/native-expression` uses the configured GitHub auth and DO budget; verify `/mcp` equally.
6. Run Node tests from `LYVRA_PET/bridge/*test.mjs`, then run staging integration tests with >300 reservations, shared cooldown, 403/429, 404, missing binding, header isolation, signing and privacy.
7. A production release requires readback and official Whole LYVRA approval, recovery, and pointer-last promotion. No auto-publish.

No free-plan capacity upgrades; fail closed on limit exhaustion. Production PET 2.3.4 and radio must remain untouched.

## State

- Configuration created and GitHub-readback confirmed.
- Secret name and type confirmed in staging Cloudflare settings.
- Actual module build **NOT DONE**.
- SQLite migration and DO binding **NOT DEPLOYED**.
- Authenticated end-to-end test **NOT DONE**.

## 2026-10-08 Full PET staging module deployment

Cloudflare deployment id: `ef3b3f52-de95-4b46-be49-6aadde0cb970`.
Version id: `c64d9044-6d05-435d-8716-a6478d609498`.
Five source modules uploaded via multipart Worker modules API, 89,201 source characters total.
Files: `worker/src/index.js`, `assets/logo-assets.mjs`, `bridge/repository-event-source.mjs`, `bridge/github-budget.mjs`, `bridge/signed-event-transport.mjs`.
Source branch: `lyvra-pet-free-auth-budget-20261008`.
Two browser fetch URLs for native-expression and budget-status rewritten to staging; static sprite/logo URLs retain the approved existing production binary references.

Cloudflare PUT response 200 success; direct readback confirmed secret_text `LYVRA_GITHUB_READ_TOKEN`, durable_object_namespace `LYVRA_PET_GITHUB_BUDGET`, staging subdomain enabled, and new deployment version id.

IMPORTANT: Staging does not contain productive `LYVRA_PET_SIGNING_KEY` or `LYVRA_PET_KEY_ID`; a genuine signed native-expression event is therefore not yet testable and must not be fabricated. The original expression preview and counter can still be smoke-tested. Unverified: browser render, budget route actual HTTP result, MCP opening, signed event, 300/h concurrency test, Cloudflare Free-plan consumption. Do not mark production READY or merge this candidate.

No production script, radio, Whole live pointer or native event mutated.
