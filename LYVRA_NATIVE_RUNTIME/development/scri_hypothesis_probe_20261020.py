"""SCRI hypothesis-revision probe. Illustrative fixtures only, NOT production integration."""
from dataclasses import dataclass

HYPOTHESES = ("studio2_fault", "track_fault", "whole_track_relation_fault")

@dataclass(frozen=True)
class Evidence:
    name: str
    supports: tuple[str, ...]
    rules_out: tuple[str, ...]

def diagnose(events):
    viable = set(HYPOTHESES)
    trace = []
    for event in events:
        viable.difference_update(event.rules_out)
        supported = viable.intersection(event.supports)
        trace.append((event.name, sorted(viable), sorted(supported or viable)))
    return trace

def proposal(events, valid=("studio2", "track_design", "whole_lyvra")):
    trace = diagnose(events)
    candidates = trace[-1][2]
    return {
        "status": "DIAGNOSTIC_CANDIDATE_ONLY" if len(candidates) == 1 else "INSUFFICIENT_EVIDENCE",
        "target": candidates[0] if len(candidates) == 1 else None,
        "preserve": list(valid),
        "trace": trace,
    }

if __name__ == "__main__":
    symptom = Evidence("Studio 2 mismatch", HYPOTHESES, ())
    counter = Evidence("Studio tests pass, relation differs", ("whole_track_relation_fault",), ("studio2_fault", "track_fault"))
    initial = proposal([symptom])
    revised = proposal([symptom, counter])
    contradictory = proposal([symptom, Evidence("all excluded", (), HYPOTHESES)])
    assert initial["status"] == "INSUFFICIENT_EVIDENCE"
    assert revised["target"] == "whole_track_relation_fault"
    assert revised["preserve"] == ["studio2", "track_design", "whole_lyvra"]
    assert contradictory["status"] == "INSUFFICIENT_EVIDENCE"
    print("3/3 fixture assertions passed; no repairs or recovery writes executed")
