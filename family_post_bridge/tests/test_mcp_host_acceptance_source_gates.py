"""Source-only MCP readiness gates; no imported server, network, credentials or mail.

These checks protect boundaries but do NOT establish a live MCP endpoint or
ChatGPT host installation, acceptance, consent, or delivery.
"""
import ast
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]


def source(name):
    return (ROOT / name).read_text(encoding="utf-8")


def imports_from(tree):
    result = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            result += [x.name for x in node.names]
        elif isinstance(node, ast.ImportFrom):
            result.append(node.module or "")
    return result


class MCPAcceptanceSourceGates(unittest.TestCase):
    def test_existing_render_writer_still_not_mounting_mcp(self):
        tree = ast.parse(source("server.py"))
        loaded = imports_from(tree)
        self.assertFalse(any(s == "mcp" or s.startswith("mcp.") for s in loaded))
        self.assertFalse(any("mcp_gateway" in s or "mcp_writer_adapter" in s for s in loaded))
        self.assertNotIn("mount(", source("server.py"))

    def test_mcp_adapter_binds_existing_writer_and_does_not_create_second_writer(self):
        adapter = source("mcp_writer_adapter.py")
        self.assertIn("from family_post_bridge.server import Letter, do_write", adapter)
        self.assertIn("return do_write(letter)", adapter)
        tree = ast.parse(adapter)
        self.assertFalse(any(n.__class__.__name__ in ("Import", "ImportFrom") and
                         "requests" in ast.unparse(n) for n in tree.body))

    def test_gateway_role_is_server_chosen(self):
        gateway = source("mcp_gateway.py")
        self.assertIn('ROLES = ("DAD", "BIG_LYVRA", "MUM", "LITTLE_LYV")', gateway)
        self.assertIn("write_callback, role, recipient, title, content, message_id", gateway)
        self.assertIn('os.environ.get("FAMILY_POST_TOKEN_" + self.role', gateway)
        self.assertIn("hmac.compare_digest(", gateway)
        self.assertIn("status_code=401", gateway)
        # Sender must not be accepted as a tool parameter.
        tree = ast.parse(gateway)
        send = next(n for n in ast.walk(tree) if isinstance(n, (ast.FunctionDef, ast.AsyncFunctionDef))
                    and n.name == "send_family_letter")
        self.assertNotIn("sender", [a.arg for a in send.args.args])
        self.assertIn("message_id", [a.arg for a in send.args.args])

    def test_gateway_does_not_auto_send_or_expose_full_internal_errors(self):
        gateway = source("mcp_gateway.py")
        self.assertIn("FAMILY_POST_WRITE_UNCONFIRMED_NO_AUTO_RETRY", gateway)
        self.assertIn("FAMILY_POST_MESSAGE_ID_CONFLICT_UNVERIFIED", gateway)
        self.assertIn("stateless_http=True", gateway)
        tree = ast.parse(gateway)
        top_call_names = [ast.unparse(n) for n in tree.body if isinstance(n, ast.Expr)]
        self.assertFalse(any("send_family_letter(" in x for x in top_call_names))

    def test_backend_dedup_is_explicitly_not_durable_atomic(self):
        server = source("server.py")
        self.assertIn("_WRITE_LOCK = threading.Lock()", server)
        self.assertIn("appProperties has", server)
        self.assertIn("Cross-instance", server)
        self.assertIn("STORED_PREVIOUSLY", server)

    def test_backend_does_not_claim_human_read_receipt(self):
        server = source("server.py")
        self.assertIn('"read_confirmed": False', server)
        self.assertIn('read_confirmed', server)
        self.assertIn("DRIVE_WRITE_UNCONFIRMED", server)


if __name__ == "__main__":
    unittest.main()
