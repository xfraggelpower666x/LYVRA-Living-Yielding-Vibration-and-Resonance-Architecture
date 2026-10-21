import unittest
from scri_lkg_protection_audit_20261021 import ProtectionEvidence,classify,guarded_plan
A="a"*40
B="b"*40
def p(http=403, rules=True, entries=(), hist=False, immutable=False):
 return ProtectionEvidence(http,rules,tuple(entries),"refs/heads/lkg-candidate",A,hist,immutable)
def plan(**kwargs):
 return guarded_plan(A,A,A,(),frozenset({"whole","track"}),frozenset({"studio"}),**kwargs)
class LKGProtectionTests(unittest.TestCase):
 def test_403_is_not_no_protection(self): self.assertEqual(classify(p())["branch_protection"],"ACCESS_DENIED")
 def test_403_cannot_verify_protection(self): self.assertEqual(classify(p())["status"],"PROTECTION_NOT_VERIFIED")
 def test_empty_rulesets_readable(self): self.assertEqual(classify(p())["rulesets"],"READABLE_EMPTY")
 def test_unreadable_rulesets(self): self.assertEqual(classify(p(rules=False))["rulesets"],"UNAVAILABLE")
 def test_404_ambiguous(self): self.assertEqual(classify(p(http=404))["branch_protection"],"NOT_FOUND_OR_INACCESSIBLE")
 def test_readable_policy_still_not_immutable_proof(self): self.assertFalse(classify(p(http=200,hist=True,immutable=True))["immutable_proven"])
 def test_absent_lkg_ref(self):
  e=ProtectionEvidence(200,True,(),"",A)
  self.assertEqual(classify(e)["status"],"ANCHOR_UNRESOLVED")
 def test_missing_history(self): self.assertIn("REF_HISTORY_INCOMPLETE",plan()["reasons"])
 def test_observed_aba(self):
  r=guarded_plan(A,A,A,(B,),frozenset(),frozenset())
  self.assertIn("ABA_OBSERVED",r["reasons"])
 def test_ref_move(self):
  r=guarded_plan(A,A,B,(A,),frozenset(),frozenset())
  self.assertIn("REF_MOVED",r["reasons"])
 def test_source_ref_mismatch(self):
  r=guarded_plan(B,A,A,(A,),frozenset(),frozenset())
  self.assertIn("ANCHOR_REF_MISMATCH",r["reasons"])
 def test_newer_evolution_protected(self):
  r=guarded_plan(A,A,A,(A,),frozenset({"whole","track"}),frozenset({"track"}))
  self.assertIn("NEWER_VALID_EVOLUTION_COLLISION",r["reasons"])
 def test_competing_supersession(self):
  r=guarded_plan(A,A,A,(A,),frozenset(),frozenset(),("deployed","pending"))
  self.assertIn("SUPERSESSION_CONFLICT",r["reasons"])
 def test_dependent_sources(self):
  r=guarded_plan(A,A,A,(A,),frozenset(),frozenset(),source_roots=("root-X","root-X"))
  self.assertIn("DEPENDENT_SOURCE_ROOTS",r["reasons"])
 def test_nominal_plan_not_approval(self):
  r=guarded_plan(A,A,A,(A,),frozenset({"whole"}),frozenset({"track"}))
  self.assertEqual(r["status"],"PLAN_REVIEW_ONLY")
  self.assertFalse(r["restore_approved"])
 def test_authority_preserved(self): self.assertEqual(plan()["authority"],"WHOLE_LYVRA")
 def test_no_actions(self): self.assertEqual(plan()["action"],"NONE")
if __name__=="__main__":unittest.main(verbosity=2)
