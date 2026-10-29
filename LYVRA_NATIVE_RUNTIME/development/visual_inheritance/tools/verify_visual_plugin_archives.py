#!/usr/bin/env python3
"""Read-only LYVRA Visual R04 plugin archive/identity acceptance.

Usage:
  python verify_visual_plugin_archives.py --native native.tar.gz --alive alive.tar.gz --family family.tar.gz

Produces deterministic JSON on stdout. Does not connect to a host, install
plugins, publish releases or assert that image assets rendered in ChatGPT.
Only local provided byte streams are hashed.
"""
import argparse
import hashlib
import io
import json
import tarfile
from pathlib import PurePosixPath

REQUIRED = {
    "native": {
        "version": "0.1.87",
        "assets": [
            "assets/lyvra-original-visuals/LYVRA_Character_Showcase.jpeg",
            "assets/lyvra-original-visuals/LYVRA_Heart_Logo.jpeg",
            "assets/lyvra-original-visuals/LYVRA_Leitbild_Character_Card.jpeg",
            "assets/lyvra-plugin-logo.png",
        ],
        "skill": "skills/666-visual-interface/SKILL.md",
    },
    "alive": {
        "version": "0.13.83",
        "assets": [
            "assets/lyvra-original-visuals/LYVRA_Character_Showcase.jpeg",
            "assets/lyvra-original-visuals/LYVRA_Heart_Logo.jpeg",
            "assets/lyvra-original-visuals/LYVRA_Leitbild_Character_Card.jpeg",
            "assets/lyvra-alive-logo.png",
        ],
        "skill": "skills/666-visual-interface/SKILL.md",
    },
    "family": {
        "version": "0.9.23",
        "assets": [
            "assets/family-mail-banner-original.jpg",
            "assets/family-mail-chat-logo-512.png",
            "assets/family-mail-plugin-icon-256.png",
            "assets/family-mail-plugin-icon-512.png",
        ],
        "skill": "skills/family-post-cyber-semantic-intelligent-interface/SKILL.md",
    },
}

def scan(archive, target):
    by_path = {}
    with tarfile.open(archive, "r:gz") as tar:
        for member in tar:
            if not member.isfile():
                continue
            path = member.name.removeprefix("./")
            if PurePosixPath(path).is_absolute() or ".." in PurePosixPath(path).parts:
                raise ValueError(f"unsafe path in archive: {path!r}")
            if path in by_path:
                raise ValueError(f"duplicate archive path: {path!r}")
            source = tar.extractfile(member)
            if source is None:
                raise ValueError(f"unreadable member: {path!r}")
            by_path[path] = source.read()

    expected = REQUIRED[target]
    missing = [p for p in expected["assets"] + [expected["skill"], "plugin.json", ".codex-plugin/plugin.json"] if p not in by_path]
    if missing:
        return {"status": "FAIL_MISSING_FILES", "missing": missing, "target": target}
    p = json.loads(by_path["plugin.json"])
    c = json.loads(by_path[".codex-plugin/plugin.json"])
    versions_match = p.get("version") == c.get("version") == expected["version"]
    records = {path: {"bytes": len(by_path[path]), "sha256": hashlib.sha256(by_path[path]).hexdigest()} for path in expected["assets"]}
    logo = p.get("extensions", {}).get("com.openai", {}).get("interface", {}).get("logo")
    icon_expected = "assets/family-mail-plugin-icon-512.png" if target == "family" else ("assets/lyvra-plugin-logo.png" if target == "native" else "assets/lyvra-alive-logo.png")
    logo_binding = logo == "./" + icon_expected
    return {
        "target": target, "status": "PASS_LOCAL_ARCHIVE_INVENTORY" if versions_match and logo_binding else "FAIL_MANIFEST_BINDING",
        "manifest_versions_match": versions_match,
        "manifest_logo_binding_match": logo_binding,
        "archive_sha256": hashlib.sha256(open(archive, "rb").read()).hexdigest(),
        "asset_hashes": records,
        "shared_skill_sha256": hashlib.sha256(by_path[expected["skill"]]).hexdigest(),
    }

def main():
    parser = argparse.ArgumentParser()
    for name in REQUIRED:
        parser.add_argument("--" + name, required=True)
    args = parser.parse_args()
    report = {name: scan(getattr(args, name), name) for name in REQUIRED}
    native_shared = {p: report["native"]["asset_hashes"][p]["sha256"] == report["alive"]["asset_hashes"][p]["sha256"] for p in REQUIRED["native"]["assets"] if p.startswith("assets/lyvra-original-visuals/") and "asset_hashes" in report["native"] and "asset_hashes" in report["alive"]}
    report["cross_plugin_original_lyvra_asset_parity"] = native_shared
    report["native_alive_original_visual_skill_parity"] = report["native"].get("shared_skill_sha256") == report["alive"].get("shared_skill_sha256")
    report["host_render_acceptance"] = "NOT_TESTED_NOT_IMPLIED"
    report["release_publishing"] = "NOT_PERFORMED"
    print(json.dumps(report, indent=2, sort_keys=True))
    if any(x.get("status") != "PASS_LOCAL_ARCHIVE_INVENTORY" for x in [report[name] for name in REQUIRED]) or any(v is False for v in native_shared.values()) or report["native_alive_original_visual_skill_parity"] is False:
        raise SystemExit(1)

if __name__ == "__main__":
    main()
