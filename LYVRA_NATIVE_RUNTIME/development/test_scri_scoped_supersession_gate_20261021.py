"""Source gate boundary regressions; real positive assessments live in bound suite."""
import unittest
from scri_scoped_supersession_gate_20261021 import judge,_evaluate_verified_carriers
class PublicBoundary(unittest.TestCase):
 def test_judge_blocks(self):
  self.assertEqual(judge({},{},{},{},"a"*40)["status"],"UNBOUND_DIRECT_CALL_BLOCKED")
 def test_internal_blocks(self):
  self.assertEqual(_evaluate_verified_carriers({},{},{},{},"a"*40)["status"],"UNBOUND_DIRECT_CALL_BLOCKED")
 def test_no_restore(self):
  self.assertFalse(judge({},{},{},{},"a"*40)["restore_approved"])
 def test_no_supersession(self):
  self.assertFalse(_evaluate_verified_carriers({},{},{},{},"a"*40)["semantic_supersession_verified"])
 def test_no_action(self):
  self.assertEqual(judge({},{},{},{},"a"*40)["action"],"NONE")
if __name__=="__main__":unittest.main(verbosity=2)
