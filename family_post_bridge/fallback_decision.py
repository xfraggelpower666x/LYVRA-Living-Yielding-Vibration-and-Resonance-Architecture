"""Pure host-side family-post route eligibility, development candidate only.

No network access, no tokens, no sending, no scheduled execution, no MCP.
Does not override the existing Render API or any platform safety decision.
A returned ELIGIBLE means only that a host may consider a separately
permitted user-initiated Google Drive action. It is not authorization itself.
"""
from dataclasses import dataclass
from typing import Literal

PrimaryState = Literal[
    "NOT_ATTEMPTED", "UNAVAILABLE_BEFORE_ATTEMPT",
    "NO_WRITE_CONFIRMED", "DELIVERY_UNKNOWN",
    "STORED_CONFIRMED", "SAFETY_DENIED", "PERMISSION_DENIED",
]
PriorMessage = Literal["ABSENT_VERIFIED", "PRESENT_VERIFIED", "UNKNOWN"]


@dataclass(frozen=True)
class RouteDecision:
    state: str
    reason: str
    can_execute: bool = False


def evaluate_direct_drive_candidate(
    *,
    primary_state: PrimaryState,
    explicit_user_send_intent: bool,
    independent_drive_permission: bool,
    prior_message: PriorMessage,
) -> RouteDecision:
    """Conservatively determine whether direct-Drive may be considered.

    In particular: alternative transports are not a workaround for a denial.
    Unknown delivery/prior-message state always requires reconciliation first.
    """
    if primary_state in ("SAFETY_DENIED", "PERMISSION_DENIED"):
        return RouteDecision("STOP_DENIED", "Respect original denial; no provider switch")
    if not explicit_user_send_intent:
        return RouteDecision("STOP_NO_SEND_INTENT", "No unattended outgoing correspondence")
    if primary_state == "STORED_CONFIRMED":
        return RouteDecision("STOP_ALREADY_STORED", "Never create an unnecessary duplicate")
    if primary_state == "DELIVERY_UNKNOWN":
        return RouteDecision("RECONCILE_DELIVERY_FIRST", "Check exact ID and content before retry")
    if prior_message == "PRESENT_VERIFIED":
        return RouteDecision("STOP_DUPLICATE", "Prior message already verified")
    if prior_message == "UNKNOWN":
        return RouteDecision("RECONCILE_PRIOR_MESSAGE_FIRST", "Do not infer absence from missing data")
    if not independent_drive_permission:
        return RouteDecision("STOP_NO_DRIVE_PERMISSION", "Host must independently authorize Drive")
    if primary_state not in (
        "NOT_ATTEMPTED", "UNAVAILABLE_BEFORE_ATTEMPT", "NO_WRITE_CONFIRMED"
    ):
        return RouteDecision("STOP_INVALID_EVIDENCE", "Unrecognized primary state")
    return RouteDecision(
        "DIRECT_DRIVE_CANDIDATE",
        "Explicit separate host authorization and full content/parent readback required",
        can_execute=False,
    )


def verified_storage_status(
    *,
    exact_file_id_in_folder: bool,
    content_full_readback: bool,
    expected_parent_confirmed: bool,
) -> str:
    """Store success requires three independent pieces of matching evidence."""
    if exact_file_id_in_folder and content_full_readback and expected_parent_confirmed:
        return "STORED_CONTENT_AND_PARENT_VERIFIED"
    return "STORAGE_UNVERIFIED"
