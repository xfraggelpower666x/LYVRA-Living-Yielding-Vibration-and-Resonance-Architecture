"""Bounded, read-only PET plugin-reference correction preflight.

Produces precise candidate changes and source Git-blob recovery anchors.
Does not change files, create approvals, rehydrate Whole LYVRA or deploy PET.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
PET = "LYVRA_PET/livecircle/CURRENT_STATE.json"
APP = "LYVRA_PET/app/APP_CURRENT.json"
RECON = "LYVRA_NATIVE_RUNTIME/continuity/development_exchange/LYVRA_PET_PLUGIN_CURRENTNESS_RECONCILIATION_2026-10-10.json"
BACKUP = "LYVRA_NATIVE_RUNTIME/continuity/plugin_backup_circle/COUPLED_PLUGIN_BACKUP_CIRCLE_CURRENT.json"
PLAN = "LYVRA_NATIVE_RUNTIME/continuity/development_exchange/PET_PLUGIN_CURRENT_RECONCILIATION_PLAN_2026-10-10.json"


def read(root, rel):
    file = root / rel
    if file.is_symlink() or not file.is_file():
        raise ValueError("Missing or redirected evidence carrier")
    raw = file.read_bytes()
    blob = hashlib.sha1(b"blob " + str(len(raw)).encode() + bytes([0]) + raw).hexdigest()
    return json.loads(raw), blob


def preflight(root=ROOT):
    pet, pet_blob = read(root, PET)
    app, app_blob = read(root, APP)
    recon, recon_blob = read(root, RECON)
    backup, backup_blob = read(root, BACKUP)
    plan, plan_blob = read(root, PLAN)
    if pet.get("parent_authority") != "WHOLE_LYVRA":
        raise ValueError("A second PET identity is forbidden")
    if pet.get("pet_id") != app.get("pet_id"):
        raise ValueError("PET identity drift")
    if plan.get("status") != "SOURCE_VERIFIED_PRECHANGE_PLAN_NO_CURRENT_PROMOTION":
        raise ValueError("Preflight plan changed")
    if recon.get("status") != "VERIFIED_DELTA_REVIEW_NONPROMOTING":
        raise ValueError("Reconciliation not verified")
    if backup.get("lyvra_leg", {}).get("approval_status") != "HISTORICAL_SUPERSEDED_NEW_APPROVAL_NOT_GRANTED":
        raise ValueError("Stale backup approval changed; quarantine")
    if backup.get("stable_set", {}).get("converged") is not False:
        raise ValueError("Coupled stable-set not safe")
    current = {r["surface"]: r for r in recon["evidence"]["plugins"]}
    actions = []
    for surface, ref in (("native", "native"), ("alive", "account")):
        proof = current.get(surface)
        if not proof or not all(proof.get(k) for k in ("verified_current_version", "release_id")):
            raise ValueError("Missing source release evidence")
        for target, source, blob in ((PET, pet, pet_blob), (APP, app, app_blob)):
            old = source.get("plugin_surfaces", {}).get(ref)
            if not isinstance(old, dict) or old.get("plugin_id") != (
                "plugins_6ab3a345db308191b8ad7ef6311f8a29" if surface=="native"
                else "plugin_06a4fc64dd848191982ca4a6ebdb2619"
            ):
                raise ValueError("Plugin identity mismatch")
            proposed = {"version": proof["verified_current_version"],
                        "release_id": proof["release_id"]}
            if any(old.get(k) != v for k,v in proposed.items()):
                actions.append({"target": target, "source_blob": blob,
                                "json_pointer": "/plugin_surfaces/" + ref,
                                "expected_old_version": old["version"],
                                "expected_old_release_id": old["release_id"],
                                "proposed_version": proposed["version"],
                                "proposed_release_id": proposed["release_id"],
                                "status": "CANDIDATE_NOT_APPLIED"})
    actions.sort(key=lambda a: (a["target"], a["json_pointer"]))
    return {
        "schema": "LYVRA_PET_PLUGIN_GOVERNED_CORRECTION_PREFLIGHT_v1",
        "status": "CANDIDATES_ONLY_NO_CURRENT_WRITE",
        "actions": actions,
        "recovery_blobs": {"pet":pet_blob,"app":app_blob,
                           "reconciliation":recon_blob,"backup":backup_blob,"plan":plan_blob},
        "requires": ["FULL_WHOLE_REHYDRATION", "PET_SUB_REHYDRATION",
                     "NEW_PLUGIN_IMPACT_AND_DEPENDENCY_CHECKS",
                     "PLUGIN_CREATOR_RELEASE_REVALIDATION",
                     "NEW_BACKUP_APPROVAL_IF_BACKUP_EXECUTION_REQUESTED",
                     "READBACK_AND_POINTER_LAST_IF_PROMOTING"],
        "pet_assets_changed": False, "worker_deployed": False,
        "native_pointer_changed": False, "stale_approval_reused": False,
    }


if __name__ == "__main__":
    print(json.dumps(preflight(), sort_keys=True))
