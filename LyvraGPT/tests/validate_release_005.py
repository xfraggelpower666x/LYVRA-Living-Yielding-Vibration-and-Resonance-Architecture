#!/usr/bin/env python3
"""Local, offline-only LYVRA GPT Repair 005 package verification."""
from pathlib import Path, PurePosixPath
import hashlib, json, sys, zipfile
root = Path(__file__).resolve().parents[1]
errors=[]
index=json.loads((root/"repair"/"RELEASE_INDEX.json").read_text(encoding="utf-8"))
if index.get("published_to_repo") is not False: errors.append("Unexpected claim: remote published")
if index.get("github_writer_available") is not False: errors.append("Unexpected claim: writer available")
if index.get("repo_runtime_modified") is not False: errors.append("Unexpected claim: runtime modified")
if index.get("target_directory")!="LyvraGPT/": errors.append("Unexpected target directory")
archive=root/index["freeze004_original_zip"]
if not archive.is_file(): errors.append("Embedded Freeze004 ZIP missing")
else:
    data=archive.read_bytes()
    if hashlib.sha256(data).hexdigest()!=index["freeze004_zip_sha256"]:
        errors.append("Embedded Freeze004 ZIP hash mismatch")
    with zipfile.ZipFile(archive) as z:
        if z.testzip(): errors.append("Embedded Freeze004 ZIP CRC mismatch")
        for n in z.namelist():
            pp=PurePosixPath(n)
            if not n.startswith("LyvraGPT/") or pp.is_absolute() or ".." in pp.parts:
                errors.append("Unsafe nested ZIP path: "+n)
lines=(root/"SHA256SUMS.txt").read_text(encoding="utf-8").splitlines()
checked=[]
for line in lines:
    if not line.strip(): continue
    try: expected,rel=line.split("  ",1)
    except ValueError: errors.append("Malformed checksum line"); continue
    pure=PurePosixPath(rel)
    if pure.is_absolute() or ".." in pure.parts: errors.append("Unsafe checksum path: "+rel); continue
    p=root/rel
    if not p.is_file() or p.is_symlink(): errors.append("Missing or linked file: "+rel); continue
    if hashlib.sha256(p.read_bytes()).hexdigest()!=expected:
        errors.append("Checksum mismatch: "+rel)
    checked.append(rel)
all_files=[str(p.relative_to(root)) for p in root.rglob("*") if p.is_file() and p.name!="SHA256SUMS.txt"]
if sorted(checked)!=sorted(all_files): errors.append("Checksum inventory differs from package files")
instr=(root/"gpt"/"EDITOR_INSTRUCTIONS_DE.txt").read_text(encoding="utf-8").rstrip("\n")
meta=json.loads((root/"gpt"/"EDITOR_CONFIG_CANDIDATE.json").read_text(encoding="utf-8"))
if len(instr)>8000 or len(instr)!=meta["editor_instructions_count"]:
    errors.append("Editor instruction count mismatch or exceeds limit")
print(f"ARCHIVE_PRESENT={archive.is_file()}")
print(f"FILE_HASHES_CHECKED={len(checked)}")
print(f"EDITOR_INSTRUCTIONS_CHARS={len(instr)}")
print("LOCAL_REPAIR_005="+("PASS" if not errors else "FAIL"))
for error in errors: print("ERROR="+error)
sys.exit(bool(errors))
