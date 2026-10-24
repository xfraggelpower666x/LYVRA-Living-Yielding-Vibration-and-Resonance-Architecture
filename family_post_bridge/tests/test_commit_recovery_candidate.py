"""No-network commit/recovery tests: fail closed on uncertain outcomes."""
import unittest
from family_post_bridge.commit_recovery_candidate import reserve_and_commit, mark_write_unknown


class FakeCursor:
    def __init__(self, result, changed=1):
        self.result = result
        self.rowcount = changed
        self.queries = []
    def execute(self, sql, params):
        self.queries.append((sql, params))
    def fetchone(self):
        return self.result


class FakeConnection:
    def __init__(self, result=("m",), fail_commit=False, fail_rollback=False, changed=1):
        self.cur = FakeCursor(result, changed)
        self.fail_commit = fail_commit
        self.fail_rollback = fail_rollback
        self.commits = 0
        self.rollbacks = 0
    def cursor(self):
        return self.cur
    def commit(self):
        self.commits += 1
        if self.fail_commit:
            raise RuntimeError("unknown commit result")
    def rollback(self):
        self.rollbacks += 1
        if self.fail_rollback:
            raise RuntimeError("connection closed")


class CommitRecoveryCandidateTests(unittest.TestCase):
    def test_commit_before_one_shot_admission(self):
        db = FakeConnection()
        result = reserve_and_commit(db,"m","a"*64,"DAD")
        self.assertEqual(db.commits, 1)
        self.assertEqual(result.state, "RESERVED_COMMITTED_ONCE")
        self.assertTrue(result.may_attempt_one_write)

    def test_unknown_commit_does_not_admit_write(self):
        for fail_rollback in (False, True):
            db = FakeConnection(fail_commit=True, fail_rollback=fail_rollback)
            result = reserve_and_commit(db,"m","a"*64,"DAD")
            self.assertEqual(result.state, "COMMIT_UNKNOWN_RECONCILE_NO_RETRY")
            self.assertFalse(result.may_attempt_one_write)

    def test_prior_message_never_admits_new_write(self):
        db = FakeConnection(result=None)
        db.cur.fetchone = lambda: None
        result = reserve_and_commit(db,"m","a"*64,"DAD")
        self.assertEqual(result.state, "RECONCILE_UNKNOWN")
        self.assertFalse(result.may_attempt_one_write)

    def test_uncertain_write_marked_and_never_released(self):
        db = FakeConnection()
        result = mark_write_unknown(db,"m","a"*64,"DAD")
        self.assertEqual(result, "WRITE_UNKNOWN_RECORDED")
        self.assertIn("delivery_state='WRITE_UNKNOWN'",db.cur.queries[0][0])
        self.assertIn("delivery_state='RESERVED'",db.cur.queries[0][0])

    def test_mark_unknown_failure_stays_uncertain(self):
        db = FakeConnection(fail_commit=True)
        result = mark_write_unknown(db,"m","a"*64,"DAD")
        self.assertEqual(result, "UNKNOWN_PERSISTENCE_RECONCILE_NO_RETRY")


if __name__ == "__main__":
    unittest.main()
