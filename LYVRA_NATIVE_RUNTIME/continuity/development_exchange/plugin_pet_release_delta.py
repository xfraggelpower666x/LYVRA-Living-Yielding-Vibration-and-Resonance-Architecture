"""Read-only causal review candidates from historic repo bindings and immutable Creator provenance.
No private Creator API, PET host invocation, native promotion or repository write.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
BINDING = "LYVRA_NATIVE_RUNTIME/continuity/approval_requests/LYVRA_RUNTIME_PLUGIN_STATE_BINDING_CURRENT.json"
ARCHIVES = "LYVRA_NATIVE_RUNTIME/plugin-backups/creator-releases/CREATOR_ORIGINALBYTE_READBACK_2026-10-09.json"
PET = "LYVRA_PET/livecircle/CURRENT_STATE.json"
PLUGIN_IDS = {"native": "plugins_6ab3a345db308191b8ad7ef6311f8a29",
              "alive": "plugin_06a4fc64dd848191982ca4a6ebdb2619"}


def _read(root, path):
    file = root / path
    if not file.is_file() or file.is_symlink():
        raise ValueError("Missing or symlinked evidence file")
    return json.loads(file.read_text(encoding="utf-8"))


def assess(root=ROOT):
    bound = _read(root, BINDING)["bound_state"]
    archive = _read(root, ARCHIVES)
    pet = _read(root, PET)
    if pet.get("parent_authority") != "WHOLE_LYVRA":
        raise ValueError("Cannot introduce a second LYVRA authority")
    releases = {r["plugin_id"]: r for r in archive.get("releases", [])}
    if len(releases) != 2:
        raise ValueError("Expected two exact Creator original archive records")
    issues = []
    for name, plugin_id in PLUGIN_IDS.items():
        old = bound[{"native":"native_plugin","alive":"account_plugin"}[name]]
        newer = releases[plugin_id]
        if old["plugin_id"] != plugin_id or newer["plugin_id"] != plugin_id:
            raise ValueError("Plugin ID binding mismatch")
        if old["version"] != newer["version"] or old["release_id"] != newer["release_id"]:
            issues.append({"surface": name, "status": "HISTORICAL_BINDING_STALE",
                           "historical_version": old["version"], "archive_version": newer["version"],
                           "proposal": "CodeForge inspect live Creator release and update governed binding if warranted",
                           "source_class": "REPO_ARCHIVE_PROVENANCE_NOT_LIVE_METADATA"})
        pet_entry = pet.get("plugin_surfaces", {}).get("native" if name=="native" else "account", {})
        if pet_entry.get("plugin_id") != plugin_id:
            raise ValueError("PET plugin binding identity mismatch")
        if pet_entry.get("release_id") != newer["release_id"]:
            issues.append({"surface": "pet_" + name, "status": "PET_HISTORICAL_RELEASE_REFERENCE",
                           "proposal": "Review PET LiveCircle version metadata against verified releases",
                           "source_class": "REPO_ARCHIVE_PROVENANCE_NOT_LIVE_METADATA"})
    issues.sort(key=lambda x: x["surface"])
    serialized = json.dumps(issues, sort_keys=True, separators=(",", ":")).encode()
    return {"schema":"LYVRA_CODEFORGE_RELEASE_DELTA_REVIEW_v1",
            "findings":issues, "candidate_fingerprint":hashlib.sha256(serialized).hexdigest(),
            "state":"REVIEW_ONLY_NO_ADOPTION",
            "live_creator_release_checked":False,"pet_host_checked":False,
            "native_mutated":False,"one_whole_lyvra":True}


if __name__ == "__main__":
    result=assess()
    print(json.dumps(result,sort_keys=True))
