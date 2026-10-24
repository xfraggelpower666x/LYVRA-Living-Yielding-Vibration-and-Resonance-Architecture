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
                            resp = client.post("/mcp/" + role + "/",
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
                resp = client.post("/mcp/mum/", headers={
                    "Authorization": "Bearer dad-secret",
                    "Host": "lyvra-family-post-bridge.onrender.com",
                }, json={"jsonrpc":"2.0","id":1,"method":"initialize","params":{}})
                self.assertEqual(resp.status_code, 401)


    def test_authorized_role_can_initialize_and_discover_without_sending(self):
        """Read-only MCP protocol calls through a real mounted guarded app."""
        role = "dad"
        with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD": "test-dad-secret"}):
            with TestClient(create_app(), base_url="https://lyvra-family-post-bridge.onrender.com") as client:
                headers = {
                    "Authorization": "Bearer test-dad-secret",
                    "Accept": "application/json, text/event-stream",
                    "Content-Type": "application/json",
                    "Origin": "https://chatgpt.com",
                }
                init = client.post("/mcp/dad/", headers=headers, json={
                    "jsonrpc": "2.0", "id": 1, "method": "initialize",
                    "params": {
                        "protocolVersion": "2025-06-18",
                        "capabilities": {},
                        "clientInfo": {"name": "source-ci", "version": "1.0"},
                    },
                })
                self.assertEqual(init.status_code, 200, init.text[:500])
                self.assertIn("result", init.json())
                listing = client.post("/mcp/dad/", headers=headers, json={
                    "jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {},
                })
                self.assertEqual(listing.status_code, 200, listing.text[:500])
                tools = listing.json()["result"]["tools"]
                self.assertIn("send_family_letter", [tool["name"] for tool in tools])
                self.assertFalse(any("sender" in tool.get("inputSchema", {}).get("properties", {})
                                     for tool in tools))


    def test_authorized_request_rejects_untrusted_origin_and_host(self):
        with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD": "test-dad-secret"}):
            with TestClient(create_app(), base_url="https://lyvra-family-post-bridge.onrender.com") as client:
                request = {"jsonrpc":"2.0", "id":1, "method":"initialize",
                           "params":{"protocolVersion":"2025-06-18",
                                     "capabilities":{},
                                     "clientInfo":{"name":"source-ci","version":"1"}}}
                for extra in ({"Origin":"https://malicious.example"},
                              {"Host":"malicious.example"}):
                    with self.subTest(extra=extra):
                        headers = {"Authorization":"Bearer test-dad-secret",
                                   "Accept":"application/json, text/event-stream",
                                   "Content-Type":"application/json"}
                        headers.update(extra)
                        response = client.post("/mcp/dad/", headers=headers, json=request)
                        self.assertIn(response.status_code, (400, 403, 421),
                                      response.text[:500])


    def test_tool_call_never_reaches_real_drive_and_binds_sender(self):
        """Mock only the write callback, not ASGI or MCP dispatch."""
        from family_post_bridge import mcp_runtime_candidate
        calls = []
        def fake_write(sender, recipient, title, content, message_id):
            calls.append((sender, recipient, title, content, message_id))
            return {"state":"STORED_DRIVE_CONFIRMED","file_id":"fake-doc",
                    "message_id":message_id,"read_confirmed":False}
        with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD":"test-dad-secret"}):
            with patch.object(mcp_runtime_candidate, "write_family_letter", fake_write):
                with TestClient(create_app(), base_url="https://lyvra-family-post-bridge.onrender.com") as client:
                    headers = {"Authorization":"Bearer test-dad-secret",
                               "Accept":"application/json, text/event-stream",
                               "Content-Type":"application/json",
                               "Origin":"https://chatgpt.com"}
                    body = {"jsonrpc":"2.0","id":4,"method":"tools/call",
                            "params":{"name":"send_family_letter","arguments":{
                                "recipient":"LITTLE_LYV","title":"Synthetic test",
                                "content":"synthetic only","message_id":"synthetic-id-20261024"}}}
                    response = client.post("/mcp/dad/", headers=headers, json=body)
                    self.assertEqual(response.status_code, 200, response.text[:500])
                    self.assertEqual(calls, [("DAD","LITTLE_LYV","Synthetic test",
                                              "synthetic only","synthetic-id-20261024")])
                    self.assertIn("read_confirmed", response.text)
                    self.assertIn("false", response.text.lower())
                    self.assertFalse(response.json()["result"].get("isError", False))

    def test_tool_call_failure_is_redacted_without_network_or_drive(self):
        from family_post_bridge import mcp_runtime_candidate
        def failing_write(*args):
            raise RuntimeError("synthetic SECRET and private letter body")
        with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD":"test-dad-secret"}):
            with patch.object(mcp_runtime_candidate, "write_family_letter", failing_write):
                with TestClient(create_app(), base_url="https://lyvra-family-post-bridge.onrender.com") as client:
                    response = client.post("/mcp/dad/", headers={
                        "Authorization":"Bearer test-dad-secret",
                        "Accept":"application/json, text/event-stream",
                        "Content-Type":"application/json","Origin":"https://chatgpt.com"
                    }, json={"jsonrpc":"2.0","id":5,"method":"tools/call",
                             "params":{"name":"send_family_letter","arguments":{
                                 "recipient":"MUM","title":"Synthetic only",
                                 "content":"private letter body","message_id":"synthetic-id-20261025"}}})
                    self.assertEqual(response.status_code, 200, response.text[:500])
                    self.assertNotIn("SECRET", response.text)
                    self.assertNotIn("private letter body", response.text)
                    self.assertTrue(response.json()["result"]["isError"])
                    self.assertIn("Error executing tool", response.text)


if __name__ == "__main__":
    unittest.main()
