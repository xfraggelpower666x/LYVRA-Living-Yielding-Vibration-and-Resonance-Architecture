#!/usr/bin/env python3
"""Offline tests; no network operations, no host credentials."""
import importlib.util
import io
import json
from pathlib import Path
import unittest
from unittest.mock import patch
import urllib.error

MODULE_PATH = Path(__file__).with_name("worker_evidence_preflight.py")
spec = importlib.util.spec_from_file_location("lyvra_worker_preflight", MODULE_PATH)
preflight = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preflight)


class FakeResponse:
    def __init__(self, payload, status=200):
        self.payload = payload
        self.status = status

    def __enter__(self):
        return self

    def __exit__(self, *args):
        return False

    def read(self, size):
        return self.payload[:size]


class FakeOpener:
    def __init__(self, response):
        self.response = response
        self.requests = []

    def open(self, request, timeout):
        self.requests.append((request, timeout))
        if isinstance(self.response, Exception):
            raise self.response
        return self.response


class WorkerPreflightTests(unittest.TestCase):
    def test_redirect_is_never_followed(self):
        handler = preflight.NoRedirectHandler()
        req = __import__("urllib.request", fromlist=["Request"]).Request(preflight.BASE + "/health")
        self.assertIsNone(handler.redirect_request(
            req, None, 302, "Found", {"Location": "https://untrusted.example/"}, "https://untrusted.example/"))
        opener = preflight.build_opener()
        self.assertTrue(any(isinstance(h, preflight.NoRedirectHandler) for h in opener.handlers))

    def test_json_success_is_not_signed_verification(self):
        fake = FakeOpener(FakeResponse(b'{"status":"ok"}'))
        with patch.object(preflight, "build_opener", return_value=fake):
            result = preflight.classify("/health")
        self.assertEqual(result["state"], "HTTP_200_JSON_OBSERVED")
        self.assertEqual(result["evidence_authentication"], "NOT_TESTED")
        self.assertEqual(fake.requests[0][0].get_method(), "GET")
        self.assertTrue(fake.requests[0][0].full_url.startswith(preflight.BASE))
        self.assertEqual(fake.requests[0][1], preflight.TIMEOUT_SECONDS)

    def test_redirect_http_error_reported_without_followup(self):
        url = preflight.BASE + "/health"
        fake = FakeOpener(urllib.error.HTTPError(url, 302, "Found", {}, None))
        with patch.object(preflight, "build_opener", return_value=fake):
            result = preflight.classify("/health")
        self.assertEqual(result, {"path": "/health", "state": "HTTP_ERROR", "http": 302})
        self.assertEqual(len(fake.requests), 1)

    def test_invalid_and_large_response_are_not_pass(self):
        for payload, state in [
            (b"<html>bad</html>", "INVALID_JSON"),
            (b"42", "INVALID_SCHEMA"),
            (b"{" + b"x" * (preflight.MAX_BYTES + 1), "RESPONSE_TOO_LARGE"),
        ]:
            with self.subTest(state=state):
                with patch.object(preflight, "build_opener", return_value=FakeOpener(FakeResponse(payload))):
                    result = preflight.classify("/v2/systems")
                self.assertEqual(result["state"], state)

    def test_network_failure_is_not_worker_dead(self):
        fake = FakeOpener(urllib.error.URLError("offline"))
        with patch.object(preflight, "build_opener", return_value=fake):
            result = preflight.classify("/health")
        self.assertEqual(result["state"], "WORKER_ENDPOINT_UNAVAILABLE")


if __name__ == "__main__":
    unittest.main()
