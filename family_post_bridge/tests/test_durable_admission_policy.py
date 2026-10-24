"""Pure no-network acceptance for fail-closed durable write-admission policy."""
import unittest
from family_post_bridge.durable_admission_policy import decide_write


class DurableAdmissionTests(unittest.TestCase):
    def test_no_coordinator_never_creates(self):
        for evidence in ("NO_DURABLE_COORDINATOR", "UNKNOWN", "ACTIVE_SAME",
                         "COMMITTED_SAME", "ABSENT_ATOMICALLY_RESERVED"):
            with self.subTest(evidence=evidence):
                x = decide_write(evidence=evidence, explicit_send_intent=True,
                                 role_authorized=True, durable_coordinator_verified=False)
                self.assertFalse(x.may_create)
                self.assertEqual(x.state, "BLOCK_NO_DURABLE_COORDINATOR")

    def test_only_atomic_reservation_admits_creation(self):
        for evidence in ("NO_DURABLE_COORDINATOR", "UNKNOWN", "ACTIVE_SAME",
                         "ACTIVE_DIFFERENT", "COMMITTED_SAME", "COMMITTED_DIFFERENT",
                         "ABSENT_ATOMICALLY_RESERVED"):
            with self.subTest(evidence=evidence):
                x = decide_write(evidence=evidence, explicit_send_intent=True,
                                 role_authorized=True, durable_coordinator_verified=True)
                self.assertEqual(x.may_create, evidence == "ABSENT_ATOMICALLY_RESERVED")

    def test_stored_is_receipt_not_second_write(self):
        x = decide_write(evidence="COMMITTED_SAME", explicit_send_intent=True,
                         role_authorized=True, durable_coordinator_verified=True)
        self.assertEqual(x.state, "RETURN_PREVIOUS_RECEIPT_ONLY")
        self.assertFalse(x.needs_reconcile)

    def test_unknown_must_reconcile(self):
        x = decide_write(evidence="UNKNOWN", explicit_send_intent=True,
                         role_authorized=True, durable_coordinator_verified=True)
        self.assertEqual(x.state, "RECONCILE_NO_RETRY")
        self.assertTrue(x.needs_reconcile)

    def test_conflicting_payload_fails_closed(self):
        for state in ("ACTIVE_DIFFERENT", "COMMITTED_DIFFERENT"):
            x = decide_write(evidence=state, explicit_send_intent=True,
                             role_authorized=True, durable_coordinator_verified=True)
            self.assertEqual(x.state, "STOP_PAYLOAD_CONFLICT")
            self.assertFalse(x.may_create)

    def test_missing_user_intent_or_role_never_sends(self):
        for intent, authorized in ((False, True), (True, False), (False, False)):
            x = decide_write(evidence="ABSENT_ATOMICALLY_RESERVED",
                             explicit_send_intent=intent, role_authorized=authorized,
                             durable_coordinator_verified=True)
            self.assertEqual(x.state, "STOP_UNAUTHORIZED_OR_UNREQUESTED")
            self.assertFalse(x.may_create)


if __name__ == "__main__":
    unittest.main()
