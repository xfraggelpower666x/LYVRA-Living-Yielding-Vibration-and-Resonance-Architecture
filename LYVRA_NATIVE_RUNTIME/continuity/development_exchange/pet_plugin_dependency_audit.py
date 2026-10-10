"""LYVRA PET plugin-dependency scope audit; evidence-only, no writes.

Distinguishes current candidate carriers from historical handoff and
superseded backup approval. Never mutates any native pointer or plugin state.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
RECON = "LYVRA_NATIVE_RUNTIME/continuity/development_exchange/LYVRA_PET_PLUGIN_CURRENTNESS_RECONCILIATION_2026-10-10.json"
CURRENT_CARRIERS = (
    ("pet_livecircle", "LYVRA_PET/livecircle/CURRENT_STATE.json", "plugin_surfaces", {"native":"native","alive":"account"}),
    ("pet_app", "LYVRA_PET/app/APP_CURRENT.json", "plugin_surfaces", {"native":"native","alive":"account"}),
    ("pet_plugin_package", "LYVRA_PET/plugin-package/PLUGIN_INTEGRATION_CURRENT.json", None, {"native":"native_plugin","alive":"account_plugin"}),
)
HISTORIC_HANDOFF = "LYVRA_NATIVE_RUNTIME/continuity/LYVRA_PET_AUTO_REPO_HANDOFF_CURRENT.json"
BACKUP_BINDING = "LYVRA_NATIVE_RUNTIME/continuity/approval_requests/LYVRA_RUNTIME_PLUGIN_STATE_BINDING_CURRENT.json"
NATIVE_ID = "plugins_6ab3a345db308191b8ad7ef6311f8a29"
ALIVE_ID = "plugin_06a4fc64dd848191982ca4a6ebdb2619"


def read(root, relative):
    p = root / relative
    if p.is_symlink() or not p.is_file():
        raise ValueError("Missing/symlink dependency carrier")
    raw = p.read_bytes()
    if len(raw) > 180000:
        raise ValueError("Dependency carrier oversized")
    blob = hashlib.sha1(b"blob " + str(len(raw)).encode() + bytes([0]) + raw).hexdigest()
    return json.loads(raw), blob


def inspect(root=ROOT):
    source, source_blob = read(root, RECON)
    if source.get("status") != "VERIFIED_DELTA_REVIEW_NONPROMOTING":
        raise ValueError("Missing valid newer production evidence")
    releases = {r["surface"]:r for r in source["evidence"]["plugins"]}
    if set(releases) != {"native","alive"}:
        raise ValueError("Unknown plugin release surfaces")
    result = []
    for name, relative, nested, keys in CURRENT_CARRIERS:
        data, blob = read(root, relative)
        if name == "pet_livecircle" and data.get("parent_authority") != "WHOLE_LYVRA":
            raise ValueError("PET authority mismatch")
        for surface in ("native","alive"):
            record = data[nested][keys[surface]] if nested else data[keys[surface]]
            actual_id = NATIVE_ID if surface=="native" else ALIVE_ID
            if record.get("plugin_id") != actual_id:
                raise ValueError("Foreign plugin substitution")
            proposed = releases[surface]
            if record.get("version") != proposed["verified_current_version"] or record.get("release_id") != proposed["release_id"]:
                result.append({"carrier":name, "path":relative, "git_blob_before":blob,
                    "plugin_surface":surface, "state":"RECONCILIATION_CANDIDATE",
                    "observed_old_version":record.get("version"),
                    "observed_new_version":proposed["verified_current_version"],
                    "native_decision":"PENDING"})
    handoff, handoff_blob = read(root, HISTORIC_HANDOFF)
    binding, binding_blob = read(root, BACKUP_BINDING)
    if not handoff.get("handoff_id") or not binding.get("runtime_plugin_state_fingerprint"):
        raise ValueError("Historical record provenance missing")
    result.sort(key=lambda v:(v["path"],v["plugin_surface"]))
    return {
      "schema":"LYVRA_PET_PLUGIN_DEPENDENCY_AUDIT_v1",
      "status":"SIX_CURRENT_CANDIDATES_TWO_HISTORICAL_REFERENCES_RETAINED" if len(result)==6 else "DEPENDENCY_REVIEW_REQUIRED",
      "current_candidates":result,
      "historical_nonpromoting":[
        {"path":HISTORIC_HANDOFF,"git_blob":handoff_blob,"action":"PRESERVE_HISTORIC_HANDOFF"},
        {"path":BACKUP_BINDING,"git_blob":binding_blob,"action":"NO_OLD_APPROVAL_REUSE"}],
      "source_blob":source_blob,
      "write_performed":False,"pet_deployment_changed":False,
      "creator_release_changed":False,"whole_current_promoted":False,
    }


if __name__=="__main__":
    print(json.dumps(inspect(),sort_keys=True))
