"""Whole-LYVRA CodeForge: read-only bot DEV -> native technical handoff.

NO adoption, no write, no Discord messages, no native rehydration claim.
Only metadata proven through exact source Git objects may enter review.
"""
from __future__ import annotations

import base64
import hashlib
import json
import os
import re
import urllib.parse
import urllib.request

BOT = "xfraggelpower666x/666LYVRACHARAKTERBOTAI"
BRANCH = "lyvrabot-dev-native-livecircle-20261002"
PATH = "continuity/outbox/BOT_TO_LYVRA_CODEFORGE_TECHNICAL_RETURN_2026-10-10.json"
DEST = "xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture"
SCHEMA = "LYVRA_BOT_TO_NATIVE_TECHNICAL_HANDOFF_v1"
SHA = re.compile(r"^[a-f0-9]{40}$")


def validate_candidate(data, *, head, blob):
    if not isinstance(data, dict) or data.get("schema") != SCHEMA:
        raise ValueError("Unrecognized source schema")
    src = data.get("source")
    dest = data.get("destination")
    if not isinstance(src, dict) or not isinstance(dest, dict):
        raise ValueError("Missing provenance")
    if src.get("repository") != BOT or src.get("branch") != BRANCH:
        raise ValueError("Wrong source authority")
    if dest.get("repository") != DEST or dest.get("branch") != "lyvra":
        raise ValueError("Wrong destination")
    if not SHA.fullmatch(head) or not SHA.fullmatch(blob):
        raise ValueError("Unpinned read")
    if not SHA.fullmatch(str(src.get("head_at_prep", ""))):
        raise ValueError("Bad historical provenance anchor")
    if data.get("privacy_class") != "PUBLIC_TECHNICAL_METADATA_ONLY":
        raise ValueError("Private or unknown class")
    if data.get("user_discord_events_included") is not False:
        raise ValueError("Discord private or user events forbidden")
    if data.get("lyvra_identity_changed") is not False or data.get("native_adoption_requested") is not False:
        raise ValueError("Illegal authority transfer")
    evidence = data.get("evidence")
    if not isinstance(evidence, dict) or evidence.get("type") != "REPOSITORY_AND_CI_METADATA":
        raise ValueError("Missing technical evidence")
    proposal = data.get("proposal")
    if not isinstance(proposal, dict) or not str(proposal.get("native_review_target", "")).startswith("LYVRA CodeForge"):
        raise ValueError("Wrong native review target")
    event = data.get("event_id")
    if not isinstance(event, str) or not re.fullmatch(r"[A-Za-z0-9._:-]{12,140}", event):
        raise ValueError("Invalid event id")
    return {
        "schema": "LYVRA_CODEFORGE_BOT_RETURN_READBACK_v1",
        "status": "TECHNICAL_REVIEW_CANDIDATE_RECEIVED_READ_ONLY",
        "event_id": event,
        "bot_source_head": head,
        "outbox_git_blob": blob,
        "evidence_class": "TECHNICAL_CI_ONLY",
        "proposal_title": str(proposal.get("title", ""))[:160],
        "source_prep_head": src["head_at_prep"],
        "native_adopted": False,
        "native_memory_mutated": False,
        "bot_implementation_approved": False,
        "whole_rehydrated": False,
    }


def _github_get(route, *, token=""):
    if not route.startswith("/repos/" + BOT + "/") or ".." in route:
        raise ValueError("Only bot repository GET permitted")
    req = urllib.request.Request(
        "https://api.github.com" + route,
        headers={
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "LYVRA-CodeForge-ReadOnly-Return",
            **({"Authorization": "Bearer " + token} if token else {}),
        },
        method="GET",
    )
    with urllib.request.urlopen(req, timeout=20) as response:
        return json.load(response)


def read_bot_return(*, token=""):
    root = "/repos/" + BOT
    first = _github_get(root + "/branches/" + BRANCH, token=token)["commit"]["sha"]
    if not SHA.fullmatch(first):
        raise ValueError("Invalid source HEAD")
    entry = _github_get(root + "/contents/" + urllib.parse.quote(PATH, safe="/")
                        + "?ref=" + first, token=token)
    if entry.get("encoding") != "base64":
        raise ValueError("Unexpected encoding")
    raw = base64.b64decode(entry["content"], validate=True)
    if len(raw) > 32000:
        raise ValueError("Oversized payload")
    digest = hashlib.sha1(b"blob " + str(len(raw)).encode() + bytes([0]) + raw).hexdigest()
    if entry.get("sha") != digest:
        raise ValueError("Git blob verification failed")
    data = json.loads(raw.decode("utf-8"))
    second = _github_get(root + "/branches/" + BRANCH, token=token)["commit"]["sha"]
    if first != second:
        raise ValueError("Concurrent source HEAD changed")
    return validate_candidate(data, head=first, blob=digest)


if __name__ == "__main__":
    report = read_bot_return(token=os.environ.get("GH_READ_TOKEN", ""))
    print(json.dumps(report, sort_keys=True))
