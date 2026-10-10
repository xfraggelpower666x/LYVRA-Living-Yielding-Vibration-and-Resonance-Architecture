"""Offline safety regression tests for PET plugin reference patch candidates."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import pet_plugin_candidate_preflight as p

NATIVE="plugins_6ab3a345db308191b8ad7ef6311f8a29"
ALIVE="plugin_06a4fc64dd848191982ca4a6ebdb2619"


def fixtures(root):
    surfaces={"native":{"plugin_id":NATIVE,"version":"0.1.50","release_id":"oldn"},
              "account":{"plugin_id":ALIVE,"version":"0.13.47","release_id":"olda"}}
    contents={
       p.PET:{"parent_authority":"WHOLE_LYVRA","pet_id":"pet1","plugin_surfaces":surfaces},
       p.APP:{"pet_id":"pet1","plugin_surfaces":surfaces},
       p.RECON:{"status":"VERIFIED_DELTA_REVIEW_NONPROMOTING","evidence":{"plugins":[
            {"surface":"native","verified_current_version":"0.1.54","release_id":"newn"},
            {"surface":"alive","verified_current_version":"0.13.49","release_id":"newa"}]}},
       p.BACKUP:{"lyvra_leg":{"approval_status":"HISTORICAL_SUPERSEDED_NEW_APPROVAL_NOT_GRANTED"},
                 "stable_set":{"converged":False}},
       p.PLAN:{"status":"SOURCE_VERIFIED_PRECHANGE_PLAN_NO_CURRENT_PROMOTION"}
    }
    for name,value in contents.items():
        target=root/name
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(json.dumps(value),encoding="utf-8")
    return contents


class PetPreflightTests(unittest.TestCase):
    def test_four_precise_candidates(self):
        with tempfile.TemporaryDirectory() as tmp:
            fixtures(Path(tmp))
            r=p.preflight(Path(tmp))
            self.assertEqual(len(r["actions"]),4)
            self.assertFalse(r["native_pointer_changed"])
            self.assertFalse(r["stale_approval_reused"])
            self.assertTrue(all(x["status"]=="CANDIDATE_NOT_APPLIED" for x in r["actions"]))

    def test_no_changes_when_already_current(self):
        with tempfile.TemporaryDirectory() as tmp:
            values=fixtures(Path(tmp))
            for item in values[p.PET]["plugin_surfaces"].values():
                if item["plugin_id"]==NATIVE:
                    item.update(version="0.1.54",release_id="newn")
                else:
                    item.update(version="0.13.49",release_id="newa")
            for name in (p.PET,p.APP):
                (Path(tmp)/name).write_text(json.dumps(values[p.PET]))
            self.assertEqual(p.preflight(Path(tmp))["actions"],[])

    def test_stale_backup_approval_guard(self):
        with tempfile.TemporaryDirectory() as tmp:
            values=fixtures(Path(tmp))
            values[p.BACKUP]["lyvra_leg"]["approval_status"]="APPROVED"
            (Path(tmp)/p.BACKUP).write_text(json.dumps(values[p.BACKUP]))
            with self.assertRaises(ValueError): p.preflight(Path(tmp))

    def test_identity_mismatch_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            values=fixtures(Path(tmp))
            values[p.APP]["pet_id"]="pet2"
            (Path(tmp)/p.APP).write_text(json.dumps(values[p.APP]))
            with self.assertRaises(ValueError): p.preflight(Path(tmp))

    def test_source_release_missing_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            values=fixtures(Path(tmp))
            values[p.RECON]["evidence"]["plugins"][0].pop("release_id")
            (Path(tmp)/p.RECON).write_text(json.dumps(values[p.RECON]))
            with self.assertRaises(ValueError): p.preflight(Path(tmp))

    def test_repo_files_not_mutated(self):
        with tempfile.TemporaryDirectory() as tmp:
            values=fixtures(Path(tmp))
            before={name:(Path(tmp)/name).read_bytes() for name in values}
            p.preflight(Path(tmp))
            self.assertEqual(before,{name:(Path(tmp)/name).read_bytes() for name in values})


if __name__=="__main__":
    unittest.main()
