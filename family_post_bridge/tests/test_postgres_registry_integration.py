"""Real PostgreSQL concurrency acceptance; CI disposable database only.

Never invokes Google Drive or a letter-writing tool.
"""
import os
import pathlib
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
import psycopg
from family_post_bridge.commit_recovery_candidate import reserve_and_commit
from family_post_bridge.durable_registry_candidate import reserve_one_transaction

SCHEMA = pathlib.Path(__file__).resolve().parents[1] / "schema" / "durable_registry_candidate.sql"
DSN = os.environ.get("FAMILY_POST_TEST_PG_DSN")


@unittest.skipUnless(DSN, "Requires disposable PostgreSQL CI service")
class DurablePostgresTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with psycopg.connect(DSN) as conn:
            conn.execute(SCHEMA.read_text())
            conn.commit()

    def setUp(self):
        with psycopg.connect(DSN) as conn:
            conn.execute("TRUNCATE family_post_delivery_registry")
            conn.commit()

    def test_two_connections_same_message_only_one_reservation(self):
        barrier = threading.Barrier(2)
        def attempt(i):
            with psycopg.connect(DSN) as conn:
                barrier.wait(timeout=10)
                return reserve_and_commit(conn, "synthetic-concurrent", "a"*64, "DAD")
        with ThreadPoolExecutor(max_workers=2) as pool:
            a, b = list(pool.map(attempt, (0, 1)))
        states = sorted((a.state, b.state))
        self.assertEqual(states, ["RECONCILE_NO_RETRY", "RESERVED_COMMITTED_ONCE"])
        self.assertEqual(sum(x.may_attempt_one_write for x in (a,b)), 1)
        with psycopg.connect(DSN) as conn:
            count = conn.execute("SELECT count(*) FROM family_post_delivery_registry").fetchone()[0]
            self.assertEqual(count, 1)

    def test_same_id_different_payload_fails_closed(self):
        with psycopg.connect(DSN) as conn:
            a = reserve_and_commit(conn, "synthetic-conflict", "a"*64, "DAD")
        with psycopg.connect(DSN) as conn:
            b = reserve_and_commit(conn, "synthetic-conflict", "b"*64, "DAD")
        self.assertEqual(a.state, "RESERVED_COMMITTED_ONCE")
        self.assertEqual(b.state, "CONFLICT")
        self.assertFalse(b.may_attempt_one_write)

    def test_reserved_survives_reconnect_and_never_resends(self):
        with psycopg.connect(DSN) as conn:
            self.assertTrue(reserve_and_commit(conn, "synthetic-crash", "a"*64, "MUM").may_attempt_one_write)
        with psycopg.connect(DSN) as conn:
            later = reserve_and_commit(conn, "synthetic-crash", "a"*64, "MUM")
        self.assertEqual(later.state, "RECONCILE_NO_RETRY")
        self.assertFalse(later.may_attempt_one_write)


if __name__ == "__main__":
    unittest.main()
