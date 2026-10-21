"""Unit tests plus real Git read-only stability acceptance."""
import subprocess
import unittest
from pathlib import Path
from scri_ref_stability_20261021 import RefObservation,evaluate,assess_lkg
ROOT=Path(__file__).resolve().parents[2]
REF="refs/heads/lyvra-backup-pre-update-reconcile-20261008-0655"
def obs(sha="a"*40, seq=1, generation=1, source="GitHub-ref-readback", ref=REF):
    return RefObservation(ref,sha,generation,source,seq)
class StabilityTests(unittest.TestCase):
    def test_stable_only_observation(self):
        self.assertEqual(evaluate(obs(),obs(seq=2))["status"],"STABLE_OBSERVATION_ONLY")
    def test_aba(self):
        self.assertEqual(evaluate(obs(),obs(seq=3),[obs("b"*40,2)])["status"],"ABA_DETECTED")
    def test_move(self):
        self.assertEqual(evaluate(obs(),obs("b"*40,2))["status"],"REF_MOVED_REVIEW")
    def test_conflict(self):
        self.assertEqual(evaluate(obs(),obs(seq=2),independent_sources=(obs("b"*40,3),))["status"],"CONTRADICTORY_EVIDENCE")
    def test_generation_conflict(self):
        self.assertEqual(evaluate(obs(),obs(seq=2,generation=2))["status"],"GENERATION_CONFLICT")
    def test_missing_provenance(self):
        self.assertEqual(evaluate(obs(source=""),obs(seq=2))["status"],"PROVENANCE_INCOMPLETE")
    def test_order(self):
        self.assertEqual(evaluate(obs(),obs(seq=1))["status"],"OBSERVATION_ORDER_UNVERIFIED")
    def test_ref_name(self):
        self.assertEqual(evaluate(obs(),obs(seq=2,ref="refs/heads/another"))["status"],"REF_IDENTITY_CONFLICT")
    def test_immutability_not_inferred(self):
        self.assertFalse(evaluate(obs(),obs(seq=2))["immutability_proven"])
    def test_no_unverified_lkg(self):
        self.assertEqual(assess_lkg(True,False,False)["status"],"PROTECTION_NOT_VERIFIED")
    def test_no_auto_restore(self):
        self.assertFalse(evaluate(obs(),obs(seq=2))["restore_approved"])
    def test_real_ref_exists_and_is_git_commit(self):
        p=subprocess.run(["git","-C",str(ROOT),"ls-remote","origin",REF],capture_output=True,text=True,timeout=30)
        self.assertEqual(p.returncode,0)
        lines=p.stdout.strip().split()
        self.assertEqual(len(lines),2)
        q=subprocess.run(["git","-C",str(ROOT),"cat-file","-t",lines[0]],capture_output=True,text=True,timeout=30)
        self.assertEqual(q.stdout.strip(),"commit")
if __name__=="__main__":unittest.main(verbosity=2)
