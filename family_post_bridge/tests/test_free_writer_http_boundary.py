"""HTTP boundary must preserve conflict, redact uncertainty, never create Drive writes."""
import os
import unittest
from unittest.mock import patch
from fastapi import HTTPException
from fastapi.testclient import TestClient
from family_post_bridge.server import app

ENV={k:"synthetic-only" for k in ("FAMILY_POST_TOKEN_DAD","FAMILY_POST_TOKEN_MUM","FAMILY_POST_TOKEN_BIG_LYVRA","FAMILY_POST_TOKEN_LITTLE_LYV","GOOGLE_CLIENT_ID","GOOGLE_CLIENT_SECRET","GOOGLE_REFRESH_TOKEN","FAMILY_POST_FOLDER_ID")}
BODY={"sender":"DAD","recipient":"LITTLE_LYV","title":"Synthetic title","content":"synthetic only","message_id":"synthetic-ambiguous-2026"}

class FreeWriterHTTPBoundaryTests(unittest.TestCase):
    def test_conflict_is_409_not_503(self):
        with patch.dict(os.environ,ENV), patch("family_post_bridge.server.do_write",side_effect=HTTPException(409,"MESSAGE_ID_AMBIGUOUS_DUPLICATES")):
            with TestClient(app) as client:
                res=client.post("/api/family-post/write",json=BODY,headers={"X-Family-Post-Token":"synthetic-only"})
        self.assertEqual(res.status_code,409)
        self.assertEqual(res.json()["detail"],"MESSAGE_ID_AMBIGUOUS_DUPLICATES")

    def test_uncertain_network_error_remains_unconfirmed(self):
        with patch.dict(os.environ,ENV), patch("family_post_bridge.server.do_write",side_effect=RuntimeError("private token secret")):
            with TestClient(app) as client:
                res=client.post("/api/family-post/write",json=BODY,headers={"X-Family-Post-Token":"synthetic-only"})
        self.assertEqual(res.status_code,503)
        self.assertEqual(res.json()["detail"],"DRIVE_WRITE_UNCONFIRMED")
        self.assertNotIn("private token",res.text)

    def test_wrong_role_token_never_calls_writer(self):
        with patch.dict(os.environ,{**ENV,"FAMILY_POST_TOKEN_DAD":"dad-token"}), patch("family_post_bridge.server.do_write") as writer:
            with TestClient(app) as client:
                res=client.post("/api/family-post/write",json=BODY,headers={"X-Family-Post-Token":"not-dad-token"})
        self.assertEqual(res.status_code,401)
        writer.assert_not_called()

if __name__=="__main__":
    unittest.main()
