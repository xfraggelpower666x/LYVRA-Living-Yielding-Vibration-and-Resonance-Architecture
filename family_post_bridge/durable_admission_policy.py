"""Fail-closed family-post idempotency admission policy.

Pure decisions only: NO CAS implementation, Drive calls or authorization.
The caller must obtain trusted durable transaction evidence. Never treat a
missing/expired lock, timeout or unknown result as verified absence.
"""
from dataclasses import dataclass
from typing import Literal

Evidence = Literal[
    "NO_DURABLE_COORDINATOR",
    "UNKNOWN",
    "ACTIVE_SAME",
    "ACTIVE_DIFFERENT",
    "COMMITTED_SAME",
    "COMMITTED_DIFFERENT",
    "ABSENT_ATOMICALLY_RESERVED",
]


@dataclass(frozen=True)
class Admission:
    state: str
    may_create: bool
    needs_reconcile: bool


def decide_write(*, evidence: Evidence, explicit_send_intent: bool,
                 role_authorized: bool, durable_coordinator_verified: bool) -> Admission:
    """Only an actual durable atomic reservation permits initial creation.

    Caller must not convert an ordinary Drive list result or an in-process
    mutex into ABSENT_ATOMICALLY_RESERVED. Returned admission is not
    sufficient for sending: original host permission and policies still apply.
    """
    if not explicit_send_intent or not role_authorized:
        return Admission("STOP_UNAUTHORIZED_OR_UNREQUESTED", False, False)
    if not durable_coordinator_verified:
        return Admission("BLOCK_NO_DURABLE_COORDINATOR", False, True)
    if evidence == "COMMITTED_SAME":
        return Admission("RETURN_PREVIOUS_RECEIPT_ONLY", False, False)
    if evidence in ("ACTIVE_DIFFERENT", "COMMITTED_DIFFERENT"):
        return Admission("STOP_PAYLOAD_CONFLICT", False, False)
    if evidence in ("ACTIVE_SAME", "UNKNOWN", "NO_DURABLE_COORDINATOR"):
        return Admission("RECONCILE_NO_RETRY", False, True)
    if evidence == "ABSENT_ATOMICALLY_RESERVED":
        return Admission("RESERVED_WRITE_ONCE", True, False)
    return Admission("BLOCK_UNKNOWN_EVIDENCE", False, True)
