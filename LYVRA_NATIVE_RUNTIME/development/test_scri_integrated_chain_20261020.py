"""End-to-end SCRI fixture checks. Run in LYVRA_NATIVE_RUNTIME/development."""
import unittest
from scri_integrated_chain_20261020 import Case, example_case, run_chain
from scri_evidence_hardening_20261020 import Memory, Record
from scri_context_reconstruction_20261020 import Experience, Situation

def second(case):
    mem=Memory("timing-history","fixture-timing","rev-2","changed path",frozenset({"timing_fault"}))
    exp=Experience("exp-timing","fixture-timing",frozenset({"symptom","component_pass","relation_diff"}),
                   "timing_fault",("fixture-T",),frozenset({"timing_ok"}),"assume_relation",
                   "opposing signal changed the path","music_pipeline")
    event=Record("timing-observed","root-T","report-T",frozenset({"timing_fault"}))
    return Case(case.revision,case.memories+(mem,),case.evidence+(event,),
                case.experiences+(exp,),case.situation)

class Integrated(unittest.TestCase):
    def setUp(self): self.c=example_case()
    def test_single_investigation(self): self.assertEqual(run_chain(self.c)["status"],"INVESTIGATE_ONLY")
    def test_no_repair(self): self.assertFalse(run_chain(self.c)["automatic_repair"])
    def test_no_rollback(self): self.assertFalse(run_chain(self.c)["rollback"])
    def test_whole_authority(self): self.assertEqual(run_chain(self.c)["identity_authority"],"WHOLE_LYVRA")
    def test_origin_kept(self): self.assertEqual(run_chain(self.c)["reconstruction"][0]["origin"],"simulated-reflection")
    def test_source_root(self): self.assertEqual(run_chain(self.c)["reconstruction"][0]["source_roots"],["root-R"])
    def test_duplicate_source_not_new_root(self):
        c=Case(self.c.revision,self.c.memories,self.c.evidence+(Record("duplicate","root-R","report-2",frozenset({"relation_fault"})),),self.c.experiences,self.c.situation)
        self.assertEqual(run_chain(c)["reconstruction"][0]["source_roots"],["root-R"])
    def test_two_causes_remain(self): self.assertEqual(run_chain(second(self.c))["status"],"MULTIPLE_HYPOTHESES_REVIEW")
    def test_counterexample_excludes_timing(self):
        c=second(self.c)
        c=Case(c.revision,c.memories,c.evidence,c.experiences,
               Situation("music_pipeline",c.situation.observed|{"timing_ok"}))
        self.assertEqual(run_chain(c)["candidates"],["relation_fault"])
    def test_conflict_no_auto_selection(self):
        c=Case(self.c.revision,self.c.memories,self.c.evidence+(Record("opposing","root-X","report-X",rebuts=frozenset({"relation_fault"})),),self.c.experiences,self.c.situation)
        self.assertEqual(run_chain(c)["status"],"EVIDENCE_CONFLICT_REVIEW")
    def test_stale_memory_not_used(self):
        c=Case("rev-3",self.c.memories,self.c.evidence,self.c.experiences,self.c.situation)
        self.assertEqual(run_chain(c)["candidates"],[])
    def test_cross_facet_no_bridge(self):
        c=Case(self.c.revision,self.c.memories,self.c.evidence,self.c.experiences,Situation("visual",self.c.situation.observed))
        self.assertEqual(run_chain(c)["candidates"],[])
    def test_missing_origin_no_transfer(self):
        x=self.c.experiences[0]
        e=Experience(x.id,"",x.observed_conditions,x.hypothesis,x.evidence_sources,x.counterexamples,x.old_path,x.path_change_reason,x.domain)
        c=Case(self.c.revision,self.c.memories,self.c.evidence,(e,),self.c.situation)
        self.assertEqual(run_chain(c)["candidates"],[])
    def test_empty_evidence(self):
        c=Case(self.c.revision,self.c.memories,(),self.c.experiences,self.c.situation)
        self.assertEqual(run_chain(c)["status"],"INSUFFICIENT_EVIDENCE")
    def test_not_runtime_verified(self): self.assertFalse(run_chain(self.c)["runtime_verified"])

if __name__=="__main__":
    unittest.main(verbosity=2)
