"""Adversarial tests for source-bound supersession. No external writes."""
import unittest
from copy import deepcopy
from scri_scoped_supersession_gate_20261021 import _evaluate_verified_carriers as judge
A="a"*40
B="b"*40
def fixture():
 return ({"status":"CURRENT_PRODUCTIVE_VERIFIED","current_known_whole_state":{"track_design_logical_revision":96,"track_design_version":"v3.6"}},
         {"status":"ACTIVE_CURRENT_HANDOFF","track_logical_revision":93,"track_design_version":"v3.4"},
         {"pet_runtime":{"deployment_status":"DEPLOYED_API_VERIFIED_HOST_VISUAL_READBACK_PENDING","deployment_id":"id-real"}},
         {"pet_surface":{"visual_atlas_render":"READBACK_PENDING"},"deployment_status":"success"})
def call(changes=None,**kw):
 p,h,pet,d=deepcopy(fixture());vals={"pointer":p,"handoff":h,"pet":pet,"deployment":d}
 if changes:changes(vals)
 return judge(vals["pointer"],vals["handoff"],vals["pet"],vals["deployment"],kw.get("source_commit",A))
class Adversarial(unittest.TestCase):
 def test_missing_pointer_blocks(self):
  self.assertEqual(call(lambda v:v.update(pointer={}))["whole"]["status"],"EVIDENCE_INCOMPLETE")
 def test_missing_handoff_blocks(self):
  self.assertEqual(call(lambda v:v.update(handoff={}))["track"]["status"],"EVIDENCE_INCOMPLETE")
 def test_missing_pet_blocks(self):
  self.assertEqual(call(lambda v:v.update(pet={}))["pet"]["status"],"EVIDENCE_INCOMPLETE")
 def test_missing_deployment_blocks(self):
  self.assertEqual(call(lambda v:v.update(deployment={}))["pet"]["status"],"EVIDENCE_INCOMPLETE")
 def test_bad_commit_blocks(self):
  self.assertEqual(call(source_commit="not-a-sha")["whole"]["status"],"EVIDENCE_INCOMPLETE")
 def test_wrong_commit_binding_blocks(self):
  self.assertEqual(call(source_commit=B,changes=lambda v:v["pointer"].update(source_commit=A))["whole"]["status"],"SOURCE_COMMIT_CONFLICT")
 def test_forged_pointer_status_blocks(self):
  self.assertNotEqual(call(lambda v:v["pointer"].update(status="FAKE_CURRENT"))["whole"]["status"],"PRESERVE_CURRENT")
 def test_same_or_newer_handoff_not_automatically_superseded(self):
  self.assertEqual(call(lambda v:v["handoff"].update(track_logical_revision=97))["track"]["status"],"REVIEW")
 def test_cross_facet_scope_block(self):
  self.assertFalse(call(lambda v:v["handoff"].update(facet_scope="STUDIO2"))["studio2"]["scope_transfer"])
 def test_pet_api_claim_not_independently_verified(self):
  self.assertFalse(call()["pet"]["api_readback_verified"])
 def test_pet_conflicting_deployment(self):
  self.assertEqual(call(lambda v:v["deployment"].update(deployment_status="failed"))["pet"]["status"],"DEPLOYMENT_CONFLICT_REVIEW")
 def test_pet_visual_false_success(self):
  self.assertFalse(call(lambda v:v["deployment"]["pet_surface"].update(visual_atlas_render="VERIFIED"))["pet"]["visual_readback_verified"])
 def test_checkpoint_reopen_untrusted(self):
  self.assertFalse(call(lambda v:v["handoff"].update(reopen_checkpoint=True))["checkpoints"]["reopen"])
 def test_no_mutation_or_restore(self):
  q=call();self.assertFalse(q["automatic_write"]);self.assertFalse(q["semantic_supersession_verified"])
if __name__=="__main__":unittest.main(verbosity=2)
