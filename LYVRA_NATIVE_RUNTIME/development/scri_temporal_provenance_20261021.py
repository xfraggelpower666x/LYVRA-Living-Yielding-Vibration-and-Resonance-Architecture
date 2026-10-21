"""SCRI read-only provenance ledger: sampled ref observations are never a continuous audit log.
No restore, git ref writes or automatic supersession approval.
"""
from dataclasses import dataclass

@dataclass(frozen=True)
class RefSample:
    ref: str
    sha: str
    seq: int
    origin: str

def reconcile(samples, claim=None, verified_deployment=False, current_valid=()):
    if not samples or any(not x.origin or len(x.sha)!=40 or not x.ref for x in samples):
        return {"status":"SOURCE_INCOMPLETE","action":"NONE"}
    if len({x.ref for x in samples})!=1 or len({x.seq for x in samples})!=len(samples):
        return {"status":"INCONSISTENT_SAMPLING","action":"NONE"}
    series=sorted(samples,key=lambda x:x.seq)
    movement=any(a.sha!=b.sha for a,b in zip(series,series[1:]))
    aba=len(series)>2 and series[0].sha==series[-1].sha and movement
    claims={"PENDING","DEPLOYED","SUPERSEDED","UNKNOWN"}
    if claim not in claims: claim="UNKNOWN"
    supersession="EVIDENCED_DEPLOYMENT_CANDIDATE" if claim=="DEPLOYED" and verified_deployment else "NOT_PROVEN"
    return {"status":"OBSERVATIONS_RECONCILED","observations":len(series),
            "movement_observed":movement,"aba_observed":aba,
            "continuous_history_proven":False,
            "supersession":supersession,"newer_valid_evolution":sorted(set(current_valid)),
            "lkg_immutable_proven":False,"restore_approved":False,"action":"NONE"}
