import unittest
from scri_behavioral_sequence_20261021 import trial,update,decide,LearningState
from scri_causal_experience_probe_20261020 import Experience,Situation
class ThreeStageBehavior(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.first,cls.second,cls.third=trial()
 def test_first_relevant(self):self.assertEqual(self.first["status"],"INVESTIGATE_NOT_REPAIR")
 def test_first_candidate(self):self.assertEqual(self.first["candidate"],"investigate_relation_fault")
 def test_first_investigate(self):self.assertTrue(self.first["investigate"])
 def test_second_contradicts(self):self.assertEqual(self.second["status"],"COUNTEREVIDENCE")
 def test_second_candidate_withheld(self):self.assertIsNone(self.second["candidate"])
 def test_second_investigation_suspended(self):self.assertFalse(self.second["investigate"])
 def test_third_does_not_change_causal_status(self):self.assertEqual(self.third["status"],self.second["status"])
 def test_third_does_not_restore_candidate(self):self.assertEqual(self.third["candidate"],self.second["candidate"])
 def test_irrelevant_is_retained_separately(self):self.assertEqual(self.third["unrelated_retained"],("unrelated_colour","pet_greeting"))
 def test_no_actions_in_sequence(self):self.assertTrue(all(not s["auto_action"] for s in trial()))
 def test_facet_does_not_change(self):self.assertTrue(all(s["facet"]=="music_pipeline" for s in trial()))
 def test_no_mutable_history(self):
  a,b,c=trial();self.assertEqual(a["status"],"INVESTIGATE_NOT_REPAIR")
 def test_invalid_transition(self):
  e=Experience("id","source",frozenset({"a","b"}),"relation",("e",),frozenset())
  s=LearningState(e,Situation(frozenset({"a","b"})))
  with self.assertRaises(ValueError):update(s,"recovery",("x",))
if __name__=="__main__":unittest.main(verbosity=2)
