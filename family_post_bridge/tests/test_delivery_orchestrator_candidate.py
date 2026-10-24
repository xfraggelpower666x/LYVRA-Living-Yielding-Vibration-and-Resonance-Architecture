"""Synthetic integration tests; not a live Drive or Postgres acceptance."""
import unittest
from types import SimpleNamespace
from family_post_bridge.delivery_orchestrator_candidate import process_one

class Cursor:
    rowcount=1
    def __init__(self): self.queries=[]
    def execute(self,sql,args): self.queries.append((sql,args))
    def fetchone(self): return ("synthetic-id",)

class DB:
    def __init__(self, fail_commit=False):
        self.cur=Cursor(); self.commits=0; self.fail_commit=fail_commit
    def cursor(self):return self.cur
    def commit(self):
        self.commits+=1
        if self.fail_commit:raise RuntimeError("uncertain commit")
    def rollback(self):pass

LETTER=SimpleNamespace(message_id="synthetic-id", sender="DAD")
FINGERPRINT="a"*64

class OrchestratorTests(unittest.TestCase):
    def invoke(self,db,writer,readback,consent=True,auth=True):
        return process_one(connection=db,letter=LETTER,fingerprint=FINGERPRINT,
                           writer=writer,independent_readback=readback,
                           explicit_send_intent=consent,role_authorized=auth)

    def test_full_synthetic_one_shot_evidence(self):
        calls=[]
        def write(letter):
            calls.append(letter)
            return {"file_id":"file-1"}
        def readback(file_id):
            return dict(listed_file_ids=[file_id],fetched_file_id=file_id,
                        expected_parent_id="folder",fetched_parent_ids=["folder"],
                        intended_content="exact synthetic",fetched_content="exact synthetic")
        db=DB()
        result=self.invoke(db,write,readback)
        self.assertTrue(result.stored_verified)
        self.assertEqual(result.state,"STORED_VERIFIED_NOT_READ")
        self.assertEqual(len(calls),1)
        self.assertEqual(db.commits,2)

    def test_no_consent_or_role_never_touches_db_or_writer(self):
        for consent,auth in ((False,True),(True,False),(False,False)):
            db=DB(); calls=[]
            def forbidden(*args):calls.append(1);raise AssertionError("must not run")
            result=self.invoke(db,forbidden,forbidden,consent,auth)
            self.assertEqual(result.state,"STOP_NO_SEND_AUTHORITY")
            self.assertEqual(db.commits,0);self.assertEqual(calls,[])

    def test_uncertain_reservation_commit_never_calls_writer(self):
        db=DB(fail_commit=True);calls=[]
        def forbidden(*args):calls.append(1)
        result=self.invoke(db,forbidden,forbidden)
        self.assertEqual(result.state,"COMMIT_UNKNOWN_RECONCILE_NO_RETRY")
        self.assertEqual(calls,[])

    def test_writer_failure_never_retries(self):
        calls=[]
        def failed(*args):calls.append(1);raise RuntimeError("synthetic network error")
        db=DB()
        result=self.invoke(db,failed,lambda x:None)
        self.assertEqual(len(calls),1)
        self.assertEqual(result.state,"WRITE_OUTCOME_UNKNOWN_RECONCILE_NO_RETRY")
        self.assertFalse(result.stored_verified)

    def test_false_readback_never_stored(self):
        calls=[]
        def writer(*args):calls.append(1);return {"file_id":"file-1"}
        db=DB()
        result=self.invoke(db,writer,lambda x:dict(
            listed_file_ids=["file-1"],fetched_file_id="file-1",
            expected_parent_id="folder",fetched_parent_ids=[],
            intended_content="synthetic",fetched_content="synthetic"))
        self.assertFalse(result.stored_verified)
        self.assertEqual(len(calls),1)

if __name__=="__main__":
    unittest.main()
