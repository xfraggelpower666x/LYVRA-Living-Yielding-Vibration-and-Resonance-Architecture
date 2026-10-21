"""Real Git commit/path/blob adversarial acceptance, read-only."""
import subprocess
import unittest
from pathlib import Path
from scri_git_blob_binding_20261021 import verify, PATHS
ROOT=Path(__file__).resolve().parents[2]
def git(*args):
 p=subprocess.run(["git","-C",str(ROOT),*args],capture_output=True,text=True,timeout=35)
 if p.returncode: raise RuntimeError(p.stderr)
 return p.stdout.strip()
class RealBlobBindings(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.prod=git("ls-remote","origin","refs/heads/lyvra").split()[0]
  cls.blobs={facet:git("rev-parse",cls.prod+":"+path) for facet,path in PATHS.items()}
 def test_real_whole_binding(self):
  self.assertEqual(verify(self.prod,"whole",PATHS["whole"],self.blobs["whole"])["status"],"GIT_BLOB_BOUND")
 def test_real_track_binding(self):
  self.assertTrue(verify(self.prod,"track",PATHS["track"],self.blobs["track"])["verified"])
 def test_real_pet_binding(self):
  self.assertTrue(verify(self.prod,"pet",PATHS["pet"],self.blobs["pet"])["verified"])
 def test_real_deployment_binding(self):
  self.assertTrue(verify(self.prod,"deployment",PATHS["deployment"],self.blobs["deployment"])["verified"])
 def test_swapped_carrier_rejected(self):
  self.assertEqual(verify(self.prod,"whole",PATHS["track"])["status"],"FACET_PATH_MISMATCH")
 def test_swapped_pet_deployment_rejected(self):
  self.assertEqual(verify(self.prod,"pet",PATHS["deployment"])["status"],"FACET_PATH_MISMATCH")
 def test_wrong_blob_sha_rejected(self):
  self.assertEqual(verify(self.prod,"track",PATHS["track"],"0"*40)["status"],"BLOB_MISMATCH")
 def test_cross_facet_blob_rejected(self):
  self.assertEqual(verify(self.prod,"whole",PATHS["whole"],self.blobs["pet"])["status"],"BLOB_MISMATCH")
 def test_invented_commit_rejected(self):
  self.assertFalse(verify("f"*40,"whole",PATHS["whole"])["verified"])
 def test_fake_deployment_binding_rejected(self):
  self.assertEqual(verify(self.prod,"deployment",PATHS["deployment"],claimed_deployment="forged")["status"],"DEPLOYMENT_ID_MISMATCH")
 def test_git_binding_not_live_deployment(self):
  self.assertFalse(verify(self.prod,"deployment",PATHS["deployment"])["live_deployment_verified"])
 def test_git_binding_not_semantic_supersession(self):
  self.assertFalse(verify(self.prod,"whole",PATHS["whole"])["semantic_supersession_verified"])
 def test_git_binding_not_restore(self):
  self.assertFalse(verify(self.prod,"whole",PATHS["whole"])["restore_approved"])
if __name__=="__main__": unittest.main(verbosity=2)
