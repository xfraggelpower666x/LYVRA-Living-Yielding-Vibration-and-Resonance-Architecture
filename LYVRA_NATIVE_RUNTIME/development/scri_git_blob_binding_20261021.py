"""Read-only Git object binding verifier. Content provenance is checked by git itself."""
import json
import subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
PATHS={
 "whole":"LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json",
 "track":"LYVRA_NATIVE_RUNTIME/continuity/TRACK_DESIGN_SUNO_STUDIO2_REPO_HANDOFF_CURRENT.json",
 "pet":"LYVRA_NATIVE_RUNTIME/continuity/LYVRA_PET_AUTO_REPO_HANDOFF_CURRENT.json",
 "deployment":"WEBLyvra/deployment/PET_PRODUCTION_STATUS_2026-10-05.json",
}
def git(*args):
 p=subprocess.run(["git","-C",str(ROOT),*args],capture_output=True,text=True,timeout=35)
 if p.returncode: raise ValueError("GIT_OBJECT_UNAVAILABLE")
 return p.stdout.strip()
def verify(commit,facet,path,claimed_blob=None,claimed_deployment=None):
 if facet not in PATHS or PATHS[facet]!=path:
  return {"status":"FACET_PATH_MISMATCH","verified":False}
 try:
  if git("cat-file","-t",commit)!="commit":
   return {"status":"COMMIT_INVALID","verified":False}
  blob=git("rev-parse",commit+":"+path)
  if git("cat-file","-t",blob)!="blob":
   return {"status":"BLOB_INVALID","verified":False}
  if claimed_blob is not None and claimed_blob!=blob:
   return {"status":"BLOB_MISMATCH","verified":False}
  raw=git("show",commit+":"+path)
  doc=json.loads(raw)
  if facet=="whole" and doc.get("status")!="CURRENT_PRODUCTIVE_VERIFIED":
   return {"status":"CARRIER_IDENTITY_MISMATCH","verified":False}
  if facet=="track" and doc.get("owner_identity")!="LYVRA":
   return {"status":"CARRIER_IDENTITY_MISMATCH","verified":False}
  if facet=="pet" and doc.get("source_branch")!="lyvra":
   return {"status":"CARRIER_IDENTITY_MISMATCH","verified":False}
  if facet=="deployment" and claimed_deployment is not None and doc.get("cloudflare_pages_deployment_id")!=claimed_deployment:
   return {"status":"DEPLOYMENT_ID_MISMATCH","verified":False}
  return {"status":"GIT_BLOB_BOUND","verified":True,"commit":commit,"blob":blob,"facet":facet,
          "live_deployment_verified":False,"semantic_supersession_verified":False,"restore_approved":False}
 except (ValueError,KeyError,TypeError):
  return {"status":"SOURCE_READ_FAILURE","verified":False}
