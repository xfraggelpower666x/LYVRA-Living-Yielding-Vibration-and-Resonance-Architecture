import unittest
from scri_open_hypothesis_generator_20261021 import Observation as O,generate
def trial(a="clock_jitter",b="buffer_contention"):
 first=[O("audio",a,"glitch","meter_1",intervention=True),O("audio",a,"glitch","meter_2",intervention=True),
        O("audio",b,"glitch","logger_1"),O("visual","color","glitch","camera",intervention=True)]
 second=first+[O("audio",a,"glitch","meter_3",-1,True),
               O("audio",b,"glitch","probe_1",1,True),O("audio",b,"glitch","probe_2",1,True)]
 return generate(first,"audio"),generate(second,"audio"),generate(second+[O("pet","greeting","smile","pet_probe",1,True)],"audio")
class OpenHypotheses(unittest.TestCase):
 def test_unseen_target_generated(self):self.assertEqual(trial()[0]["candidate"],"clock_jitter")
 def test_second_cause_present(self):self.assertIn("buffer_contention",trial()[0]["candidates"])
 def test_competing_rerank(self):self.assertEqual(trial()[1]["candidate"],"buffer_contention")
 def test_counterevidence_stored(self):self.assertIn("meter_3",trial()[1]["candidates"]["clock_jitter"]["counter_sources"])
 def test_irrelevant_stable(self):self.assertEqual(trial()[1],trial()[2])
 def test_renaming_inputs_generalizes(self):self.assertEqual(trial("new_wire_fault","unexpected_feedback")[0]["candidate"],"new_wire_fault")
 def test_distinct_names_change_result(self):self.assertEqual(trial("new_wire_fault","unexpected_feedback")[1]["candidate"],"unexpected_feedback")
 def test_single_source_abstain(self):self.assertEqual(generate([O("audio","x","noise","one",1,True)],"audio")["status"],"ABSTAIN")
 def test_observation_only_abstain(self):self.assertEqual(generate([O("audio","x","noise","a"),O("audio","x","noise","b")],"audio")["status"],"ABSTAIN")
 def test_two_ties_abstain(self):
  es=[O("audio",t,"noise",s,1,True) for t in ("x","y") for s in ("a","b")]
  self.assertEqual(generate(es,"audio")["status"],"ABSTAIN")
 def test_duplicate_source_no_independence(self):
  es=[O("audio","x","noise","a",1,True)]*3
  self.assertEqual(generate(es,"audio")["status"],"ABSTAIN")
 def test_conflict_same_source_not_positive(self):
  es=[O("audio","x","noise","a",1,True),O("audio","x","noise","a",-1,True),O("audio","x","noise","b",1,True)]
  self.assertEqual(generate(es,"audio")["status"],"ABSTAIN")
 def test_facet_isolation(self):self.assertNotIn("color",trial()[0]["candidates"])
 def test_not_causal_proof(self):self.assertFalse(trial()[0]["candidates"]["clock_jitter"]["causal_confirmed"])
 def test_no_automatic_actions(self):self.assertEqual(trial()[1]["action"],"NONE")
if __name__=="__main__":unittest.main(verbosity=2)
