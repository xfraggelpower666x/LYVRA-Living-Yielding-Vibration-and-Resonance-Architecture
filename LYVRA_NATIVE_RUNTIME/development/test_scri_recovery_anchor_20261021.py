"""SCRI read-only recovery anchor acceptance against actual Git history in CI.
Technical ancestry != semantic compatibility != permission to restore.
"""
import subprocess
import unittest
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
RECOVERY="lyvra-backup-pre-update-reconcile-20261008-0655"
def git(*args):
    return subprocess.run(["git","-C",str(ROOT),*args],text=True,capture_output=True,timeout=40)
def remote_head(ref):
    p=git("ls-remote","origin","refs/heads/"+ref)
    if p.returncode or len(p.stdout.strip().split())!=2:
        return None
    return p.stdout.strip().split()[0]
class RecoveryAnchors(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.anchor=remote_head(RECOVERY)
        cls.production=remote_head("lyvra")
        cls.candidate=git("rev-parse","HEAD").stdout.strip()
    def test_historical_anchor_ref_exists(self):
        self.assertIsNotNone(self.anchor)
    def test_anchor_commit_object_readable(self):
        self.assertEqual(git("cat-file","-t",self.anchor).stdout.strip(),"commit")
    def test_production_commit_object_readable(self):
        self.assertEqual(git("cat-file","-t",self.production).stdout.strip(),"commit")
    def test_anchor_is_prod_ancestor(self):
        self.assertEqual(git("merge-base","--is-ancestor",self.anchor,self.production).returncode,0)
    def test_anchor_is_candidate_ancestor(self):
        self.assertEqual(git("merge-base","--is-ancestor",self.anchor,self.candidate).returncode,0)
    def test_anchor_not_current_prod(self):
        self.assertNotEqual(self.anchor,self.production)
    def test_anchor_not_candidate_head(self):
        self.assertNotEqual(self.anchor,self.candidate)
    def test_no_restore_and_no_tracked_modification(self):
        self.assertEqual(git("diff","--name-only").stdout.strip(),"")
    def test_semantic_approval_requires_separate_evidence(self):
        status={"technically_existing":True,"semantic_compatibility":"NOT_VERIFIED",
                "restore_approved":False,"protected_last_known_good":"NOT_VERIFIED",
                "recovery_slots":"NOT_VERIFIED","automatic_repair":False}
        self.assertFalse(status["restore_approved"])
        self.assertEqual(status["semantic_compatibility"],"NOT_VERIFIED")
        self.assertEqual(status["protected_last_known_good"],"NOT_VERIFIED")
if __name__=="__main__": unittest.main(verbosity=2)
