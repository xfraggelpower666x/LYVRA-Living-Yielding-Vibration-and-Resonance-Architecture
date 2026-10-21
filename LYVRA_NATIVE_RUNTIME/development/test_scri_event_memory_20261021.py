import unittest
from scri_event_memory_20261021 import Event,form,recall,revise,example
from scri_context_reconstruction_20261020 import Situation
class EventMemory(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.memory,cls.before,cls.after,cls.later=example()
 def test_form_from_events(self):self.assertIsNotNone(self.memory)
 def test_sources_real_fixture(self):self.assertEqual(len(self.memory.experience.evidence_sources),3)
 def test_initial_candidate_not_authority(self):self.assertEqual(self.memory.status,"CANDIDATE")
 def test_initial_recall(self):self.assertEqual(self.before["status"],"INVESTIGATE_ONLY")
 def test_no_action(self):self.assertEqual(self.before["action"],"NONE")
 def test_counterevidence_revision(self):self.assertEqual(self.after.status,"COUNTEREVIDENCE")
 def test_revision_increases(self):self.assertEqual(self.after.revision,2)
 def test_no_history_mutation(self):self.assertEqual(self.memory.revision,1)
 def test_candidate_withheld_after_revision(self):self.assertIsNone(self.later["candidate"])
 def test_wrong_domain_recall_abstains(self):
  self.assertEqual(recall(self.memory,Situation("pet",frozenset({"symptom","component_pass","relation_diff"})))["status"],"DOMAIN_BOUNDARY")
 def test_irrelevant_counter_unchanged(self):
  self.assertEqual(revise(self.memory,Event("pet","pet",frozenset({"colour"}),"pet_source")),self.memory)
 def test_missing_event_rejected(self):
  self.assertIsNone(form((Event("symptom","music_pipeline",frozenset(),"source"),)))
 def test_insufficient_sources_rejected(self):
  es=[Event(k,"music_pipeline",frozenset({k}),"same") for k in ("symptom","component_pass","relation_diff")]
  self.assertIsNone(form(es))
 def test_mixed_domains_rejected(self):
  es=[Event(k,"pet" if k=="relation_diff" else "music_pipeline",frozenset({k}),k) for k in ("symptom","component_pass","relation_diff")]
  self.assertIsNone(form(es))
 def test_component_failure_rejected(self):
  es=[Event(k,"music_pipeline",frozenset({k}),k) for k in ("symptom","component_pass","relation_diff","component_failure")]
  self.assertIsNone(form(es))
if __name__=="__main__":unittest.main(verbosity=2)
