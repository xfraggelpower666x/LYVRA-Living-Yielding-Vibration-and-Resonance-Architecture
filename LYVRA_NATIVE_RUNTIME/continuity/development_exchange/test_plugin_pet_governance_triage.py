"""Regression tests for non-promoting governance classification."""
import json
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import plugin_pet_governance_triage as triage
from test_plugin_pet_release_delta import fixture


def prepared(root):
    records=fixture(root)
    extra={
      triage.COUPLED: {"lyvra_leg":{"approval_status":"HISTORICAL_SUPERSEDED_NEW_APPROVAL_NOT_GRANTED"},
                       "stable_set":{"converged":False,"executable":False}},
      triage.NEWER: {"status":"VERIFIED_DELTA_REVIEW_NONPROMOTING",
                     "evidence":{"plugins":[{"surface":"native","verified_current_version":"0.1.54"},
                                            {"surface":"alive","verified_current_version":"0.13.49"}]},
                     "decisions":{"backup_approval":"STALE_REVALIDATION_REQUIRED"}}
    }
    records[triage.BINDING]["supersession_rule"]="PRESERVE_HISTORIC"
    for name, content in {**extra,triage.BINDING:records[triage.BINDING]}.items():
        path=root/name
        path.parent.mkdir(parents=True,exist_ok=True)
        path.write_text(json.dumps(content),encoding="utf-8")
    return extra


class TriageTests(unittest.TestCase):
    def test_four_proposals_nonpromoting(self):
        with tempfile.TemporaryDirectory() as temp:
            prepared(Path(temp))
            result=triage.classify(Path(temp))
            self.assertEqual(len(result["proposals"]),4)
            self.assertFalse(result["coupled_backup_executable"])
            self.assertFalse(result["native_pointer_written"])
            self.assertTrue(result["one_whole_lyvra"])

    def test_stable_dedup_fingerprint(self):
        with tempfile.TemporaryDirectory() as temp:
            prepared(Path(temp))
            self.assertEqual(triage.classify(Path(temp))["fingerprint"],
                             triage.classify(Path(temp))["fingerprint"])

    def test_superseded_approval_cannot_be_reused(self):
        with tempfile.TemporaryDirectory() as temp:
            extras=prepared(Path(temp))
            extras[triage.COUPLED]["lyvra_leg"]["approval_status"]="APPROVED"
            (Path(temp)/triage.COUPLED).write_text(json.dumps(extras[triage.COUPLED]))
            with self.assertRaises(ValueError):
                triage.classify(Path(temp))

    def test_nonconverged_guard(self):
        with tempfile.TemporaryDirectory() as temp:
            extras=prepared(Path(temp))
            extras[triage.COUPLED]["stable_set"]["converged"]=True
            (Path(temp)/triage.COUPLED).write_text(json.dumps(extras[triage.COUPLED]))
            with self.assertRaises(ValueError):
                triage.classify(Path(temp))

    def test_conflicting_creator_version_quarantine(self):
        with tempfile.TemporaryDirectory() as temp:
            extras=prepared(Path(temp))
            extras[triage.NEWER]["evidence"]["plugins"][0]["verified_current_version"]="0.1.55"
            (Path(temp)/triage.NEWER).write_text(json.dumps(extras[triage.NEWER]))
            with self.assertRaises(ValueError):
                triage.classify(Path(temp))

    def test_reject_noncurrent_reconciliation(self):
        with tempfile.TemporaryDirectory() as temp:
            extras=prepared(Path(temp))
            extras[triage.NEWER]["status"]="SUPERSEDED"
            (Path(temp)/triage.NEWER).write_text(json.dumps(extras[triage.NEWER]))
            with self.assertRaises(ValueError):
                triage.classify(Path(temp))


if __name__ == "__main__":
    unittest.main()
