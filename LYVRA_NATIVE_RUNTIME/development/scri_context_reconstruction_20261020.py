"""LYVRA SCRI contextual causal experience reconstruction — isolated model fixture.

Candidate hypotheses for investigation only; never recommends or performs repairs.
Historical records are not new facts. Evidence provenance and contradicted conditions
remain visible. Transfer across facets requires an explicitly grounded bridge.
"""
from dataclasses import dataclass
from typing import FrozenSet, Tuple

@dataclass(frozen=True)
class Experience:
    id: str
    origin: str
    observed_conditions: FrozenSet[str]
    hypothesis: str
    evidence_sources: Tuple[str, ...]
    counterexamples: FrozenSet[str]
    old_path: str
    path_change_reason: str
    domain: str

@dataclass(frozen=True)
class Situation:
    domain: str
    observed: FrozenSet[str]
    contradicted: FrozenSet[str] = frozenset()
    bridge_evidence: Tuple[str, ...] = ()


def reconstruct(past: Experience, now: Situation) -> dict:
    """Return transparent candidate meaning, uncertainty, not a repair."""
    provenance = {"id": past.id, "origin": past.origin,
                  "evidence_sources": list(past.evidence_sources),
                  "path_change_reason": past.path_change_reason,
                  "old_path": past.old_path}
    result = {"status": "ABSTAIN", "candidate": None, "reason": None,
              "provenance": provenance, "new_relations": [], "action": "NONE"}
    if not past.origin or not past.evidence_sources or not past.path_change_reason:
        result.update(status="PROVENANCE_GAP", reason="historical grounding incomplete")
        return result
    if now.contradicted & past.observed_conditions:
        result.update(status="CONTRADICTION", reason="new evidence contradicts old conditions")
        return result
    if now.observed & past.counterexamples:
        result.update(status="COUNTEREXAMPLE", reason="stored negative example active")
        return result
    shared = past.observed_conditions & now.observed
    if len(shared) < 2:
        result.update(status="WEAK_RELEVANCE", reason="no sufficient causal overlap")
        return result
    if past.domain != now.domain and not now.bridge_evidence:
        result.update(status="DOMAIN_BOUNDARY", reason="transfer not evidenced")
        return result
    relation = ("within-domain: compare historical changed diagnosis with current evidence"
                if past.domain == now.domain else
                "cross-domain: provisional analogy, independently verify bridge")
    result.update(status="INVESTIGATE_ONLY", candidate=past.hypothesis,
                  reason="current causal overlap warrants inquiry, not automatic reuse",
                  new_relations=[relation,
                    "historical rejection of old path must be challenged by new facts",
                    "recovery source logic and valid newer evolution remain protected"],
                  shared_conditions=sorted(shared),
                  bridge_evidence=list(now.bridge_evidence))
    return result


def run_tests():
    original = Experience(
        id="experience-revision-001", origin="scri-reflection-fixture-2026-10-20",
        observed_conditions=frozenset({"visible_symptom", "component_passes", "relation_diff"}),
        hypothesis="investigate_relation_mismatch",
        evidence_sources=("component-fixture-check", "relation-fixture-diff"),
        counterexamples=frozenset({"component_fails"}),
        old_path="assume_symptomatic_component_fault",
        path_change_reason="verified component health plus relationship discrepancy disproved initial path",
        domain="music_pipeline")
    s = lambda observed, **kwargs: Situation("music_pipeline", frozenset(observed), **kwargs)
    tests = [
        ("same_domain_reconstruction", reconstruct(original, s({"visible_symptom", "component_passes", "relation_diff"}))["status"] == "INVESTIGATE_ONLY"),
        ("not_repair", reconstruct(original, s({"visible_symptom", "component_passes"}))["action"] == "NONE"),
        ("preserves_origin", reconstruct(original, s({"visible_symptom", "component_passes"}))["provenance"]["origin"] == original.origin),
        ("weak_overlap", reconstruct(original, s({"visible_symptom"}))["status"] == "WEAK_RELEVANCE"),
        ("counterexample", reconstruct(original, s({"visible_symptom", "component_passes", "component_fails"}))["status"] == "COUNTEREXAMPLE"),
        ("new_contradiction", reconstruct(original, s({"visible_symptom", "component_passes"}, contradicted=frozenset({"component_passes"})))["status"] == "CONTRADICTION"),
        ("no_implicit_cross_facet_transfer", reconstruct(original, Situation("visual", frozenset({"visible_symptom", "component_passes"})))["status"] == "DOMAIN_BOUNDARY"),
        ("evidenced_analogy_still_investigation", reconstruct(original, Situation("visual", frozenset({"visible_symptom", "component_passes"}), bridge_evidence=("verified-structural-analogy",)))["status"] == "INVESTIGATE_ONLY"),
        ("cross_facet_provisional", "provisional analogy" in reconstruct(original, Situation("visual", frozenset({"visible_symptom", "component_passes"}), bridge_evidence=("verified-structural-analogy",)))["new_relations"][0]),
        ("missing_provenance", reconstruct(Experience(**{**original.__dict__, "origin": ""}), s({"visible_symptom", "component_passes"}))["status"] == "PROVENANCE_GAP"),
        ("prior_assumption_is_visible", reconstruct(original, s({"visible_symptom", "component_passes"}))["provenance"]["old_path"] == original.old_path),
        ("new_relation_is_not_fixed_template", "new facts" in reconstruct(original, s({"visible_symptom", "component_passes"}))["new_relations"][1]),
    ]
    for name, result in tests:
        assert result, name
    print(f"{len(tests)}/{len(tests)} reconstruction checks PASS; illustrative fixtures only; no runtime or recovery mutations")

if __name__ == "__main__":
    run_tests()
