import unittest
from pathlib import Path
from scri_runner_trust_audit_20261021 import audit
ROOT=Path(__file__).resolve().parents[2]
WF=ROOT/".github/workflows/scri-isolated-regression.yml"
class RunnerTrust(unittest.TestCase):
 def test_live_checkout_workflow_read_token(self):self.assertTrue(audit(WF.read_text())["declared_token_read_only"])
 def test_live_checkout_scoped(self):self.assertTrue(audit(WF.read_text())["branch_scoped_job"])
 def test_live_checkout_no_stored_creds(self):self.assertTrue(audit(WF.read_text())["checkout_does_not_persist_credentials"])
 def test_action_ref_major_not_immutable(self):self.assertTrue(audit(WF.read_text())["mutable_major_version_action_refs"])
 def test_no_independent_permissions_assertion(self):self.assertFalse(audit(WF.read_text())["repo_permission_enforcement_verified"])
 def test_no_branch_rule_claim(self):self.assertFalse(audit(WF.read_text())["branch_protection_verified"])
 def test_no_runner_integrity_claim(self):self.assertFalse(audit(WF.read_text())["runner_process_integrity_verified"])
 def test_no_continuous_ref_claim(self):self.assertFalse(audit(WF.read_text())["ref_history_continuity_verified"])
 def test_no_restore(self):self.assertFalse(audit(WF.read_text())["restore_approved"])
 def test_missing_permissions_detected(self):self.assertFalse(audit("jobs:\n  test:\n    runs-on: ubuntu-latest")["declared_token_read_only"])
 def test_write_permission_detected(self):self.assertTrue(audit("permissions: write-all")["risky_workflow_directives"])
 def test_oidc_permission_detected(self):self.assertTrue(audit("id-token: write")["risky_workflow_directives"])
 def test_unpinned_external_action_detected(self):self.assertIn("uses: actions/checkout@v4",audit("uses: actions/checkout@v4")["mutable_major_version_action_refs"])
if __name__=="__main__":unittest.main(verbosity=2)
