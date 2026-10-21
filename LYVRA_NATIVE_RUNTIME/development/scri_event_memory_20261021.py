"""Isolated SCRI event-derived causal memory; ephemeral and scoped, no writes."""
from dataclasses import dataclass,replace
from scri_context_reconstruction_20261020 import Experience,Situation,reconstruct

@dataclass(frozen=True)
class Event:
    key:str
    domain:str
    facts:frozenset[str]
    source:str
    observed:bool=True

@dataclass(frozen=True)
class CausalMemory:
    experience:Experience
    supporting_ids:tuple[str,...]
    status:str="CANDIDATE"
    revision:int=1

def form(events):
    events=tuple(events)
    if len(events)<3 or len({e.source for e in events if e.observed})<2:
        return None
    if any(not e.key or not e.source or not e.domain for e in events):
        return None
    if len({e.domain for e in events})!=1:
        return None
    by_key={e.key:e for e in events}
    if not {"symptom","component_pass","relation_diff"}<=set(by_key):
        return None
    if not all(by_key[k].observed for k in ("symptom","component_pass","relation_diff")):
        return None
    if "component_failure" in by_key and by_key["component_failure"].observed:
        return None
    chosen=tuple(by_key[k] for k in ("symptom","component_pass","relation_diff"))
    exp=Experience("derived-"+chosen[0].key, "+".join(sorted({e.source for e in chosen})),
        frozenset({"symptom","component_pass","relation_diff"}),"investigate_relation_mismatch",
        tuple(sorted({e.source for e in chosen})),frozenset({"component_failure"}),
        "assume_component_fault",
        "observed component pass and relation difference contradict component-first diagnosis",
        chosen[0].domain)
    return CausalMemory(exp,tuple(e.key for e in chosen))

def recall(memory,situation):
    result=reconstruct(memory.experience,situation)
    if memory.status=="COUNTEREVIDENCE":
        return {"status":"REVISED_COUNTEREVIDENCE","candidate":None,"action":"NONE"}
    return result

def revise(memory,counter):
    if counter.domain!=memory.experience.domain or not counter.observed:
        return memory
    if not ({"component_failure","component_pass_disproved"} & counter.facts):
        return memory
    return replace(memory,status="COUNTEREVIDENCE",revision=memory.revision+1)

def example():
    events=(Event("symptom","music_pipeline",frozenset({"audible_anomaly"}),"monitor"),
            Event("component_pass","music_pipeline",frozenset({"pass"}),"component_test"),
            Event("relation_diff","music_pipeline",frozenset({"diff"}),"relation_audit"))
    memory=form(events)
    situation=Situation("music_pipeline",frozenset({"symptom","component_pass","relation_diff"}))
    before=recall(memory,situation)
    after=revise(memory,Event("counter","music_pipeline",frozenset({"component_pass_disproved"}),"later_test"))
    return memory,before,after,recall(after,situation)
