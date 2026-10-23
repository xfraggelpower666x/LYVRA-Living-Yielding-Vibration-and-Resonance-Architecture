"""Source-only tests; not an authenticated sender, mailbox reader or scheduler."""
import unittest

from family_post_bridge.post_write_monitor import (
    verify_post_write_receipt, monitor_inbox_snapshot, visual_monitor_summary,
)

BASE = {
    "backend_response": {"state": "STORED_DRIVE_CONFIRMED", "file_id": "doc-01", "message_id": "message-001"},
    "expected_message_id": "message-001",
    "expected_file_id": "doc-01",
    "expected_parent_id": "family-folder",
    "expected_content": "Sender: DAD\nRecipient: FAMILY\nMessage-ID: message-001\n\nHello\n",
    "drive_listing": [{"id": "doc-01"}],
    "drive_document": {"id": "doc-01", "parents": ["family-folder"], "content": "Sender: DAD\nRecipient: FAMILY\nMessage-ID: message-001\n\nHello\n"},
    "connector_read_confirmed": True,
}


class TestPostWriteMonitor(unittest.TestCase):
    def receipt(self, **overrides):
        return verify_post_write_receipt(**{**BASE, **overrides})

    def test_confirmed_write_and_independent_exact_readback(self):
        r = self.receipt()
        self.assertEqual(r["state"], "STORED_CONTENT_AND_PARENT_VERIFIED")
        self.assertTrue(r["read_confirmed"])
        self.assertFalse(r["recipient_read_confirmed"])

    def test_api_success_not_equal_drive_readback(self):
        r = self.receipt(connector_read_confirmed=False)
        self.assertEqual(r["state"], "STORED_READBACK_PENDING")
        self.assertFalse(r["read_confirmed"])

    def test_unknown_write_result_reconciles_without_retry(self):
        self.assertEqual(self.receipt(backend_response={})["state"], "WRITE_UNCONFIRMED_RECONCILE")

    def test_conflicting_id_fails_closed(self):
        self.assertEqual(self.receipt(expected_message_id="other")["state"], "RECEIPT_MESSAGE_ID_CONFLICT")
        self.assertEqual(self.receipt(expected_file_id="other")["state"], "RECEIPT_FILE_ID_CONFLICT")

    def test_exact_full_content_and_folder_are_required(self):
        for mutation in (
            {"drive_listing": []},
            {"drive_document": {"id": "doc-01", "parents": ["other"], "content": BASE["expected_content"]}},
            {"drive_document": {"id": "doc-01", "parents": ["family-folder"], "content": "changed"}},
            {"drive_document": {"id": "other", "parents": ["family-folder"], "content": BASE["expected_content"]}},
        ):
            with self.subTest(mutation=mutation):
                self.assertEqual(self.receipt(**mutation)["state"], "STORED_READBACK_MISMATCH")

    def test_monitor_readback_not_proven(self):
        r = monitor_inbox_snapshot(entries=[], listing_verified=False)
        self.assertEqual(r["state"], "READBACK_PENDING")
        self.assertIsNone(r["folder_count"])

    def test_monitor_revision_and_answer_link(self):
        entries = [
            {"file_id": "a", "revision": "1", "message_id": "m-a", "is_incoming": True},
            {"file_id": "b", "revision": "3", "message_id": "m-b", "is_incoming": True},
            {"file_id": "c", "revision": "9", "message_id": "m-c", "is_incoming": True},
            {"file_id": "d", "revision": "1", "message_id": "m-d", "is_incoming": False},
        ]
        r = monitor_inbox_snapshot(
            entries=entries, known_revisions={"a": "1", "b": "2"},
            source_link_evidence={"d": "c"}, listing_verified=True
        )
        self.assertEqual([i["state"] for i in r["items"]], [
            "UNCHANGED_PREVIOUSLY_REVIEWED", "CHANGED_NEEDS_REVIEW",
            "ANSWER_EVIDENCE_PRESENT", "OUTGOING_NOT_INBOX"
        ])
        self.assertEqual(r["folder_count"], 4)

    def test_duplicate_ids_need_review(self):
        entries = [{"file_id": f"f{i}", "revision": "1", "message_id": "same", "is_incoming": True} for i in range(2)]
        r = monitor_inbox_snapshot(entries=entries, listing_verified=True)
        self.assertTrue(all(i["state"] == "DUPLICATE_ID_REVIEW" for i in r["items"]))

    def test_visual_status_never_claims_human_read_or_enabled_task(self):
        r = visual_monitor_summary("STORED_READBACK_PENDING", "READ_VERIFIED")
        self.assertEqual(r["scheduler"], "NOT_CHECKED")
        self.assertEqual(r["recipient_read"], "NOT_VERIFIED")
        self.assertEqual(r["next_action"], "READBACK_REQUIRED")


if __name__ == "__main__":
    unittest.main()
