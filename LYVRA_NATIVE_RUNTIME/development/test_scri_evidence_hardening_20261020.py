"""Reproducible SCRI evidence hardening fixtures. Run python -m unittest -v test_scri_evidence_hardening_20261020.py"""
import unittest
from scri_evidence_hardening_20261020 import Memory, Record, assess
REV = 'rev-2'
def memory(name='m', hs=('relation',), rev=REV, origin='historical-fixture', explanation='counterevidence changed route'):
    return Memory(name, origin, rev, explanation, frozenset(hs))
def record(root='A', report='A1', sup=(), rebut=(), verified=True, current=True):
    return Record('fixture observation', root, report, frozenset(sup), frozenset(rebut), verified, current)
class Hardening(unittest.TestCase):
    def test_single_source_investigate(self):
        self.assertEqual(assess([memory()], [record(sup=('relation',))], REV)['status'], 'INVESTIGATE_ONLY')
    def test_duplicate_reports_share_source_root(self):
        r=assess([memory()], [record(sup=('relation',)),record(report='A2',sup=('relation',))], REV)
        self.assertEqual(r['support_roots']['relation'], ['A'])
        self.assertEqual(r['duplicated_reports']['A'], ['A1','A2'])
    def test_two_distinct_source_roots(self):
        r=assess([memory()], [record(sup=('relation',)),record(root='B',report='B1',sup=('relation',))],REV)
        self.assertEqual(r['support_roots']['relation'],['A','B'])
    def test_conflicting_independent_reports(self):
        r=assess([memory()], [record(sup=('relation',)),record(root='B',report='B1',rebut=('relation',))],REV)
        self.assertEqual(r['status'],'EVIDENCE_CONFLICT')
    def test_same_source_self_conflict(self):
        self.assertEqual(assess([memory()], [record(sup=('relation',),rebut=('relation',))], REV)['status'],'EVIDENCE_CONFLICT')
    def test_stale_revision_quarantines_memory(self):
        r=assess([memory(rev='old')],[record(sup=('relation',))],REV)
        self.assertEqual(r['stale_memories'],['m'])
        self.assertEqual(r['status'],'INSUFFICIENT_EVIDENCE')
    def test_missing_memory_origin(self):
        r=assess([memory(origin='')],[record(sup=('relation',))],REV)
        self.assertEqual(r['ungrounded_memories'],['m'])
        self.assertEqual(r['candidates'],[])
    def test_unverified_report_quarantine(self):
        self.assertEqual(assess([memory()],[record(sup=('relation',),verified=False)],REV)['quarantined_reports'],['A1'])
    def test_outdated_report_quarantine(self):
        self.assertEqual(assess([memory()],[record(sup=('relation',),current=False)],REV)['status'],'INSUFFICIENT_EVIDENCE')
    def test_missing_root_quarantine(self):
        self.assertEqual(assess([memory()],[record(root='',sup=('relation',))],REV)['quarantined_reports'],['A1'])
    def test_two_simultaneous_causes_preserved(self):
        r=assess([memory(hs=('relation','studio'))],[record(sup=('relation',)),record(root='B',report='B1',sup=('studio',))],REV)
        self.assertEqual(r['status'],'MULTIPLE_CAUSES_OR_AMBIGUITY')
        self.assertEqual(r['candidates'],['relation','studio'])
    def test_contested_one_does_not_discard_other(self):
        r=assess([memory(hs=('relation','studio'))],[record(sup=('relation','studio')),record(root='B',report='B1',rebut=('studio',))],REV)
        self.assertEqual(r['status'],'EVIDENCE_CONFLICT')
        self.assertEqual(r['candidates'],['relation'])
    def test_no_recovery_writes(self):
        r=assess([memory()],[record(sup=('relation',))],REV)
        self.assertEqual(r['action'],'NONE')
        self.assertIn('newer_valid_evolution',r['preserved'])
    def test_no_memory_yields_no_diagnosis(self):
        self.assertEqual(assess([],[],REV)['status'],'INSUFFICIENT_EVIDENCE')
    def test_unrecognized_hypothesis_not_invented(self):
        self.assertEqual(assess([memory()],[record(sup=('unknown',))],REV)['candidates'],[])
if __name__ == '__main__':
    unittest.main(verbosity=2)
