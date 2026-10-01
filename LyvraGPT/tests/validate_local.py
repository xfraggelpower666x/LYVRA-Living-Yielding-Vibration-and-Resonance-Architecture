#!/usr/bin/env python3
"""Check local archive integrity; no network access or external writes."""
from pathlib import Path
import hashlib, json, sys
root = Path(__file__).resolve().parents[1]
problems = []
cfg = json.loads((root/"gpt"/"EDITOR_CONFIG_CANDIDATE.json").read_text(encoding="utf-8"))
lock = json.loads((root/"freeze"/"FREEZE_LOCK.json").read_text(encoding="utf-8"))
text = (root/"gpt"/"EDITOR_INSTRUCTIONS_DE.txt").read_text(encoding="utf-8").rstrip("\n")
if len(text) > 8000: problems.append(f"instructions too long ({len(text)})")
if len(text) != cfg["editor_instructions_count"]: problems.append("character count doesn't match metadata")
if lock["repository_write"] != "NONE": problems.append("snapshot claims repository write")
if lock["freeze_status"] != "LOCAL_ARCHIVE_PREPARED_NOT_REPOSITORY_COMMITTED_NOT_PUBLISHED":
    problems.append("freeze state unexpected")
if cfg["action_secrets"] != "NOT_INCLUDED": problems.append("unexpected action secrets state")
lines = (root/"SHA256SUMS.txt").read_text(encoding="utf-8").splitlines()
filelist = []
for line in lines:
    if not line.strip(): continue
    try: sha,path = line.split("  ",1)
    except ValueError: problems.append("bad checksum line"); continue
    p = root / path
    filelist.append(path)
    if not p.is_file(): problems.append(f"missing {path}"); continue
    if hashlib.sha256(p.read_bytes()).hexdigest() != sha:
        problems.append(f"checksum mismatch: {path}")
actual = sorted(str(p.relative_to(root)) for p in root.rglob("*") if p.is_file() and p.name!="SHA256SUMS.txt")
if sorted(filelist) != actual: problems.append("inventory does not equal actual files")
print(f"EDITOR_INSTRUCTIONS_CHARS={len(text)} / 8000")
print(f"CHECKED_FILES={len(filelist)}")
print("LOCAL_FREEZE_INTEGRITY="+("PASS" if not problems else "FAIL"))
for problem in problems: print("ERROR="+problem)
sys.exit(1 if problems else 0)
