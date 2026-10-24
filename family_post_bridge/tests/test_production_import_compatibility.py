"""Exercise exact existing Render Free command import: server:app. No Drive writes."""
import os
import unittest
from unittest.mock import patch
from starlette.testclient import TestClient

from family_post_bridge.server import app

class ProductionImportCompatibilityTests(unittest.TestCase):
    def test_existing_render_entrypoint_has_rest_and_mcp(self):
        with patch.dict(os.environ, {"FAMILY_POST_TOKEN_DAD":"synthetic-only"}):
            with TestClient(app,base_url="https://lyvra-family-post-bridge.onrender.com") as client:
                rest=client.get("/health")
                self.assertEqual(rest.status_code,200,rest.text)
                self.assertEqual(rest.json()["mode"],"WRITE_ONLY")
                mcp=client.post("/mcp/dad/",json={"jsonrpc":"2.0","id":1,
                               "method":"initialize","params":{}})
                self.assertEqual(mcp.status_code,401,mcp.text)
                self.assertEqual(mcp.headers.get("cache-control"),"no-store")

    def test_prod_dependencies_are_same_free_service(self):
        from pathlib import Path
        req=(Path(__file__).resolve().parents[1]/"requirements.txt").read_text()
        self.assertIn("mcp==2.3.0",req)
        for forbidden in ("psycopg", "redis==", "sqlalchemy", "asyncpg"):
            self.assertNotIn(forbidden,req.lower())

if __name__=="__main__":
    unittest.main()
