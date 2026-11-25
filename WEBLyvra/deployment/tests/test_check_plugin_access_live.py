#!/usr/bin/env python3
"""Offline regression checks for the read-only production smoke checker."""
import contextlib
import importlib.util
import io
import json
from pathlib import Path
import sys
import unittest
from unittest.mock import patch
import urllib.error

TARGET = Path(__file__).resolve().parents[1] / "check_plugin_access_live.py"
spec = importlib.util.spec_from_file_location("weblyvra_live_checker", TARGET)
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)


class FakeResponse:
    status = 200

    def __init__(self, html):
        self.html = html

    def __enter__(self):
        return self

    def __exit__(self, *_):
        return None

    def read(self, *_):
        return self.html.encode("utf-8")

    def geturl(self):
        return "https://example.test/"


class SmokeTest(unittest.TestCase):
    def test_fetch_success_and_sha(self):
        with patch.object(checker.urllib.request, "urlopen", return_value=FakeResponse("<html>hello</html>")):
            result = checker.fetch("https://example.test/", 4)
        self.assertEqual(result["status"], "PASS")
        self.assertEqual(result["http_status"], 200)
        self.assertIn("sha256", result)

    def test_403_is_inconclusive(self):
        err = urllib.error.HTTPError("https://example.test/", 403, "Forbidden", {}, None)
        with patch.object(checker.urllib.request, "urlopen", side_effect=err):
            result = checker.fetch("https://example.test/", 4)
        self.assertEqual(result["status"], "INCONCLUSIVE")

    def test_network_failure_inconclusive(self):
        with patch.object(checker.urllib.request, "urlopen", side_effect=urllib.error.URLError("DNS")):
            result = checker.fetch("https://example.test/", 4)
        self.assertEqual(result["status"], "INCONCLUSIVE")

    def run_main(self, homepage, privacy):
        with patch.object(sys, "argv", ["probe", "--base", "https://example.test/"]), \
             patch.object(checker, "fetch", side_effect=[homepage, privacy]), \
             contextlib.redirect_stdout(io.StringIO()) as output:
            code = checker.main()
        return code, json.loads(output.getvalue())

    def test_present_plugin_and_privacy_pass(self):
        markup = '<html id="lyvra-plugin">plugin-access.css https://chatgpt.com/plugins</html>'
        code, result = self.run_main(
            {"url": "https://example.test/", "status": "PASS", "content": markup, "sha256": "x"},
            {"url": "https://example.test/privacy/", "status": "PASS",
             "content": "<html>Datenschutz</html>"}
        )
        self.assertEqual(code, 0)
        self.assertEqual(result["result"], "PASS")

    def test_missing_plugin_is_definite_failure(self):
        code, result = self.run_main(
            {"url": "https://example.test/", "status": "PASS",
             "content": "<html>Older site</html>", "sha256": "x"},
            {"url": "https://example.test/privacy/", "status": "PASS",
             "content": "<html>Privacy</html>"}
        )
        self.assertEqual(code, 1)
        self.assertEqual(result["home"]["status"], "FAIL")
        self.assertEqual(len(result["home"]["missing_markers"]), 3)

    def test_inconclusive_network_is_not_false_success(self):
        code, result = self.run_main(
            {"url": "https://example.test/", "status": "INCONCLUSIVE", "reason": "timeout"},
            {"url": "https://example.test/privacy/", "status": "PASS",
             "content": "<html>Privacy</html>"}
        )
        self.assertEqual(code, 2)
        self.assertEqual(result["result"], "INCONCLUSIVE")


if __name__ == "__main__":
    unittest.main()
