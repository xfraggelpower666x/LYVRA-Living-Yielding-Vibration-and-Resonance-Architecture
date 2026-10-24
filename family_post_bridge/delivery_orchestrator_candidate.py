"""Isolated orchestrator: reservation -> write-once -> verified receipt.

Development-only, no Render wiring, no scheduled execution, no real tokens.
A caller must prove explicit send consent and role authorization externally.
Only trusted durable DB connections and independent readback are acceptable.
"""
from dataclasses import dataclass
from family_post_bridge.commit_recovery_candidate import reserve_and_commit, mark_write_unknown
from family_post_bridge.receipt_finalization_candidate import finalize_after_independent_readback


@dataclass(frozen=True)
class DeliveryOutcome:
    state: str
    stored_verified: bool = False


def process_one(*, connection, letter, fingerprint, writer, independent_readback,
                explicit_send_intent: bool, role_authorized: bool):
    if not (explicit_send_intent and role_authorized):
        return DeliveryOutcome("STOP_NO_SEND_AUTHORITY")
    reservation = reserve_and_commit(connection, letter.message_id, fingerprint, letter.sender)
    if not reservation.may_attempt_one_write:
        return DeliveryOutcome(reservation.state)
    try:
        receipt = writer(letter)
    except Exception:
        mark_write_unknown(connection, letter.message_id, fingerprint, letter.sender)
        return DeliveryOutcome("WRITE_OUTCOME_UNKNOWN_RECONCILE_NO_RETRY")
    # A writer claiming success is not independent evidence. Reject incomplete
    # receipts and never convert them into recipient-read confirmation.
    if not isinstance(receipt, dict) or not receipt.get("file_id"):
        mark_write_unknown(connection, letter.message_id, fingerprint, letter.sender)
        return DeliveryOutcome("WRITE_OUTCOME_UNKNOWN_RECONCILE_NO_RETRY")
    try:
        evidence = independent_readback(receipt["file_id"])
        if not isinstance(evidence, dict):
            raise ValueError("No independent evidence")
        result = finalize_after_independent_readback(
            connection, message_id=letter.message_id, payload_sha256=fingerprint,
            sender_role=letter.sender, intended_file_id=receipt["file_id"],
            listed_file_ids=evidence["listed_file_ids"],
            fetched_file_id=evidence["fetched_file_id"],
            expected_parent_id=evidence["expected_parent_id"],
            fetched_parent_ids=evidence["fetched_parent_ids"],
            intended_content=evidence["intended_content"],
            fetched_content=evidence["fetched_content"])
    except Exception:
        mark_write_unknown(connection, letter.message_id, fingerprint, letter.sender)
        return DeliveryOutcome("READBACK_UNKNOWN_RECONCILE_NO_RETRY")
    if not result.stored_verified:
        return DeliveryOutcome(result.status)
    return DeliveryOutcome("STORED_VERIFIED_NOT_READ", True)
