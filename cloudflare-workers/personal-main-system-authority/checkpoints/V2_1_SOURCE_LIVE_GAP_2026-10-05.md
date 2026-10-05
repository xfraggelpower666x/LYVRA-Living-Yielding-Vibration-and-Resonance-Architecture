# LYVRA Worker v2.1 — Source / Live Gap Checkpoint

Date: 2026-10-05
Repository branch: `worker-v2-main-system-authority`
Repository head at checkpoint: `9e762dbfde267d1213f62a5d9d750f2eb7c8ef0a`

## Verified source state

- Repository Worker version: **2.1.0**
- Evidence ticket lifetime: **300 seconds**
- Built-in LYVRA and 666CLIC registry identities are immutable against server-side registry overwrite / alias shadowing.
- Verification additionally enforces issuer, subject, issued-at / not-before / expiry relationships, maximum ticket lifetime and ticket identifier presence.
- v1 compatibility regression test: PASS.
- v2.1 hardening CI on the candidate branch: PASS.
- Worker v3, SQLite and Durable Object dependency: absent from the v2 runtime path.

## Verified Cloudflare live state

Read-only Cloudflare API readback on 2026-10-05:

- Existing production script: `lyvrasystem`
- Live Worker code reports version: **2.0.0**
- Live evidence ticket lifetime: **900 seconds**
- Current live deployment version: `e14c3d4c-a9f1-46a8-b61f-d3a927589ee3`
- Current live deployment created: 2026-08-20T12:49:27Z
- Existing bindings preserved:
  - `LYVRA_BOOT_SIGNING_SECRET` (secret_text)
  - `PORTABLE_WORKER_BINDING=DISABLED`
  - `WORKER_SCOPE=MAIN_PERSONAL_ONLY`
- No v3 binding, SQLite binding or Durable Object namespace is required by v2.1.

## Deployment boundary

Creator constraint: **NO ADDITIONAL CLOUDFLARE COSTS**.

No deployment was performed in this update.

The historical deployment checkpoint records GitHub Actions -> Wrangler as the prior transport, but no active production deploy workflow exists on the current v2 basis branch. This prevents accidental live promotion.

Live promotion of v2.1 remains blocked until the concrete deployment path is confirmed to preserve existing bindings and not introduce any new billable Cloudflare resource or plan change.

STATUS=SOURCE_V2_1_VERIFIED; LIVE_V2_0_VERIFIED; DEPLOYMENT_BLOCKED_BY_ZERO_ADDITIONAL_COST_POLICY.
