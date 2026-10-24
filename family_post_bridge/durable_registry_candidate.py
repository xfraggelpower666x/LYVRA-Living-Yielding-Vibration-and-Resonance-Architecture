"""Proposed transactional registry adapter, source-only, no DB connection.

Requires caller-supplied trusted PostgreSQL transaction with atomic unique key.
Does not authorize, call Drive, resolve UNKNOWN, or run automatically.
"""
from dataclasses import dataclass
import hmac

RESERVE_SQL = """
INSERT INTO family_post_delivery_registry
(message_id, payload_sha256, sender_role, delivery_state)
VALUES (%s, %s, %s, 'RESERVED')
ON CONFLICT (message_id) DO NOTHING
RETURNING message_id
"""
READ_SQL = """
SELECT payload_sha256, sender_role, delivery_state, drive_file_id
FROM family_post_delivery_registry WHERE message_id = %s
"""

@dataclass(frozen=True)
class ReservationResult:
    state: str
    can_attempt_once: bool = False


def reserve_one_transaction(cursor, message_id: str, fingerprint: str, sender_role: str):
    """Caller must commit successful INSERT before Drive side effect.

    A failed commit means UNKNOWN, not permission to write. Caller must treat
    transaction integrity and authorized server credentials as external gates.
    """
    cursor.execute(RESERVE_SQL, (message_id, fingerprint, sender_role))
    row = cursor.fetchone()
    if row:
        return ReservationResult("RESERVED_NEW_COMMIT_REQUIRED", False)
    cursor.execute(READ_SQL, (message_id,))
    prior = cursor.fetchone()
    if not prior:
        return ReservationResult("RECONCILE_UNKNOWN")
    prior_hash, prior_role, state, file_id = prior
    if (not hmac.compare_digest(prior_hash, fingerprint)
            or prior_role != sender_role):
        return ReservationResult("CONFLICT")
    if state == "STORED_VERIFIED" and file_id:
        return ReservationResult("RETURN_EXISTING_RECEIPT")
    return ReservationResult("RECONCILE_NO_RETRY")
