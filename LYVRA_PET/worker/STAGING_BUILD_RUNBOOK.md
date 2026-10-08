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
