"""Read-only SCRI causal-experience learning model; no runtime/system mutations.

Experience is a conditional clue with provenance, not an executable repair rule.
A conflicting current observation abstains; a relevant counterexample lowers transfer.
"""
from dataclasses import dataclass

@dataclass(frozen=True)
class Experience:
    key: str
    origin: str
    context: frozenset[str]
    causal_relation: str
    evidence: tuple[str, ...]
    counterexamples: frozenset[str]
    revised_from: str | None = None

@dataclass(frozen=True)
class Situation:
    observed: frozenset[str]
    contradicted: frozenset[str] = frozenset()


def reconsider(experience: Experience, current: Situation) -> dict:
    """Rank relevance; never produce an automatic repair or override current evidence."""
    shared = experience.context & current.observed
    if not experience.origin or not experience.evidence:
        return {"status": "PROVENANCE_INCOMPLETE", "candidate": None, "why": "missing origin or evidence"}
    if current.contradicted & experience.context:
        return {"status": "COUNTEREVIDENCE", "candidate": None, "why": "current evidence contradicts historical conditions"}
    if current.observed & experience.counterexamples:
        return {"status": "COUNTEREXAMPLE_APPLIES", "candidate": None, "why": "stored counterexample is active"}
    if len(shared) < 2:
        return {"status": "INSUFFICIENT_RELEVANCE", "candidate": None, "why": "insufficient shared causal conditions"}
    return {"status": "INVESTIGATE_NOT_REPAIR", "candidate": experience.causal_relation,
            "why": "relevant historical relation; re-evaluate with current evidence",
            "origin": experience.origin, "evidence": experience.evidence, "shared_conditions": sorted(shared)}


def fixtures() -> None:
    learned = Experience(
        key="relation-mismatch-001", origin="hypothesis-revision-fixture-2026-10-20",
        context=frozenset({"studio_symptom", "studio_component_pass", "relation_disagreement"}),
        causal_relation="whole_track_relation_fault", evidence=("studio_component_test", "semantic_relation_diff"),
        counterexamples=frozenset({"studio_component_failure"}), revised_from="studio2_fault",
    )
    assert reconsider(learned, Situation(frozenset({"studio_symptom", "studio_component_pass", "relation_disagreement"})))['status'] == "INVESTIGATE_NOT_REPAIR"
    assert reconsider(learned, Situation(frozenset({"studio_symptom"})))['status'] == "INSUFFICIENT_RELEVANCE"
    assert reconsider(learned, Situation(frozenset({"studio_symptom", "studio_component_pass", "studio_component_failure"})))['status'] == "COUNTEREXAMPLE_APPLIES"
    assert reconsider(learned, Situation(frozenset({"studio_symptom", "studio_component_pass"}), frozenset({"studio_component_pass"})))['status'] == "COUNTEREVIDENCE"
    incomplete = Experience("bad", "", learned.context, learned.causal_relation, (), frozenset())
    assert reconsider(incomplete, Situation(learned.context))['status'] == "PROVENANCE_INCOMPLETE"
    assert reconsider(learned, Situation(frozenset({"visual_mismatch", "colour_shift"})))['status'] == "INSUFFICIENT_RELEVANCE"
    print('6/6 experience fixtures PASS; no repair action, recovery mutation or persisted memory')

if __name__ == '__main__':
    fixtures()
