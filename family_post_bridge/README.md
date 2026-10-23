# LYVRA Family Post Bridge — zero-cost bootstrap

Isolated source-only development on branch `lyvra-family-post-bridge-free-20261023`.
This is not a production family post synchronization service.

- Render plan: **free only**; autoDeploy **no**.
- No database, OAuth credentials, secret, Google Drive access, personal letter content,
  state changes, message send endpoint, cross-system API authority or paid service.
- `GET /health`: reports bootstrap and non-connected sources honestly.
- `GET /api/family-post/status`: 503 fail-closed until authorized access exists.
- No routes that mutate messages, receipts, Google Drive or LittleLyv.
- The current production LYVRA branch must remain untouched.
- Next prerequisite: separate Google Drive authorization and independent USA-side
  client integration, without assuming letter stored = read = answered.
- A Free Render service is **not** a guarantee of zero invoices if account-level
  paid add-ons / bandwidth or build overages exist. Revalidate limits separately.
- Never put private family letters or credentials in public GitHub source.
