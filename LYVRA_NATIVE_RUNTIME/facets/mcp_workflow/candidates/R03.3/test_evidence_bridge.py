import unittest
from copy import deepcopy
from evidence_bridge import handoff, digest
from checkpoint import restore
from test_checkpoint import fixture, HEAD, PC

class BridgeTests(unittest.TestCase):
    def run_bridge(self, data=None, **kw):
        d = fixture() if data is None else data
        args = dict(project='Projekt', track='Track', route=PC, restore=restore,
                    read_head=lambda branch: HEAD, current=fixture())
        args.update(kw)
        return handoff(d, **args)
    def test_ready(self):
        d=fixture(); copy=deepcopy(d); r=self.run_bridge(d)
        self.assertEqual(r['status'],'VALIDATED_HANDOFF')
        self.assertEqual(r['checkpoint_sha256'],digest(d))
        self.assertEqual(d,copy)
        self.assertFalse(r['write_authority']); self.assertFalse(r['provider_execution'])
        self.assertNotIn('checkpoint',r)
    def test_no_current(self):
        self.assertEqual(self.run_bridge(current=None)['status'],'READBACK_PENDING')
    def test_bad_head(self):
        with self.assertRaisesRegex(ValueError,'READBACK_PENDING'): self.run_bridge(read_head=lambda b:'bad')
    def test_moved(self):
        heads=iter([HEAD,'a'*40])
        with self.assertRaisesRegex(ValueError,'HEAD_MOVED'): self.run_bridge(read_head=lambda b:next(heads))
    def test_stale_source(self):
        self.assertEqual(self.run_bridge(read_head=lambda b:'a'*40)['status'],'READBACK_PENDING')
    def test_conflict(self):
        d=fixture(); d['track']['music']='different'
        with self.assertRaisesRegex(ValueError,'CONFLICT_QUARANTINE'): self.run_bridge(d)
    def test_pending_device(self):
        self.assertEqual(self.run_bridge(route='IPHONE_CUSTOM_WITH_MAIN')['status'],'READBACK_PENDING')
    def test_evidence_gap(self):
        d=fixture(); del d['evidence'][0]['alternative']
        self.assertEqual(self.run_bridge(d)['status'],'READBACK_PENDING')
    def test_wrong_project(self):
        with self.assertRaisesRegex(ValueError,'CONFLICT_QUARANTINE'): self.run_bridge(project='other')
    def test_utf16(self):
        d=fixture(); d['devices'][PC]['fields']['Extended']='🌀'*401
        self.assertEqual(self.run_bridge(d)['route_reason'],'EXTENDED_OVER_BUDGET')

if __name__=='__main__': unittest.main()
