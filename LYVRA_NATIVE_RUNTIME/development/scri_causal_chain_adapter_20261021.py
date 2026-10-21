"""Read-only integration of existing SCRI event inference with scoped causal memory.
Adapter only: retains event provenance, no synthetic causality confirmation or persistence.
"""
from dataclasses import dataclass,replace
from scri_event_sequence_inference_20261021 import infer

@dataclass(frozen=True)
class Memory:
    facet:str
    relation:tuple[str,str]
    sources:tuple[str,...]
    runs:tuple[str,...]
    revision:int=1
    status:str="PROVISIONAL"
    counter_sources:tuple[str,...]=()

def derive(events,facet):
    result=infer(events,facet)
    if result["status"]!="INVESTIGATE_ONLY" or not result["candidate"]:return None
    relation=result["candidate"]
    evidence=result["relations"][relation]
    return Memory(facet,relation,tuple(evidence["sources"]),tuple(evidence["intervention_runs"]))

def recall(memory,events,facet):
    if memory is None or facet!=memory.facet:
        return {"status":"DOMAIN_BOUNDARY","candidate":None,"action":"NONE"}
    if memory.status=="COUNTEREVIDENCE":
        return {"status":"REVISED_COUNTEREVIDENCE","candidate":None,"action":"NONE"}
    current=infer(events,facet)
    relation=current["relations"].get(memory.relation)
    if relation is None:
        return {"status":"INSUFFICIENT_CONTEXT","candidate":None,"action":"NONE"}
    if relation["status"]=="COUNTEREVIDENCE_REVIEW":
        return {"status":"COUNTEREVIDENCE_REVIEW","candidate":None,"action":"NONE"}
    if current["candidate"]!=memory.relation:
        return {"status":"NOT_CURRENTLY_SUPPORTED","candidate":None,"action":"NONE"}
    return {"status":"INVESTIGATE_ONLY","candidate":memory.relation,"action":"NONE"}

def revise(memory,new_events):
    if memory is None:return None
    current=infer(new_events,memory.facet)
    relation=current["relations"].get(memory.relation)
    if not relation or not relation["counter_sources"]:return memory
    sources=tuple(sorted(set(memory.counter_sources)|set(relation["counter_sources"])))
    if sources==memory.counter_sources:return memory
    return replace(memory,status="COUNTEREVIDENCE",revision=memory.revision+1,counter_sources=sources)
