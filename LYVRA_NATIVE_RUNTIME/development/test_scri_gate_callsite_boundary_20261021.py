"""Public unbound gate must never yield decisions; read-only source callsite audit."""
import ast
import unittest
from pathlib import Path
from scri_scoped_supersession_gate_20261021 import judge
ROOT=Path(__file__).resolve().parent
class PublicBoundary(unittest.TestCase):
 def test_unbound_no_current(self):
  self.assertEqual(judge({"status":"CURRENT_PRODUCTIVE_VERIFIED"},{},{},{},"a"*40)["status"],"UNBOUND_DIRECT_CALL_BLOCKED")
 def test_unbound_no_supersession(self):
  self.assertFalse(judge({},{},{},{},"a"*40)["semantic_supersession_verified"])
 def test_unbound_no_restore(self):
  self.assertFalse(judge({},{},{},{},"a"*40)["restore_approved"])
 def test_unbound_no_action(self):
  self.assertEqual(judge({},{},{},{},"a"*40)["action"],"NONE")
 def test_bound_path_imports_internal_function(self):
  tree=ast.parse((ROOT/"scri_bound_supersession_20261021.py").read_text())
  names=[n.name for node in ast.walk(tree) if isinstance(node,ast.ImportFrom) for n in node.names]
  self.assertIn("_evaluate_verified_carriers",names)
  self.assertNotIn("judge",names)
 def test_public_gate_never_calls_internal(self):
  tree=ast.parse((ROOT/"scri_scoped_supersession_gate_20261021.py").read_text())
  method=next(n for n in tree.body if isinstance(n,ast.FunctionDef) and n.name=="judge")
  self.assertFalse(any(isinstance(x,ast.Call) and isinstance(x.func,ast.Name) and x.func.id=="_evaluate_verified_carriers" for x in ast.walk(method)))
 def test_only_bound_production_module_imports_internal(self):
  modules=list(ROOT.glob("scri_*_20261021.py"))
  offenders=[]
  for module in modules:
   if module.name in ("scri_bound_supersession_20261021.py","scri_scoped_supersession_gate_20261021.py"):continue
   tree=ast.parse(module.read_text())
   if any(isinstance(x,ast.Name) and x.id=="_evaluate_verified_carriers" for x in ast.walk(tree)):offenders.append(module.name)
  self.assertFalse(offenders,offenders)
 def test_only_fixture_tests_import_internal(self):
  allowed={"test_scri_scoped_supersession_gate_20261021.py","test_scri_adversarial_gate_20261021.py","test_scri_gate_callsite_boundary_20261021.py"}
  offenders=[]
  for module in ROOT.glob("test_scri_*_20261021.py"):
   if module.name in allowed:continue
   if "_evaluate_verified_carriers" in module.read_text():offenders.append(module.name)
  self.assertFalse(offenders,offenders)
if __name__=="__main__":unittest.main(verbosity=2)
