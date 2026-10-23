import unittest
from family_post_bridge.intelligent_review import classify_mailbox, post_write_followup

class ReviewTests(unittest.TestCase):
    def test_mixed_personal_test_image_answer_and_peer_task(self):
        xs=[
            {"file_id":"method","revision":"1","category":"PERSONAL_INCOMING","message_id":"method-id"},
            {"file_id":"status","revision":"1","category":"PERSONAL_INCOMING","message_id":"status-id"},
            {"file_id":"portrait","revision":"1","category":"IMAGE_LETTER"},
            {"file_id":"old","revision":"1","category":"PERSONAL_INCOMING","message_id":"old-id"},
            {"file_id":"out","revision":"1","category":"OUTGOING"},
            {"file_id":"probe","revision":"1","category":"TECHNICAL_TEST"}
        ]
        r=classify_mailbox(xs,validated_answer_links={"out":"old"},
             task_status_evidence={"origin":"PEER_LETTER","status":"DISABLED"})
        self.assertEqual([a["state"] for a in r["items"]],
           ["PERSONAL_NEW_NEEDS_REVIEW","PERSONAL_NEW_NEEDS_REVIEW",
            "IMAGE_CONTENT_UNVERIFIED","ANSWER_LINK_VERIFIED",
            "OUTGOING_NOT_INBOX","TECHNICAL_NO_PERSONAL_REPLY"])
        self.assertEqual(r["scheduler_status"],"NOT_INDEPENDENTLY_VERIFIED")
        self.assertFalse(r["sent"])

    def test_scheduler_requires_independent_host_read(self):
        x=classify_mailbox([],task_status_evidence={
            "origin":"HOST_TASK_SETTINGS_READBACK","status":"DISABLED"})
        self.assertEqual(x["scheduler_status"],"DISABLED")

    def test_duplicate_and_changed(self):
        xs=[{"file_id":"a","revision":"2","category":"PERSONAL_INCOMING","message_id":"shared"},
            {"file_id":"b","revision":"1","category":"PERSONAL_INCOMING","message_id":"shared"},
            {"file_id":"c","revision":"3","category":"PERSONAL_INCOMING"}]
        r=classify_mailbox(xs,reviewed_revisions={"c":"2"})
        self.assertEqual([x["state"] for x in r["items"]],
                         ["DUPLICATE_ID_REVIEW","DUPLICATE_ID_REVIEW","CHANGED_NEEDS_REVIEW"])

    def test_post_write_readback_plan_and_no_retry(self):
        self.assertEqual(post_write_followup(render_receipt_state="STORED_DRIVE_CONFIRMED",
           drive_receipt_state="PENDING")["next"],"REQUEST_HOST_GOOGLE_CONNECTOR_READBACK")
        self.assertEqual(post_write_followup(render_receipt_state="TIMEOUT",
           drive_receipt_state="PENDING")["next"],"RECONCILE_BY_MESSAGE_ID")
        self.assertEqual(post_write_followup(render_receipt_state="STORED_DRIVE_CONFIRMED",
           drive_receipt_state="STORED_CONTENT_AND_PARENT_VERIFIED")["next"],"SHOW_STORED_VERIFIED_NOT_READ")
        self.assertEqual(post_write_followup(render_receipt_state="STORED_DRIVE_CONFIRMED",
           drive_receipt_state="PENDING",denied=True)["next"],"STOP_BLOCKED")
        self.assertFalse(post_write_followup(render_receipt_state="TIMEOUT",
           drive_receipt_state="PENDING")["may_resend"])
if __name__=="__main__": unittest.main()
