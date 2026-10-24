"""Release invariants for observed Render Free host, no external connections."""
from pathlib import Path
import unittest

ROOT=Path(__file__).resolve().parents[1]

class RenderFreeReleaseContract(unittest.TestCase):
    def test_same_service_candidate_has_no_database_dep(self):
        req=(ROOT/"requirements-mcp-runtime-candidate.txt").read_text()
        self.assertIn("-r requirements.txt",req)
        self.assertIn("mcp==2.3.0",req)
        for forbidden in ("psycopg","redis","sqlalchemy","pytest"):
            self.assertNotIn(forbidden,req.lower())

    def test_live_start_command_is_not_changed_by_candidate(self):
        plan=(ROOT/"RENDER_FREE_READBACK_AND_ACTIVATION_GATES_20261024.md").read_text()
        self.assertIn("autoDeploy: no",plan)
        self.assertIn("plan: free",plan)
        self.assertIn("numInstances: 1",plan)
        self.assertIn("uvicorn family_post_bridge.server:app",plan)
        self.assertIn("not a successful live MCP deployment",plan.lower())
        self.assertNotIn("mcp_asgi_entrypoint_candidate", (ROOT/"server.py").read_text())

    def test_candidate_route_remains_opt_in_only(self):
        entry=(ROOT/"mcp_asgi_entrypoint_candidate.py").read_text()
        self.assertIn("create_app()",entry)
        policy=(ROOT/"ZERO_EURO_GOVERNANCE_LOCK_20261024.md").read_text()
        self.assertIn("No new database",policy)

if __name__=="__main__":
    unittest.main()
