"""CodeForge read-only repository evidence audit across plugins and PET.

GitHub-only. Does NOT authenticate against private Creator plugin releases,
invoke PET worker, write native authority or publish plugin/Discord changes.
"""
from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
CARRIERS = {
    "native_plugin_release_binding": "LYVRA_NATIVE_RUNTIME/continuity/approval_requests/LYVRA_RUNTIME_PLUGIN_STATE_BINDING_CURRENT.json",
    "pet_livecircle": "LYVRA_PET/livecircle/CURRENT_STATE.json",
    "pet_rehydration": "LYVRA_PET/rehydration/REHYDRATION_MANIFEST.json",
    "pet_repo_handoff": "LYVRA_NATIVE_RUNTIME/continuity/LYVRA_PET_AUTO_REPO_HANDOFF_CURRENT.json",
    "plugin_bilateral_governance": "LYVRA_NATIVE_RUNTIME/development/BIDIRECTIONAL_PLUGIN_NATIVE_EVOLUTION_LIFECIRCLE.md",
    "unified_codeforge_exchange": "LYVRA_NATIVE_RUNTIME/development/CODEFORGE_UNIFIED_PLUGIN_PET_RECIPROCAL_EXCHANGE_2026-10-10.md",
}

NATIVE_ID = "plugins_6ab3a345db308191b8ad7ef6311f8a29"
ALIVE_ID = "plugin_06a4fc64dd848191982ca4a6ebdb2619"


def git_blob(raw: bytes) -> str:
    return hashlib.sha1(b"blob " + str(len(raw)).encode() + bytes([0]) + raw).hexdigest()


def audit(root: Path = ROOT) -> dict:
    carriers = {}
    parsed = {}
    for key, relpath in CARRIERS.items():
        path = root / relpath
        if not path.is_file() or path.is_symlink():
            raise ValueError(f"Missing/symlink carrier: {key}")
        raw = path.read_bytes()
        if len(raw) > 400_000:
            raise ValueError(f"Unexpected oversized carrier: {key}")
        carriers[key] = {"path": relpath, "git_blob_sha1": git_blob(raw),
                         "bytes": len(raw), "status": "REPO_BYTES_VERIFIED"}
        if relpath.endswith(".json"):
            parsed[key] = json.loads(raw)
    binding = parsed["native_plugin_release_binding"]["bound_state"]
    pet = parsed["pet_livecircle"]
    named = {"native": binding["native_plugin"], "alive": binding["account_plugin"]}
    for key, plugin_id in [("native", NATIVE_ID), ("alive", ALIVE_ID)]:
        if named[key]["plugin_id"] != plugin_id or not named[key].get("release_id"):
            raise ValueError(f"Missing plugin identity/release provenance: {key}")
    if pet.get("parent_authority") != "WHOLE_LYVRA" or pet.get("pet_id") is None:
        raise ValueError("PET no longer bound to one Whole LYVRA")
    if parsed["pet_rehydration"].get("whole_lyvra_rehydration_precedes_pet_rehydration") is not True:
        raise ValueError("PET precedence violated")

    return {
        "schema": "LYVRA_CODEFORGE_PLUGIN_PET_REPO_AUDIT_v1",
        "status": "REPOSITORY_CARRIERS_VERIFIED_LIVE_READBACK_PENDING",
        "carriers": carriers,
        "surfaces": {
            key: {"plugin_id": val["plugin_id"], "repo_binding_version": val["version"],
                  "repo_binding_release_id": val["release_id"],
                  "creator_live_release_readback": "PENDING"}
            for key, val in named.items()
        },
        "pet": {"pet_id": pet["pet_id"],
                "worker_version_in_repo": pet.get("worker_version"),
                "worker_live_deployment_readback": "PENDING",
                "host_visual_readback": "PENDING"},
        "one_whole_lyvra": True,
        "new_plugin_releases_created": False,
        "native_authority_changed": False,
        "pet_runtime_deployed": False,
        "native_learning_adopted": False,
    }


if __name__ == "__main__":
    data = audit()
    print(json.dumps(data, sort_keys=True))
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as out:
            out.write("## CodeForge · LYVRA Plugins + PET (read-only)\n")
            out.write(f'- Repository carriers verified: {len(data["carriers"])}\n')
            out.write("- Native/ALIVE Creator releases: **live readback pending**\n")
            out.write("- PET worker/host: **live readback pending**\n")
            out.write("- No writes, learning adoption, logo or plugin release changes\n")
