"""Real ASGI smoke/negative tests with pinned MCP SDK; no network/Drive writes.

Run in CI with the dev MCP dependency and httpx. Requests are in-process.
The protected writer tool is NEVER invoked in this suite.
"""
import os
import unittest
from unittest.mock import patch

from starlette.testclient import TestClient

from family_post_bridge.mcp_runtime_candidate import create_app


class MCPASGIRuntimeSmokeTests(unittest.TestCase):
    def test_public_legacy_health_still_reachable(self):
        with TestClient(create_app()) as client:
            response = client.get("/health")
            self.assertEqual(response.status_code, 200)
            payload = response.json()
            self.assertEqual(payload["service"], "lyvra-family-post-bridge")
            self.assertFalse(payload["drive_read_mailbox"])

    def test_every_role_rejects_missing_and_wrong_bearer(self):
        for role in ("dad", "big_lyvra", "mum", "little_lyv"):
            with self.subTest(role=role):
                key = "FAMILY_POST_TOKEN_" + role.upper()
                with patch.dict(os.environ, {key: "test-secret-" + role}):
                    with TestClient(create_app()) as client:
                        for token in (None, "Bearer bad-secret"):
                            headers = {"Host": "lyvra-family-post-bridge.onrender.com"}
                            if token:
                                headers["Authorization"] = token
                            resp = client.post("/mcp/" + role,
                                headers=headers, json={"jsonrpc":"2.0",
                                "id":1,"method":"initialize",
                                "params":{"protocolVersion":"2025-06-18",
                                "capabilities":{},"clientInfo":{"name":"test","version":"1"}}})
                            self.assertEqual(resp.status_code, 401, resp.text[:300])
                            self.assertEqual(resp.json()["error"], "UNAUTHORIZED")

    def test_wrong_role_token_cannot_initialize(self):
        with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD":"dad-secret",
                                     "FAMILY_POST_TOKEN_MUM":"mum-secret"}):
            with TestClient(create_app()) as client:
                resp = client.post("/mcp/mum", headers={
                    "Authorization": "Bearer dad-secret",
                    "Host": "lyvra-family-post-bridge.onrender.com",
                }, json={"jsonrpc":"2.0","id":1,"method":"initialize","params":{}})
                self.assertEqual(resp.status_code, 401)


if __name__ == "__main__":
    unittest.main()
