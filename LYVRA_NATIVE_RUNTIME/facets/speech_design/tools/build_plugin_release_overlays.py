"""Reproducible dry-run LYVRA Speech skill overlays for current plugin baselines.

Creates two source-only ZIPs and a SHA-256 manifest. Does NOT call Plugin
Creator, install a plugin, modify GitHub native CURRENT, or ship binaries.
Existing binary assets remain in the plugin because these are overlays.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import zipfile

ROOT = Path(__file__).resolve().parents[4]
STAGING = ROOT / "lyvra-plugin" / "staging" / "speech-design"
SOURCES = ROOT / "lyvra-plugin"

SPECS = (
    {
        "key": "plugin-a", "source": "account/releases/v0.13.1/source",
        "next_version": "0.13.2", "base_version": "0.13.1",
        "id": "plugin_06a4fc64dd848191982ca4a6ebdb2619",
        "expected_release_id": "pluginrel_6abf5fbe0acc8191ba395c6d17f0725e",
        "skill": "speech-design",
    },
    {
        "key": "plugin-b", "source": "native-runtime/releases/v0.1.3/source",
        "next_version": "0.1.4", "base_version": "0.1.3",
        "id": "plugins_6ab3a345db308191b8ad7ef6311f8a29",
        "expected_release_id": "pluginrel_6abf5fc5cf808191b4fd0d4beae8bcce",
        "skill": "lyvra-speech-design",
    },
)


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def package(spec: dict, output_dir: Path) -> dict:
    current = SOURCES / spec["source"]
    overlay = STAGING / spec["key"] / "release-overlay"
    expected_paths = ("plugin.json", ".codex-plugin/plugin.json",
                      f"skills/{spec['skill']}/SKILL.md")
    actual_files = {p.relative_to(overlay).as_posix()
                    for p in overlay.rglob("*") if p.is_file()}
    if actual_files != set(expected_paths):
        raise ValueError(f"Unexpected overlay paths for {spec['key']}: {actual_files}")

    for name in expected_paths[:2]:
        baseline = json.loads((current / name).read_text(encoding="utf-8"))
        proposal = json.loads((overlay / name).read_text(encoding="utf-8"))
        if baseline["version"] != spec["base_version"] \
                or proposal["version"] != spec["next_version"]:
            raise ValueError(f"Version mismatch: {spec['key']}/{name}")
        baseline.pop("version")
        proposal.pop("version")
        if baseline != proposal:
            raise ValueError(f"Accidental change to plugin identity or contract: {spec['key']}/{name}")

    if not (current / ".app.json").is_file() \
            or not (current / "skills" / "666-visual-interface" / "SKILL.md").is_file():
        raise ValueError(f"Current release snapshot incomplete: {spec['key']}")
    skill_bytes = (overlay / expected_paths[2]).read_bytes()
    if b"LYVRA SPEECH DESIGN" not in skill_bytes \
            or b"RELEASE_CAPABILITY_RUNTIME_VERIFICATION_REQUIRED" not in skill_bytes:
        raise ValueError("Skill does not carry native trigger and truthful runtime gate")

    output_dir.mkdir(parents=True, exist_ok=True)
    zip_name = f"LYVRA_{spec['key'].upper().replace('-', '_')}_SPEECH_RC_v{spec['next_version']}.zip"
    zip_path = output_dir / zip_name
    with zipfile.ZipFile(zip_path, "w") as archive:
        for name in sorted(expected_paths):
            info = zipfile.ZipInfo(name, date_time=(2026, 10, 2, 12, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = (0o100644 & 0xFFFF) << 16
            archive.writestr(info, (overlay / name).read_bytes())
    with zipfile.ZipFile(zip_path, "r") as archive:
        if archive.testzip() is not None or set(archive.namelist()) != set(expected_paths):
            raise ValueError(f"Invalid ZIP overlay: {zip_path.name}")
    return {
        "target_plugin": spec["id"],
        "base_version": spec["base_version"],
        "proposed_version": spec["next_version"],
        "guard_expected_current_release_id": spec["expected_release_id"],
        "package_filename": zip_name,
        "zip_sha256": sha256(zip_path.read_bytes()),
        "payload_paths": sorted(expected_paths),
        "actual_plugin_release_executed": False,
        "native_current_pointer_changed": False,
    }


def build(output_dir: Path) -> dict:
    packages = [package(spec, output_dir) for spec in SPECS]
    audit = {
        "schema": "LYVRA_SPEECH_PLUGIN_OVERLAY_PREVIEW_V1",
        "source_authority": "native productive lyvra, separate Speech DEV candidate",
        "status": "PREVIEW_ONLY_NOT_INSTALLED",
        "guard_policy": "Plugin Creator update must re-read current release ID first",
        "restore_policy": "Preserve all existing installed skills, assets, app and connector settings",
        "packages": packages,
    }
    (output_dir / "RELEASE_OVERLAY_SHA256_MANIFEST.json").write_text(
        json.dumps(audit, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return audit


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    result = build(args.output_dir)
    print(json.dumps({"preview_ready": True, "packages": len(result["packages"]),
                      "status": result["status"]}))
