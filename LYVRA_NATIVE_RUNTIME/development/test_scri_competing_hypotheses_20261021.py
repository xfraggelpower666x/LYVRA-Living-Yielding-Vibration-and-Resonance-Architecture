import unittest
from scri_competing_hypotheses_20261021 import Evidence,rank,sequence
class Competition(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.first,cls.second,cls.third=sequence()
 def test_two_alternatives(self):self.assertEqual(set(self.first["alternatives"]),{"component_fault","relation_fault"})
 def test_initial_relation_selected(self):self.assertEqual(self.first["candidate"],"relation_fault")
 def test_initial_independent_sources(self):self.assertEqual(len(self.first["alternatives"]["relation_fault"]["sources"]),3)
 def test_counterevidence_revises_selection(self):self.assertEqual(self.second["candidate"],"component_fault")
 def test_relevant_scores_change(self):self.assertNotEqual(self.first["alternatives"],self.second["alternatives"])
 def test_irrelevance_preserves_candidate(self):self.assertEqual(self.third["candidate"],self.second["candidate"])
 def test_irrelevance_preserves_scores(self):self.assertEqual(self.third["alternatives"],self.second["alternatives"])
 def test_facet_stable(self):self.assertTrue(all(r["facet"]=="music_pipeline" for r in sequence()))
 def test_actions_none(self):self.assertTrue(all(r["action"]=="NONE" for r in sequence()))
 def test_no_live_runtime_claim(self):self.assertTrue(all(not r["runtime_verified"] for r in sequence()))
 def test_single_source_abstains(self):self.assertEqual(rank([Evidence("relation_diff","single")])["status"],"ABSTAIN")
 def test_no_positive_evidence_abstains(self):self.assertEqual(rank([])["status"],"ABSTAIN")
 def test_unrelated_facet_abstains(self):self.assertEqual(rank([Evidence("component_failure","x","studio2"),Evidence("symptom","y","studio2")])["status"],"ABSTAIN")
 def test_duplicate_same_source_cannot_fake_independence(self):self.assertEqual(rank([Evidence("relation_diff","one"),Evidence("relation_diff","one")])["status"],"ABSTAIN")
 def test_independent_reversal_is_scoped(self):self.assertIn("second_test",self.second["alternatives"]["component_fault"]["sources"])
if __name__=="__main__":unittest.main(verbosity=2)
