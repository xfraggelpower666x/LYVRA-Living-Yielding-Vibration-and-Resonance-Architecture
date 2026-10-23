"""Guard existing Render writer from accidental monitor boot/writes.

Uses Python AST only. No secrets, external clients, imports of server or HTTP.
The intended integration is adding dormant pure helpers, not a running agent.
"""
import ast
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
MONITORS = ("fallback_decision.py", "post_write_monitor.py", "intelligent_review.py")


class BackendSourceIsolationTests(unittest.TestCase):
    def test_existing_server_does_not_import_monitor_modules(self):
        tree = ast.parse((ROOT / "server.py").read_text(encoding="utf-8"))
        imports = []
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                imports.extend(alias.name for alias in node.names)
            if isinstance(node, ast.ImportFrom):
                imports.append(node.module or "")
        for name in ("fallback_decision", "post_write_monitor", "intelligent_review"):
            self.assertFalse(any(x == name or x.endswith("." + name) for x in imports), name)

    def test_pure_helpers_do_not_import_network_or_sender_apis(self):
        forbidden_roots = {"requests", "httpx", "fastapi", "google", "googleapiclient",
                           "urllib", "socket", "subprocess", "mcp"}
        for filename in MONITORS:
            with self.subTest(file=filename):
                tree = ast.parse((ROOT / filename).read_text(encoding="utf-8"))
                imported = set()
                for node in ast.walk(tree):
                    if isinstance(node, ast.Import):
                        imported.update(a.name.split(".")[0] for a in node.names)
                    elif isinstance(node, ast.ImportFrom) and node.module:
                        imported.add(node.module.split(".")[0])
                self.assertFalse(forbidden_roots & imported, forbidden_roots & imported)

    def test_no_pure_helper_runs_main_or_background_entrypoint(self):
        for filename in MONITORS:
            with self.subTest(file=filename):
                tree = ast.parse((ROOT / filename).read_text(encoding="utf-8"))
                for node in tree.body:
                    self.assertFalse(isinstance(node, ast.If), "no top-level if runner")
                    self.assertFalse(isinstance(node, ast.Expr) and
                                     isinstance(node.value, ast.Call), "no top-level call")


if __name__ == "__main__":
    unittest.main()
