"""Scoped competing causal explanations based on independent event sources. Fixture only."""
from dataclasses import dataclass
@dataclass(frozen=True)
class Evidence:
    signal:str
    source:str
    facet:str="music_pipeline"
    polarity:int=1

RULES={"component_fault":{"component_failure":2,"symptom":1,"component_pass":-2,"relation_diff":-1},
       "relation_fault":{"relation_diff":2,"symptom":1,"component_pass":1,"component_failure":-2}}
def rank(events,facet="music_pipeline"):
    events=tuple(e for e in events if e.facet==facet and e.source and e.polarity in (-1,1))
    totals={}
    for hypothesis,weights in RULES.items():
        contributions={}
        for e in events:
            if e.signal in weights:
                contributions.setdefault(e.signal,{}).setdefault(e.source,[]).append(weights[e.signal]*e.polarity)
        # one source contributes at most one strongest signed value per signal
        observations=[max(v,key=abs) for sources in contributions.values() for v in sources.values()]
        totals[hypothesis]={"score":sum(observations),
            "sources":sorted({source for sources in contributions.values() for source in sources}),
            "signals":sorted(contributions)}
    ordered=sorted(totals,key=lambda k:(-totals[k]["score"],k))
    best=ordered[0]
    status="INVESTIGATE_ONLY" if totals[best]["score"]>0 and len(totals[best]["sources"])>=2 and totals[best]["score"]>totals[ordered[1]]["score"] else "ABSTAIN"
    return {"status":status,"candidate":best if status=="INVESTIGATE_ONLY" else None,
            "alternatives":totals,"facet":facet,"action":"NONE","runtime_verified":False}
def sequence():
    initial=[Evidence("symptom","monitor"),Evidence("relation_diff","relation_audit"),Evidence("component_pass","component_test")]
    contradiction=[Evidence("component_failure","second_test"),Evidence("relation_diff","reassessment",polarity=-1)]
    irrelevant=[Evidence("colour_shift","visual_probe","visual"),Evidence("pet_greeting","pet","pet")]
    return rank(initial),rank(initial+contradiction),rank(initial+contradiction+irrelevant)
