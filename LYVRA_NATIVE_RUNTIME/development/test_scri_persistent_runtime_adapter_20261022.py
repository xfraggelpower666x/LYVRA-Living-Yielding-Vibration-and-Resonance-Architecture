import unittest,tempfile
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from scri_event_sequence_inference_20261021 import Event as E
from scri_persistent_runtime_adapter_20261022 import process,load,store,process_scoped
def evidence(facet="music",a="pulse",b="drop"):
 return [E(facet,"r1",1,a,"i1","intervention"),E(facet,"r1",2,b,"m1"),E(facet,"r2",1,a,"i2","intervention"),E(facet,"r2",2,b,"m2")]
def refute(facet="music",a="pulse",b="drop"):
 return [E(facet,"r3",1,a,"i3","intervention"),E(facet,"r3",2,b,"refuter","refutation")]
class Persistent(unittest.TestCase):
 def setUp(self):self.tmp=tempfile.TemporaryDirectory();self.p=Path(self.tmp.name)/"music.json"
 def tearDown(self):self.tmp.cleanup()
 def test_scoped_entry_separates_facets(self):
  root=Path(self.tmp.name)/"scoped"
  first=process_scoped(root,"music",evidence("music"))
  second=process_scoped(root,"studio2",evidence("studio2","cache","frame"))
  self.assertEqual(first["memory"].relation,("pulse","drop"))
  self.assertEqual(second["memory"].relation,("cache","frame"))
  self.assertEqual(load(root/"music.json","music").revision,1)
  self.assertEqual(load(root/"studio2.json","studio2").revision,1)
 def test_scoped_entry_rejects_traversal(self):
  with self.assertRaises(ValueError):process_scoped(Path(self.tmp.name),"../music",evidence())
 def test_scoped_entry_rejects_symlink_root(self):
  target=Path(self.tmp.name)/"target"
  target.mkdir()
  alias=Path(self.tmp.name)/"alias"
  alias.symlink_to(target,target_is_directory=True)
  with self.assertRaises(ValueError):process_scoped(alias,"music",evidence())
 def test_first_pass(self):self.assertEqual(process(self.p,"music",evidence())["decision"]["status"],"INVESTIGATE_ONLY")
 def test_single_pass_iterator_retains_evidence(self):
  result=process(self.p,"music",iter(evidence()))
  self.assertEqual(result["decision"]["status"],"INVESTIGATE_ONLY")
  self.assertEqual(result["decision"]["candidate"],("pulse","drop"))
 def test_single_pass_iterator_revises(self):
  process(self.p,"music",iter(evidence()))
  result=process(self.p,"music",iter(evidence()+refute()))
  self.assertEqual(result["decision"]["status"],"REVISED_COUNTEREVIDENCE")
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
 def test_corrupt_json_preserved_fail_closed(self):
  self.p.write_text("{incomplete")
  before=self.p.read_bytes()
  with self.assertRaisesRegex(ValueError,"corrupted memory"):process(self.p,"music",evidence())
  self.assertEqual(self.p.read_bytes(),before)
 def test_nonobject_payload_preserved_fail_closed(self):
  self.p.write_text("[]")
  before=self.p.read_bytes()
  with self.assertRaisesRegex(ValueError,"invalid memory envelope"):process(self.p,"music",evidence())
  self.assertEqual(self.p.read_bytes(),before)
 def test_nonobject_memory_preserved_fail_closed(self):
  self.p.write_text('{"schema":1,"facet":"music","memory":[]}')
  before=self.p.read_bytes()
  with self.assertRaisesRegex(ValueError,"invalid memory"):process(self.p,"music",evidence())
  self.assertEqual(self.p.read_bytes(),before)
 def test_symlink_denied(self):
  target=Path(self.tmp.name)/"real.json";target.write_text("{}");self.p.symlink_to(target)
  with self.assertRaises(ValueError):load(self.p,"music")
 def test_no_automatic_action(self):self.assertEqual(process(self.p,"music",evidence())["decision"]["action"],"NONE")
class ConcurrentRevision(unittest.TestCase):
 def test_simultaneous_distinct_counterevidence_retained(self):
  with tempfile.TemporaryDirectory() as tmp:
   p=Path(tmp)/"scoped.json"
   process(p,"music",evidence())
   one=evidence()+refute()
   two=evidence()+[E("music","r4",1,"pulse","i4","intervention"),E("music","r4",2,"drop","refuter2","refutation")]
   with ThreadPoolExecutor(max_workers=2) as pool:
    results=list(pool.map(lambda es:process(p,"music",es),(one,two)))
   m=load(p,"music")
   self.assertEqual(m.revision,3)
   self.assertEqual(set(m.counter_sources),{"refuter","refuter2"})
   self.assertEqual(m.status,"COUNTEREVIDENCE")
if __name__=="__main__":unittest.main(verbosity=2)
