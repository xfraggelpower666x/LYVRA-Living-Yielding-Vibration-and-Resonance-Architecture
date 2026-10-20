"""SCRI live-shape adapter fixtures (no network or mutations)."""
import unittest
from scri_github_evidence_adapter_20261020 import parse, compatible_with_scri
from scri_integrated_chain_20261020 import example_case, run_chain
P="253d2363f1483e2bcb57bb8dbe82a62141fab2e5"
D="2e3e03e042844f887a7de8f7d96ffed7d919268c"
A="59cafb813c5f75efed3cddb3cfe0d5cb737f77e1"
def sample():
    return parse({"commit":{"sha":P}},{"commit":{"sha":D}},
                 {"sha":D,"parents":[{"sha":A}],"files":[{"filename":"LYVRA_NATIVE_RUNTIME/development/file.py"}],
                  "html_url":"https://github.com/example/repo/commit/"+D},
                 [{"path":"LYVRA_NATIVE_RUNTIME/recovery/old.md","sha":"c43d3b01ae04f07684d15c0a46cdbe13de479a21","type":"file"}])
class AdapterTests(unittest.TestCase):
    def test_valid_shape(self): self.assertEqual(sample()["status"],"READ_ONLY_EVIDENCE")
    def test_prod_sha(self): self.assertEqual(sample()["evidence"].production_sha,P)
    def test_parent_observed(self): self.assertEqual(sample()["evidence"].candidate_parents,(A,))
    def test_no_false_recovery_approval(self): self.assertFalse(sample()["recovery_ready"])
    def test_no_false_supersession(self): self.assertFalse(sample()["supersession_verified"])
    def test_recovery_file_is_not_commit(self): self.assertTrue(sample()["evidence"].recovery_refs[0][0].endswith("old.md"))
    def test_invalid_sha(self): self.assertEqual(parse({"commit":{"sha":"wrong"}},{"commit":{"sha":D}},{"sha":D},[])["status"],"INVALID_SHA_OR_MISSING")
    def test_wrong_commit(self): self.assertEqual(parse({"commit":{"sha":P}},{"commit":{"sha":D}},{"sha":A},[])["status"],"UNMATCHED_COMMIT_READ")
    def test_invalid_parent(self): self.assertEqual(parse({"commit":{"sha":P}},{"commit":{"sha":D}},{"sha":D,"parents":[{"sha":"bad"}]},[])["status"],"INVALID_PARENT")
    def test_no_auto_repair(self): self.assertFalse(sample()["automatic_repair"])
    def test_chain_link_preserves_authority(self):
        r=compatible_with_scri(sample(),run_chain(example_case()))
        self.assertEqual(r["status"],"CANDIDATE_FOR_CAUSAL_REVIEW")
        self.assertEqual(r["action"],"NONE")
    def test_refuse_unsafe_chain(self):
        self.assertEqual(compatible_with_scri(sample(),{"identity_authority":"FOREIGN","automatic_repair":False})["status"],"AUTHORITY_BOUNDARY_FAILURE")
    def test_no_runtime_verification(self): self.assertFalse(sample()["runtime_verified"])
if __name__=="__main__":
    unittest.main(verbosity=2)
