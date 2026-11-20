#!/usr/bin/env python3
"""Whole-LYVRA-Ansicht für einen zuvor auf GitHub aufgelösten Commit rendern."""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

from render_ui import ASSETS, apply_checkpoint, render

RUNTIME = "LYVRA_NATIVE_RUNTIME"
POINTER = f"{RUNTIME}/CURRENT_POINTER.json"
MANIFEST = f"{RUNTIME}/REHYDRATION_MANIFEST.json"
FINGERPRINTS = f"{RUNTIME}/continuity/CURRENT_REVISION_FINGERPRINTS.json"
BINDING = "whole_intelligent_ui_20261120"


def git(repo: Path, *args: str) -> bytes:
    return subprocess.run(
        ["git", "-C", str(repo), *args], check=True, capture_output=True
    ).stdout


def current_view(repo: Path, revision: str) -> dict:
    if not re.fullmatch(r"[0-9a-f]{40}", revision):
        raise ValueError("Eine vollständige Git-Commit-ID angeben")
    git(repo, "cat-file", "-e", f"{revision}^{{commit}}")
    pointer = json.loads(git(repo, "show", f"{revision}:{POINTER}"))
    if pointer["repository"]["authority_branch"] != "lyvra" or BINDING not in pointer:
        raise ValueError("Der Commit enthält keine produktive Whole-LYVRA-UI-Bindung")
    if pointer["rehydration"]["manifest"] != MANIFEST:
        raise ValueError("Das Rehydration-Manifest hat einen anderen Pfad")

    manifest = json.loads(git(repo, "show", f"{revision}:{MANIFEST}"))
    registry = json.loads(git(repo, "show", f"{revision}:{FINGERPRINTS}"))
    expected = registry["critical_carriers"]
    if not expected or MANIFEST not in expected:
        raise ValueError("Das Fingerprint-Register enthält keine Manifest-Bindung")
    observed = {}
    for entry in git(repo, "ls-tree", "-r", "-z", revision).split(b"\0"):
        if entry:
            metadata, path = entry.split(b"\t", 1)
            _, kind, sha = metadata.decode("ascii").split()
            if kind == "blob":
                observed[path.decode("utf-8", errors="surrogateescape")] = sha

    differences = sorted(path for path, sha in expected.items() if observed.get(path) != sha)
    status = "PARTIAL" if differences else "VERIFIZIERT"
    basis = f"lyvra · {revision}"
    evidence = f"{len(expected) - len(differences)} von {len(expected)} Blob-Fingerprints stimmen."
    return {
        "title": "Whole LYVRA · Projektansicht",
        "basis": basis,
        "views": [{
            "id": "current",
            "title": "GitHub Current",
            "summary": "Quellenabgleich für den angegebenen Commit.",
            "kind": "cards",
            "source": MANIFEST,
            "status": status,
            "route_terms": ["current", "status", "evidenz", "projekt"],
            "items": [
                {"label": "Whole-Revision", "text": str(registry["whole_revision"])},
                {"label": "Track-Design-Revision", "text": str(registry["track_design_revision"])},
                {"label": "Pflichtbereiche im Manifest", "text": str(len(manifest["required_order"]))},
                {"label": "Fingerprint-Abgleich", "text": evidence},
            ],
        }],
        "gaps": [f"Fingerprint abweichend oder fehlt · {path}" for path in differences],
        "chart": {
            "intent": "compare",
            "rows": f"Übereinstimmend;{len(expected) - len(differences)}\nAbweichend;{len(differences)}",
            "source": f"{FINGERPRINTS} · {revision}",
            "unit": "Dateien",
        },
        "companion": {
            "phase": "Quellenabgleich",
            "status": status,
            "last_evidence": evidence,
            "project_key": "whole-lyvra",
            "source_revision": revision,
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output", type=Path)
    parser.add_argument("--repo", type=Path, default=Path("."))
    parser.add_argument("--revision", required=True)
    parser.add_argument("--checkpoint", type=Path)
    parser.add_argument("--fragment", action="store_true")
    args = parser.parse_args()

    try:
        data = current_view(args.repo, args.revision)
        if args.checkpoint:
            try:
                data = apply_checkpoint(data, json.loads(args.checkpoint.read_text(encoding="utf-8")))
            except (OSError, ValueError) as error:
                print(f"UI-Handoff übersprungen · {error}", file=sys.stderr)

        html = render(data, (ASSETS / "ui-template.html").read_text(encoding="utf-8"))
        if not args.fragment:
            html = (
                '<!doctype html><html lang="de"><meta charset="utf-8">'
                '<meta name="viewport" content="width=device-width, initial-scale=1">'
                '<title>Whole LYVRA</title><body>' + html + '</body></html>'
            )
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(html, encoding="utf-8")
    except subprocess.CalledProcessError as error:
        parser.exit(1, f"LYVRA-Quelle nicht lesbar · {error.stderr.decode(errors='replace').strip()}\n")
    except (KeyError, OSError, ValueError) as error:
        parser.exit(1, f"LYVRA-Ansicht konnte nicht erstellt werden · {error}\n")
    print(args.output.resolve())
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
