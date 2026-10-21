"""Exploratory event-sequence interpretation: temporal proximity != causation.
No pre-labelled cause/target fields. All evidence is synthetic and non-authoritative.
"""
from dataclasses import dataclass
from collections import defaultdict

@dataclass(frozen=True)
class Event:
    facet:str
    run:str
    tick:int
    signal:str
    source:str
    kind:str="observation" # observation, intervention, refutation
    value:bool=True

def infer(events, facet, max_lag=3):
    filtered=[e for e in events if e.facet==facet and e.signal and e.source and e.run and
              e.kind in ("observation","intervention","refutation") and type(e.tick) is int]
    by_run=defaultdict(list)
    for e in filtered:by_run[e.run].append(e)
    relations=defaultdict(lambda:{"temporal_runs":set(),"interventions":set(),"counter":set(),"sources":set()})
    for run,items in by_run.items():
        items=sorted(items,key=lambda e:e.tick)
        for earlier in items:
            if not earlier.value or earlier.kind=="refutation":continue
            for later in items:
                if earlier.signal==later.signal or not (0<later.tick-earlier.tick<=max_lag):continue
                k=(earlier.signal,later.signal)
                info=relations[k]
                if later.kind=="refutation" or not later.value:
                    info["counter"].add(later.source)
                elif earlier.kind=="intervention":
                    info["interventions"].add((run,earlier.source,later.source))
                    info["sources"].update((earlier.source,later.source))
                else:
                    info["temporal_runs"].add(run)
                    info["sources"].update((earlier.source,later.source))
    candidates={}
    for (cause,effect),info in relations.items():
        independent={x[1] for x in info["interventions"]}
        intervention_runs={x[0] for x in info["interventions"]}
        supported=len(independent)>=2 and len(intervention_runs)>=2 and not info["counter"]
        status=("INTERVENTION_SUPPORTED_INVESTIGATE" if supported else
                "COUNTEREVIDENCE_REVIEW" if info["counter"] else
                "TEMPORAL_ASSOCIATION_ONLY")
        candidates[(cause,effect)]={"status":status,
          "intervention_runs":sorted(intervention_runs),
          "sources":sorted(info["sources"]),
          "counter_sources":sorted(info["counter"]),
          "causal_confirmed":False}
    eligible=[p for p,v in candidates.items() if v["status"]=="INTERVENTION_SUPPORTED_INVESTIGATE"]
    return {"status":"INVESTIGATE_ONLY" if len(eligible)==1 else "ABSTAIN",
            "candidate":eligible[0] if len(eligible)==1 else None,
            "relations":candidates,"facet":facet,"action":"NONE","runtime_verified":False}
