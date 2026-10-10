"""Read-only CodeForge plugin/PET review regression tests."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import plugin_pet_release_delta as d


def fixture(root):
    data = {
        d.BINDING: {"bound_state": {
            "native_plugin": {"plugin_id": d.PLUGIN_IDS["native"], "version": "0.1.50", "release_id": "old-native"},
            "account_plugin": {"plugin_id": d.PLUGIN_IDS["alive"], "version": "0.13.47", "release_id": "old-alive"}}},
        d.ARCHIVES: {"releases": [
            {"plugin_id": d.PLUGIN_IDS["native"], "version": "0.1.54", "release_id": "new-native"},
            {"plugin_id": d.PLUGIN_IDS["alive"], "version": "0.13.49", "release_id": "new-alive"}]},
        d.PET: {"parent_authority": "WHOLE_LYVRA", "plugin_surfaces": {
            "native": {"plugin_id": d.PLUGIN_IDS["native"], "release_id": "old-native"},
            "account": {"plugin_id": d.PLUGIN_IDS["alive"], "release_id": "old-alive"}}}
    }
    for name, entry in data.items():
        path = root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(entry), encoding="utf-8")
    return data


class ReleaseDeltaTests(unittest.TestCase):
    def test_actual_versions_raise_review_not_promotion(self):
        with tempfile.TemporaryDirectory() as tmp:
            fixture(Path(tmp))
            r = d.assess(Path(tmp))
            self.assertEqual(len(r["findings"]), 4)
            self.assertFalse(r["native_mutated"])
            self.assertFalse(r["live_creator_release_checked"])

    def test_idempotent_fingerprint(self):
        with tempfile.TemporaryDirectory() as tmp:
            fixture(Path(tmp))
            a, b = d.assess(Path(tmp)), d.assess(Path(tmp))
            self.assertEqual(a["candidate_fingerprint"], b["candidate_fingerprint"])

    def test_no_fake_difference(self):
        with tempfile.TemporaryDirectory() as tmp:
            entries = fixture(Path(tmp))
            for key, name in [("native_plugin", "native"), ("account_plugin", "alive")]:
                for release in entries[d.ARCHIVES]["releases"]:
                    if release["plugin_id"] == d.PLUGIN_IDS[name]:
                        entries[d.BINDING]["bound_state"][key]["release_id"] = release["release_id"]
                        entries[d.BINDING]["bound_state"][key]["version"] = release["version"]
                        entries[d.PET]["plugin_surfaces"]["native" if name=="native" else "account"]["release_id"] = release["release_id"]
            for name in (d.BINDING, d.PET):
                (Path(tmp)/name).write_text(json.dumps(entries[name]))
            self.assertEqual(d.assess(Path(tmp))["findings"], [])

    def test_reject_second_identity(self):
        with tempfile.TemporaryDirectory() as tmp:
            entries = fixture(Path(tmp))
            entries[d.PET]["parent_authority"] = "PET_ONLY"
            (Path(tmp)/d.PET).write_text(json.dumps(entries[d.PET]))
            with self.assertRaises(ValueError):
                d.assess(Path(tmp))

    def test_reject_plugin_id_substitution(self):
        with tempfile.TemporaryDirectory() as tmp:
            entries = fixture(Path(tmp))
            entries[d.BINDING]["bound_state"]["native_plugin"]["plugin_id"] = "fake"
            (Path(tmp)/d.BINDING).write_text(json.dumps(entries[d.BINDING]))
            with self.assertRaises(ValueError):
                d.assess(Path(tmp))


if __name__ == "__main__":
    unittest.main()
