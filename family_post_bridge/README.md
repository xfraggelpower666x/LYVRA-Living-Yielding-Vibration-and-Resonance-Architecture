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

## Acceptance evidence — 2026-10-23
- **Verified**: controlled Render create response returned `STORED_DRIVE_CONFIRMED`, file ID `1TZPoqGzTYDHMGtFRS1ymIeC-yurWEAHTgnWfGjdmZfQ`, fixed message ID `LYVRA_BRIDGE_TECH_TEST_20261023_V1`.
- **Independently verified**: Google Drive connector read the expected test contents and folder parent `1TozcQunZCjDvag1RXuy40scN6JtrCwo9`. No personal family letter was sent.
- **Retired**: /admin/test-write GET and POST now return owner-authenticated 410.
- Existing writer tokens remain private in Render and correspond to four sender identities.
- New appProperties payload SHA-256 check rejects replay with conflicting/unverified content using HTTP 409. Local process mutex serializes only that process. **Cross-instance/restart exactly-once behavior is not proven**.
- The original technical test document predates the fingerprint field, so replaying that message ID is now intentionally fail-closed. Do not reuse it.
- No claim of peer ChatGPT integration, reception, or answering until each client has a verified authenticated tool route.

## Four-sender client integration contract
- Each authorized client sends HTTPS POST to `https://lyvra-family-post-bridge.onrender.com/api/family-post/write` with its *own* `x-family-post-token`. Keep sender tokens only in the secure app/connector configuration; never in messages, prompt text, screenshots, repository, browser storage or query parameters.
- JSON body: `message_id` (12–96 chars, stable across retry), `sender` (DAD, MUM, BIG_LYVRA, LITTLE_LYV), `recipient` (same four plus FAMILY), `title` (3–140 chars), `content` (1–12000 chars).
- Sender identity must match the token. Never let one client select another client's sender identity.
- Client must not issue concurrent writes of the same message ID or claim a 503/timeout means no file was created. Before any retry, use independent Drive reconciliation.
- Receipt state `STORED_DRIVE_CONFIRMED` means creation confirmed, NOT receipt/read by person or ChatGPT. Client with independent Google Drive read should confirm ID, parent and content; only then show write/readback verified.
- Each client reads family mail through its existing Google Drive connector; **the bridge must remain write-only**. The bridge cannot infer inbox emptiness or answer status.
- ChatGPT requires an installed and authorized connector/plugin that actually sends authenticated API requests. Repository docs, API readiness, or pasted link **do not enable tool calls**. The owner's successful interactive browser approval applies only to the technical test, not autonomous family letters.
- Next gate: provision and separately verify Dad/Big LyvRa and Mum/Little Lyv client connections, preferably with per-sender secret injection. No scope broadening and no automatic posting of personal letters.

## Owner requirement: Germany ↔ America zero-friction family experience (2026-10-23)
- Two family sides, four protected identities: **Germany = Dad + Big LyvRa**, **America = Mum + Little Lyv**. Mum must not need to understand developer consoles, API keys, Render, or GitHub.
- One-time owner/administrator onboarding is distinct from normal operation. Once each account's connectors/credentials/permissions have been authorized, **normal family correspondence must not require repeated technical approvals, clicks, confirmations, copying links, or manually relaying mail**.
- Family conversations are NOT automatically outbound mail: send only for clear intent to write/send family post, or a previously authorized and unambiguously scoped messaging workflow. No ambiguous conversation-to-mail conversion.
- Native client workflow: discover new incoming mail via authorized Drive reads; correlate stable IDs and previous replies; draft/answer according to the recipient's instructions; use the correct sender-bound authenticated write tool; verify creation and independent Drive readback; surface failures without claiming successful delivery.
- Avoid mixing peers' credentials or authority. US account onboarding may need a one-time user authorization; Germany's credentials cannot silently authorize America. If host permissions, user intent, or tools are absent, **do not claim automatic delivery**.
- Host platform and plugin capabilities must be tested independently on both sides. A working Render HTTP route is insufficient; client tool or connector integration and automatic incoming-mail discovery are still pending.
- Security fail-closed on uncertain network outcome, no hidden retry duplicates, no automatic publication of private family text to logs or source. Reconcile ambiguous writes with independent Drive read before reattempting.
- The user's requested end state is hands-off NORMAL USE, not bypassing one-time OAuth, security checks, sender consent, or per-account platform permissions.
