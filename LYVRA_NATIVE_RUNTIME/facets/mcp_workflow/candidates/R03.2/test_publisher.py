import unittest
from publisher import *

H='a'*40; P='b'*40; C='c'*40; T='d'*40
class Fake:
    def __init__(self):
        self.refs={BRANCH:H,PRODUCTION:P}; self.trees={H:{'protected.txt':'e'*40}}; self.writes=0
    def head(self,r): return self.refs[r]
    def tree(self,r): return self.trees[r].copy()
    def create_blob(self,b): self.writes+=1; return blob(b)
    def create_tree(self,h,a): self.trees[T]={**self.trees[h],**a}; return T
    def commit(self,t,h,m):
        if '[CI Skip]' not in m or '[skip ci]' not in m: raise ValueError('CI')
        self.trees[C]=self.trees[t].copy(); return C
    def compare_and_swap(self,r,h,c):
        if self.refs[r]!=h: return False
        self.refs[r]=c; return True
class Tests(unittest.TestCase):
    def runpub(self,a,files=None,**kw): return publish(a,{'x.py':b'hello'} if files is None else files,H,P,**({'dry_run':False,'confirmed_source_only':True}|kw))
    def test_success(self):
        a=Fake(); self.assertEqual(self.runpub(a)['status'],'SOURCE_READBACK_MATCH'); self.assertEqual(a.refs[PRODUCTION],P); self.assertEqual(a.tree(C)['protected.txt'],'e'*40)
    def test_dry(self):
        a=Fake(); self.assertEqual(self.runpub(a,dry_run=True)['status'],'DRY_RUN'); self.assertEqual(a.writes,0)
    def test_cost(self):
        a=Fake(); self.assertRaises(Conflict,self.runpub,a,confirmed_source_only=False); self.assertEqual(a.writes,0)
    def test_path(self): self.assertRaises(Conflict,plan,{'../x':b'x'})
    def test_empty(self): self.assertRaises(Conflict,plan,{})
    def test_branch_moved(self):
        a=Fake(); a.refs[BRANCH]=C; self.assertRaises(Conflict,self.runpub,a); self.assertEqual(a.writes,0)
    def test_production_moved(self):
        a=Fake(); a.refs[PRODUCTION]=C; self.assertRaises(Conflict,self.runpub,a); self.assertEqual(a.writes,0)
    def test_existing_conflict(self):
        a=Fake(); a.trees[H][PREFIX+'x.py']='0'*40; self.assertRaises(Conflict,self.runpub,a); self.assertEqual(a.writes,0)
    def test_existing_identical(self):
        a=Fake(); a.trees[H].update(plan({'x.py':b'hello'})); self.assertEqual(self.runpub(a)['status'],'ALREADY_PRESENT'); self.assertEqual(a.writes,0)
    def test_bad_blob(self):
        a=Fake(); a.create_blob=lambda b:'0'*40; self.assertRaises(Conflict,self.runpub,a); self.assertEqual(a.refs[BRANCH],H)
    def test_bad_tree(self):
        a=Fake(); a.create_tree=lambda h,d:h; self.assertRaises(Conflict,self.runpub,a); self.assertEqual(a.refs[BRANCH],H)
    def test_cas_conflict(self):
        a=Fake(); a.compare_and_swap=lambda *x:False; self.assertRaises(Conflict,self.runpub,a); self.assertEqual(a.refs[BRANCH],H)
if __name__=='__main__': unittest.main()
