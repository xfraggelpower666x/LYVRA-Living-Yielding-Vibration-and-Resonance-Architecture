#!/usr/bin/env python3
"""Read-only WEBLyvra production smoke check; no deployment or mutation.

Exit 0: required homepage/plugin and privacy checks passed.
Exit 1: a concrete mismatch was observed.
Exit 2: a necessary check could not be completed (network, 403, TLS, etc.).
"""
from __future__ import annotations

import argparse
import hashlib
import json
import pathlib
import ssl
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone
from urllib.parse import urljoin, urlsplit

DEFAULT_BASE = "https://weblyvra.666soundsdesign-broadcaster.com/"
REQUIRED_MARKERS = ('id="lyvra-plugin"', 'plugin-access.css', 'https://chatgpt.com/plugins')


def fetch(url: str, timeout: float) -> dict:
    entry = {"url": url, "status": "INCONCLUSIVE", "http_status": None}
    try:
        req = urllib.request.Request(url, headers={
            "User-Agent": "WEBLyvra-ReadOnly-Deployment-Check/1.0",
            "Accept": "text/html",
        })
        with urllib.request.urlopen(req, timeout=timeout, context=ssl.create_default_context()) as res:
            raw = res.read(2_000_001)
            entry.update(http_status=res.status, final_url=res.geturl())
            if len(raw) > 2_000_000:
                entry.update(status="INCONCLUSIVE", reason="response exceeded 2MB limit")
            elif res.status != 200:
                entry.update(status="FAIL", reason="unexpected HTTP response")
            else:
                entry.update(
                    status="PASS",
                    content=raw.decode("utf-8", errors="replace"),
                    sha256=hashlib.sha256(raw).hexdigest(),
                    byte_length=len(raw),
                )
    except urllib.error.HTTPError as exc:
        entry.update(http_status=exc.code, status="INCONCLUSIVE" if exc.code in (403, 429) else "FAIL",
                     reason=f"HTTP {exc.code}")
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        entry.update(reason=f"{type(exc).__name__}: {exc}")
    return entry


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--base", default=DEFAULT_BASE, help="HTTPS production base URL")
    p.add_argument("--timeout", type=float, default=15.0)
    p.add_argument("--report", help="Optional JSON output path (local report only)")
    p.add_argument("--reference-index", help="Optional local dist/index.html to compare exact SHA-256")
    p.add_argument("--pages-url", help="Optional separate Cloudflare Pages URL to check")
    args = p.parse_args()
    if args.timeout <= 0 or not args.base.startswith("https://"):
        p.error("Positive timeout and HTTPS base required")
    base = args.base.rstrip("/") + "/"
    hostname = urlsplit(base).hostname
    if not hostname:
        p.error("Valid host required")
    home = fetch(base, args.timeout)
    privacy = fetch(urljoin(base, "privacy/"), args.timeout)
    if home["status"] == "PASS":
        delivered_html = home.pop("content")
        missing = [m for m in REQUIRED_MARKERS if m not in delivered_html]
        if missing:
            home.update(status="FAIL", reason="plugin access marker(s) absent in served HTML", missing_markers=missing)
        elif args.reference_index:
            try:
                expected = hashlib.sha256(pathlib.Path(args.reference_index).read_bytes()).hexdigest()
                home["expected_reference_sha256"] = expected
                home["exact_reference_hash_matches"] = expected == home["sha256"]
                # Cloudflare may rewrite delivery bytes: report difference but do not
                # treat it as proof of stale source without a build provenance check.
            except OSError as exc:
                home["reference_check"] = f"INCONCLUSIVE: {exc}"
    if privacy["status"] == "PASS":
        body = privacy.pop("content")
        if "<html" not in body.lower() or not any(x in body.lower() for x in ("datenschutz", "privacy")):
            privacy.update(status="FAIL", reason="privacy document markers missing")
    result = {
        "check": "WEBLYVRA_PLUGIN_ACCESS_001_LIVE",
        "checked_utc": datetime.now(timezone.utc).isoformat(),
        "no_write_actions": True,
        "home": home,
        "privacy": privacy,
    }
    if args.pages_url:
        if not args.pages_url.startswith("https://"):
            p.error("--pages-url must be HTTPS")
        pages = fetch(args.pages_url, args.timeout)
        pages.pop("content", None)
        result["pages_optional"] = pages
    statuses = (home["status"], privacy["status"])
    result["result"] = "FAIL" if "FAIL" in statuses else (
        "PASS" if statuses == ("PASS", "PASS") else "INCONCLUSIVE"
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    if args.report:
        pathlib.Path(args.report).write_text(
            json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    return {"PASS": 0, "FAIL": 1, "INCONCLUSIVE": 2}[result["result"]]


if __name__ == "__main__":
    sys.exit(main())
