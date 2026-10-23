"""Source-only compatibility guard against the unchanged Render writer.

No network, imports of server, OAuth, Google Drive or sending side effects.
Tests actual source signatures and canonical stored-body structure.
This is NOT host invocation proof or full live contract acceptance.
"""
import ast
from pathlib import Path
import unittest

SERVER = Path(__file__).resolve().parents[1] / "server.py"


class ExistingWriterContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = SERVER.read_text(encoding="utf-8")
        cls.tree = ast.parse(cls.source)

    def test_actual_response_contract_matches_monitor(self):
        literal_values = {n.value for n in ast.walk(self.tree)
                          if isinstance(n, ast.Constant) and isinstance(n.value, str)}
        for required in ("STORED_DRIVE_CONFIRMED", "STORED_PREVIOUSLY",
                         "state", "file_id", "message_id", "read_confirmed"):
            with self.subTest(required=required):
                self.assertIn(required, literal_values)

    def test_canonical_body_includes_sender_recipient_message_id(self):
        src = self.source
        self.assertIn("Sender: {letter.sender}", src)
        self.assertIn("Recipient: {letter.recipient}", src)
        self.assertIn("Message-ID: {letter.message_id}", src)
        self.assertIn("{letter.content}", src)

    def test_writer_remains_separate_from_source_only_modules(self):
        src = self.source
        self.assertNotIn("from family_post_bridge.post_write_monitor import", src)
        self.assertNotIn("from family_post_bridge.intelligent_review import", src)
        self.assertNotIn("from family_post_bridge.fallback_decision import", src)


if __name__ == "__main__":
    unittest.main()
