"""Read-only SCRI ten-slot recovery planning model. No git mutations or restore."""
from dataclasses import dataclass
from typing import Optional

@dataclass(frozen=True)
class Snapshot:
    anchor: str
    verified: bool
    generation: int
    facets: frozenset[str]
    revision: int
    superseded: bool = False

@dataclass(frozen=True)
class Ring:
    slots: tuple[Optional[Snapshot], ...]
    last_known_good: Optional[Snapshot]

    def __post_init__(self):
        if len(self.slots) != 10:
            raise ValueError("exactly ten rotating slots required")

def plan_rotation(ring: Ring, proposed: Snapshot, current_revision: int):
    """Compute an immutable hypothetical ring. Never change real refs."""
    if not proposed.verified or proposed.superseded or proposed.revision > current_revision:
        return {"status": "REVIEW", "reason": "unverified, superseded or future anchor", "ring": ring, "action": "NONE"}
    idx = proposed.generation % 10
    candidate = list(ring.slots)
    prior = candidate[idx]
    if prior and prior.generation >= proposed.generation:
        return {"status": "BLOCKED", "reason": "slot holds equally new or newer generation", "ring": ring, "action": "NONE"}
    candidate[idx] = proposed
    return {"status": "PLAN_ONLY", "slot": idx, "ring": Ring(tuple(candidate), ring.last_known_good), "action": "NONE"}

def plan_selective_restore(ring: Ring, anchor: Snapshot, affected: frozenset[str],
                           protected: frozenset[str], current_revision: int,
                           evidence_conflict: bool = False, supersession_proven: bool = False):
    """Never approve actual restore; only expose constraints for human/native review."""
    reasons = []
    known = anchor in ring.slots or anchor == ring.last_known_good
    if not known: reasons.append("ANCHOR_UNREGISTERED")
    if not anchor.verified: reasons.append("ANCHOR_UNVERIFIED")
    if anchor.superseded: reasons.append("ANCHOR_SUPERSEDED")
    if anchor.revision < current_revision and not supersession_proven:
        reasons.append("NEWER_VALID_EVOLUTION_NOT_EVALUATED")
    if evidence_conflict: reasons.append("EVIDENCE_CONFLICT")
    if not affected or not affected.issubset(anchor.facets): reasons.append("SCOPE_NOT_GROUNDED")
    if affected & protected: reasons.append("PROTECTED_FACET_COLLISION")
    return {"status": "BLOCKED_REVIEW" if reasons else "SELECTIVE_PLAN_REVIEW",
            "reasons": reasons, "affected": sorted(affected),
            "preserve": sorted(protected), "source_anchor": anchor.anchor,
            "authority": "WHOLE_LYVRA", "automatic_repair": False,
            "restore_approved": False, "action": "NONE"}
