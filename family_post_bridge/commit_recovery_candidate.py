"""Commit-aware reservation protocol, source-only; no Google/Render/DB setup.

The caller supplies a real transactional connection; this module does not
perform a Drive write. A successful commit grants a one-shot reservation
receipt only. No retries if that receipt is lost or a write outcome is unknown.
"""
from dataclasses import dataclass
from family_post_bridge.durable_registry_candidate import reserve_one_transaction


@dataclass(frozen=True)
class CommittedReservation:
    state: str
    may_attempt_one_write: bool = False


def reserve_and_commit(connection, message_id: str, fingerprint: str, sender_role: str):
    """Perform one atomic DB reservation then commit before any external side effect.

    connection must implement cursor(), commit(), rollback(). Uncertain commit
    MUST return fail-closed, even if database persisted the reservation.
    Caller must not retry merely because it receives UNKNOWN.
    """
    try:
        cursor = connection.cursor()
        decision = reserve_one_transaction(cursor, message_id, fingerprint, sender_role)
        connection.commit()
    except Exception:
        try:
            connection.rollback()
        except Exception:
            pass
        return CommittedReservation("COMMIT_UNKNOWN_RECONCILE_NO_RETRY")
    if decision.state == "RESERVED_NEW_COMMIT_REQUIRED":
        return CommittedReservation("RESERVED_COMMITTED_ONCE", True)
    return CommittedReservation(decision.state)


def mark_write_unknown(connection, message_id: str, fingerprint: str, sender_role: str):
    """Record uncertain result; never mark stored or release reservation."""
    try:
        cursor = connection.cursor()
        cursor.execute(
            """UPDATE family_post_delivery_registry SET delivery_state='WRITE_UNKNOWN',
               updated_at=now() WHERE message_id=%s AND payload_sha256=%s
               AND sender_role=%s AND delivery_state='RESERVED'""",
            (message_id, fingerprint, sender_role),
        )
        changed = cursor.rowcount
        connection.commit()
    except Exception:
        try:
            connection.rollback()
        except Exception:
            pass
        return "UNKNOWN_PERSISTENCE_RECONCILE_NO_RETRY"
    return "WRITE_UNKNOWN_RECORDED" if changed == 1 else "STATE_NOT_CHANGED_RECONCILE"
