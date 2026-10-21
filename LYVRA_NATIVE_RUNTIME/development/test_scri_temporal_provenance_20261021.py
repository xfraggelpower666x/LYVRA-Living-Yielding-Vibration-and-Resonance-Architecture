import subprocess
import unittest
from pathlib import Path
from scri_temporal_provenance_20261021 import RefSample,reconcile
ROOT=Path(__file__).resolve().parents[2]
REF="refs/heads/lyvra-backup-pre-update-reconcile-20261008-0655"
A="a"*40
B="b"*40
def s(sha=A,seq=1,origin="github-ref"):return RefSample(REF,sha,seq,origin)
def run_git(*a):return subprocess.run(["git","-C",str(ROOT),*a],capture_output=True,text=True,timeout=30)
class ProvenanceTests(unittest.TestCase):
 def test_stable_samples_not_continuous_history(self):
  r=reconcile((s(),s(seq=2)))
  self.assertFalse(r["continuous_history_proven"])
 def test_aba_observed(self): self.assertTrue(reconcile((s(),s(B,2),s(A,3)))["aba_observed"])
 def test_discrete_movement(self): self.assertTrue(reconcile((s(),s(B,2)))["movement_observed"])
 def test_out_of_order_reconciles(self): self.assertEqual(reconcile((s(B,2),s(A,1)))["observations"],2)
 def test_duplicate_seq_rejected(self): self.assertEqual(reconcile((s(),s(B,1)))["status"],"INCONSISTENT_SAMPLING")
 def test_missing_origin_rejected(self): self.assertEqual(reconcile((s(origin=""),))["status"],"SOURCE_INCOMPLETE")
 def test_pending_not_supersession(self): self.assertEqual(reconcile((s(),),claim="PENDING")["supersession"],"NOT_PROVEN")
 def test_deployed_without_readback_not_supersession(self): self.assertEqual(reconcile((s(),),claim="DEPLOYED")["supersession"],"NOT_PROVEN")
 def test_deployment_evidence_still_candidate(self): self.assertEqual(reconcile((s(),),claim="DEPLOYED",verified_deployment=True)["supersession"],"EVIDENCED_DEPLOYMENT_CANDIDATE")
 def test_newer_evolution_preserved(self): self.assertEqual(reconcile((s(),),current_valid=("whole","track"))["newer_valid_evolution"],["track","whole"])
 def test_no_restore(self): self.assertFalse(reconcile((s(),))["restore_approved"])
 def test_lkg_immutable_never_claimed(self): self.assertFalse(reconcile((s(),))["lkg_immutable_proven"])
 def test_real_git_observations_from_remote(self):
  readings=[]
  for n in (1,2):
   p=run_git("ls-remote","origin",REF)
   self.assertEqual(p.returncode,0)
   data=p.stdout.strip().split()
   self.assertEqual(len(data),2)
   readings.append(RefSample(data[1],data[0],n,"git-ls-remote"))
  r=reconcile(tuple(readings))
  self.assertEqual(r["status"],"OBSERVATIONS_RECONCILED")
  self.assertFalse(r["continuous_history_proven"])
if __name__=="__main__":unittest.main(verbosity=2)
