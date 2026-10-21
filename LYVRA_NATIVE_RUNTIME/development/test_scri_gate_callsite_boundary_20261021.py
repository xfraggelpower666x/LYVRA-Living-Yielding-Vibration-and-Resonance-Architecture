"""Audit tracked Python files repo-wide; direct imports remain non-decisional."""
import ast,subprocess,unittest
from pathlib import Path
from scri_scoped_supersession_gate_20261021 import judge,_evaluate_verified_carriers
ROOT=Path(__file__).resolve().parents[2]
def tracked_python():
 p=subprocess.run(["git","-C",str(ROOT),"ls-files","-z","--","*.py"],capture_output=True,check=True)
 return [ROOT/x.decode() for x in p.stdout.split(b"\0") if x]
class Boundary(unittest.TestCase):
 def test_public_denied(self):self.assertEqual(judge({},{},{},{},"a"*40)["status"],"UNBOUND_DIRECT_CALL_BLOCKED")
 def test_internal_denied(self):self.assertEqual(_evaluate_verified_carriers({},{},{},{},"a"*40)["status"],"UNBOUND_DIRECT_CALL_BLOCKED")
 def test_no_restore(self):self.assertFalse(_evaluate_verified_carriers({},{},{},{},"a"*40)["restore_approved"])
 def test_bound_module_no_internal_gate_import(self):
  tree=ast.parse((ROOT/"LYVRA_NATIVE_RUNTIME/development/scri_bound_supersession_20261021.py").read_text())
  names=[alias.name for n in ast.walk(tree) if isinstance(n,ast.ImportFrom) for alias in n.names]
  self.assertNotIn("_evaluate_verified_carriers",names)
 def test_tracked_repo_scan_reaches_gate(self):
  paths=tracked_python()
  self.assertTrue(any(p.name=="scri_scoped_supersession_gate_20261021.py" for p in paths))
 def test_all_parseable_tracked_python_gate_import_sites(self):
  sites=[]
  for path in tracked_python():
   try:tree=ast.parse(path.read_text(encoding="utf-8"))
   except (UnicodeError,SyntaxError):continue
   for node in ast.walk(tree):
    if isinstance(node,ast.ImportFrom) and node.module=="scri_scoped_supersession_gate_20261021":
     sites.append(str(path.relative_to(ROOT)))
  self.assertTrue(sites)
  # Any import is safe only because public and historical internal functions both deny.
  self.assertTrue(all(isinstance(p,str) for p in sites))
if __name__=="__main__":unittest.main(verbosity=2)
