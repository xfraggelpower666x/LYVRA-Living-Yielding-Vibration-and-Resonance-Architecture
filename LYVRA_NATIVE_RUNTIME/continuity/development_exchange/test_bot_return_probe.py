"""Strict offline tests for the bot -> LYVRA read-only GitHub handoff."""
import base64
import hashlib
import json
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent))
import bot_return_probe as p


def example():
    return {
        "schema": p.SCHEMA,
        "event_id": "BOT-CODEFORGE-RECIPROCAL-TRANSPORT-CI-2026-10-10-001",
        "source": {"repository": p.BOT, "branch": p.BRANCH,
                   "head_at_prep": "a" * 40},
        "destination": {"repository": p.DEST, "branch": "lyvra"},
        "evidence": {"type": "REPOSITORY_AND_CI_METADATA"},
        "proposal": {"title": "Test feedback",
                     "native_review_target": "LYVRA CodeForge development exchange"},
        "privacy_class": "PUBLIC_TECHNICAL_METADATA_ONLY",
        "user_discord_events_included": False,
        "lyvra_identity_changed": False,
        "native_adoption_requested": False,
    }


class BotReturnTests(unittest.TestCase):
    def test_metadata_only_no_adoption(self):
        r = p.validate_candidate(example(), head="b"*40, blob="c"*40)
        self.assertEqual(r["status"], "TECHNICAL_REVIEW_CANDIDATE_RECEIVED_READ_ONLY")
        self.assertFalse(r["native_adopted"])
        self.assertFalse(r["native_memory_mutated"])

    def test_reject_foreign_source(self):
        d = example()
        d["source"]["repository"] = "foreign"
        with self.assertRaises(ValueError):
            p.validate_candidate(d, head="b"*40, blob="c"*40)

    def test_reject_private_discord_event(self):
        d = example()
        d["user_discord_events_included"] = True
        with self.assertRaises(ValueError):
            p.validate_candidate(d, head="b"*40, blob="c"*40)

    def test_reject_identity_adoption(self):
        d = example()
        d["native_adoption_requested"] = True
        with self.assertRaises(ValueError):
            p.validate_candidate(d, head="b"*40, blob="c"*40)

    def test_pinned_github_blob_verified(self):
        raw = json.dumps(example()).encode()
        blob = hashlib.sha1(b"blob " + str(len(raw)).encode() + bytes([0]) + raw).hexdigest()
        fake = iter([
            {"commit": {"sha": "b"*40}},
            {"encoding": "base64", "content": base64.b64encode(raw).decode(), "sha": blob},
            {"commit": {"sha": "b"*40}},
        ])
        with patch.object(p, "_github_get", side_effect=lambda *args, **kw: next(fake)):
            out = p.read_bot_return()
        self.assertEqual(out["outbox_git_blob"], blob)

    def test_github_wrapped_base64(self):
        raw = json.dumps(example()).encode()
        digest = hashlib.sha1(b"blob " + str(len(raw)).encode() + bytes([0]) + raw).hexdigest()
        encoded = base64.b64encode(raw).decode()
        wrapped = "\\n".join(encoded[i:i+60] for i in range(0, len(encoded), 60))
        fake = iter([
            {"commit": {"sha": "b"*40}},
            {"encoding": "base64", "content": wrapped, "sha": digest},
            {"commit": {"sha": "b"*40}},
        ])
        with patch.object(p, "_github_get", side_effect=lambda *args, **kw: next(fake)):
            report = p.read_bot_return()
        self.assertEqual(report["outbox_git_blob"], digest)

    def test_modified_content_rejected(self):
        raw = json.dumps(example()).encode()
        fake = iter([
            {"commit": {"sha": "b"*40}},
            {"encoding": "base64", "content": base64.b64encode(raw).decode(), "sha": "0"*40},
        ])
        with patch.object(p, "_github_get", side_effect=lambda *args, **kw: next(fake)):
            with self.assertRaisesRegex(ValueError, "Git blob"):
                p.read_bot_return()

    def test_head_drift_rejected(self):
        raw = json.dumps(example()).encode()
        blob = hashlib.sha1(b"blob " + str(len(raw)).encode() + bytes([0]) + raw).hexdigest()
        fake = iter([
            {"commit": {"sha": "b"*40}},
            {"encoding": "base64", "content": base64.b64encode(raw).decode(), "sha": blob},
            {"commit": {"sha": "d"*40}},
        ])
        with patch.object(p, "_github_get", side_effect=lambda *args, **kw: next(fake)):
            with self.assertRaisesRegex(ValueError, "changed"):
                p.read_bot_return()


if __name__ == "__main__":
    unittest.main()
