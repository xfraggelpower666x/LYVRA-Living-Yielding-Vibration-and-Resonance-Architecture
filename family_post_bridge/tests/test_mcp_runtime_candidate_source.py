"""No-network/source-only invariants for opt-in MCP ASGI candidate."""
import ast
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


class MCPRuntimeCandidateTests(unittest.TestCase):
    def test_no_production_entrypoint_mutation(self):
        server = (ROOT / "server.py").read_text()
        self.assertNotIn("mcp_runtime_candidate", server)
        self.assertNotIn("create_role_server", server)

    def test_candidate_opt_in_and_role_mounts(self):
        code = (ROOT / "mcp_runtime_candidate.py").read_text()
        tree = ast.parse(code)
        self.assertFalse(any(isinstance(node, ast.Assign)
                             and any(isinstance(t, ast.Name) and t.id == "app"
                                     for t in node.targets)
                             for node in tree.body))
        self.assertIn('Mount("/mcp/" + role.lower()', code)
        self.assertIn('Mount("/", app=legacy_app)', code)
        self.assertIn("guarded.application", code)
        self.assertIn("inner.router.lifespan_context(inner)", code)
        self.assertIn("legacy_app.router.lifespan_context(legacy_app)", code)

    def test_role_binding_and_no_autonomous_send(self):
        code = (ROOT / "mcp_runtime_candidate.py").read_text()
        self.assertIn("create_role_server(role, write_family_letter)", code)
        self.assertNotIn("send_family_letter(", code)
        self.assertNotIn("do_write(", code)

    def test_existing_render_requirements_do_not_install_mcp(self):
        req = (ROOT / "requirements.txt").read_text()
        self.assertNotIn("mcp==", req)
        self.assertIn("mcp==2.3.0", (ROOT / "requirements-mcp-dev.txt").read_text())


if __name__ == "__main__":
    unittest.main()
