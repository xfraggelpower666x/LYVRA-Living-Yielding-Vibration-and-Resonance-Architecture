"""Offline safety tests for PET plugin dry-run preview."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import pet_plugin_patch_preview as p
from test_pet_plugin_dependency_audit import fixtures
import pet_plugin_dependency_audit as d


class PreviewTests(unittest.TestCase):
    def test_three_candidates_without_mutation(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            docs=fixtures(root)
            before={path:(root/path).read_bytes() for path in docs}
            result=p.preview(root)
            self.assertEqual(len(result["files"]),3)
            self.assertFalse(result["written"])
            self.assertEqual(before,{path:(root/path).read_bytes() for path in docs})

    def test_preserves_all_nonrelease_fields(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            fixtures(root)
            result=p.preview(root)
            self.assertEqual(len(result["files"]),3)
            for item in result["files"]:
                self.assertNotEqual(item["old_semantic_sha256"],item["candidate_semantic_sha256"])

    def test_foreign_identity_blocks(self):
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp)
            docs=fixtures(root)
            docs[d.CURRENT_CARRIERS[1][1]]["plugin_surfaces"]["native"]["plugin_id"]="forged"
            (root/d.CURRENT_CARRIERS[1][1]).write_text(json.dumps(docs[d.CURRENT_CARRIERS[1][1]]))
            with self.assertRaises(ValueError): p.preview(root)


if __name__=="__main__":
    unittest.main()
