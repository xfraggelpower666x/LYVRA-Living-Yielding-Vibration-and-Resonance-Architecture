#!/usr/bin/env python3
"""Deterministic, OFFLINE/READ-ONLY candidate ZIP + receipt builder.

This tool does NOT publish a plugin release or write GitHub. It accepts an
already governed, target-specific release-identical extracted source tree,
creates a reproducible ZIP locally and verifies its contents byte-for-byte.
Its caller must separately verify exact plugin release provenance, apply
repository-native HEAD/SHA/recovery/write governance, perform GitHub binary
readback and finally publish CURRENT_POINTER last.

Usage:
 python build_release_zip_mirror.py --source /verified/release/tree \
   --plugin-id <exact-id> --version <version> --release-id <exact-release> \
   --output-dir /tmp/lyvra-mirror --target native
"""
import argparse, hashlib, json, os, pathlib, zipfile
from datetime import datetime, timezone

ASSETS = {
 "native": ["assets/lyvra-original-visuals/LYVRA_Character_Showcase.jpeg", "assets/lyvra-original-visuals/LYVRA_Heart_Logo.jpeg", "assets/lyvra-original-visuals/LYVRA_Leitbild_Character_Card.jpeg", "assets/lyvra-plugin-logo.png"],
 "alive": ["assets/lyvra-original-visuals/LYVRA_Character_Showcase.jpeg", "assets/lyvra-original-visuals/LYVRA_Heart_Logo.jpeg", "assets/lyvra-original-visuals/LYVRA_Leitbild_Character_Card.jpeg", "assets/lyvra-alive-logo.png"],
 "family-mail": ["assets/family-mail-banner-original.jpg", "assets/family-mail-chat-logo-512.png", "assets/family-mail-plugin-icon-256.png", "assets/family-mail-plugin-icon-512.png"],
}
def sha(data): return hashlib.sha256(data).hexdigest()
def fail(message): raise ValueError(message)

def main():
 p=argparse.ArgumentParser()
 p.add_argument("--source",required=True)
 p.add_argument("--target",choices=sorted(ASSETS),required=True)
 p.add_argument("--plugin-id",required=True)
 p.add_argument("--version",required=True)
 p.add_argument("--release-id",required=True)
 p.add_argument("--output-dir",required=True)
 p.add_argument("--provenance",choices=["VERIFIED_RELEASE_IDENTICAL_SOURCE","SOURCE_SNAPSHOT_ONLY"],default="SOURCE_SNAPSHOT_ONLY")
 a=p.parse_args()
 root=pathlib.Path(a.source).resolve(strict=True)
 if not root.is_dir(): fail("source must be directory")
 files={}
 for f in sorted(root.rglob("*")):
  if f.is_symlink(): fail(f"symlink not accepted: {f}")
  if not f.is_file(): continue
  rel=f.relative_to(root).as_posix()
  if rel.startswith("../") or rel in files: fail("unsafe/duplicate path")
  files[rel]=f.read_bytes()
 for required in ["plugin.json",".codex-plugin/plugin.json",*ASSETS[a.target]]:
  if required not in files: fail(f"required file missing: {required}")
 first=json.loads(files["plugin.json"]); second=json.loads(files[".codex-plugin/plugin.json"])
 if first.get("version")!=a.version or second.get("version")!=a.version: fail("manifest version mismatch")
 if first.get("name") != second.get("name"): fail("manifest identity mismatch")
 expected_logo={"native":"lyvra-plugin-logo.png","alive":"lyvra-alive-logo.png","family-mail":"family-mail-plugin-icon-512.png"}[a.target]
 path=first.get("extensions",{}).get("com.openai",{}).get("interface",{}).get("logo")
 if path!="./assets/"+expected_logo: fail("original logo manifest binding mismatch")
 out=pathlib.Path(a.output_dir).resolve();out.mkdir(parents=True,exist_ok=True)
 filename=f"LYVRA_{a.target}_{a.version}_{a.release_id}.zip"
 dest=out/filename
 with zipfile.ZipFile(dest,"w",compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
  for rel,data in files.items():
   info=zipfile.ZipInfo(rel,date_time=(1980,1,1,0,0,0))
   info.compress_type=zipfile.ZIP_DEFLATED
   info.external_attr=(0o644<<16)
   z.writestr(info,data,compress_type=zipfile.ZIP_DEFLATED,compresslevel=9)
 with zipfile.ZipFile(dest) as z:
  if sorted(z.namelist())!=sorted(files): fail("zip file-list mismatch")
  for rel,data in files.items():
   if z.read(rel)!=data: fail(f"ZIP readback mismatch: {rel}")
 zipped=dest.read_bytes()
 receipt={"schema":"LYVRA_RELEASE_ZIP_MIRROR_RECEIPT_V1","status":"LOCALLY_ZIP_READBACK_VERIFIED","target":a.target,"plugin_id":a.plugin_id,"version":a.version,"release_id":a.release_id,"source_provenance":a.provenance,"archive_filename":filename,"zip_sha256":sha(zipped),"zip_bytes":len(zipped),"source_file_count":len(files),"source_file_sha256":{k:sha(v) for k,v in files.items()},"original_asset_sha256":{k:sha(files[k]) for k in ASSETS[a.target]},"live_plugin_release_readback":"REQUIRED_EXTERNAL_GATE","github_blob_readback":"REQUIRED_EXTERNAL_GATE","host_render":"NOT_TESTED","production_pointer_last":"REQUIRED_EXTERNAL_GATE"}
 receiptfile=out/(filename+".receipt.json")
 receiptfile.write_text(json.dumps(receipt,indent=2,sort_keys=True)+"\n",encoding="utf-8")
 print(json.dumps({"zip":str(dest),"receipt":str(receiptfile),"sha256":receipt["zip_sha256"],"source_provenance":a.provenance,"current_release_mirror_verified":False},indent=2))

if __name__=="__main__":main()
