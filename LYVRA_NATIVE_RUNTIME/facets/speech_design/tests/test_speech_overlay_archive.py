"""Offline tests for reproducible, strictly additive Speech plugin preview ZIPs."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
import zipfile

SCRIPT = Path(__file__).resolve().parents[1] / "tools" / "build_plugin_release_overlays.py"
spec = importlib.util.spec_from_file_location("speech_overlay_builder", SCRIPT)
builder = importlib.util.module_from_spec(spec)
spec.loader.exec_module(builder)


class OverlayArchiveTests(unittest.TestCase):
    def test_produces_two_distinct_guarded_previews(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = builder.build(Path(tmp))
            self.assertEqual(report["status"], "PREVIEW_ONLY_NOT_INSTALLED")
            self.assertEqual(len(report["packages"]), 2)
            self.assertEqual({x["base_version"] for x in report["packages"]}, {"0.13.1", "0.1.3"})
            self.assertEqual({x["proposed_version"] for x in report["packages"]}, {"0.13.2", "0.1.4"})
            self.assertTrue(all(not x["actual_plugin_release_executed"] for x in report["packages"]))

    def test_zip_payload_excludes_existing_assets_and_connector_data(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = builder.build(Path(tmp))
            for item in report["packages"]:
                with self.subTest(target=item["target_plugin"]):
                    with zipfile.ZipFile(Path(tmp) / item["package_filename"]) as z:
                        names = set(z.namelist())
                        self.assertEqual(len(names), 3)
                        self.assertEqual(names, set(item["payload_paths"]))
                        self.assertNotIn(".app.json", names)
                        self.assertFalse(any(path.startswith("assets/") for path in names))
                        self.assertIsNone(z.testzip())

    def test_output_is_byte_identical_across_rebuilds(self):
        with tempfile.TemporaryDirectory() as a, tempfile.TemporaryDirectory() as b:
            first = builder.build(Path(a))
            second = builder.build(Path(b))
            self.assertEqual(first, second)
            for item in first["packages"]:
                left = (Path(a) / item["package_filename"]).read_bytes()
                right = (Path(b) / item["package_filename"]).read_bytes()
                self.assertEqual(left, right)
                self.assertEqual(hashlib.sha256(left).hexdigest(), item["zip_sha256"])

    def test_manifest_preserves_optimistic_lock_and_baseline(self):
        with tempfile.TemporaryDirectory() as tmp:
            report = builder.build(Path(tmp))
            saved = json.loads((Path(tmp) / "RELEASE_OVERLAY_SHA256_MANIFEST.json").read_text())
            self.assertEqual(report, saved)
            locks = {p["guard_expected_current_release_id"] for p in report["packages"]}
            self.assertEqual(locks, {
                "pluginrel_6abf5fbe0acc8191ba395c6d17f0725e",
                "pluginrel_6abf5fc5cf808191b4fd0d4beae8bcce",
            })


if __name__ == "__main__":
    unittest.main()
