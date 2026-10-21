import unittest
from scri_event_sequence_inference_20261021 import Event as E
from scri_causal_chain_adapter_20261021 import derive,recall,revise
def series(a="oscillation",b="dropout",facet="track"):
 return [E(facet,"r1",1,a,"probe_a","intervention"),E(facet,"r1",2,b,"meter_a"),
         E(facet,"r2",1,a,"probe_b","intervention"),E(facet,"r2",2,b,"meter_b")]
def counter(a="oscillation",b="dropout",facet="track"):
 return [E(facet,"r3",1,a,"probe_c","intervention"),E(facet,"r3",2,b,"refuter","refutation")]
class Chain(unittest.TestCase):
 def test_from_unlabeled_events(self):self.assertEqual(derive(series(),"track").relation,("oscillation","dropout"))
 def test_scoped_memory(self):self.assertEqual(derive(series(),"track").facet,"track")
 def test_sources_preserved(self):self.assertIn("probe_a",derive(series(),"track").sources)
 def test_runs_preserved(self):self.assertEqual(derive(series(),"track").runs,("r1","r2"))
 def test_later_recall(self):self.assertEqual(recall(derive(series(),"track"),series(),"track")["status"],"INVESTIGATE_ONLY")
 def test_different_facet_recall(self):self.assertEqual(recall(derive(series(),"track"),series(),"pet")["status"],"DOMAIN_BOUNDARY")
 def test_unrelated_not_recalled(self):self.assertEqual(recall(derive(series(),"track"),[],"track")["status"],"INSUFFICIENT_CONTEXT")
 def test_revise_counter(self):
  m=derive(series(),"track");self.assertEqual(revise(m,series()+counter()).status,"COUNTEREVIDENCE")
 def test_revision_increment(self):
  m=derive(series(),"track");self.assertEqual(revise(m,series()+counter()).revision,2)
 def test_newer_state_keeps_original(self):
  m=derive(series(),"track");revise(m,series()+counter());self.assertEqual(m.revision,1)
 def test_revised_not_recalled(self):
  m=derive(series(),"track");n=revise(m,series()+counter());self.assertEqual(recall(n,series(),"track")["status"],"REVISED_COUNTEREVIDENCE")
 def test_irrelevant_facet_does_not_revise(self):
  m=derive(series(),"track");self.assertEqual(revise(m,series()+counter(facet="pet")),m)
 def test_duplicate_counter_idempotent(self):
  m=derive(series(),"track");n=revise(m,series()+counter());self.assertEqual(revise(n,series()+counter()),n)
 def test_unseen_names_same_chain(self):
  m=derive(series("new_root","new_effect","studio2"),"studio2")
  self.assertEqual(recall(m,series("new_root","new_effect","studio2"),"studio2")["candidate"],("new_root","new_effect"))
 def test_no_action(self):self.assertEqual(recall(derive(series(),"track"),series(),"track")["action"],"NONE")
 def test_without_support_does_not_form(self):self.assertIsNone(derive(series()[:2],"track"))
if __name__=="__main__":unittest.main(verbosity=2)
