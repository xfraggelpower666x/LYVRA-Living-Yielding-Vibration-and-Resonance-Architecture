"""Read-only SCRI gate. Source claims do not substitute independent live evidence."""
import re
_SHA=re.compile(r"^[0-9a-f]{40}$")
def _obj(x): return x if isinstance(x,dict) else {}
def judge(pointer, handoff, pet, deployment, source_commit):
 pointer,handoff,pet,deployment=map(_obj,(pointer,handoff,pet,deployment))
 state=_obj(pointer.get("current_known_whole_state"))
 runtime=_obj(pet.get("pet_runtime"))
 surface=_obj(deployment.get("pet_surface"))
 valid_commit=isinstance(source_commit,str) and bool(_SHA.fullmatch(source_commit))
 matching=pointer.get("source_commit",source_commit)==source_commit
 current_ok=(pointer.get("status")=="CURRENT_PRODUCTIVE_VERIFIED"
             and isinstance(state.get("track_design_logical_revision"),int)
             and isinstance(state.get("track_design_version"),str) and valid_commit)
 handoff_ok=(isinstance(handoff.get("track_logical_revision"),int)
             and isinstance(handoff.get("track_design_version"),str))
 pet_ok=isinstance(runtime.get("deployment_status"),str) and bool(runtime.get("deployment_id"))
 dep_ok=isinstance(surface.get("visual_atlas_render"),str)
 whole_status=("EVIDENCE_INCOMPLETE" if not current_ok else
               "SOURCE_COMMIT_CONFLICT" if not matching else "PRESERVE_CURRENT")
 track_old=handoff_ok and current_ok and handoff["track_logical_revision"]<state["track_design_logical_revision"]
 track_status=("EVIDENCE_INCOMPLETE" if not (current_ok and handoff_ok and matching) else
               "HISTORICAL_HANDOFF" if track_old else "REVIEW")
 pet_status=("EVIDENCE_INCOMPLETE" if not (pet_ok and dep_ok) else
             "DEPLOYMENT_CONFLICT_REVIEW" if deployment.get("deployment_status") in ("failed","failure","error") else
             "DEPLOYMENT_CLAIM_VISUAL_PENDING" if surface["visual_atlas_render"]=="READBACK_PENDING" else "REVIEW")
 return {
  "whole":{"authority":"LYVRA","source_commit":source_commit if valid_commit else None,"restore":False,"status":whole_status},
  "track":{"status":track_status,"current":state.get("track_design_version"),
           "historical":handoff.get("track_design_version"),
           "supersession":"CURRENT_REVISION_PRECEDENCE_NOT_DEPLOYMENT_PROOF","restore":False},
  "studio2":{"status":"OWN_FACET_ONLY","scope_transfer":False,"restore":False},
  "pet":{"status":pet_status,"deployment_provenance":runtime.get("deployment_id"),
         "claimed_api_verification":"API_VERIFIED" in runtime.get("deployment_status",""),
         "api_readback_verified":False,"visual_readback_verified":False,"restore":False},
  "checkpoints":{"reopen":False,"closure_verified":False},
  "automatic_write":False,"semantic_supersession_verified":False
 }
