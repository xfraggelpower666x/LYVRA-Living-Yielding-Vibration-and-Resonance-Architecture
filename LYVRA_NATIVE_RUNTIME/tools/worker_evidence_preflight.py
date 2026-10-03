#!/usr/bin/env python3
"""Read-only, optional LYVRA evidence Worker reachability preflight.

No automatic invocation, credentials, ticket issuance, writes or authority changes.
Usage: python LYVRA_NATIVE_RUNTIME/tools/worker_evidence_preflight.py
"""
import json
import urllib.error
import urllib.request

BASE = "https://lyvrasystem.666soundsdesign-broadcaster.com"
PATHS = ("/health", "/v2/systems")
TIMEOUT_SECONDS = 5
MAX_BYTES = 65536


def classify(path):
    request = urllib.request.Request(BASE + path, headers={
        "Accept": "application/json",
        "User-Agent": "LYVRA-optional-evidence-preflight/1.0",
    }, method="GET")
    try:
        with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            status = response.status
            raw = response.read(MAX_BYTES + 1)
            if len(raw) > MAX_BYTES:
                return {"path": path, "state": "RESPONSE_TOO_LARGE", "http": status}
            try:
                payload = json.loads(raw.decode("utf-8"))
            except (UnicodeError, ValueError):
                return {"path": path, "state": "INVALID_JSON", "http": status}
            if status != 200:
                return {"path": path, "state": "WORKER_REACHABLE_NO_VALID_EVIDENCE", "http": status}
            if not isinstance(payload, (dict, list)):
                return {"path": path, "state": "INVALID_SCHEMA", "http": status}
            return {"path": path, "state": "HTTP_200_JSON_OBSERVED", "http": status,
                    "evidence_authentication": "NOT_TESTED"}
    except urllib.error.HTTPError as exc:
        return {"path": path, "state": "HTTP_ERROR", "http": exc.code}
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        return {"path": path, "state": "WORKER_ENDPOINT_UNAVAILABLE",
                "error_class": type(exc).__name__}


def main():
    checks = [classify(path) for path in PATHS]
    result = {
        "system": "LYVRA",
        "kind": "OPTIONAL_READ_ONLY_WORKER_EVIDENCE_PREFLIGHT",
        "target": BASE,
        "checks": checks,
        "worker_signed_evidence_verified": False,
        "lyvra_current_authority_changed": False,
        "native_boot_dependency": False,
        "note": "HTTP reachability is not signed authority evidence; unavailability never blocks native GitHub rehydration."
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0  # Diagnostic only; do not gate LYVRA SYSTEMSTART or UPDATE.


if __name__ == "__main__":
    raise SystemExit(main())
