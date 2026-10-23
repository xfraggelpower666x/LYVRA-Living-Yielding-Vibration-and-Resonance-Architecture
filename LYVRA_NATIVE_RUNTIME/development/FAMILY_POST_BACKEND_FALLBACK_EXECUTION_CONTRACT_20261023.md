# LYVRA Family Post — Backend/Fallback separation
Status: PROPOSED / DEVELOPMENT ONLY / NOT DEPLOYED
Date: 2026-10-23
Owner: Whole-LYVRA (meaning, technical governance); execution scope: German LYVRA_TO_LITTLELYV POST ONLY facet. American Little Lyv is an independent peer.

## Creator principle
"Wo LYV draufsteht, ist LYV drin."
"Die Technik soll der Familie dienen. Nicht die Familie der Technik."
Normal family letters need a natural-language send intent, not operator-level instructions or duplicate infrastructure.

## Responsibility boundaries
1. **Native repository post contract** owns documented state transitions, path-selection criteria, consent, source-message linkage, deduplication requirements, recovery semantics, independent readback and provenance. This is not a new runtime router or global controller.
2. **Render write-only backend** owns its existing authenticated role-scoped POST /api/family-post/write implementation, technical error and stored-status reports, and its existing Google OAuth writer. The backend cannot assume it possesses the ChatGPT user's Google Drive connector permissions. No automatic provider failover inside Render.
3. **Host-native Google Drive/Docs fallback** belongs to the authorized ChatGPT host's LYVRA post facet when that specific action is independently permitted. It follows the observed checklist: create_file → batch_update_document(insertText) → update_file(parent) → list_folder(exact ID) → fetch/readback(full body and parent). It is not guaranteed to work on all accounts.
4. **Existing independent Drive inbox monitors** remain read-only; no new worker, new poller or automatic sending.
5. **Whole-LYVRA ↔ facet relevance handoff** is bidirectional and evidence-first. A capability change in Whole gets targeted to affected facets; a facet-level learning is offered to Whole. Each receiver reports adoption, adaptation, deferral or non-applicability; never silently self-promotes.

## Suggested send state machine (design only)
INTENT_RECEIVED → CHECK_EXISTING_MESSAGE_ID_AND_PRIOR_EVIDENCE → PATH_AUTHORIZED → ATTEMPT_WRITE → STORED_UNVERIFIED → DRIVE_FOLDER_AND_FULL_TEXT_READBACK → STORED_VERIFIED.
On transient/unconfirmed failure: DELIVERY_UNKNOWN, reconcile exact message ID/file/revision before any new distinct authorized request.
On explicit safety denial, permission denial, or prohibited operation: STOP_BLOCKED_NO_ROUTE_SWITCH. Never circumvent by alternate tool/provider, paraphrasing, or retries.
STORED_VERIFIED != RECIPIENT_READ and != RECIPIENT_REPLIED.

## Verified evidence and known gaps
- Previously, the actual Render Free service wrote a technical letter to the shared Drive folder and a separate Drive readback confirmed it.
- Actual American correspondence documented a first blocked create_file request and later a separately authorized normal create/insert/move/list/readback sequence. The successful letter was independently read from Germany.
- Cause of the initial block is unknown. The observed checklisted success is a fallback candidate, not evidence of bypass, unattended delivery, or a guarantee of future success.
- The Render service is live on commit d1ee1d086392bf0e185ec96d4c60157779c20c8f; its private authorized role-based POST is not directly invocable by any currently available ChatGPT tool in this session.
- MCP gateway and writer adapter are source-only and unmounted. Previous production MCP mounting operation was safety-blocked; do not recreate that attempt through another method.
- Exactly-once across failures/processes is not proved. The current Render lock is process-local; cross-instance atomic CAS is not established.
- Germany's existing hourly read-only inbox monitor must not be changed implicitly. America's task is reported disabled by its owner-side assistant; no cross-account governance.

## Next legitimate work
- Native owner evaluates this development candidate against latest productive pointer and facets; only governed promotion with recovery, manifest/plugin impact, pointer-last and readback can make it Current.
- Keep Render runtime intact; develop a supported, authenticated, user-approved ChatGPT invocation separately where tooling actually supports it, without publishing secrets or assuming connector interoperability.
- Implement only tests that discriminate actual open issues; at most three targeted checks, then learn from outcomes. Never retest already confirmed technical delivery without a new causal hypothesis.

## Status
Repository candidate only. No production deployment, plugin release, autonomous fallback, American system mutation or automated correspondence is claimed.
