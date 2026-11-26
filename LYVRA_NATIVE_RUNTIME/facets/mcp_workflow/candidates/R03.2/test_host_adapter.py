import unittest
from host_adapter import GitHubHostAdapter, REPO
from publisher import BRANCH, PRODUCTION, Conflict

class HostTests(unittest.TestCase):
    def setUp(self):
        self.calls=[]
        def call(name,args):
            self.calls.append((name,args))
            return {'result': {'success':True,'sha':'a'*40,'commit':{'sha':'b'*40}}}
        self.api=GitHubHostAdapter(call)
    def test_lease(self):
        self.assertTrue(self.api.compare_and_swap(BRANCH,'a'*40,'b'*40))
        self.assertEqual(self.calls[-1],('update_ref',dict(repository_full_name=REPO,branch_name=BRANCH,expected_sha='a'*40,sha='b'*40,force=False)))
    def test_production_denied(self):
        with self.assertRaises(Conflict): self.api.compare_and_swap(PRODUCTION,'a'*40,'b'*40)
        self.assertFalse(self.calls)
    def test_blob_bytes(self):
        self.api.create_blob(b'\x00\xff')
        self.assertEqual(self.calls[-1][1]['content'],'AP8=')
    def test_no_skip_denied(self):
        with self.assertRaises(Conflict): self.api.commit('a'*40,'b'*40,'bad')
    def test_foreign_path_denied(self):
        with self.assertRaises(Conflict): self.api.create_tree('a'*40,{'foreign':'b'*40})
    def test_foreign_branch_denied(self):
        with self.assertRaises(Conflict): self.api.head('main')
    def test_false_lease(self):
        self.api.call=lambda *args:{'result':{'success':False}}
        self.assertFalse(self.api.compare_and_swap(BRANCH,'a'*40,'b'*40))

if __name__=='__main__': unittest.main()
