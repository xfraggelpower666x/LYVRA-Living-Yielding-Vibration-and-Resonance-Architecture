import json, subprocess, unittest
from pathlib import Path
from scri_causal_carrier_chain_20261021 import evaluate
ROOT=Path(__file__).resolve().parents[2]
def git(*args):
 p=subprocess.run(["git","-C",str(ROOT),*args],text=True,capture_output=True,timeout=35)
 if p.returncode: raise RuntimeError(p.stderr)
 return p.stdout.strip()
class CarrierChainAcceptance(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.prod=git("ls-remote","origin","refs/heads/lyvra").split()[0]
  cls.dev=git("rev-parse","HEAD")
  def read(path):return git("show",cls.prod+":"+path)
  cls.pointer=json.loads(read("LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json"))
  cls.handoff=json.loads(read("LYVRA_NATIVE_RUNTIME/continuity/TRACK_DESIGN_SUNO_STUDIO2_REPO_HANDOFF_CURRENT.json"))
  cls.guard=read("LYVRA_NATIVE_RUNTIME/current/governance/FACET_BOUNDARY_AND_PROMOTION_GUARD.md")
  cls.deployment=json.loads(read("WEBLyvra/deployment/PET_PRODUCTION_STATUS_2026-10-05.json"))
  cls.result=evaluate(cls.pointer,cls.handoff,cls.guard,cls.deployment,{"prod":cls.prod,"dev":cls.dev})
 def test_real_production_object(self):self.assertEqual(git("cat-file","-t",self.prod),"commit")
 def test_whole_lyvra_authority(self):self.assertEqual(self.result["whole"]["authority"],"LYVRA")
 def test_track_old_handoff_not_restored(self):self.assertEqual(self.result["track"]["status"],"OLDER_HANDOFF_EVIDENCE")
 def test_track_revision_causality(self):self.assertGreater(self.result["track"]["current_revision"],self.result["track"]["handoff_revision"])
 def test_track_current_preserved(self):self.assertEqual(self.result["track"]["preserve_version"],self.pointer["current_known_whole_state"]["track_design_version"])
 def test_studio_separate(self):self.assertTrue(self.result["studio2"]["no_track_scope_transfer"])
 def test_studio_not_derived_from_track(self):self.assertEqual(self.result["studio2"]["status"],"SEPARATE_FACET_REVIEW")
 def test_deployment_is_claim(self):self.assertFalse(self.result["deployment"]["live_verified"])
 def test_deployment_claim_retained(self):self.assertEqual(self.result["deployment"]["claim"],self.deployment["deployment_status"])
 def test_no_semantic_supersession_from_git(self):self.assertFalse(self.result["git"]["semantic_supersession_proven"])
 def test_no_closed_checkpoint_reopening(self):self.assertEqual(self.result["checkpoints"]["status"],"DO_NOT_REOPEN_WITHOUT_NEW_CURRENT_EVIDENCE")
 def test_no_whole_restore(self):self.assertFalse(self.result["whole"]["recovery_approved"])
 def test_no_track_restore(self):self.assertFalse(self.result["track"]["recovery_approved"])
 def test_no_studio_restore(self):self.assertFalse(self.result["studio2"]["recovery_approved"])
 def test_no_action(self):self.assertEqual(self.result["action"],"NONE")
if __name__=="__main__":unittest.main(verbosity=2)
