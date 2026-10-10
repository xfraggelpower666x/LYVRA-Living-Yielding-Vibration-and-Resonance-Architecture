"""Dry-run only: prepare fully bounded PET plugin reference patches in memory."""
import copy
import hashlib
import json
from pet_plugin_dependency_audit import ROOT, CURRENT_CARRIERS, RECON, inspect, read

IDS = {"native": "plugins_6ab3a345db308191b8ad7ef6311f8a29",
       "alive": "plugin_06a4fc64dd848191982ca4a6ebdb2619"}


def preview(root=ROOT):
    scan = inspect(root)
    if len(scan["current_candidates"]) != 6:
        raise ValueError("Expected exactly 6 candidates; quarantine")
    recon, _ = read(root, RECON)
    current = {r["surface"]: r for r in recon["evidence"]["plugins"]}
    output = []
    for name, path, nested, keys in CURRENT_CARRIERS:
        old, blob = read(root, path)
        new = copy.deepcopy(old)
        for surface in ("native", "alive"):
            original = old[nested][keys[surface]] if nested else old[keys[surface]]
            edited = new[nested][keys[surface]] if nested else new[keys[surface]]
            if original["plugin_id"] != IDS[surface]:
                raise ValueError("Surface identity changed")
            edited["version"] = current[surface]["verified_current_version"]
            edited["release_id"] = current[surface]["release_id"]
        restored = copy.deepcopy(new)
        for surface in ("native", "alive"):
            src = old[nested][keys[surface]] if nested else old[keys[surface]]
            dst = restored[nested][keys[surface]] if nested else restored[keys[surface]]
            dst["version"] = src["version"]
            dst["release_id"] = src["release_id"]
        if restored != old:
            raise ValueError("Non-plugin changes forbidden")
        digest = lambda obj: hashlib.sha256(json.dumps(obj, sort_keys=True).encode()).hexdigest()
        output.append({"path": path, "old_git_blob": blob,
                       "old_semantic_sha256": digest(old),
                       "candidate_semantic_sha256": digest(new),
                       "candidate": new})
    return {"status": "THREE_FILES_STAGED_MEMORY_ONLY", "files": output,
            "written": False, "pointer_changed": False, "backup_approval": False}


if __name__ == "__main__":
    result = preview()
    print(json.dumps({"status": result["status"], "files": [
        {k:v for k,v in item.items() if k != "candidate"} for item in result["files"]
    ], "written": False, "pointer_changed": False}, sort_keys=True))
