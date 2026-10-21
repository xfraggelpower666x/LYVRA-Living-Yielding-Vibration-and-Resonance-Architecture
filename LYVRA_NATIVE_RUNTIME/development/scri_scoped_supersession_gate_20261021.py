"""Source-bound read-only supersession and deployment decision gate."""
def judge(pointer, handoff, pet, deployment, source_commit):
 s=pointer["current_known_whole_state"]
 track_old=handoff["track_logical_revision"]<s["track_design_logical_revision"]
 pet_status=pet["pet_runtime"]["deployment_status"]
 visual=deployment["pet_surface"]["visual_atlas_render"]
 return {
  "whole":{"authority":"LYVRA","source_commit":source_commit,"restore":False,"status":"PRESERVE_CURRENT"},
  "track":{"status":"HISTORICAL_HANDOFF" if track_old else "REVIEW",
           "current":s["track_design_version"],"historical":handoff["track_design_version"],
           "supersession":"CURRENT_REVISION_PRECEDENCE_NOT_DEPLOYMENT_PROOF","restore":False},
  "studio2":{"status":"OWN_FACET_ONLY","scope_transfer":False,"restore":False},
  "pet":{"status":"DEPLOYMENT_CLAIM_VISUAL_PENDING" if visual=="READBACK_PENDING" else "REVIEW",
         "deployment_provenance":pet["pet_runtime"].get("deployment_id"),
         "claimed_api_verification":"API_VERIFIED" in pet_status,
         "visual_readback_verified":False,"restore":False},
  "checkpoints":{"reopen":False,"closure_verified":False},
  "automatic_write":False,"semantic_supersession_verified":False
 }
