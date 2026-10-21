import json,subprocess,unittest
from pathlib import Path
from scri_scoped_supersession_gate_20261021 import _evaluate_verified_carriers as judge
ROOT=Path(__file__).resolve().parents[2]
def git(*args):
 p=subprocess.run(["git","-C",str(ROOT),*args],text=True,capture_output=True,timeout=40)
 if p.returncode:raise RuntimeError(p.stderr)
 return p.stdout.strip()
class ScopedSupersessionAcceptance(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.sha=git("ls-remote","origin","refs/heads/lyvra").split()[0]
  def get(path):return json.loads(git("show",cls.sha+":"+path))
  cls.pointer=get("LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json")
  cls.handoff=get("LYVRA_NATIVE_RUNTIME/continuity/TRACK_DESIGN_SUNO_STUDIO2_REPO_HANDOFF_CURRENT.json")
  cls.pet=get("LYVRA_NATIVE_RUNTIME/continuity/LYVRA_PET_AUTO_REPO_HANDOFF_CURRENT.json")
  cls.deployment=get("WEBLyvra/deployment/PET_PRODUCTION_STATUS_2026-10-05.json")
  cls.result=judge(cls.pointer,cls.handoff,cls.pet,cls.deployment,cls.sha)
 def test_real_production_commit(self):self.assertEqual(git("cat-file","-t",self.sha),"commit")
 def test_whole_authority(self):self.assertEqual(self.result["whole"]["authority"],"LYVRA")
 def test_whole_preserved(self):self.assertEqual(self.result["whole"]["status"],"PRESERVE_CURRENT")
 def test_track_historical_handoff(self):self.assertEqual(self.result["track"]["status"],"HISTORICAL_HANDOFF")
 def test_track_current_revision(self):self.assertEqual(self.result["track"]["current"],"v3.6")
 def test_track_no_deployment_proof(self):self.assertIn("NOT_DEPLOYMENT_PROOF",self.result["track"]["supersession"])
 def test_studio_facet_isolated(self):self.assertFalse(self.result["studio2"]["scope_transfer"])
 def test_pet_deployment_claim(self):self.assertTrue(self.result["pet"]["claimed_api_verification"])
 def test_pet_visual_pending(self):self.assertEqual(self.result["pet"]["status"],"DEPLOYMENT_CLAIM_VISUAL_PENDING")
 def test_pet_visual_not_verified(self):self.assertFalse(self.result["pet"]["visual_readback_verified"])
 def test_pet_id_provenance_retained(self):self.assertEqual(self.result["pet"]["deployment_provenance"],self.pet["pet_runtime"]["deployment_id"])
 def test_closed_checkpoint_not_reopened(self):self.assertFalse(self.result["checkpoints"]["reopen"])
 def test_checkpoint_closure_not_invented(self):self.assertFalse(self.result["checkpoints"]["closure_verified"])
 def test_no_any_facet_restore(self):
  self.assertTrue(all(not self.result[k]["restore"] for k in ("whole","track","studio2","pet")))
 def test_no_auto_mutation(self):self.assertFalse(self.result["automatic_write"])
 def test_no_false_supersession(self):self.assertFalse(self.result["semantic_supersession_verified"])
if __name__=="__main__":unittest.main(verbosity=2)
