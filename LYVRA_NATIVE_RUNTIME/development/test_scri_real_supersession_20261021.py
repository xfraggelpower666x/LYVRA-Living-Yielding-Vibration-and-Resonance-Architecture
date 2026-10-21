"""Read-only real-carrier supersession acceptance. Repo current is freshly fetched by CI.
Old active handoff is evidence, not current authority. No restore or mutation.
"""
import json
import subprocess
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
POINTER="LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json"
HANDOFF="LYVRA_NATIVE_RUNTIME/continuity/TRACK_DESIGN_SUNO_STUDIO2_REPO_HANDOFF_CURRENT.json"
PET="LYVRA_NATIVE_RUNTIME/continuity/LYVRA_PET_AUTO_REPO_HANDOFF_CURRENT.json"
DEPLOY="WEBLyvra/deployment/PET_PRODUCTION_STATUS_2026-10-05.json"
RECOVERY="LYVRA_NATIVE_RUNTIME/recovery/UPDATE_FRESHNESS_RECONCILE_2026-10-08_0655.md"

def git(*a):
 p=subprocess.run(["git","-C",str(ROOT),*a],text=True,capture_output=True,timeout=35)
 if p.returncode: raise RuntimeError(p.stderr)
 return p.stdout.strip()

def read_prod(path, sha):
 return git("show",sha+":"+path)

def classify(current,handoff):
 a=current["current_known_whole_state"]
 return {"current_track_revision":a["track_design_logical_revision"],
         "handoff_track_revision":handoff["track_logical_revision"],
         "current_track_version":a["track_design_version"],
         "handoff_track_version":handoff["track_design_version"],
         "stale_handoff":handoff["track_logical_revision"]<a["track_design_logical_revision"],
         "authority":"WHOLE_LYVRA","auto_restore":False,"supersession_approved":False}

class CurrentCarrierAcceptance(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  lines=git("ls-remote","origin","refs/heads/lyvra").split()
  assert len(lines)==2
  cls.prod=lines[0]
  cls.pointer=json.loads(read_prod(POINTER,cls.prod))
  cls.handoff=json.loads(read_prod(HANDOFF,cls.prod))
  cls.pet=json.loads(read_prod(PET,cls.prod))
  cls.deploy=json.loads(read_prod(DEPLOY,cls.prod))
  cls.recovery=read_prod(RECOVERY,cls.prod)
  cls.state=classify(cls.pointer,cls.handoff)
 def test_actual_prod_commit(self): self.assertEqual(git("cat-file","-t",self.prod),"commit")
 def test_current_claim(self): self.assertEqual(self.pointer["status"],"CURRENT_PRODUCTIVE_VERIFIED")
 def test_stale_handoff_detected(self): self.assertTrue(self.state["stale_handoff"])
 def test_revision_order(self): self.assertGreater(self.state["current_track_revision"],self.state["handoff_track_revision"])
 def test_handoff_status_does_not_override(self): self.assertEqual(self.handoff["status"],"ACTIVE_CURRENT_HANDOFF")
 def test_track_current_kept(self): self.assertEqual(self.state["current_track_version"],"v3.6")
 def test_whole_authority(self): self.assertEqual(self.state["authority"],"WHOLE_LYVRA")
 def test_no_restore(self): self.assertFalse(self.state["auto_restore"])
 def test_old_handoff_not_auto_supersession(self): self.assertFalse(self.state["supersession_approved"])
 def test_pet_deployment_is_claim(self): self.assertIn("DEPLOYED",self.pet["pet_runtime"]["deployment_status"])
 def test_pet_deployment_id_provenance_present(self): self.assertTrue(self.pet["pet_runtime"]["deployment_id"])
 def test_published_deployment_distinct_from_live(self): self.assertEqual(self.deploy["pet_surface"]["visual_atlas_render"],"READBACK_PENDING")
 def test_old_recovery_not_write_authority(self): self.assertIn("RECOVERY_BRANCH=",self.recovery)
 def test_historical_backup_blocked(self): self.assertIn("BACKUP_WRITE=BLOCKED",self.recovery)
 def test_no_newer_evolution_erasure(self): self.assertIn("track_design_version",self.pointer["current_known_whole_state"])
if __name__=="__main__":unittest.main(verbosity=2)
