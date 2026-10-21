"""SCRI behavioral sequence: experience -> contradiction -> irrelevant update.
Fixtures exercise existing causal model; no persisted memory or runtime claims.
"""
from dataclasses import dataclass
from scri_causal_experience_probe_20261020 import Experience,Situation,reconsider

@dataclass(frozen=True)
class LearningState:
    experience: Experience
    current: Situation
    unrelated: tuple[str,...]=()

def decide(state):
    result=reconsider(state.experience,state.current)
    return {"status":result["status"],"candidate":result["candidate"],
            "investigate":result["status"]=="INVESTIGATE_NOT_REPAIR",
            "auto_action":False,"facet":"music_pipeline",
            "unrelated_retained":state.unrelated}

def update(state,kind,conditions):
    if kind=="contradiction":
        return LearningState(state.experience,
                             Situation(state.current.observed,frozenset(conditions)),
                             state.unrelated)
    if kind=="irrelevant":
        return LearningState(state.experience,state.current,state.unrelated+tuple(conditions))
    raise ValueError("unsupported stage")

def trial():
    experience=Experience("e1","isolated-behavior-fixture",
        frozenset({"symptom","component_pass","relation_diff"}),
        "investigate_relation_fault",("source-A","source-B"),
        frozenset({"component_failure"}))
    first=LearningState(experience,Situation(experience.context))
    second=update(first,"contradiction",("component_pass",))
    third=update(second,"irrelevant",("unrelated_colour","pet_greeting"))
    return tuple(decide(s) for s in (first,second,third))
