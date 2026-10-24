"""Zero-network test for duplicate message IDs under existing Drive free writer."""
import os
import unittest
from unittest.mock import MagicMock, patch
from fastapi import HTTPException
from family_post_bridge.server import Letter, _do_write_locked

LETTER = Letter(message_id="synthetic-duplicate-123", sender="DAD",
                recipient="LITTLE_LYV", title="Synthetic only", content="No real message")

class DuplicateDriveIdTests(unittest.TestCase):
    def test_multiple_matches_fail_closed_without_create(self):
        service=MagicMock()
        service.files.return_value.list.return_value.execute.return_value={
            "files":[{"id":"id-a","appProperties":{}},{"id":"id-b","appProperties":{}}]
        }
        with patch("family_post_bridge.server.drive",return_value=service), patch.dict(os.environ,{"FAMILY_POST_FOLDER_ID":"synthetic-folder"}):
            with self.assertRaises(HTTPException) as ctx:
                _do_write_locked(LETTER)
            self.assertEqual(ctx.exception.status_code,409)
            self.assertEqual(ctx.exception.detail,"MESSAGE_ID_AMBIGUOUS_DUPLICATES")
            service.files.return_value.create.assert_not_called()

    def test_uncertain_existing_fingerprint_fails_closed(self):
        service=MagicMock()
        service.files.return_value.list.return_value.execute.return_value={
            "files":[{"id":"id-a","appProperties":{"family_post_payload_sha256":"b"*64}}]
        }
        with patch("family_post_bridge.server.drive",return_value=service), patch.dict(os.environ,{"FAMILY_POST_FOLDER_ID":"synthetic-folder"}):
            with self.assertRaises(HTTPException) as ctx:
                _do_write_locked(LETTER)
            self.assertEqual(ctx.exception.status_code,409)
            service.files.return_value.create.assert_not_called()

if __name__=="__main__":
    unittest.main()
