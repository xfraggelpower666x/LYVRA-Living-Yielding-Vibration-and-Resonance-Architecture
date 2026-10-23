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
