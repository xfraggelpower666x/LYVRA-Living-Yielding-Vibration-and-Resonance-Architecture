"""Pure intelligent family-post monitor and post-write readback evaluator.

Development candidate. This module never calls Google, Render, or ChatGPT.
The independently authorized host must provide exact connector observations.
It does not infer unread human mail from metadata or trigger automatic sending.
"""
from collections import Counter
from typing import Any

from family_post_bridge.fallback_decision import evaluate_exact_drive_readback


def verify_post_write_receipt(
    *,
    backend_response: dict[str, Any] | None,
    expected_message_id: str,
    expected_file_id: str | None,
    expected_parent_id: str,
    expected_content: str,
    drive_listing: list[dict[str, Any]] | None,
    drive_document: dict[str, Any] | None,
    connector_read_confirmed: bool,
) -> dict[str, Any]:
    """Derive a receipt from a backend write and independent Drive read.

    Backend and Drive permissions are separate. The host must make the
    connector calls itself after a permitted, user-directed write. A timeout
    cannot be treated as a clean no-write result or cause an automatic resend.
    Content is compared exactly; callers must supply the canonical expected
    stored body including any sender/recipient headers used by the writer.
    """
    response = backend_response or {}
    state = response.get("state")
    reported_file = response.get("file_id")
    reported_message = response.get("message_id")
    if state not in ("STORED_DRIVE_CONFIRMED", "STORED_PREVIOUSLY"):
        return {"state": "WRITE_UNCONFIRMED_RECONCILE", "read_confirmed": False}
    if not expected_message_id or reported_message != expected_message_id:
        return {"state": "RECEIPT_MESSAGE_ID_CONFLICT", "read_confirmed": False}
    if not reported_file or (expected_file_id and expected_file_id != reported_file):
        return {"state": "RECEIPT_FILE_ID_CONFLICT", "read_confirmed": False}
    if not connector_read_confirmed or drive_listing is None or drive_document is None:
        return {"state": "STORED_READBACK_PENDING", "read_confirmed": False, "file_id": reported_file}

    doc_id = drive_document.get("id", "")
    parent_ids = drive_document.get("parents", [])
    body = drive_document.get("content", "")
    ids = [item.get("id") for item in drive_listing if isinstance(item, dict)]
    verified = evaluate_exact_drive_readback(
        intended_file_id=reported_file,
        listed_file_ids=ids,
        fetched_file_id=doc_id,
        expected_parent_id=expected_parent_id,
        fetched_parent_ids=parent_ids if isinstance(parent_ids, list) else [],
        intended_content=expected_content,
        fetched_content=body,
    )
    if verified != "STORED_CONTENT_AND_PARENT_VERIFIED":
        return {"state": "STORED_READBACK_MISMATCH", "read_confirmed": False, "file_id": reported_file}
    return {
        "state": "STORED_CONTENT_AND_PARENT_VERIFIED",
        "read_confirmed": True,
        "file_id": reported_file,
        "recipient_read_confirmed": False,
    }


def monitor_inbox_snapshot(
    *,
    entries: list[dict[str, Any]],
    known_revisions: dict[str, str] | None = None,
    answered_source_ids: set[str] | None = None,
    source_link_evidence: dict[str, str] | None = None,
    listing_verified: bool,
) -> dict[str, Any]:
    """Classify new/changed candidates and evidenced replies, read-only.

    source_link_evidence: mapping answer document file ID -> verified source
    document file ID from its full content. The caller is responsible for
    independently checking that link; a title-only guess is invalid.
    """
    if not listing_verified:
        return {"state": "READBACK_PENDING", "folder_count": None, "items": []}
    known_revisions = known_revisions or {}
    answered_source_ids = set(answered_source_ids or ())
    source_link_evidence = source_link_evidence or {}
    counts = Counter(e.get("message_id") for e in entries if e.get("message_id"))
    evidence_targets = set(source_link_evidence.values()) | answered_source_ids
    items = []
    for entry in entries:
        file_id = entry.get("file_id")
        rev = entry.get("revision")
        mid = entry.get("message_id")
        incoming = entry.get("is_incoming")
        if not file_id or incoming not in (True, False):
            state = "NEEDS_METADATA_REVIEW"
        elif incoming is False:
            state = "OUTGOING_NOT_INBOX"
        elif mid and counts[mid] > 1:
            state = "DUPLICATE_ID_REVIEW"
        elif file_id in evidence_targets:
            state = "ANSWER_EVIDENCE_PRESENT"
        elif file_id in known_revisions and rev and known_revisions[file_id] == rev:
            state = "UNCHANGED_PREVIOUSLY_REVIEWED"
        elif file_id in known_revisions:
            state = "CHANGED_NEEDS_REVIEW"
        else:
            state = "NEW_NEEDS_REVIEW"
        items.append({"file_id": file_id, "revision": rev, "state": state})
    return {"state": "READ_VERIFIED", "folder_count": len(entries), "items": items}


def visual_monitor_summary(
    receipt_state: str,
    inbox_state: str,
    *,
    scheduler_state: str = "NOT_CHECKED",
) -> dict[str, Any]:
    """UI-facing verified status, never a claim of recipient reading.

    No green 'delivered' status from mere API success. Scheduling activation,
    latest task run, storage verification and actual human reading are distinct.
    """
    return {
        "storage": receipt_state,
        "mailbox": inbox_state,
        "scheduler": scheduler_state,
        "recipient_read": "NOT_VERIFIED",
        "next_action": (
            "READBACK_REQUIRED" if receipt_state == "STORED_READBACK_PENDING"
            else "RECONCILE_NO_RETRY" if receipt_state in (
                "WRITE_UNCONFIRMED_RECONCILE", "STORED_READBACK_MISMATCH"
            )
            else "REVIEW_NEW_MAIL" if inbox_state == "READ_VERIFIED"
            else "CHECK_AUTHORIZED_CONNECTOR"
        ),
    }
