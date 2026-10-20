"""Read-only adapter for genuine GitHub evidence snapshots. No network, writes or restoration.
Accepts raw GitHub API payloads captured by a separate read-only caller.
"""
from dataclasses import dataclass
import re
SHA = re.compile(r"^[0-9a-f]{40}$")

@dataclass(frozen=True)
class GitEvidence:
    production_sha: str
    candidate_sha: str
    candidate_parents: tuple[str, ...]
    changed_paths: tuple[str, ...]
    recovery_refs: tuple[tuple[str, str], ...]
    observations: tuple[str, ...]
    status: str

def parse(branch_prod, branch_dev, dev_commit, recovery_entries):
    """Do not infer ancestry, supersession, or recovery viability without proofs."""
    prod = branch_prod.get("commit", {}).get("sha")
    dev = branch_dev.get("commit", {}).get("sha")
    commit_sha = dev_commit.get("sha")
    parents = tuple(p.get("sha", "") for p in dev_commit.get("parents", ()))
    if not all(isinstance(x, str) and SHA.fullmatch(x) for x in (prod, dev, commit_sha)):
        return {"status":"INVALID_SHA_OR_MISSING", "evidence":None}
    if commit_sha != dev:
        return {"status":"UNMATCHED_COMMIT_READ", "evidence":None}
    if not all(SHA.fullmatch(p) for p in parents):
        return {"status":"INVALID_PARENT", "evidence":None}
    paths = tuple(sorted({f.get("filename", "") for f in dev_commit.get("files", ()) if f.get("filename")}))
    refs = tuple(sorted((x["path"], x["sha"]) for x in recovery_entries
                        if x.get("type") == "file" and x.get("path") and SHA.fullmatch(x.get("sha", ""))))
    observations = (
        "Commit and parent SHA metadata observed; parent is not complete ancestry proof",
        "Changed paths identify diff scope, not semantic impact",
        "Recovery listing contains file blobs, not restore-ready commit anchors",
        "Supersession requires explicit causal/deployment evidence; no inference from date/order",
        "Source independence, owner rights and snapshot compatibility not established by these metadata",
    )
    result = GitEvidence(prod,dev,parents,paths,refs,observations,"READ_ONLY_EVIDENCE")
    return {"status":"READ_ONLY_EVIDENCE", "evidence":result,
            "provenance":{"commit_url":dev_commit.get("html_url"),"branch":"lyvra-scri-candidate-20261020"},
            "recovery_ready":False, "supersession_verified":False,
            "automatic_repair":False, "runtime_verified":False}

def compatible_with_scri(evidence_result, chain_result):
    if evidence_result["status"] != "READ_ONLY_EVIDENCE":
        return {"status":"SOURCE_UNVERIFIED", "action":"NONE"}
    if chain_result.get("identity_authority") != "WHOLE_LYVRA" or chain_result.get("automatic_repair") is not False:
        return {"status":"AUTHORITY_BOUNDARY_FAILURE", "action":"NONE"}
    return {"status":"CANDIDATE_FOR_CAUSAL_REVIEW",
            "action":"NONE", "recovery_ready":False,
            "prod_sha":evidence_result["evidence"].production_sha,
            "dev_sha":evidence_result["evidence"].candidate_sha,
            "trace":chain_result.get("status"),
            "limitations":evidence_result["evidence"].observations}
