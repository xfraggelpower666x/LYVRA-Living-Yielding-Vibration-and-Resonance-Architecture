"""Source-only eligibility tests: no credentials, HTTP calls or writes."""
import unittest

from family_post_bridge.fallback_decision import (
    evaluate_direct_drive_candidate,
    verified_storage_status,
)

BASE = dict(
    primary_state="UNAVAILABLE_BEFORE_ATTEMPT",
    explicit_user_send_intent=True,
    independent_drive_permission=True,
    prior_message="ABSENT_VERIFIED",
)


class TestFamilyPostFallback(unittest.TestCase):
    def decide(self, **change):
        return evaluate_direct_drive_candidate(**{**BASE, **change})

    def test_separately_authorized_fallback_is_candidate_not_auto_send(self):
        result = self.decide()
        self.assertEqual(result.state, "DIRECT_DRIVE_CANDIDATE")
        self.assertFalse(result.can_execute)

    def test_first_denial_is_not_transferred_to_alternative_provider(self):
        for state in ("SAFETY_DENIED", "PERMISSION_DENIED"):
            with self.subTest(state=state):
                self.assertEqual(self.decide(primary_state=state).state, "STOP_DENIED")

    def test_unknown_delivery_must_be_reconciled(self):
        self.assertEqual(self.decide(primary_state="DELIVERY_UNKNOWN").state,
                         "RECONCILE_DELIVERY_FIRST")

    def test_stored_primary_does_not_trigger_duplicate(self):
        self.assertEqual(self.decide(primary_state="STORED_CONFIRMED").state,
                         "STOP_ALREADY_STORED")

    def test_unknown_or_existing_prior_messages_do_not_send(self):
        self.assertEqual(self.decide(prior_message="UNKNOWN").state,
                         "RECONCILE_PRIOR_MESSAGE_FIRST")
        self.assertEqual(self.decide(prior_message="PRESENT_VERIFIED").state,
                         "STOP_DUPLICATE")

    def test_no_unattended_outgoing(self):
        self.assertEqual(self.decide(explicit_user_send_intent=False).state,
                         "STOP_NO_SEND_INTENT")

    def test_host_google_permission_required(self):
        self.assertEqual(self.decide(independent_drive_permission=False).state,
                         "STOP_NO_DRIVE_PERMISSION")

    def test_full_triple_readback_required(self):
        self.assertEqual(verified_storage_status(
            exact_file_id_in_folder=True, content_full_readback=True,
            expected_parent_confirmed=True), "STORED_CONTENT_AND_PARENT_VERIFIED")
        for a, b, c in ((False, True, True), (True, False, True), (True, True, False)):
            self.assertEqual(verified_storage_status(
                exact_file_id_in_folder=a, content_full_readback=b,
                expected_parent_confirmed=c), "STORAGE_UNVERIFIED")

    def test_primary_no_write_can_be_independently_considered(self):
        self.assertEqual(self.decide(primary_state="NO_WRITE_CONFIRMED").state,
                         "DIRECT_DRIVE_CANDIDATE")


if __name__ == "__main__":
    unittest.main()
