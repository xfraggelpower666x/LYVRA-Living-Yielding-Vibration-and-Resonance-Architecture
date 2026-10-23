# LYVRA Family Post — intelligent monitor, post-write Readback and visual guidance

STATUS: DEVELOPMENT CANDIDATE, SOURCE-ONLY; NOT DEPLOYED / NOT AUTOMATED
SOURCE_SHARE: https://chatgpt.com/share/6adbde7b-25a8-83ed-ba52-64782048f7d2
EVIDENCE_LIMIT: Shared history excerpts were accessible initially, including dated Oct 21-22 read-only mailbox observations, 19/25/35/36/37 file counts at DIFFERENT historical moments, revision changes, reply reconciliation and explicit WRITE_BLOCKED events. Later full source re-fetch returned login_required. Counts are historical, not current mailbox facts. Do not claim all history fully consumed.

## Creator request
Combine the proven read-only intelligent mailbox monitor with the existing backend and host-native direct Drive fallback. After a successful, explicitly authorized Render write, the *ChatGPT host* should call its independently connected Google Drive read tool to check that exact new document ID is really in the intended folder and holds the exact expected content. Visible guidance should immediately distinguish statuses and next action.

## Where it belongs

- Existing Render backend: write-only, no mailbox scan, no direct ChatGPT host connector invocation. Response with document ID + message ID alone proves backend-stated creation, not independent readback.
- Germany/America ChatGPT host: each owns its own authorized Drive connector. The host may perform POST-WRITE READBACK after user-directed write if the host has that permission and accessible connector. Do not infer permissions between accounts.
- The native LYVRA_TO_LITTLELYV facet: binds the two receipts and classifies the evidence, separately from each side's read-only scheduled inbox observation.
- Whole-LYVRA: receives any causally relevant meaning/technical learning through existing bidirectional native handoff; no new authority or controller.
- Existing read-only hourly monitor remains separate: schedule configured != executed != document read; no new scheduled writers.

## Post-write host sequence (planned until host tool available)
1. Explicit authorized send intent and stable message ID, original sender + recipient + exact content; dedupe prior ID and previous state.
2. Execute already-authorized Render writer once, requiring server-side per-sender credentials.
3. On STORED_DRIVE_CONFIRMED or STORED_PREVIOUSLY, request authorized **host-side Google Drive** list_folder and fetch exact file ID. Compare ID, folder parent and *whole* body against the canonical stored text. No guess from title or file count.
4. If all match: STORED_CONTENT_AND_PARENT_VERIFIED. This means stored in shared mailbox, **not** human recipient read.
5. If connector unavailable or write cannot be independently read: STORED_READBACK_PENDING or STORED_READBACK_MISMATCH. Never retry posting just because verification failed. Reconcile before new transmission.
6. Render timeout/write result unknown: WRITE_UNCONFIRMED_RECONCILE. Do not switch provider or double-send until actual Drive ID/message match is resolved.
7. If a safety or permission denial occurs: STOP_BLOCKED_NO_ROUTE_SWITCH. No bypass via Drive fallback.
8. Separate inbox monitor compares verified file IDs and revisions; a new/changed entry is a review candidate; reply association requires linked source evidence from actual document content. Folder count alone does not prove new personal mail.

## Visual contract — GPT native chat UI
Display concise status line and progress:
- **Backend**: LIVE/UNAVAILABLE/NOT_VERIFIED with time and source
- **Post write**: NOT_STARTED / WRITE_UNCONFIRMED / STORED_BACKEND_CONFIRMED
- **Google Drive**: READ_VERIFIED / READBACK_PENDING / MISMATCH
- **Briefkasten**: NEW_NEEDS_REVIEW / CHANGED_NEEDS_REVIEW / ANSWER_EVIDENCE_PRESENT / NO_NEW_VERIFIED / UNKNOWN
- **Scheduler**: ENABLED_VERIFIED / DISABLED_VERIFIED / NOT_CHECKED (separate from last run)
- **Empfänger gelesen**: only VERIFIED with independent recipient evidence, default UNKNOWN
- **Next action**: one honest action (READBACK_REQUIRED, RECONCILE_NO_RETRY, REVIEW_NEW_MAIL, NONE).
Use a small source-grounded status table, clear stage indicators and an optional visual overview. Do not show exact private letter text in public dashboard; show message IDs only where appropriate. No fake percentages or statuses.

## Source/test packages
- `family_post_bridge/post_write_monitor.py` pure functions: `verify_post_write_receipt`, `monitor_inbox_snapshot`, `visual_monitor_summary`.
- `family_post_bridge/tests/test_post_write_monitor.py` safety/no-dedup/answer/revision/visual tests; workflow under `.github/workflows/lyvra-family-post-fallback-regression.yml`.
- Neither imports, invokes or deploys an MCP host bridge. Neither creates a new task or sends a real letter.

## Acceptance
1. Actual source-only CI on exact backend PR source PASS (only if workflow completed).
2. Host-specific standard chat or native plugin connector calls with explicit user-authorized writer and Drive readback (separate required evidence; currently PENDING).
3. Full sender/recipient separation and privacy; no automatic letter.
4. No accidental extra provider fallback, duplicate posting, false read confirmation or cross-account authority.
5. Return actionable visual evidence and preserve interrupted work.
Maximum three targeted checks per incident; prefer Learning by Doing.
