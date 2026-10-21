"""Exploratory causal candidates from data-defined interventions, not fixed fault names.
All outputs are hypotheses for investigation, never established causal truth.
"""
from dataclasses import dataclass
from collections import defaultdict

@dataclass(frozen=True)
class Observation:
    facet:str
    target:str
    effect:str
    source:str
    direction:int=1
    intervention:bool=False

def generate(records,facet):
    groups=defaultdict(lambda:defaultdict(dict))
    for r in records:
        if r.facet!=facet or not r.source or not r.target or not r.effect or r.direction not in (-1,1):
            continue
        # A single source cannot cast duplicate independent votes.
        key=(r.effect,r.intervention)
        prior=groups[r.target][r.source].get(key)
        if prior is not None and prior!=r.direction:
            groups[r.target][r.source][key]=0
        elif prior is None:
            groups[r.target][r.source][key]=r.direction
    candidates={}
    for target,sources in groups.items():
        supporting={src for src,signals in sources.items() if any(k[1] and v==1 for k,v in signals.items())}
        conflicting={src for src,signals in sources.items() if any(k[1] and v==-1 for k,v in signals.items())}
        observational={src for src,signals in sources.items() if any(not k[1] and v==1 for k,v in signals.items())}
        if not (supporting or conflicting or observational):continue
        candidates[target]={"support_sources":sorted(supporting),"counter_sources":sorted(conflicting),
          "association_sources":sorted(observational),
          "score":len(supporting)-len(conflicting),
          "causal_confirmed":False}
    ranked=sorted(candidates,key=lambda k:(-candidates[k]["score"],k))
    eligible=[k for k in ranked if len(candidates[k]["support_sources"])>=2 and not candidates[k]["counter_sources"]]
    return {"status":"INVESTIGATE_ONLY" if len(eligible)==1 else "ABSTAIN",
      "candidate":eligible[0] if len(eligible)==1 else None,"candidates":candidates,
      "facet":facet,"action":"NONE","runtime_verified":False}
