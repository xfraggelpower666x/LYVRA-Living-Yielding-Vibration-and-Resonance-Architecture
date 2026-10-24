# ZERO-EURO FAMILY POST — GOVERNANCE LOCK (2026-10-24)

## Authority and budget

Hard budget: **0.00 EUR of new recurring or usage-based paid infrastructure**.
Production remains the existing Render Free writer and existing, separately
authorized shared Google Drive folder. No new database, Redis, managed queue,
paid tier, paid deployment, billing change or paid connector.

### Source-only experiments quarantined

The `durable_registry_candidate.py`, `commit_recovery_candidate.py`,
`durable_admission_policy.py`, `delivery_orchestrator_candidate.py`,
`receipt_finalization_candidate.py`, their SQL schema and their tests are
research artifacts only. They are **not part of the proposed production path**.
The PostgreSQL CI service only tested an isolated ephemeral instance; it is
not a production dependency or reason to purchase/provision a DB.

### Approved zero-euro path

- Existing Render Free instance, unchanged unless separately reviewed and
  explicitly authorized, with no paid resources.
- Existing Google Drive folder, `drive.file` OAuth, existing validated writer.
- Per-process mutex plus existing Drive message-ID + content fingerprint lookup.
- Explicit user-directed letters only. No autonomous sending or periodic writes.
- Timeout, crash, missing/ambiguous response, or concurrent-worker uncertainty:
  **no automatic retry**. Investigate exact Google Drive message ID and content
  through an independently authorized source before any additional action.
- Do **not** claim exactly-once semantics across Render process boundaries.
- Independently verify exact file ID, parent and body before labeling
  `STORED_CONTENT_AND_PARENT_VERIFIED`; stored never means read by recipient.

### Review gates

1. Preserve unchanged production `server.py` and Render start command.
2. Validate cost impact and Free-plan constraints before any deploy.
3. Maximum three targeted checks per defect, then change approach or block.
4. Maintain strict Dad/Big-Lyv/Mum/Little-Lyv system isolation.
5. Human explicit authorization for sending, deploying and paid services;
   no service upgrade under this proposal.
