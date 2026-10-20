"""SCRI end-to-end integration fixture; read-only, no recovery writes.
All evidence, source roots and revision freshness are simulated fixtures, not real verification.
"""
from dataclasses import dataclass
from scri_evidence_hardening_20261020 import Memory, Record, assess
from scri_context_reconstruction_20261020 import Experience, Situation, reconstruct

@dataclass(frozen=True)
class Case:
    revision: str
    memories: tuple[Memory, ...]
    evidence: tuple[Record, ...]
    experiences: tuple[Experience, ...]
    situation: Situation

def run_chain(case: Case):
    investigation = assess(case.memories, case.evidence, case.revision)
    eligible = set(investigation["candidates"])
    contextual = []
    for history in case.experiences:
        reconstruction = reconstruct(history, case.situation)
        if history.hypothesis in eligible and reconstruction["status"] == "INVESTIGATE_ONLY":
            contextual.append({"hypothesis": history.hypothesis, "historical_id": history.id,
                              "origin": history.origin, "reason": reconstruction["reason"],
                              "relation": reconstruction["new_relations"],
                              "source_roots": investigation["support_roots"].get(history.hypothesis, [])})
    hypotheses = sorted({entry["hypothesis"] for entry in contextual})
    if investigation["status"] == "EVIDENCE_CONFLICT":
        status = "EVIDENCE_CONFLICT_REVIEW"
    elif not hypotheses:
        status = "INSUFFICIENT_EVIDENCE"
    elif len(hypotheses) > 1:
        status = "MULTIPLE_HYPOTHESES_REVIEW"
    else:
        status = "INVESTIGATE_ONLY"
    return {"status": status, "candidates": hypotheses, "reconstruction": contextual,
            "evidence_audit": investigation, "automatic_repair": False, "rollback": False,
            "identity_authority": "WHOLE_LYVRA",
            "recovery_basis": "PRESERVE_CAUSAL_SELECTIVE_RECOVERY",
            "runtime_verified": False}

def example_case():
    m = Memory("historical-relation", "simulated-reflection", "rev-2",
               "initial component diagnosis contradicted by relation evidence",
               frozenset({"relation_fault"}))
    e = Experience("exp-relation", "simulated-reflection",
                   frozenset({"symptom", "component_pass", "relation_diff"}),
                   "relation_fault", ("fixture-evidence",), frozenset({"component_fail"}),
                   "component_fault", "new evidence falsified old component hypothesis",
                   "music_pipeline")
    return Case("rev-2", (m,), (Record("relation_observed", "root-R", "report-R",
                                      frozenset({"relation_fault"})),),
                (e,), Situation("music_pipeline", frozenset({"symptom", "component_pass", "relation_diff"})))
