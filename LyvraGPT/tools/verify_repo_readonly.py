#!/usr/bin/env python3
"""LYVRA Read-only repository preflight. No auth, no Git writes. Python 3.10+."""
import argparse, base64, hashlib, json, sys, urllib.request, urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOCK = json.loads((ROOT / "freeze" / "FREEZE_LOCK.json").read_text(encoding="utf-8"))
REPO = LOCK["target_repository"]
HEAD_EXPECTED = LOCK["verified_source_commit"]
API = f"https://api.github.com/repos/{REPO}"
RAW = f"https://raw.githubusercontent.com/{REPO}"
UA = {"User-Agent":"LYVRA-GPT-readonly-audit-004", "Accept":"application/vnd.github+json"}

def fetch(url):
    req = urllib.request.Request(url, headers=UA, method="GET")
    with urllib.request.urlopen(req, timeout=20) as r:
        data = r.read(4_000_001)
    if len(data) > 4_000_000:
        raise ValueError("source exceeds 4 MB safe size")
    return data

def json_remote(url):
    return json.loads(fetch(url).decode("utf-8"))

def blob_sha(content):
    header = f"blob {len(content)}\0".encode("ascii")
    return hashlib.sha1(header + content).hexdigest()

def main():
    p = argparse.ArgumentParser(description="Public GitHub read-only audit; intentionally does not touch private vault.")
    p.add_argument("--online", action="store_true", help="Allow GET requests to GitHub public API/raw files.")
    args = p.parse_args()
    if not args.online:
        print("STOP: offline by default; specify --online for GET-only preflight.")
        return 2
    result = {"baseline_commit":HEAD_EXPECTED,"errors":[],"warnings":[],
              "read_files":0,"sha_verified":0,"json_parsed":0,"private_recovery":"NOT_ATTEMPTED"}
    try:
        branch = json_remote(f"{API}/branches/{urllib.parse.quote(LOCK['target_branch'])}")
        head = branch["commit"]["sha"]
        result["live_head"] = head
        result["branch_protected"] = branch.get("protected")
        if head != HEAD_EXPECTED:
            result["errors"].append("HEAD_CHANGED_STOP: freeze must be re-audited; no mixing commits")
            print(json.dumps(result, ensure_ascii=False,indent=2)); return 1
        tree_sha = branch["commit"]["commit"]["tree"]["sha"]
        if tree_sha != LOCK["verified_source_tree"]:
            result["errors"].append("TREE_CHANGED_STOP")
            print(json.dumps(result,ensure_ascii=False,indent=2)); return 1
        tree = json_remote(f"{API}/git/trees/{tree_sha}?recursive=1")
        if tree.get("truncated"):
            result["errors"].append("TRUNCATED_TREE")
        paths = {f["path"]:f["sha"] for f in tree["tree"] if f["type"] == "blob"}
        cache = {}
        def source(path):
            if not isinstance(path,str) or not path.startswith("LYVRA_NATIVE_RUNTIME/") or ".." in path.split("/"):
                raise ValueError("outside allowed public LYVRA native scope")
            if path not in paths:
                raise FileNotFoundError(path)
            if path not in cache:
                url = f"{RAW}/{HEAD_EXPECTED}/" + urllib.parse.quote(path,safe="/")
                contents = fetch(url)
                result["read_files"] += 1
                actual = blob_sha(contents)
                if actual != paths[path]:
                    result["errors"].append(f"BLOB_SHA_MISMATCH: {path}")
                else:
                    result["sha_verified"] += 1
                cache[path] = contents
            return cache[path]
        def parsed(path):
            data = source(path)
            try:
                obj = json.loads(data.decode("utf-8-sig"))
                result["json_parsed"] += 1
                return obj
            except (ValueError,UnicodeDecodeError) as exc:
                result["errors"].append(f"INVALID_JSON {path}: {exc}")
                raise
        pointer = parsed("LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json")
        manifest = parsed("LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json")
        registry = parsed("LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json")
        source("LYVRA_NATIVE_RUNTIME/AUTHORITY_CONTRACT.md")
        source("LYVRA_NATIVE_RUNTIME/continuity/VERSION_FRESHNESS_GUARD.md")
        names = manifest.get("required_order",[])
        mapping = manifest.get("domain_path_map",{})
        unmapped = [name for name in names if name not in mapping]
        result["unmapped_required_domains"] = unmapped
        if unmapped:
            result["warnings"].append("REQUIRED_ORDER_HAS_UNMAPPED_DOMAINS; no full coverage claim")
        required_paths = {path for group in mapping.values() for path in group}
        for path in sorted(required_paths):
            try:
                if path.endswith(".json"): parsed(path)
                else: source(path)
            except Exception as exc:
                result["errors"].append(f"REQUIRED_READ_FAIL {path}: {type(exc).__name__}")
        carriers = registry.get("critical_carriers",{})
        result["critical_carriers_expected"] = len(carriers)
        for path, expected_blob in carriers.items():
            if paths.get(path) != expected_blob:
                result["errors"].append(f"REGISTER_TREE_MISMATCH {path}")
            else:
                try: source(path)
                except Exception as exc:
                    result["errors"].append(f"CRITICAL_READ_FAIL {path}: {type(exc).__name__}")
        result["freshness_epoch"] = registry.get("freshness_epoch")
        if result["freshness_epoch"] != LOCK["freshness_epoch"]:
            result["errors"].append("FRESHNESS_EPOCH_MISMATCH")
        result["reported_whole_revision"] = registry.get("whole_revision")
        result["reported_track_revision"] = registry.get("track_design_revision")
        if result["reported_whole_revision"] != LOCK["source_whole_revision"]:
            result["errors"].append("WHOLE_REVISION_MISMATCH")
        if result["reported_track_revision"] != LOCK["source_track_design_revision"]:
            result["errors"].append("TRACK_REVISION_MISMATCH")
        result["public_coverage_status"] = (
            "VERIFIED_REPO_READBACK" if not result["errors"] and not unmapped else "PARTIAL"
        )
    except Exception as exc:
        result["errors"].append(f"HALT {type(exc).__name__}: {exc}")
        result["public_coverage_status"]="BLOCKIERT_OR_PARTIAL"
    result["whole_rehydration_status"]="PARTIAL; NO_PRIVATE_RECOVERY"
    print(json.dumps(result,ensure_ascii=False,indent=2))
    return 0 if result["public_coverage_status"]=="VERIFIED_REPO_READBACK" else 1

if __name__ == "__main__":
    sys.exit(main())
