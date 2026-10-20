"""SCRI research fixture: reason about a revision of a diagnostic path.
Not persistent memory, a recovery engine, or a production integration.
"""
from dataclasses import dataclass

@dataclass(frozen=True)
class Observation:
    source: str
    observation: str
    favors: frozenset[str]
    excludes: frozenset[str]
    reliability: str = "verified"

@dataclass(frozen=True)
class Experience:
    origin: str
    prior_hypothesis: str
    updated_hypothesis: str
    decisive_observations: tuple[str, ...]
    disconfirming_observations: tuple[str, ...]
    path_change_reason: str
    constraints: tuple[str, ...]
    preservation: tuple[str, ...]

KNOWN = frozenset({"studio_fault", "track_fault", "whole_track_relation_fault"})

def reflect(observations: tuple[Observation, ...], initial: str) -> dict:
    """Create a bounded explanation; never select a repair, rollback or write."""
    if initial not in KNOWN:
        raise ValueError("unknown starting hypothesis")
    if not observations:
        return {"status": "INSUFFICIENT_EVIDENCE", "experience": None}
    if any(not o.source or o.reliability != "verified" for o in observations):
        return {"status": "SOURCE_UNVERIFIED", "experience": None}
    viable = set(KNOWN)
    for o in observations:
        viable.difference_update(o.excludes)
    if len(viable) != 1:
        return {"status": "INSUFFICIENT_EVIDENCE", "viable": sorted(viable), "experience": None}
    updated = next(iter(viable))
    matching = [o for o in observations if updated in o.favors and o.favors != KNOWN]
    if not matching:
        return {"status": "UNSUPPORTED_SINGLETON", "experience": None}
    if initial == updated:
        return {"status": "NO_REVISION", "experience": None}
    contradictory = [o for o in observations if initial in o.excludes]
    if not contradictory:
        return {"status": "REVISION_UNEXPLAINED", "experience": None}
    exp = Experience(
        origin="scri-diagnostic-reflection-fixture-2026-10-20",
        prior_hypothesis=initial, updated_hypothesis=updated,
        decisive_observations=tuple(f"{o.source}: {o.observation}" for o in matching),
        disconfirming_observations=tuple(f"{o.source}: {o.observation}" for o in contradictory),
        path_change_reason="previous hypothesis excluded by newer verified evidence; investigate relation, not symptomatic component",
        constraints=("historical hypothesis is not current authority", "re-test in a new context", "no automatic repair"),
        preservation=("whole_lyvra", "track_design", "studio_2", "newer_valid_evolution"),
    )
    return {"status": "REFLECTION_CANDIDATE", "experience": exp}

def test_reflection():
    symptom = Observation("studio-log", "Studio 2 output differs", KNOWN, frozenset())
    relation = Observation("semantic-readback", "Whole/Track contract disagrees", frozenset({"whole_track_relation_fault"}), frozenset({"studio_fault", "track_fault"}))
    t = lambda observations, initial="studio_fault": reflect(tuple(observations), initial)
    r = t([symptom, relation])
    assert r["status"] == "REFLECTION_CANDIDATE"
    assert r["experience"].updated_hypothesis == "whole_track_relation_fault"
    assert r["experience"].prior_hypothesis == "studio_fault"
    assert len(r["experience"].disconfirming_observations) == 1
    assert "newer_valid_evolution" in r["experience"].preservation
    assert t([symptom])["status"] == "INSUFFICIENT_EVIDENCE"
    assert t([symptom, Observation("", "unsupported", frozenset(), frozenset(), "unverified")])["status"] == "SOURCE_UNVERIFIED"
    assert t([symptom, Observation("other", "exclude all", frozenset(), KNOWN)])["status"] == "INSUFFICIENT_EVIDENCE"
    assert t([symptom, Observation("other", "exclude two", frozenset(), frozenset({"studio_fault", "track_fault"}))])["status"] == "UNSUPPORTED_SINGLETON"
    assert t([symptom, relation], "whole_track_relation_fault")["status"] == "NO_REVISION"
    assert "no automatic repair" in r["experience"].constraints
    print("11/11 reflection assertions PASS; simulation only, no writes or repairs")

if __name__ == "__main__":
    test_reflection()
