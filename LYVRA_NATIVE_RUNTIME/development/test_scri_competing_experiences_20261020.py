"""Reproducible competing-experience checks; no repository/runtime writes."""
import unittest
from scri_context_reconstruction_20261020 import Experience, Situation, reconstruct

def memory(identifier, hypothesis, conditions, counter=(), domain='music_pipeline', origin='fixture-history'):
    return Experience(identifier, origin, frozenset(conditions), hypothesis,
                      ('fixture-source-' + identifier,), frozenset(counter),
                      'initial-assumption-' + identifier, 'counterevidence changed initial path', domain)

def compare(experiences, now):
    """Return candidate investigations and ambiguity; no forced winner or repair."""
    evaluations = [(e.id, reconstruct(e, now)) for e in experiences]
    viable = [(identity, value) for identity, value in evaluations if value['status'] == 'INVESTIGATE_ONLY']
    hypotheses = sorted({value['candidate'] for _, value in viable})
    if not viable:
        status = 'NO_SUPPORTED_TRANSFER'
    elif len(hypotheses) > 1:
        status = 'COMPETING_HYPOTHESES'
    else:
        status = 'INVESTIGATE_ONLY'
    return {'status': status, 'hypotheses': hypotheses, 'evaluations': evaluations,
            'action': 'NONE', 'preserve': ['whole_lyvra', 'track_design', 'studio_2', 'newer_valid_evolution']}

class SCRICompetingTests(unittest.TestCase):
    def setUp(self):
        self.relation = memory('relation', 'whole_track_relation', {'symptom', 'component_pass', 'relation_diff'}, {'component_fail'})
        self.component = memory('component', 'studio_component', {'symptom', 'component_fail', 'local_log'}, {'component_pass'})
        self.alternative = memory('timing', 'transport_timing', {'symptom', 'component_pass', 'relation_diff'}, {'transport_ok'})
        self.now = Situation('music_pipeline', frozenset({'symptom', 'component_pass', 'relation_diff'}))

    def test_ambiguous_memories_do_not_choose_winner(self):
        r = compare([self.relation, self.alternative], self.now)
        self.assertEqual(r['status'], 'COMPETING_HYPOTHESES')
        self.assertEqual(len(r['hypotheses']), 2)

    def test_counterexample_filters_competitor(self):
        now = Situation('music_pipeline', self.now.observed | {'transport_ok'})
        r = compare([self.relation, self.alternative], now)
        self.assertEqual(r['hypotheses'], ['whole_track_relation'])
        self.assertEqual(dict(r['evaluations'])['timing']['status'], 'COUNTEREXAMPLE')

    def test_competing_evidence_no_forced_transfer(self):
        r = compare([self.relation, self.component], self.now)
        self.assertEqual(r['hypotheses'], ['whole_track_relation'])
        self.assertEqual(dict(r['evaluations'])['component']['status'], 'COUNTEREXAMPLE')

    def test_provenance_retained_per_experience(self):
        results = dict(compare([self.relation, self.alternative], self.now)['evaluations'])
        self.assertEqual(results['relation']['provenance']['id'], 'relation')
        self.assertEqual(results['timing']['provenance']['id'], 'timing')

    def test_missing_provenance_excluded(self):
        bad = memory('untrusted', 'bad_hypothesis', {'symptom', 'component_pass'}, origin='')
        r = compare([self.relation, bad], self.now)
        self.assertEqual(r['hypotheses'], ['whole_track_relation'])
        self.assertEqual(dict(r['evaluations'])['untrusted']['status'], 'PROVENANCE_GAP')

    def test_no_automatic_cross_domain_transfer(self):
        r = compare([self.relation], Situation('visual', self.now.observed))
        self.assertEqual(r['status'], 'NO_SUPPORTED_TRANSFER')

    def test_bridge_is_only_provisional(self):
        r = compare([self.relation], Situation('visual', self.now.observed, bridge_evidence=('fixture-bridge',)))
        self.assertEqual(r['status'], 'INVESTIGATE_ONLY')
        self.assertIn('provisional', dict(r['evaluations'])['relation']['new_relations'][0])

    def test_current_contradiction_rejects_historical_clue(self):
        r = compare([self.relation], Situation('music_pipeline', self.now.observed, contradicted=frozenset({'component_pass'})))
        self.assertEqual(r['status'], 'NO_SUPPORTED_TRANSFER')

    def test_no_experience_is_safe(self):
        self.assertEqual(compare([], self.now)['status'], 'NO_SUPPORTED_TRANSFER')

    def test_no_repair_or_rollback(self):
        r = compare([self.relation, self.alternative], self.now)
        self.assertEqual(r['action'], 'NONE')
        self.assertIn('newer_valid_evolution', r['preserve'])

    def test_order_independence(self):
        a = compare([self.relation, self.alternative], self.now)
        b = compare([self.alternative, self.relation], self.now)
        self.assertEqual(a['status'], b['status'])
        self.assertEqual(a['hypotheses'], b['hypotheses'])

    def test_same_hypothesis_multiple_memories_not_conflict(self):
        twin = memory('twin', 'whole_track_relation', {'symptom', 'component_pass'}, {'component_fail'})
        r = compare([self.relation, twin], self.now)
        self.assertEqual(r['status'], 'INVESTIGATE_ONLY')

if __name__ == '__main__':
    unittest.main(verbosity=2)
