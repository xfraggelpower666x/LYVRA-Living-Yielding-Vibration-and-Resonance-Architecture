import unittest
from scri_event_sequence_inference_20261021 import Event as E,infer
def events(a="phase_pulse",b="latency_spike",facet="audio"):
 return [E(facet,"r1",1,a,"probe_1","intervention"),E(facet,"r1",2,b,"meter_1"),
         E(facet,"r2",1,a,"probe_2","intervention"),E(facet,"r2",2,b,"meter_2")]
class TemporalCausal(unittest.TestCase):
 def test_novel_names(self):self.assertEqual(infer(events(),"audio")["candidate"],("phase_pulse","latency_spike"))
 def test_unknown_second_context(self):self.assertEqual(infer(events("cache_flush","frame_pause","studio2"),"studio2")["candidate"],("cache_flush","frame_pause"))
 def test_no_target_field_input(self):self.assertFalse(hasattr(events()[0],"target"))
 def test_intervention_not_proof(self):self.assertFalse(infer(events(),"audio")["relations"][("phase_pulse","latency_spike")]["causal_confirmed"])
 def test_temporal_only_abstains(self):
  es=[E("audio","r1",1,"x","a"),E("audio","r1",2,"y","b"),E("audio","r2",1,"x","c"),E("audio","r2",2,"y","d")]
  self.assertEqual(infer(es,"audio")["status"],"ABSTAIN")
 def test_observed_order_is_not_intervention(self):
  es=[E("audio","r1",1,"x","a"),E("audio","r1",2,"y","b")]
  self.assertEqual(infer(es,"audio")["relations"][("x","y")]["status"],"TEMPORAL_ASSOCIATION_ONLY")
 def test_counterevidence_revokes(self):
  es=events()+[E("audio","r3",1,"phase_pulse","probe_3","intervention"),E("audio","r3",2,"latency_spike","refuter","refutation")]
  self.assertEqual(infer(es,"audio")["status"],"ABSTAIN")
 def test_counter_source_tracked(self):
  es=events()+[E("audio","r3",1,"phase_pulse","probe_3","intervention"),E("audio","r3",2,"latency_spike","refuter","refutation")]
  self.assertIn("refuter",infer(es,"audio")["relations"][("phase_pulse","latency_spike")]["counter_sources"])
 def test_irrelevant_pet_stable(self):
  first=infer(events(),"audio")
  extras=[E("pet","r4",1,"greeting","pet_probe","intervention"),E("pet","r4",2,"smile","pet_meter")]
  self.assertEqual(first,infer(events()+extras,"audio"))
 def test_visual_facet_stable(self):
  self.assertEqual(infer(events()+events("hue","flicker","visual"),"audio"),infer(events(),"audio"))
 def test_same_source_not_independent(self):
  es=[E("audio",run,1,"x","single","intervention") for run in ("r1","r2")]
  es +=[E("audio",run,2,"y","meter") for run in ("r1","r2")]
  self.assertEqual(infer(es,"audio")["status"],"ABSTAIN")
 def test_single_run_insufficient(self):self.assertEqual(infer(events()[:2],"audio")["status"],"ABSTAIN")
 def test_out_of_window_does_not_create_relation(self):
  es=[E("audio","r1",1,"x","a","intervention"),E("audio","r1",20,"y","b")]
  self.assertFalse(infer(es,"audio")["relations"])
 def test_backward_time_not_causal(self):
  es=[E("audio","r1",5,"x","a","intervention"),E("audio","r1",2,"y","b")]
  self.assertNotIn(("x","y"),infer(es,"audio")["relations"])
 def test_two_competing_supported_abstains(self):
  es=events()+events("other_pulse","other_effect")
  self.assertEqual(infer(es,"audio")["status"],"ABSTAIN")
 def test_no_action(self):self.assertEqual(infer(events(),"audio")["action"],"NONE")
 def test_no_runtime_claim(self):self.assertFalse(infer(events(),"audio")["runtime_verified"])
if __name__=="__main__":unittest.main(verbosity=2)
