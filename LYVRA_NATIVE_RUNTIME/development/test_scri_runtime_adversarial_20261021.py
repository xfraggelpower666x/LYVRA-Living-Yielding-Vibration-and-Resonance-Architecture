"""Adversarial bounded Git ref and Python runtime convention tests."""
import importlib,subprocess,unittest
from pathlib import Path
from unittest.mock import patch
import scri_bound_supersession_20261021 as bound
import scri_scoped_supersession_gate_20261021 as gate
from scri_git_blob_binding_20261021 import PATHS
ROOT=Path(__file__).resolve().parents[2]
def git(*args):
 return subprocess.check_output(["git","-C",str(ROOT),*args],text=True,timeout=35).strip()
class RuntimeAdversarial(unittest.TestCase):
 @classmethod
 def setUpClass(cls):
  cls.prod=git("ls-remote","origin","refs/heads/lyvra").split()[0]
  cls.bindings={k:{"commit":cls.prod,"path":p,"blob":git("rev-parse",cls.prod+":"+p)} for k,p in PATHS.items()}
 def test_dynamic_import_public_denied(self):
  mod=importlib.import_module("scri_scoped_supersession_gate_20261021")
  self.assertEqual(getattr(mod,"judge")({},{},{},{},"a"*40)["status"],"UNBOUND_DIRECT_CALL_BLOCKED")
 def test_dynamic_import_internal_denied(self):
  mod=importlib.import_module("scri_scoped_supersession_gate_20261021")
  self.assertEqual(getattr(mod,"_evaluate_verified_carriers")({},{},{},{},"a"*40)["status"],"UNBOUND_DIRECT_CALL_BLOCKED")
 def test_live_remote_ref_checked(self):
  with patch.object(bound,"_remote_head",return_value="f"*40):
   self.assertEqual(bound.assess(self.prod,self.bindings,self.prod)["status"],"LIVE_REF_MISMATCH")
 def test_ref_switch_after_readback(self):
  with patch.object(bound,"_remote_head",side_effect=[self.prod,"f"*40]):
   self.assertEqual(bound.assess(self.prod,self.bindings,self.prod)["status"],"REF_CHANGED_DURING_REVIEW")
 def test_actual_real_remote_binding(self):
  self.assertEqual(bound.assess(self.prod,self.bindings,self.prod)["status"],"BOUND_REVIEW_ONLY")
 def test_invalid_blob_still_rejected(self):
  d={k:dict(v) for k,v in self.bindings.items()};d["whole"]["blob"]="0"*40
  self.assertEqual(bound.assess(self.prod,d,self.prod)["status"],"GIT_BINDING_REJECTED")
 def test_patched_verify_is_not_a_security_boundary(self):
  # Detection/documentation only. A hostile Python process can replace functions.
  self.assertTrue(callable(bound.verify))
  self.assertFalse(bound.assess(self.prod,self.bindings,self.prod)["restore_approved"])
 def test_no_auto_write_even_with_valid_git(self):
  self.assertEqual(bound.assess(self.prod,self.bindings,self.prod)["action"],"NONE")
if __name__=="__main__":unittest.main(verbosity=2)
