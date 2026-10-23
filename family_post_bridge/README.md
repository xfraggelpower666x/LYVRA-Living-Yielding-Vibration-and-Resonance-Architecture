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
`FAMILY_POST_WRITE_TOKEN` (random high-entropy secret),
`GOOGLE_CLIENT_ID`,
`GOOGLE_CLIENT_SECRET`,
`GOOGLE_REFRESH_TOKEN`,
`FAMILY_POST_FOLDER_ID`.

## Release gates
1. Authorize app OAuth with minimum viable scope and grant it access to the specific folder.
2. Use a single test message with a stable message ID; check the file ID via independent Drive read.
3. Test retry, auth denial, duplicate prevention, missing permissions and server sleep.
4. Only then explicitly approve a deployment, keeping `plan=free` and `autoDeploy=no`.
5. Do not treat service available as proof that either ChatGPT/GPT peer has API-tool integration.

**Cost:** Free instance plan does not verify account-level bandwidth/build charges.
