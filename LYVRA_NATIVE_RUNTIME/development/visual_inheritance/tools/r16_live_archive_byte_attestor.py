#!/usr/bin/env python3
"""Fail-closed byte attestation for actual current Native/ALIVE plugin releases.

Requires a locally available original provider tar.gz archive for the exact
approved release. No network calls, plugin mutations or GitHub writes.
R14 hybrid snapshot is an editable candidate, NOT a live release.
"""
from __future__ import annotations
import argparse
import hashlib
import io
import json
import pathlib
import tarfile
import zipfile
import sys

TARGETS = {
    "native": {"current": "0.1.87", "candidate": "0.1.88", "count": 50,
               "release": "pluginrel_6ae2b9c989608191a858005bc2fb2af9"},
    "alive": {"current": "0.13.83", "candidate": "0.13.84", "count": 64,
              "release": "pluginrel_6ae2b9dbd83c8191b2dfea8cdbde2b16"},
}
MUTABLE = {"plugin.json", ".codex-plugin/plugin.json", "skills/666-visual-interface/SKILL.md"}
PROTECTED = ("dashboard/index.html",)
ASSET_PREFIXES = ("assets/", "skills/instructions/references/")
def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()

def inspect_tar(path: pathlib.Path) -> dict[str, bytes]:
    members = {}
    with tarfile.open(path, "r:gz") as tar:
        all_files = [m for m in tar.getmembers() if m.isfile()]
        names = [m.name[2:] if m.name.startswith("./") else m.name for m in all_files]
        if names and all("/" in n for n in names):
            head = {n.split("/", 1)[0] for n in names}
            if len(head) == 1:
                names = [n.split("/", 1)[1] for n in names]
        for original, name in zip(all_files, names):
            pp = pathlib.PurePosixPath(name)
            if (not name or pp.is_absolute() or ".." in pp.parts or
                any(part in ("", ".") for part in pp.parts) or name in members):
                raise ValueError("UNSAFE_OR_DUPLICATE_ARCHIVE_PATH: " + name)
            if not original.isfile() or original.issym() or original.islnk():
                raise ValueError("UNSAFE_ARCHIVE_MEMBER: " + name)
            src = tar.extractfile(original)
            if src is None:
                raise ValueError("UNREADABLE_ARCHIVE_MEMBER: " + name)
            members[name] = src.read()
        for other in tar.getmembers():
            if other.issym() or other.islnk() or other.isdev():
                raise ValueError("UNSAFE_SPECIAL_MEMBER: " + other.name)
    return members

def inspect_snapshot(path: pathlib.Path) -> dict[str, bytes]:
    return {f.relative_to(path).as_posix(): f.read_bytes()
            for f in path.rglob("*") if f.is_file()}

def verify(current: dict[str, bytes], candidate: dict[str, bytes],
           surface: str, expected_release: str) -> dict:
    cfg = TARGETS[surface]
    if cfg["release"] != expected_release:
        raise ValueError("RELEASE_ID_MISMATCH")
    if len(current) != cfg["count"] or len(candidate) != cfg["count"]:
        raise ValueError("INVENTORY_SIZE_MISMATCH")
    if set(current) != set(candidate):
        raise ValueError("INVENTORY_PATH_MISMATCH")
    for n in ("plugin.json", ".codex-plugin/plugin.json"):
        live_ver = json.loads(current[n].decode("utf-8"))["version"]
        new_ver = json.loads(candidate[n].decode("utf-8"))["version"]
        if live_ver != cfg["current"] or new_ver != cfg["candidate"]:
            raise ValueError("MANIFEST_VERSION_MISMATCH: " + n)
    unchanged, changed, protected = [], [], []
    for name in sorted(current):
        a, b = current[name], candidate[name]
        if name.startswith(ASSET_PREFIXES) or name in PROTECTED:
            protected.append({"path": name, "live_sha256": sha(a),
                              "candidate_sha256": sha(b), "bytes": len(a)})
            if a != b:
                raise ValueError("PROTECTED_ASSET_OR_DASHBOARD_DRIFT: " + name)
        elif name not in MUTABLE and a != b:
            raise ValueError("UNAPPROVED_SOURCE_CHANGE: " + name)
        elif a == b:
            unchanged.append(name)
        else:
            changed.append(name)
    if "skills/666-visual-interface/SKILL.md" not in changed:
        raise ValueError("EXPECTED_R11_VISUAL_CHANGE_MISSING")
    return {"status": "LIVE_BYTES_MATCH_PROTECTED_FILES",
            "release_id": expected_release, "current_version": cfg["current"],
            "candidate_version": cfg["candidate"], "file_count": len(current),
            "current_sha256": {k: sha(v) for k,v in sorted(current.items())},
            "protected": protected, "changed": changed, "unchanged": unchanged}

def build_zip(candidate: dict[str, bytes], output: pathlib.Path) -> dict:
    with zipfile.ZipFile(output, "w", compression=zipfile.ZIP_STORED) as z:
        for name, data in sorted(candidate.items()):
            info = zipfile.ZipInfo(name, date_time=(2026, 10, 29, 0, 0, 0))
            info.compress_type = zipfile.ZIP_STORED
            info.external_attr = (0o100644 << 16)
            info.flag_bits |= 0x800
            z.writestr(info, data)
    with zipfile.ZipFile(output, "r") as z:
        if set(z.namelist()) != set(candidate):
            raise ValueError("BUILT_ZIP_INVENTORY_MISMATCH")
        for n, data in candidate.items():
            if z.read(n) != data:
                raise ValueError("BUILT_ZIP_BYTE_MISMATCH:" + n)
    b = output.read_bytes()
    return {"zip_sha256": sha(b), "zip_bytes": len(b), "zip_entry_count": len(candidate)}

def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--surface", choices=TARGETS, required=True)
    p.add_argument("--live-archive", type=pathlib.Path, required=True)
    p.add_argument("--candidate-snapshot", type=pathlib.Path, required=True)
    p.add_argument("--release-id", required=True)
    p.add_argument("--out-zip", type=pathlib.Path)
    p.add_argument("--receipt", type=pathlib.Path)
    a = p.parse_args()
    try:
        if not a.live_archive.is_file():
            raise FileNotFoundError("LIVE_PROVIDER_ARCHIVE_BYTES_UNAVAILABLE")
        if not a.candidate_snapshot.is_dir():
            raise FileNotFoundError("CANDIDATE_SNAPSHOT_UNAVAILABLE")
        old = inspect_tar(a.live_archive)
        new = inspect_snapshot(a.candidate_snapshot)
        report = verify(old, new, a.surface, a.release_id)
        report["live_archive_sha256"] = sha(a.live_archive.read_bytes())
        if a.out_zip:
            report.update(build_zip(new, a.out_zip))
        if a.receipt:
            a.receipt.write_text(json.dumps(report, indent=2, ensure_ascii=False)+"\n",
                                 encoding="utf-8")
        print(json.dumps(report, ensure_ascii=False))
        return 0
    except Exception as exc:
        print(json.dumps({"status":"BLOCKED_NO_RELEASE_ZIP", "reason":str(exc)}))
        return 2
if __name__ == "__main__":
    sys.exit(main())
