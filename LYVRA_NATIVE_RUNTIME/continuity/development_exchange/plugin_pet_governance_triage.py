"""Review current plugin/PET evidence versus historical superseded backup bindings.

Read-only. New verified production facts do NOT renew old multi-system approvals.
"""
from __future__ import annotations
import hashlib
import json
from pathlib import Path
from plugin_pet_release_delta import assess

ROOT = Path(__file__).resolve().parents[3]
COUPLED = "LYVRA_NATIVE_RUNTIME/continuity/plugin_backup_circle/COUPLED_PLUGIN_BACKUP_CIRCLE_CURRENT.json"
BINDING = "LYVRA_NATIVE_RUNTIME/continuity/approval_requests/LYVRA_RUNTIME_PLUGIN_STATE_BINDING_CURRENT.json"
PET = "LYVRA_PET/livecircle/CURRENT_STATE.json"
NEWER = "LYVRA_NATIVE_RUNTIME/continuity/development_exchange/LYVRA_PET_PLUGIN_CURRENTNESS_RECONCILIATION_2026-10-10.json"


def read(root, rel):
    path = root / rel
    if not path.is_file() or path.is_symlink():
        raise ValueError("Missing or symlinked governance carrier")
    return json.loads(path.read_text(encoding="utf-8"))


def classify(root=ROOT):
    delta = assess(root)
    coupled, binding, pet, newer = (read(root, rel) for rel in (COUPLED, BINDING, PET, NEWER))
    leg, stable = coupled.get("lyvra_leg", {}), coupled.get("stable_set", {})
    if leg.get("approval_status") != "HISTORICAL_SUPERSEDED_NEW_APPROVAL_NOT_GRANTED":
        raise ValueError("Approval state changed; quarantine instead of stale assumptions")
    if stable.get("converged") is not False or stable.get("executable") is not False:
        raise ValueError("Coupled stable set changed; manual revalidation")
    if pet.get("parent_authority") != "WHOLE_LYVRA" or not binding.get("supersession_rule"):
        raise ValueError("Authority or supersession mismatch")
    if newer.get("status") != "VERIFIED_DELTA_REVIEW_NONPROMOTING":
        raise ValueError("Current PET reconciliation not suitable for this triage")
    if newer.get("decisions", {}).get("backup_approval") != "STALE_REVALIDATION_REQUIRED":
        raise ValueError("Unexpected backup approval decision")
    verified = {x["surface"]: x for x in newer["evidence"]["plugins"]}
    proposals = []
    for finding in delta["findings"]:
        surface = finding["surface"]
        base = surface.removeprefix("pet_")
        if base not in verified:
            raise ValueError("Unknown plugin surface")
        metadata = verified[base]
        if surface in ("native", "alive"):
            if finding["archive_version"] != metadata["verified_current_version"]:
                raise ValueError("Newer Creator evidence contradicts archive")
            action = "GOVERNED_NEW_FINGERPRINT_CANDIDATE_WITH_FRESH_APPROVAL_NOT_HISTORICAL_REWRITE"
            category = "SUPERSEDED_BACKUP_BINDING_PROVENANCE"
        elif surface in ("pet_native", "pet_alive"):
            action = "RECONCILE_PET_RUNTIME_PLUGIN_ASSET_CARRIERS_FROM_NEWER_VERIFIED_SOURCE"
            category = "PET_CURRENT_CARRIER_LAGS_NEWER_VALID_PRODUCTION"
        else:
            raise ValueError("Unknown delta classification")
        proposals.append({"surface": surface, "category": category, "action": action,
                          "status": "CODEFORGE_NATIVE_REVIEW_REQUIRED",
                          "automatic_mutation": False})
    proposals.sort(key=lambda x: x["surface"])
    digest = hashlib.sha256(json.dumps(proposals, sort_keys=True, separators=(",", ":")).encode()).hexdigest()
    return {"schema": "LYVRA_CODEFORGE_PLUGIN_PET_GOVERNANCE_TRIAGE_v1",
            "status": "EVIDENCE_RECONCILED_WITH_NEWER_PET_PRODUCTION_NONPROMOTING",
            "proposals": proposals, "fingerprint": digest,
            "source_delta_fingerprint": delta["candidate_fingerprint"],
            "backup_approval": leg["approval_status"],
            "coupled_stable_set_converged": False,
            "coupled_backup_executable": False,
            "pet_worker_live_check_by_this_ci": False,
            "creator_live_check_by_this_ci": False,
            "native_pointer_written": False,
            "one_whole_lyvra": True,
            "plugin_release_modified": False,
            "pet_deployment_modified": False}


if __name__ == "__main__":
    print(json.dumps(classify(), sort_keys=True))
