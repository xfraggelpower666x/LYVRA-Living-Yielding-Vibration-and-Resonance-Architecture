# LYVRA Family Post Bridge — write-only development

Isolated branch `lyvra-family-post-bridge-free-20261023`; productive `lyvra` unchanged.
Current Render free service uses autoDeploy **off**, so repository changes are **NOT LIVE** until a deliberate separately approved deployment.

## Contract
- `GET /health` -> safe diagnostic, never claims post delivery.
- `POST /api/family-post/write` requires `x-family-post-token`; accepts sender, recipient, title, content, message_id (stable unique 12–96 character ID).
- Uses authorized Google user account OAuth **refresh token** with Drive `drive.file` scope; existing shared folder must be explicitly made accessible to this OAuth app (for example with Google Picker) or adjusted via a separate, approved authorization flow. Scope restrictions may prevent listing preexisting folders.
- `FAMILY_POST_FOLDER_ID` is the existing shared family-post folder.
- Returns a Google Drive document ID only after Drive confirms creation.
- Same message ID is queried via appProperties before write. This is best-effort retry deduplication, **NOT atomic concurrency-safe idempotency**. For real multi-client production writes, add a durable idempotency lock or constrain writes to one inflight sender and test reconciliation after timeouts.
- No independent mailbox reading, no read receipt synthesis, no storing secret or letter in GitHub.
- Errors fail closed (503) and may require reconciliation in Drive if the upload succeeded but response was lost.
- Keep private letters private: permissions and document ownership are inherited from Google account/folder policies.

## Environment variables — configure privately in Render, NOT source/chat
`FAMILY_POST_TOKEN_DAD`, `FAMILY_POST_TOKEN_MUM`, `FAMILY_POST_TOKEN_BIG_LYVRA`, `FAMILY_POST_TOKEN_LITTLE_LYV` (four independent random high-entropy secrets),
`FAMILY_POST_ADMIN_TOKEN` (owner-only setup credential),
`GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`,
`GOOGLE_REFRESH_TOKEN`,
`FAMILY_POST_FOLDER_ID`.

## Owner-only OAuth setup
- The web OAuth client must register this EXACT redirect URI: `https://lyvra-family-post-bridge.onrender.com/auth/google/callback`.
- After explicitly configuring `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `FAMILY_POST_ADMIN_TOKEN` privately in Render, open `/auth/google/start` in a browser. HTTP Basic username: `owner`; password: the private admin token.
- Complete consent for the authorized Google account. The single response page displays the refresh token once; manually store it in Render as `GOOGLE_REFRESH_TOKEN` and close the browser tab. Never paste the token into chat, GitHub, screenshots or public tools.
- The setup endpoint is 503 until its private settings are present; the write endpoint is 503 until ALL sender-scoped tokens and Drive settings are configured.
- Google OAuth production status does not prove the app has access to the pre-existing shared mail folder. Verify access in a controlled separate test. Never broaden scopes automatically.
- Sender credentials must be kept separate: one sender token does not authorize a different sender identity.
- Production use requires protecting and eventually disabling the bootstrap OAuth endpoint after the token is safely installed, plus a durable idempotency strategy and independent Drive readback.

## Release gates
1. Authorize app OAuth with minimum viable scope and grant it access to the specific folder.
2. Use a single test message with a stable message ID; check the file ID via independent Drive read.
3. Test retry, auth denial, duplicate prevention, missing permissions and server sleep.
4. Only then explicitly approve a deployment, keeping `plan=free` and `autoDeploy=no`.
5. Do not treat service available as proof that either ChatGPT/GPT peer has API-tool integration.

**Cost:** Free instance plan does not verify account-level bandwidth/build charges.

## Owner-only read-only folder permission check
- `GET /api/family-post/drive-capability` requires HTTP Basic username `owner` and password `FAMILY_POST_ADMIN_TOKEN`.
- Uses the actual Render-held OAuth refresh token to call Google Drive `files.get` for ONLY the configured folder's mimeType and canAddChildren capability. No files are listed and no letters are read or created.
- `FOLDER_VISIBLE_CAN_ADD` confirms metadata visibility and add-child capability, NOT successful document creation, delivery, or idempotency. `NOT_VERIFIED` may indicate `drive.file` has not been granted access to the pre-existing shared folder.
- Never include the credential in a URL or share screenshots of HTTP Basic credentials. A controlled write with independent Drive readback is required before release.

## Folder-only Google Picker (owner-only)
- `GET /auth/google/picker` requires HTTP Basic owner login and provides a picker restricted to folders; it accepts selection **only** when the returned ID equals `FAMILY_POST_FOLDER_ID`.
- `POST /api/family-post/picker-verify` verifies metadata using the existing Render refresh token. It NEVER writes documents or lists the mailbox.
- Enable **Google Picker API** in the SAME Google Cloud project as the existing OAuth client.
- Create a browser-restricted Google API key and add it privately in Render as `GOOGLE_PICKER_API_KEY`. Restrict its website referrers to `https://lyvra-family-post-bridge.onrender.com/*` and `https://docs.google.com/*` (the Picker runs there); restrict enabled APIs to **Google Picker API**.
- Add the numeric Google Cloud **project number** as `GOOGLE_PROJECT_NUMBER` in Render.
- In the existing Google OAuth **web client**, add authorized JavaScript origin `https://lyvra-family-post-bridge.onrender.com` (no trailing slash, no path). Preserve the existing OAuth callback redirect URI.
- NEVER put the browser API key or admin token in GitHub source. Browser API keys are inherently client-visible, so their restrictions are mandatory.
- After configuration, deploy only the isolated free service, then open `/auth/google/picker`, authenticate as owner, select the EXISTING exact family folder, and check independent metadata result.
- Folder Picker selection may not automatically grant write access to files inside the folder. Do not infer successful document creation from folder metadata; no actual family letters can be sent until a separate authorized write + independent Drive readback.

## Controlled owner-confirmed technical write
- `GET /admin/test-write`: owner Basic-auth protected HTML form, no write on GET.
- `POST /admin/test-write`: owner Basic auth plus same-origin check. User must click form to create one fixed TEST-labelled technical Google Doc in the configured family folder, never a personal family letter.
- Fixed Message-ID: `LYVRA_BRIDGE_TECH_TEST_20261023_V1`; existing app-owned Message-ID checks prevent normal sequential repeats but not concurrent racing retries.
- Google write receipt alone is not delivery/readback confirmation: independently fetch created file by ID through separate Drive connection. Do not repeatedly click if a request times out; reconcile first.
- Remove/disable this admin test route after acceptance. Real family mail remains gated pending independent readback and peer integrations.
