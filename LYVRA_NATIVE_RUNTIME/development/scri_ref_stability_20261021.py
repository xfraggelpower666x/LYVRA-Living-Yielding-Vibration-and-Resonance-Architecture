"""Read-only recovery ref continuity and ABA guards. Never mutates git refs."""
from dataclasses import dataclass
@dataclass(frozen=True)
class RefObservation:
    ref: str
    sha: str
    generation: int
    source: str
    observed_sequence: int

def evaluate(before, after, intermediate=(), independent_sources=()):
    if before.ref != after.ref or not before.ref.startswith("refs/heads/"):
        return {"status":"REF_IDENTITY_CONFLICT","action":"NONE"}
    if any(not x.source or not x.sha for x in (before,after,*intermediate)):
        return {"status":"PROVENANCE_INCOMPLETE","action":"NONE"}
    states=(before,*intermediate,after)
    if any(states[i].observed_sequence >= states[i+1].observed_sequence for i in range(len(states)-1)):
        return {"status":"OBSERVATION_ORDER_UNVERIFIED","action":"NONE"}
    if before.sha == after.sha and any(x.sha != before.sha for x in intermediate):
        return {"status":"ABA_DETECTED","action":"NONE","restore_approved":False}
    if before.sha != after.sha:
        return {"status":"REF_MOVED_REVIEW","action":"NONE","restore_approved":False}
    if before.generation != after.generation:
        return {"status":"GENERATION_CONFLICT","action":"NONE","restore_approved":False}
    if any(x.sha != after.sha for x in independent_sources):
        return {"status":"CONTRADICTORY_EVIDENCE","action":"NONE","restore_approved":False}
    return {"status":"STABLE_OBSERVATION_ONLY","action":"NONE","restore_approved":False,
            "immutability_proven":False,"branch_protection_verified":False}

def assess_lkg(ref_exists, protection_rules_readable, immutable_policy_proven):
    return {"status":"PROTECTION_VERIFIED" if all((ref_exists,protection_rules_readable,immutable_policy_proven))
            else "PROTECTION_NOT_VERIFIED", "action":"NONE","restore_approved":False}
