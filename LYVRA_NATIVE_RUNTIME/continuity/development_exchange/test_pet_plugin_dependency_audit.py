"""Offline dependency regression tests, no GitHub/Creator network."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import pet_plugin_dependency_audit as d


def fixtures(root):
    releases={"native":{"surface":"native","verified_current_version":"0.1.54","release_id":"n54"},
              "alive":{"surface":"alive","verified_current_version":"0.13.49","release_id":"a49"}}
    old={"native":{"plugin_id":d.NATIVE_ID,"version":"0.1.50","release_id":"n50"},
         "account":{"plugin_id":d.ALIVE_ID,"version":"0.13.47","release_id":"a47"}}
    files={d.RECON:{"status":"VERIFIED_DELTA_REVIEW_NONPROMOTING","evidence":{"plugins":list(releases.values())}},
      d.HISTORIC_HANDOFF:{"handoff_id":"historical-valid"},
      d.BACKUP_BINDING:{"runtime_plugin_state_fingerprint":"old-fingerprint"}}
    for name, path, nested, keys in d.CURRENT_CARRIERS:
        if nested:
            files[path]={nested:old.copy()}
        else:
            files[path]={"native_plugin":old["native"].copy(),"account_plugin":old["account"].copy()}
        if name=="pet_livecircle":
            files[path]["parent_authority"]="WHOLE_LYVRA"
    for rel, data in files.items():
        target=root/rel
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(json.dumps(data),encoding="utf-8")
    return files


class DependencyTests(unittest.TestCase):
    def test_six_candidates_and_historic_preservation(self):
        with tempfile.TemporaryDirectory() as temp:
            fixtures(Path(temp))
            report=d.inspect(Path(temp))
            self.assertEqual(len(report["current_candidates"]),6)
            self.assertEqual(len(report["historical_nonpromoting"]),2)
            self.assertFalse(report["write_performed"])

    def test_no_candidate_when_current(self):
        with tempfile.TemporaryDirectory() as temp:
            rows=fixtures(Path(temp))
            for _,path,nested,keys in d.CURRENT_CARRIERS:
                entries=rows[path][nested] if nested else rows[path]
                for name in ("native","alive"):
                    e=entries[keys[name]]
                    e["version"]="0.1.54" if name=="native" else "0.13.49"
                    e["release_id"]="n54" if name=="native" else "a49"
                (Path(temp)/path).write_text(json.dumps(rows[path]))
            self.assertEqual(d.inspect(Path(temp))["current_candidates"],[])

    def test_identity_mismatch_blocks(self):
        with tempfile.TemporaryDirectory() as temp:
            rows=fixtures(Path(temp))
            rows[d.CURRENT_CARRIERS[2][1]]["native_plugin"]["plugin_id"]="wrong"
            (Path(temp)/d.CURRENT_CARRIERS[2][1]).write_text(json.dumps(rows[d.CURRENT_CARRIERS[2][1]]))
            with self.assertRaises(ValueError): d.inspect(Path(temp))

    def test_invalid_newer_evidence_blocks(self):
        with tempfile.TemporaryDirectory() as temp:
            rows=fixtures(Path(temp))
            rows[d.RECON]["status"]="SUPERSEDED"
            (Path(temp)/d.RECON).write_text(json.dumps(rows[d.RECON]))
            with self.assertRaises(ValueError): d.inspect(Path(temp))

    def test_read_only_preserves_files(self):
        with tempfile.TemporaryDirectory() as temp:
            rows=fixtures(Path(temp))
            old={rel:(Path(temp)/rel).read_bytes() for rel in rows}
            d.inspect(Path(temp))
            self.assertEqual(old,{rel:(Path(temp)/rel).read_bytes() for rel in rows})

    def test_missing_historical_provenance_blocks(self):
        with tempfile.TemporaryDirectory() as temp:
            rows=fixtures(Path(temp))
            rows[d.HISTORIC_HANDOFF].pop("handoff_id")
            (Path(temp)/d.HISTORIC_HANDOFF).write_text(json.dumps(rows[d.HISTORIC_HANDOFF]))
            with self.assertRaises(ValueError): d.inspect(Path(temp))


if __name__=="__main__": unittest.main()
