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
