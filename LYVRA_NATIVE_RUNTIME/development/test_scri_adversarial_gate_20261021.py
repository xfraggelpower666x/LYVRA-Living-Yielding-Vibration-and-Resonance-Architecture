"""Adversarial public/private direct calls must not bypass Git-bound assessment."""
import unittest
from scri_scoped_supersession_gate_20261021 import judge,_evaluate_verified_carriers
class AdversarialBoundary(unittest.TestCase):
 def check(self,carrier):
  for fn in (judge,_evaluate_verified_carriers):
   result=fn(carrier,carrier,carrier,carrier,"f"*40)
   self.assertEqual(result["status"],"UNBOUND_DIRECT_CALL_BLOCKED")
   self.assertFalse(result["restore_approved"])
 def test_fake_current(self):self.check({"status":"CURRENT_PRODUCTIVE_VERIFIED"})
 def test_fake_deployment(self):self.check({"deployment_status":"VERIFIED"})
 def test_fake_blob(self):self.check({"blob":"a"*40})
 def test_fake_scope(self):self.check({"facet_scope":"WHOLE_LYVRA"})
 def test_fake_supersession(self):self.check({"supersession":"DEPLOYED"})
 def test_fake_checkpoint(self):self.check({"checkpoint":"REOPEN"})
if __name__=="__main__":unittest.main(verbosity=2)
