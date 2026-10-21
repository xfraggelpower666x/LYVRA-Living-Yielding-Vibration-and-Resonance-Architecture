"""Mandatory real Git-bound evaluation; no unbound dict reaches the supersession gate."""
import json
from scri_git_blob_binding_20261021 import PATHS,verify,git
from scri_scoped_supersession_gate_20261021 import judge

def assess(commit, bindings, expected_current_commit=None):
    if not isinstance(bindings,dict) or set(bindings)!=set(PATHS):
        return {"status":"UNBOUND_CARRIER_SET","action":"NONE","restore_approved":False}
    if expected_current_commit is None or commit!=expected_current_commit:
        return {"status":"STALE_OR_UNPINNED_CURRENT","action":"NONE","restore_approved":False}
    verified={}
    for facet,path in PATHS.items():
        item=bindings.get(facet)
        if not isinstance(item,dict) or item.get("path")!=path or item.get("commit")!=commit:
            return {"status":"CARRIER_COMMIT_OR_PATH_MISMATCH","facet":facet,"action":"NONE","restore_approved":False}
        if not isinstance(item.get("blob"),str) or len(item["blob"])!=40:
            return {"status":"UNBOUND_BLOB","facet":facet,"action":"NONE","restore_approved":False}
        evidence=verify(commit,facet,path,item["blob"],item.get("deployment_id"))
        if not evidence.get("verified"):
            return {"status":"GIT_BINDING_REJECTED","facet":facet,"reason":evidence["status"],"action":"NONE","restore_approved":False}
        verified[facet]=json.loads(git("show",commit+":"+path))
    result=judge(verified["whole"],verified["track"],verified["pet"],verified["deployment"],commit)
    return {"status":"BOUND_REVIEW_ONLY","decision":result,"verified_git_blobs":len(verified),
            "action":"NONE","restore_approved":False}
