"""CodeForge: bounded audit evidence regression tests; does not grant write authority."""
import json
import unittest
from pathlib import Path

ALLOWED = {
    'EXISTING_NATIVE_CAPABILITY', 'MISSING_EXECUTION_BINDING',
    'NOVEL_GENERALIZABLE_CAPABILITY', 'PLUGIN_ONLY_ADAPTER',
    'DUPLICATE_OR_CONFLICT', 'UNVERIFIED_CANDIDATE', 'PRIVACY_RESTRICTED',
}
DISPOSITIONS = {
    'KEEP_IN_PLUGIN', 'REFERENCE_NATIVE_CONTRACT', 'PROPOSE_NATIVE_EVOLUTION',
    'REPAIR_EXISTING_NATIVE_BINDING', 'QUARANTINE_PENDING_EVIDENCE',
    'REJECT_WITH_PROVENANCE',
}
REQUIRED = {'source_release', 'source_path', 'source_blob_sha',
            'native_branch', 'native_path', 'native_blob_sha',
            'classification', 'disposition', 'evidence_status',
            'creative_freedom_preserved', 'foreign_autoload',
            'native_decision_authority', 'productively_promoted'}

def audit_gate(record):
    if not isinstance(record, dict):
        return False, 'record_not_object'
    missing = REQUIRED - set(record)
    if missing:
        return False, 'missing_evidence_fields:' + ','.join(sorted(missing))
    for f in ('source_release', 'source_path', 'native_branch', 'native_path'):
        if not isinstance(record[f], str) or not record[f].strip():
            return False, 'missing_source:' + f
    for f in ('source_blob_sha', 'native_blob_sha'):
        value = record[f]
        if not isinstance(value, str) or len(value) != 40 or any(c not in '0123456789abcdef' for c in value):
            return False, 'invalid_git_blob_sha:' + f
    if record['classification'] not in ALLOWED:
        return False, 'unknown_classification'
    if record['disposition'] not in DISPOSITIONS:
        return False, 'unknown_disposition'
    if record['native_decision_authority'] != 'LYVRA_ONLY':
        return False, 'unauthorized_decision_authority'
    if record['foreign_autoload'] is not False:
        return False, 'foreign_autoload'
    if record['creative_freedom_preserved'] is not True:
        return False, 'creative_freedom_regression'
    if record['productively_promoted'] is not False:
        return False, 'no_auto_promotion'
    if record['evidence_status'] != 'DIRECT_TEXT_READBACK':
        return False, 'source_readback_pending'
    if record['classification'] == 'UNVERIFIED_CANDIDATE' and record['disposition'] != 'QUARANTINE_PENDING_EVIDENCE':
        return False, 'unverified_not_quarantined'
    if record['classification'] == 'NOVEL_GENERALIZABLE_CAPABILITY' and record['disposition'] != 'PROPOSE_NATIVE_EVOLUTION':
        return False, 'novelty_requires_proposal_not_automerge'
    return True, 'PASS_BOUNDED_EVIDENCE_ONLY'

HERE = Path(__file__).resolve().parent
FIXTURES = json.loads((HERE / 'cross_audit_cases.json').read_text(encoding='utf-8'))

class TestCrossAuditGate(unittest.TestCase):
    def test_real_evidence_cases(self):
        for case in FIXTURES['cases']:
            with self.subTest(case=case['source_path']):
                self.assertEqual(audit_gate(case), (True, 'PASS_BOUNDED_EVIDENCE_ONLY'))
    def test_reject_missing_source(self):
        c = dict(FIXTURES['cases'][0]); c.pop('source_blob_sha')
        self.assertFalse(audit_gate(c)[0])
    def test_reject_auto_promotion(self):
        c = dict(FIXTURES['cases'][0]); c['productively_promoted'] = True
        self.assertEqual(audit_gate(c)[1], 'no_auto_promotion')
    def test_reject_foreign_autoload(self):
        c = dict(FIXTURES['cases'][0]); c['foreign_autoload'] = True
        self.assertEqual(audit_gate(c)[1], 'foreign_autoload')
    def test_reject_creative_confinement(self):
        c = dict(FIXTURES['cases'][0]); c['creative_freedom_preserved'] = False
        self.assertEqual(audit_gate(c)[1], 'creative_freedom_regression')
    def test_reject_authority_transfer(self):
        c = dict(FIXTURES['cases'][0]); c['native_decision_authority'] = 'CODEFORGE'
        self.assertEqual(audit_gate(c)[1], 'unauthorized_decision_authority')
    def test_reject_unverified_nonquarantine(self):
        c = dict(FIXTURES['cases'][0]); c['classification'] = 'UNVERIFIED_CANDIDATE'
        self.assertEqual(audit_gate(c)[1], 'unverified_not_quarantined')
    def test_reject_bad_sha(self):
        c = dict(FIXTURES['cases'][0]); c['source_blob_sha'] = '123'
        self.assertEqual(audit_gate(c)[1], 'invalid_git_blob_sha:source_blob_sha')
    def test_reject_false_text_readback(self):
        c = dict(FIXTURES['cases'][0]); c['evidence_status'] = 'SNIPPET_ONLY'
        self.assertEqual(audit_gate(c)[1], 'source_readback_pending')
    def test_reject_novelty_without_proposal(self):
        c = dict(FIXTURES['cases'][0]); c['classification'] = 'NOVEL_GENERALIZABLE_CAPABILITY'; c['disposition']='KEEP_IN_PLUGIN'
        self.assertEqual(audit_gate(c)[1], 'novelty_requires_proposal_not_automerge')

if __name__ == '__main__':
    unittest.main(verbosity=2)
