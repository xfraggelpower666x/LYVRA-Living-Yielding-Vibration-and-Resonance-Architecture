"""Candidate import/Free-plan dependency boundary; no live side effects."""
import os
import unittest
from unittest.mock import patch
from starlette.testclient import TestClient

class EntrypointTests(unittest.TestCase):
    def test_optional_entrypoint_real_lifespan_and_legacy_health(self):
        with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD":"synthetic-only"}):
            from family_post_bridge.mcp_asgi_entrypoint_candidate import app
            with TestClient(app) as client:
                r=client.get("/health")
                self.assertEqual(r.status_code,200)
                denied=client.post("/mcp/dad/",json={"jsonrpc":"2.0","id":1,"method":"initialize","params":{}})
                self.assertEqual(denied.status_code,401)

    def test_minimal_dependency_and_untouched_prod_start(self):
        from pathlib import Path
        root=Path(__file__).resolve().parents[1]
        req=(root/"requirements-mcp-runtime-candidate.txt").read_text()
        self.assertIn("mcp==2.3.0",req)
        self.assertNotIn("psycopg",req)
        self.assertNotIn("pytest",req)
        self.assertNotIn("redis",req)
        self.assertNotIn("mcp_asgi_entrypoint_candidate", (root/"server.py").read_text())

if __name__=="__main__":
    unittest.main()
