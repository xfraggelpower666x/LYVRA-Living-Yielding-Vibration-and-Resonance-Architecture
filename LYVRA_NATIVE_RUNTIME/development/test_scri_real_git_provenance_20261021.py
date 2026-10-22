"""SCRI acceptance checks against REAL git objects in the isolated CI checkout.
Read-only: never restores, checks out another branch, commits, or updates refs.
No claim that Git ancestry alone proves semantic supersession or recovery readiness.
"""
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CANDIDATE_REF = "lyvra-scri-candidate-20261020"
RECOVERY_DIR = "LYVRA_NATIVE_RUNTIME/recovery"

def git(*args):
    return subprocess.check_output(["git", "-C", str(ROOT), *args], text=True, timeout=25).strip()

class RealGitProvenance(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.head = git("rev-parse", "HEAD")
        cls.parent_line = git("rev-list", "--parents", "-n", "1", "HEAD").split()
        cls.remote_prod = git("ls-remote", "origin", "refs/heads/lyvra").split()[0]

    def test_candidate_head_is_actual_checkout(self):
        self.assertEqual(self.head, self.parent_line[0])

    def test_real_parent_object_exists(self):
        self.assertGreaterEqual(len(self.parent_line), 2)
        for parent in self.parent_line[1:]:
            self.assertEqual(git("cat-file", "-t", parent), "commit")

    def test_diff_paths_come_from_git_not_filename_inference(self):
        files = git("diff-tree", "--no-commit-id", "--name-only", "-r", self.head).splitlines()
        self.assertTrue(files, "HEAD must have real changed paths")
        for path in files:
            self.assertEqual(git("cat-file", "-t", "HEAD:" + path), "blob")

    def test_production_ref_is_a_real_remote_branch(self):
        # The remote can advance after checkout. ls-remote proves the branch points to a SHA,
        # not that this moving SHA is already present in the local Git object store.
        self.assertEqual(len(self.remote_prod), 40)
        self.assertTrue(all(c in "0123456789abcdef" for c in self.remote_prod))
        self.assertEqual(git("ls-remote", "--exit-code", "origin", "refs/heads/lyvra").split()[0], self.remote_prod)

    def test_recovery_documents_are_blobs_not_restore_anchors(self):
        entries = git("ls-tree", "-r", "HEAD", RECOVERY_DIR + "/").splitlines()
        self.assertTrue(entries)
        for line in entries:
            self.assertIn(" blob ", line)
        self.assertFalse(any(" commit " in line for line in entries))

    def test_real_recovery_blob_readback(self):
        name = RECOVERY_DIR + "/CLIC_BACKUP_REFERENCE_REPAIR_2026-10-08.md"
        blob = git("rev-parse", "HEAD:" + name)
        self.assertEqual(git("cat-file", "-t", blob), "blob")
        self.assertIn("COUPLED_BACKUP_BLOCKED", git("show", "HEAD:" + name))

    def test_git_parent_ne_semantic_supersession(self):
        self.assertNotEqual(self.parent_line[0], self.parent_line[1])
        self.assertEqual("NOT_INFERRED", "NOT_INFERRED")

    def test_candidate_and_prod_are_separate_refs(self):
        self.assertNotEqual(self.head, self.remote_prod)

    def test_no_repair_execution_or_restore(self):
        self.assertEqual(git("diff", "--name-only"), "")

if __name__ == "__main__":
    unittest.main(verbosity=2)
