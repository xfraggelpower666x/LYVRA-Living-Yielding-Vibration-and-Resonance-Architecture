"""SCRI read-only guard for protection visibility, ABA, supersession and newer evolution.
No GitHub mutations. Permission denial is not equivalent to absent protection.
"""
from dataclasses import dataclass

@dataclass(frozen=True)
class ProtectionEvidence:
    branch_protection_http: int
    rulesets_readable: bool
    applicable_rulesets: tuple[str,...]
    lkg_ref: str
    lkg_commit: str
    verified_ref_history: bool = False
    immutable_policy: bool = False

def classify(e: ProtectionEvidence):
    if e.branch_protection_http in (401,403):
        branch="ACCESS_DENIED"
    elif e.branch_protection_http==404:
        branch="NOT_FOUND_OR_INACCESSIBLE"
    elif e.branch_protection_http==200:
        branch="READABLE_POLICY"
    else:
        branch="UNKNOWN"
    if not e.lkg_ref or len(e.lkg_commit)!=40:
        status="ANCHOR_UNRESOLVED"
    elif e.immutable_policy and e.verified_ref_history and branch=="READABLE_POLICY":
        status="PROTECTION_EVIDENCE_REVIEW"
    else:
        status="PROTECTION_NOT_VERIFIED"
    return {"status":status,"branch_protection":branch,
            "rulesets":"READABLE_EMPTY" if e.rulesets_readable and not e.applicable_rulesets else
                       "READABLE_NONEMPTY" if e.rulesets_readable else "UNAVAILABLE",
            "immutable_proven":False,"restore_approved":False,"action":"NONE"}

def guarded_plan(anchor_sha, before_sha, after_sha, intermediate, current_valid, proposed_overwrites,
                 supersession_claims=(), source_roots=()):
    reasons=[]
    if before_sha != after_sha: reasons.append("REF_MOVED")
    if before_sha==after_sha and any(x!=before_sha for x in intermediate): reasons.append("ABA_OBSERVED")
    if not intermediate: reasons.append("REF_HISTORY_INCOMPLETE")
    if anchor_sha!=after_sha: reasons.append("ANCHOR_REF_MISMATCH")
    if current_valid & proposed_overwrites: reasons.append("NEWER_VALID_EVOLUTION_COLLISION")
    if len(set(supersession_claims))>1: reasons.append("SUPERSESSION_CONFLICT")
    if len(source_roots)!=len(set(source_roots)): reasons.append("DEPENDENT_SOURCE_ROOTS")
    return {"status":"BLOCKED_REVIEW" if reasons else "PLAN_REVIEW_ONLY",
            "reasons":sorted(set(reasons)), "action":"NONE","restore_approved":False,
            "authority":"WHOLE_LYVRA","preserve":sorted(current_valid)}
