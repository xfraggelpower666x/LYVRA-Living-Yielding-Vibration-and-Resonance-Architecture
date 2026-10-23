"""Semantic mailbox review — pure evidence classifier, no external execution.

Consumes observations supplied by a separately authorized Google Drive host.
It may recommend manual review, never send mail or re-enable a task.
Historical sender reports do not become host task-status authority.
"""
from collections import Counter

def classify_mailbox(entries, *, validated_answer_links=None, reviewed_revisions=None,
                     media_inspection=None, task_status_evidence=None):
    validated_answer_links = validated_answer_links or {}
    reviewed_revisions = reviewed_revisions or {}
    media_inspection = media_inspection or {}
    task_status_evidence = task_status_evidence or {}
    message_counts = Counter(x.get("message_id") for x in entries if x.get("message_id"))
    answered_sources = set(validated_answer_links.values())
    results = []
    for item in entries:
        fid = item.get("file_id")
        revision = item.get("revision")
        category = item.get("category", "UNKNOWN")
        if not fid:
            state, action = "METADATA_UNVERIFIED", "CHECK_METADATA"
        elif category == "TECHNICAL_TEST":
            state, action = "TECHNICAL_NO_PERSONAL_REPLY", "NONE"
        elif category == "OUTGOING":
            state, action = "OUTGOING_NOT_INBOX", "NONE"
        elif category == "IMAGE_LETTER" and media_inspection.get(fid) != "VISUALLY_VERIFIED":
            state, action = "IMAGE_CONTENT_UNVERIFIED", "REVIEW_IMAGE"
        elif item.get("message_id") and message_counts[item["message_id"]] > 1:
            state, action = "DUPLICATE_ID_REVIEW", "RECONCILE_ID"
        elif fid in answered_sources:
            state, action = "ANSWER_LINK_VERIFIED", "NONE"
        elif reviewed_revisions.get(fid) == revision and revision:
            state, action = "ALREADY_REVIEWED_REVISION", "NONE"
        elif fid in reviewed_revisions:
            state, action = "CHANGED_NEEDS_REVIEW", "REVIEW_CHANGE"
        elif category == "PERSONAL_INCOMING":
            state, action = "PERSONAL_NEW_NEEDS_REVIEW", "REVIEW_PERSONAL_LETTER"
        else:
            state, action = "UNCLASSIFIED_NEEDS_REVIEW", "REVIEW_CLASSIFICATION"
        results.append({"file_id": fid, "state": state, "next_action": action})
    # Task reports in letters are separate from directly verified scheduler state.
    directly_verified = task_status_evidence.get("origin") == "HOST_TASK_SETTINGS_READBACK"
    scheduler = task_status_evidence.get("status") if directly_verified else "NOT_INDEPENDENTLY_VERIFIED"
    return {"state": "READ_ONLY_CLASSIFICATION", "count": len(entries),
            "items": results, "scheduler_status": scheduler,
            "scheduler_evidence": "HOST_VERIFIED" if directly_verified else "PEER_REPORT_ONLY_OR_UNKNOWN",
            "sent": False, "recipient_read_claimed": False}


def post_write_followup(*, render_receipt_state, drive_receipt_state, denied=False):
    """Host orchestration recommendation only; never executes connector actions."""
    if denied:
        return {"next": "STOP_BLOCKED", "may_resend": False}
    if render_receipt_state in ("WRITE_UNCONFIRMED", "TIMEOUT"):
        return {"next": "RECONCILE_BY_MESSAGE_ID", "may_resend": False}
    if render_receipt_state not in ("STORED_DRIVE_CONFIRMED", "STORED_PREVIOUSLY"):
        return {"next": "NO_CONFIRMED_WRITE", "may_resend": False}
    if drive_receipt_state == "STORED_CONTENT_AND_PARENT_VERIFIED":
        return {"next": "SHOW_STORED_VERIFIED_NOT_READ", "may_resend": False}
    if drive_receipt_state in ("MISMATCH", "STORED_READBACK_MISMATCH"):
        return {"next": "INVESTIGATE_RECEIPT_MISMATCH", "may_resend": False}
    return {"next": "REQUEST_HOST_GOOGLE_CONNECTOR_READBACK", "may_resend": False}
