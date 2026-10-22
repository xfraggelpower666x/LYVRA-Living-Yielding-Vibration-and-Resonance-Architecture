import unittest,tempfile
from pathlib import Path
from scri_event_sequence_inference_20261021 import Event as E
from scri_persistent_runtime_adapter_20261022 import process,load,store
def evidence(facet="music",a="pulse",b="drop"):
 return [E(facet,"r1",1,a,"i1","intervention"),E(facet,"r1",2,b,"m1"),E(facet,"r2",1,a,"i2","intervention"),E(facet,"r2",2,b,"m2")]
def refute(facet="music",a="pulse",b="drop"):
 return [E(facet,"r3",1,a,"i3","intervention"),E(facet,"r3",2,b,"refuter","refutation")]
class Persistent(unittest.TestCase):
 def setUp(self):self.tmp=tempfile.TemporaryDirectory();self.p=Path(self.tmp.name)/"music.json"
 def tearDown(self):self.tmp.cleanup()
 def test_first_pass(self):self.assertEqual(process(self.p,"music",evidence())["decision"]["status"],"INVESTIGATE_ONLY")
 def test_file_created(self):process(self.p,"music",evidence());self.assertTrue(self.p.is_file())
 def test_reload(self):process(self.p,"music",evidence());self.assertEqual(load(self.p,"music").relation,("pulse","drop"))
 def test_restart(self):process(self.p,"music",evidence());self.assertEqual(process(self.p,"music",evidence())["decision"]["candidate"],("pulse","drop"))
 def test_refutation_revises(self):
  process(self.p,"music",evidence());r=process(self.p,"music",evidence()+refute())
  self.assertEqual((r["memory"].revision,r["decision"]["status"]),(2,"REVISED_COUNTEREVIDENCE"))
 def test_refutation_survives_restart(self):
  process(self.p,"music",evidence());process(self.p,"music",evidence()+refute())
  self.assertEqual(process(self.p,"music",evidence())["decision"]["status"],"REVISED_COUNTEREVIDENCE")
 def test_revision_idempotent(self):
  process(self.p,"music",evidence());process(self.p,"music",evidence()+refute())
  self.assertEqual(process(self.p,"music",evidence()+refute())["memory"].revision,2)
 def test_foreign_data_no_revision(self):
  process(self.p,"music",evidence());self.assertEqual(process(self.p,"music",evidence("pet")+refute("pet"))["memory"].revision,1)
 def test_cross_facet_load_denied(self):
  process(self.p,"music",evidence())
  with self.assertRaises(ValueError):load(self.p,"pet")
 def test_cross_facet_write_denied(self):
  mem=process(self.p,"music",evidence())["memory"]
  with self.assertRaises(ValueError):store(self.p,"pet",mem)
 def test_bad_facet_denied(self):
  with self.assertRaises(ValueError):process(self.p,"../x",evidence())
 def test_unrelated_no_memory(self):self.assertEqual(process(self.p,"music",evidence()[:2])["decision"]["status"],"ABSTAIN")
 def test_novel_labels(self):
  p=Path(self.tmp.name)/"new.json";self.assertEqual(process(p,"studio2",evidence("studio2","cache","frame"))["memory"].relation,("cache","frame"))
 def test_invalid_schema(self):
  self.p.write_text('{"schema":99,"facet":"music","memory":null}')
  with self.assertRaises(ValueError):load(self.p,"music")
 def test_symlink_denied(self):
  target=Path(self.tmp.name)/"real.json";target.write_text("{}");self.p.symlink_to(target)
  with self.assertRaises(ValueError):load(self.p,"music")
 def test_no_automatic_action(self):self.assertEqual(process(self.p,"music",evidence())["decision"]["action"],"NONE")
if __name__=="__main__":unittest.main(verbosity=2)
