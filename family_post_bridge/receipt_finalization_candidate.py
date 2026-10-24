"""Evidence-gated receipt finalization for the source-only registry candidate.

No Drive access, no DB provisioning, no automatic message writing. Caller
provides independent verified Drive evidence and an authorized DB transaction.
"""
from dataclasses import dataclass
from family_post_bridge.fallback_decision import evaluate_exact_drive_readback

FINALIZE_SQL = """
UPDATE family_post_delivery_registry
SET delivery_state='STORED_VERIFIED', drive_file_id=%s, updated_at=now()
WHERE message_id=%s AND payload_sha256=%s AND sender_role=%s
  AND delivery_state IN ('RESERVED','WRITE_UNKNOWN')
  AND drive_file_id IS NULL
"""

@dataclass(frozen=True)
class Finalization:
    status: str
    stored_verified: bool = False


def finalize_after_independent_readback(
    connection, *, message_id, payload_sha256, sender_role,
    intended_file_id, listed_file_ids, fetched_file_id,
    expected_parent_id, fetched_parent_ids, intended_content, fetched_content,
):
    evidence = evaluate_exact_drive_readback(
        intended_file_id=intended_file_id,
        listed_file_ids=listed_file_ids,
        fetched_file_id=fetched_file_id,
        expected_parent_id=expected_parent_id,
        fetched_parent_ids=fetched_parent_ids,
        intended_content=intended_content,
        fetched_content=fetched_content,
    )
    if evidence != "STORED_CONTENT_AND_PARENT_VERIFIED":
        return Finalization("RECONCILE_INDEPENDENT_READBACK_REQUIRED")
    try:
        cursor = connection.cursor()
        cursor.execute(FINALIZE_SQL, (
            intended_file_id, message_id, payload_sha256, sender_role,
        ))
        changed = cursor.rowcount
        if changed != 1:
            connection.rollback()
            return Finalization("CONFLICT_OR_ALREADY_FINALIZED_READBACK_REQUIRED")
        connection.commit()
    except Exception:
        try:
            connection.rollback()
        except Exception:
            pass
        return Finalization("COMMIT_UNKNOWN_RECONCILE_NO_RETRY")
    return Finalization("STORED_CONTENT_AND_PARENT_VERIFIED", True)
