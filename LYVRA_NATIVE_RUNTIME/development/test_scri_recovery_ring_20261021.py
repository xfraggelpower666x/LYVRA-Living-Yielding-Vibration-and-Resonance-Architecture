"""Read-only SCRI ring and selective preservation regression suite."""
import unittest
from scri_recovery_ring_20261021 import Snapshot,Ring,plan_rotation,plan_selective_restore

FACETS=frozenset({"whole","track","studio"})
def snap(id="old",rev=4,g=1,verified=True,superseded=False):
    return Snapshot(id,verified,g,FACETS,rev,superseded)
def ring(anchor=None,lkg=None):
    slots=[None]*10
    if anchor: slots[anchor.generation%10]=anchor
    return Ring(tuple(slots),lkg)
class RecoveryRingTests(unittest.TestCase):
    def setUp(self):
        self.old=snap()
        self.lkg=snap("protected-lkg",rev=9,g=99)
        self.r=ring(self.old,self.lkg)
    def test_ten_slots_required(self):
        with self.assertRaises(ValueError): Ring((None,)*9,None)
    def test_rotation_plan_only(self):
        r=plan_rotation(self.r,snap("new",rev=9,g=11),10)
        self.assertEqual(r["status"],"PLAN_ONLY")
        self.assertEqual(r["action"],"NONE")
    def test_lkg_unchanged_after_rotation(self):
        self.assertEqual(plan_rotation(self.r,snap("new",rev=9,g=11),10)["ring"].last_known_good,self.lkg)
    def test_original_ring_immutable(self):
        plan_rotation(self.r,snap("new",rev=9,g=11),10)
        self.assertEqual(self.r.slots[1],self.old)
    def test_same_generation_cannot_overwrite(self):
        self.assertEqual(plan_rotation(self.r,snap("other",g=1),10)["status"],"BLOCKED")
    def test_older_generation_cannot_overwrite(self):
        self.assertEqual(plan_rotation(self.r,snap("older",g=-9),10)["status"],"BLOCKED")
    def test_unverified_anchor_not_rotated(self):
        self.assertEqual(plan_rotation(self.r,snap(verified=False,g=11),10)["status"],"REVIEW")
    def test_superseded_anchor_not_rotated(self):
        self.assertEqual(plan_rotation(self.r,snap(g=11,superseded=True),10)["status"],"REVIEW")
    def test_future_revision_not_rotated(self):
        self.assertEqual(plan_rotation(self.r,snap(rev=15,g=11),10)["status"],"REVIEW")
    def test_old_anchor_requires_new_evolution_review(self):
        r=plan_selective_restore(self.r,self.old,frozenset({"track"}),frozenset({"whole","studio"}),10)
        self.assertIn("NEWER_VALID_EVOLUTION_NOT_EVALUATED",r["reasons"])
    def test_selective_scope_does_not_include_healthy_facets(self):
        r=plan_selective_restore(self.r,self.old,frozenset({"track"}),frozenset({"whole","studio"}),10, supersession_proven=True)
        self.assertEqual(r["status"],"SELECTIVE_PLAN_REVIEW")
        self.assertEqual(r["preserve"],["studio","whole"])
    def test_protected_facet_collision(self):
        r=plan_selective_restore(self.r,self.old,frozenset({"whole","track"}),frozenset({"whole"}),10,supersession_proven=True)
        self.assertIn("PROTECTED_FACET_COLLISION",r["reasons"])
    def test_conflicting_evidence(self):
        r=plan_selective_restore(self.r,self.old,frozenset({"track"}),frozenset({"whole"}),10,True,True)
        self.assertIn("EVIDENCE_CONFLICT",r["reasons"])
    def test_unregistered_anchor(self):
        r=plan_selective_restore(self.r,snap("outsider",g=5),frozenset({"track"}),frozenset({"whole"}),10)
        self.assertIn("ANCHOR_UNREGISTERED",r["reasons"])
    def test_superseded_restore_block(self):
        old=snap(superseded=True)
        r=plan_selective_restore(ring(old),old,frozenset({"track"}),frozenset({"whole"}),10)
        self.assertIn("ANCHOR_SUPERSEDED",r["reasons"])
    def test_no_auto_restore_even_if_review_passes(self):
        r=plan_selective_restore(self.r,self.old,frozenset({"track"}),frozenset({"whole"}),10,supersession_proven=True)
        self.assertFalse(r["restore_approved"])
        self.assertFalse(r["automatic_repair"])
        self.assertEqual(r["action"],"NONE")
    def test_last_known_good_protected_even_as_source(self):
        r=plan_selective_restore(self.r,self.lkg,frozenset({"track"}),frozenset({"whole"}),10,supersession_proven=True)
        self.assertEqual(r["source_anchor"],"protected-lkg")
        self.assertIs(self.r.last_known_good,self.lkg)
    def test_unknown_scope(self):
        r=plan_selective_restore(self.r,self.old,frozenset({"foreign"}),frozenset({"whole"}),10, supersession_proven=True)
        self.assertIn("SCOPE_NOT_GROUNDED",r["reasons"])
if __name__=="__main__": unittest.main(verbosity=2)
