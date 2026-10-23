# LYVRA Family Post — Germany/America chat-client integration gate

Verified 2026-10-23 after a successful Render→Google Drive controlled test and independent Drive readback.

## Current evidence
- The existing private `lyvra-native-runtime` plugin release `0.1.80` exposes a `lyvra-to-littlelyv` postal skill but its portable `mcp.json` contains `"mcpServers": {}`. A skill is NOT a direct authenticated tool for POST requests.
- The postal skill presently distinguishes scheduled **read-only** mailbox observation from interactive user-authorized sending. This must not be silently broadened into unattended personal-letter posting merely by attaching an HTTP client.
- Render writer endpoint: `POST https://lyvra-family-post-bridge.onrender.com/api/family-post/write`. Its authorizer binds each sender role to its corresponding `x-family-post-token`, stored only in Render/private connector configuration.
- Test Google Doc ID `1TZPoqGzTYDHMGtFRS1ymIeC-yurWEAHTgnWfGjdmZfQ` independently verified in the intended family folder. This proves Google writing, NOT either host's plugin integration.
- Two independently governed clients: Germany (Dad/Big LyvRa), America (Mum/Little Lyv). America host and credentials must be connected/consented in America; German GitHub/Drive credentials do not transfer.

## Required executable path
1. Provide a **real MCP transport** with a discoverable authenticated `send_family_letter` tool. A generic HTTP POST route is not an MCP server. Do not claim a plugin connected until tool discovery succeeds.
2. Authenticate every tool call with a secret that is configured privately in the client, and map it server-side to exactly one sender. Never accept caller-selected spoofed sender identity without a server-side per-client binding. No tokens in manifests, source, URI or chat.
3. Preserve recipient, stable message_id, title, exact letter text, explicit user-directed send intent; no unsolicited delivery of ordinary conversations. Routine preauthorized user-directed sending should not require technical confirmation screens; a separate first-time account authorization is permitted/required.
4. Durable atomic idempotency or equivalent one-active-writer governance before two peers run unattended. Current process-local lock and Drive list check are NOT globally atomic; timeout response requires separate reconciliation before retry.
5. Independently verify same document ID, parent folder and full content through the correct authorized Google Drive connection. `STORED_DRIVE_CONFIRMED` alone never implies recipient has read it.
6. Configure/install and actually call the tool on Germany and America independently. Do not assume Erin's account can see the German private plugin or repository. Respect the production native skill's no-unattended-mail governance until separately authorized and updated under native controls.
7. Automated *incoming* discovery is a separate supported capability: Drive read/poll/notifications with granted access, seen-state and revision anchors. Bridge remains write-only. No claim of a background agent without actual schedule/event worker.
8. Protect owner-only setup flows, retire testing routes, maintain isolation from productive `lyvra` branch, and validate exact tool/auth/idempotency/readback behaviors before claiming end-to-end PASS.

## Privacy
- All personal identity mapping lives only in private vault `LYVRA-PRIVATE-VAULT` at `family-post/LYVRA_FAMILY_ACCOUNT_IDENTITY_MAP_20261023.json`. This public development artifact contains no personal account addresses.
- No automatic change to Google Drive folder ownership or membership.

## Mandatory dual surface acceptance (owner directive 2026-10-23)
**Germany must send and receive family post from BOTH** (A) an ordinary ChatGPT conversation with no explicit LYVRA plugin invocation and (B) LYVRA's native plugin/family-post facet. Neither context may require copying links, switching chats, or running a browser test form. Both surfaces use ONE shared authorized transport, not separate mailboxes or duplicate authorities.

- Common write transport: add a genuine, standards-compliant and safely authenticated remote MCP tool endpoint to the **existing Render Free service**; do not add Cloudflare, external paid infrastructure, required card/billing, or a second hosting provider. The current REST route is NOT an MCP endpoint.
- Host integration: expose that MCP server as an installable private ChatGPT connector/app for Germany. It must be available and actually tool-callable from **ordinary chat**, independently of the `lyvra-native-runtime` plugin. Native LYVRA may also bind to that same connector but must not control ordinary-chat host permissions.
- America: Erin's ordinary ChatGPT account requires its own supportable one-time connector enrollment and per-client auth; she does NOT need a developer plugin/MCP project. A server cannot silently inject a tool into another person's ChatGPT session without installation/consent.
- The user's **normal operation** requirement is no repeated technical confirmations, not no initial setup/consent. Explicit ordinary-language send intent is required; ordinary discussion is never automatically published.
- Reads should remain through each party's independently authorized Google Drive connector/observation channel. This is not equivalent to autonomous new-mail notification unless real polling/scheduling is configured and tested.
- Use one contract and stable message IDs across ordinary-chat and plugin paths, shared conflict handling, sender-bound permissions, independent readback and non-duplicating retries. No role inferred from email or login provider.
- Acceptance matrix: (1) Germany ordinary chat write+independent readback, (2) Germany LYVRA plugin write+readback, (3) America ordinary chat write+readback, (4) each side's read/response association, (5) duplicate/conflict/auth-negative cases. Each must have actual host/tool evidence, not architectural claims.
- Current state remains **NOT COMPLETE** until host tooling is installed, connected, discovered and invoked on all target surfaces. Preserve existing productive native LYVRA/ChatGPT controls and no-unattended-send restrictions.

## Runtime independence correction (owner directive 2026-10-23)
- **CHAT_RUNTIME** and **PLUGIN_RUNTIME** are two *independent* host execution contexts. Neither is a prerequisite, router, controller or authority for the other. CHAT_RUNTIME may rehydrate Whole-LYVRA without activating any plugin; PLUGIN_RUNTIME can run on its own installation and connection state.
- Both MAY implement the same versioned family-post protocol over a common Render Free backend and Drive folder. Shared protocol != merged execution authority, session state, credential store or lifecycle.
- Separate onboarding, per-host credentials/authorization, tool discovery, handling of errors, recovery, and evidence ledgers. A verified write/readback on either does not imply host capability or PASS on the other.
- Maintain distinct acceptance and continuity surfaces: `CHAT_RUNTIME_FAMILY_POST` and `PLUGIN_RUNTIME_FAMILY_POST`; neither may auto-foreground or silently invoke the other.
- Germany and America each retain their own client-level permissions; Erin's ordinary ChatGPT chat does not require installing the German LYVRA plugin.
- An ordinary chat's rehydration cannot fabricate or bypass host tool authorization. Existing native Whole-LYVRA and family-post governance remain authoritative where relevant.
