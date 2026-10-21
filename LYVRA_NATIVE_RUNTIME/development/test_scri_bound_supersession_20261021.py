"""Real checkout tests: only bound Git blobs may reach the supersession decision."""
import subprocess,unittest
from pathlib import Path
from scri_bound_supersession_20261021 import assess
from scri_git_blob_binding_20261021 import PATHS
ROOT=Path(__file__).resolve().parents[2]
def git(*args):
 p=subprocess.run(["git","-C",str(ROOT),*args],capture_output=True,text=True,timeout=40)
 if p.returncode:raise RuntimeError(p.stderr)
 return p.stdout.strip()
class IntegratedBinding(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.prod=git("ls-remote","origin","refs/heads/lyvra").split()[0]
  cls.data={f:{"path":p,"commit":cls.prod,"blob":git("rev-parse",cls.prod+":"+p)} for f,p in PATHS.items()}
 def test_valid_real_bound_assessment(self):
  self.assertEqual(assess(self.prod,self.data,self.prod)["status"],"BOUND_REVIEW_ONLY")
 def test_whole_current_kept(self):
  self.assertEqual(assess(self.prod,self.data,self.prod)["decision"]["track"]["status"],"HISTORICAL_HANDOFF")
 def test_missing_pinned_current(self):
  self.assertEqual(assess(self.prod,self.data)["status"],"STALE_OR_UNPINNED_CURRENT")
 def test_stale_current_rejected(self):
  self.assertEqual(assess(self.prod,self.data,"a"*40)["status"],"STALE_OR_UNPINNED_CURRENT")
 def test_swapped_path_rejected(self):
  d={k:dict(v) for k,v in self.data.items()}
  d["whole"]["path"]=PATHS["track"]
  self.assertEqual(assess(self.prod,d,self.prod)["status"],"CARRIER_COMMIT_OR_PATH_MISMATCH")
 def test_wrong_blob_rejected(self):
  d={k:dict(v) for k,v in self.data.items()}
  d["track"]["blob"]="0"*40
  self.assertEqual(assess(self.prod,d,self.prod)["status"],"GIT_BINDING_REJECTED")
 def test_cross_facet_blob_rejected(self):
  d={k:dict(v) for k,v in self.data.items()}
  d["pet"]["blob"]=self.data["whole"]["blob"]
  self.assertEqual(assess(self.prod,d,self.prod)["status"],"GIT_BINDING_REJECTED")
 def test_missing_blob_rejected(self):
  d={k:dict(v) for k,v in self.data.items()}
  d["pet"].pop("blob")
  self.assertEqual(assess(self.prod,d,self.prod)["status"],"UNBOUND_BLOB")
 def test_wrong_commit_assignment_rejected(self):
  d={k:dict(v) for k,v in self.data.items()}
  d["deployment"]["commit"]="f"*40
  self.assertEqual(assess(self.prod,d,self.prod)["status"],"CARRIER_COMMIT_OR_PATH_MISMATCH")
 def test_missing_facet_rejected(self):
  d={k:v for k,v in self.data.items() if k!="pet"}
  self.assertEqual(assess(self.prod,d,self.prod)["status"],"UNBOUND_CARRIER_SET")
 def test_wrong_deployment_id_rejected(self):
  d={k:dict(v) for k,v in self.data.items()}
  d["deployment"]["deployment_id"]="forged"
  self.assertEqual(assess(self.prod,d,self.prod)["reason"],"DEPLOYMENT_ID_MISMATCH")
 def test_no_promotion_or_restore(self):
  r=assess(self.prod,self.data,self.prod)
  self.assertFalse(r["restore_approved"])
  self.assertFalse(r["decision"]["semantic_supersession_verified"])
if __name__=="__main__":unittest.main(verbosity=2)
