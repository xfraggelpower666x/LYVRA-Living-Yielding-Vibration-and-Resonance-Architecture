"""Mandatory real Git-bound evaluation; no unbound dict reaches the supersession gate."""
import json
from scri_git_blob_binding_20261021 import PATHS,verify,git


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
    whole,track,pet,deployment=(verified[k] for k in ("whole","track","pet","deployment"))
    state=whole["current_known_whole_state"]
    old=track["track_logical_revision"] < state["track_design_logical_revision"]
    result={"whole":{"authority":"LYVRA","status":"PRESERVE_CURRENT","source_commit":commit,"restore":False},
            "track":{"status":"HISTORICAL_HANDOFF" if old else "REVIEW","current":state["track_design_version"],"historical":track["track_design_version"],"restore":False},
            "studio2":{"status":"OWN_FACET_ONLY","scope_transfer":False,"restore":False},
            "pet":{"status":"DEPLOYMENT_CLAIM_VISUAL_PENDING" if deployment["pet_surface"]["visual_atlas_render"]=="READBACK_PENDING" else "REVIEW",
                   "deployment_provenance":pet["pet_runtime"].get("deployment_id"),"visual_readback_verified":False,"restore":False},
            "checkpoints":{"reopen":False},"automatic_write":False,"semantic_supersession_verified":False}
    return {"status":"BOUND_REVIEW_ONLY","decision":result,"verified_git_blobs":len(verified),
            "action":"NONE","restore_approved":False}
