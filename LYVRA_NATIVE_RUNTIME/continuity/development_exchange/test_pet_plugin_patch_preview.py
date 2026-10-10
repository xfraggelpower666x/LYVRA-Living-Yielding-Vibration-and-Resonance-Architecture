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


    def test_exact_pinned_versions_in_all_three_files(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixtures(root)
            report = p.preview(root)
            expected = {"native": ("0.1.54", "n54"),
                        "alive": ("0.13.49", "a49")}
            targets = {name: (nested, keys) for name, _, nested, keys in d.CURRENT_CARRIERS}
            for record, (name, _, _, _) in zip(report["files"], d.CURRENT_CARRIERS):
                candidate = record["candidate"]
                nested, keys = targets[name]
                for surface, (version, release_id) in expected.items():
                    plugin = candidate[nested][keys[surface]] if nested else candidate[keys[surface]]
                    self.assertEqual((plugin["version"], plugin["release_id"]),
                                     (version, release_id))

    def test_unrelated_fields_survive_candidate_render(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            docs = fixtures(root)
            for _, path, _, _ in d.CURRENT_CARRIERS:
                docs[path]["custom_logo_sha256"] = "unique-user-asset"
                docs[path]["worker_production_status"] = "preserved"
                docs[path]["relationship_authority"] = "WHOLE_LYVRA_ONLY"
                (root / path).write_text(json.dumps(docs[path]))
            result = p.preview(root)
            for item in result["files"]:
                self.assertEqual(item["candidate"]["custom_logo_sha256"], "unique-user-asset")
                self.assertEqual(item["candidate"]["worker_production_status"], "preserved")
                self.assertEqual(item["candidate"]["relationship_authority"], "WHOLE_LYVRA_ONLY")

    def test_preview_idempotent_and_no_release_collision(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            fixtures(root)
            first, second = p.preview(root), p.preview(root)
            self.assertEqual(
                [(x["path"], x["candidate_semantic_sha256"]) for x in first["files"]],
                [(x["path"], x["candidate_semantic_sha256"]) for x in second["files"]]
            )
            self.assertFalse(first["backup_approval"])
            self.assertFalse(first["pointer_changed"])


    def test_already_reconciled_is_safe_noop(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            docs = fixtures(root)
            for _, path, nested, keys in d.CURRENT_CARRIERS:
                destination = docs[path][nested] if nested else docs[path]
                for surface in ("native", "alive"):
                    pentry = destination[keys[surface]]
                    pentry["version"] = "0.1.54" if surface == "native" else "0.13.49"
                    pentry["release_id"] = "n54" if surface == "native" else "a49"
                (root / path).write_text(json.dumps(docs[path]))
            snapshot = {path: (root / path).read_bytes() for path in docs}
            result = p.preview(root)
            self.assertEqual(result["status"], "ALREADY_RECONCILED_NO_PATCH_NEEDED")
            self.assertEqual(result["files"], [])
            self.assertFalse(result["written"])
            self.assertEqual(snapshot, {path: (root / path).read_bytes() for path in docs})


if __name__=="__main__":
    unittest.main()
