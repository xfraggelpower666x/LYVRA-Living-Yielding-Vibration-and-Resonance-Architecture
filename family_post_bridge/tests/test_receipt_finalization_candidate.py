"""Source-only tests: receipt finalization must have concrete readback evidence."""
import unittest
from family_post_bridge.receipt_finalization_candidate import finalize_after_independent_readback

class FakeDB:
    def __init__(self, changed=1, fail=False):
        self.rowcount=changed
        self.fail=fail
        self.commits=0
        self.rollbacks=0
        self.calls=[]
    def cursor(self):
        return self
    def execute(self, sql, args):
        self.calls.append((sql,args))
    def commit(self):
        self.commits+=1
        if self.fail: raise RuntimeError("uncertain commit")
    def rollback(self):
        self.rollbacks+=1

def call(db, **overrides):
    args=dict(message_id="synthetic-id-20261024",payload_sha256="a"*64,sender_role="DAD",
              intended_file_id="synthetic-file",listed_file_ids=["synthetic-file"],
              fetched_file_id="synthetic-file",expected_parent_id="folder",
              fetched_parent_ids=["folder"],intended_content="exact synthetic content",
              fetched_content="exact synthetic content")
    args.update(overrides)
    return finalize_after_independent_readback(db,**args)

class ReceiptFinalizationTests(unittest.TestCase):
    def test_full_evidence_and_commit(self):
        db=FakeDB()
        result=call(db)
        self.assertTrue(result.stored_verified)
        self.assertEqual(db.commits,1)
        self.assertIn("delivery_state='STORED_VERIFIED'",db.calls[0][0])

    def test_evidence_mismatch_blocks_db_write(self):
        for mismatch in (dict(listed_file_ids=[]),dict(fetched_file_id="wrong"),
                         dict(fetched_parent_ids=[]),dict(fetched_content="wrong")):
            with self.subTest(mismatch=mismatch):
                db=FakeDB()
                result=call(db,**mismatch)
                self.assertFalse(result.stored_verified)
                self.assertEqual(db.calls,[])
                self.assertEqual(db.commits,0)

    def test_concurrent_or_prior_receipt_no_overwrite(self):
        db=FakeDB(changed=0)
        result=call(db)
        self.assertFalse(result.stored_verified)
        self.assertEqual(db.rollbacks,1)

    def test_commit_unknown_fails_closed(self):
        db=FakeDB(fail=True)
        result=call(db)
        self.assertFalse(result.stored_verified)
        self.assertEqual(result.status,"COMMIT_UNKNOWN_RECONCILE_NO_RETRY")

if __name__=="__main__":
    unittest.main()
