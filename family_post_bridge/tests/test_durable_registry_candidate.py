"""Transactional registry decision tests without DB, network or Drive."""
import unittest
from family_post_bridge.durable_registry_candidate import reserve_one_transaction

class FakeCursor:
    def __init__(self, results):
        self.results = iter(results)
        self.calls = []
    def execute(self, sql, params):
        self.calls.append((sql, params))
    def fetchone(self):
        return next(self.results)


class CandidateRegistryTests(unittest.TestCase):
    def test_new_reservation_is_not_yet_permission_to_send(self):
        db = FakeCursor([("mid",)])
        result = reserve_one_transaction(db, "mid", "a"*64, "DAD")
        self.assertEqual(result.state, "RESERVED_NEW_COMMIT_REQUIRED")
        self.assertFalse(result.can_attempt_once)
        self.assertIn("ON CONFLICT (message_id) DO NOTHING", db.calls[0][0])

    def test_existing_identical_is_never_resubmitted(self):
        for state, file_id, expected in (
                ("RESERVED", None, "RECONCILE_NO_RETRY"),
                ("WRITE_UNKNOWN", None, "RECONCILE_NO_RETRY"),
                ("STORED_VERIFIED", "file-1", "RETURN_EXISTING_RECEIPT")):
            with self.subTest(state=state):
                db = FakeCursor([None, ("a"*64, "DAD", state, file_id)])
                result = reserve_one_transaction(db, "mid", "a"*64, "DAD")
                self.assertEqual(result.state, expected)
                self.assertFalse(result.can_attempt_once)

    def test_conflicting_payload_or_role_is_rejected(self):
        for prior in (("b"*64,"DAD","RESERVED",None),
                      ("a"*64,"MUM","RESERVED",None)):
            db = FakeCursor([None, prior])
            self.assertEqual(reserve_one_transaction(db,"mid","a"*64,"DAD").state,"CONFLICT")

    def test_ambiguous_db_result_never_resends(self):
        db = FakeCursor([None, None])
        result = reserve_one_transaction(db,"mid","a"*64,"DAD")
        self.assertEqual(result.state,"RECONCILE_UNKNOWN")
        self.assertFalse(result.can_attempt_once)

if __name__ == "__main__":
    unittest.main()
