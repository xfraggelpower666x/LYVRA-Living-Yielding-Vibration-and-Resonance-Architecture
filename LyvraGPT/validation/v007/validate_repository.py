#!/usr/bin/env python3
"""Prüft Repository-Sicherung und Originalarchive offline, ohne Mutationen."""
import argparse
import hashlib
import io
import json
import stat
import sys
import zipfile
from pathlib import Path, PurePosixPath

HASHES = {
    'LYVRA_GPT_REPAIR_005_2026-10-01.zip': 'be587083268aadb46148b3b62f03b0a0ddab32c6f5e0cf7f45d5353cdde4d60e',
    'LYVRA_GPT_AUDIT_REPAIR_FREEZE_004_2026-10-01.zip': 'e9ebc9daca3b9cc8045c1fe677dc50ab039cd6cfa0be7d29f7645d3212f410dc',
}

def safe_path(name):
    p = PurePosixPath(name)
    if p.is_absolute() or '..' in p.parts or '\\' in name or ':' in name:
        raise ValueError('Unsicherer Pfad: ' + name)
    return p


def sha(data):
    return hashlib.sha256(data).hexdigest()


def archive(data):
    with zipfile.ZipFile(io.BytesIO(data)) as z:
        names = z.namelist()
        if len(set(names)) != len(names):
            raise ValueError('Doppelte Archiveinträge')
        if sum(i.file_size for i in z.infolist()) > 10_000_000:
            raise ValueError('Archiv zu groß')
        for i in z.infolist():
            safe_path(i.filename)
            if not i.filename.startswith('LyvraGPT/') or stat.S_ISLNK(i.external_attr >> 16):
                raise ValueError('Archiveintrag außerhalb des erlaubten Bereichs')
        if z.testzip() is not None:
            raise ValueError('CRC-Fehler')
        files = {n: z.read(n) for n in names if not n.endswith('/')}
    listed = set()
    for line in files['LyvraGPT/SHA256SUMS.txt'].decode().splitlines():
        if not line.strip():
            continue
        expected, rel = line.split('  ', 1)
        safe_path(rel)
        path = 'LyvraGPT/' + rel
        if path in listed or sha(files[path]) != expected:
            raise ValueError('Archiv-Prüfsumme: ' + path)
        listed.add(path)
    if listed != set(files) - {'LyvraGPT/SHA256SUMS.txt'}:
        raise ValueError('Archiv-Inventar unvollständig')
    cfg = json.loads(files['LyvraGPT/gpt/EDITOR_CONFIG_CANDIDATE.json'])
    text = files['LyvraGPT/gpt/EDITOR_INSTRUCTIONS_DE.txt'].decode().rstrip('\n')
    if len(text) != cfg['editor_instructions_count'] or len(text) > 8000:
        raise ValueError('Zeichenmetadaten ungültig')
    return files


def validate(root):
    root = root.resolve()
    for name, expected in HASHES.items():
        path = root / 'releases' / name
        if path.is_symlink():
            raise ValueError('Archiv darf kein Symlink sein')
        data = path.read_bytes()
        if sha(data) != expected:
            raise ValueError('Original-ZIP verändert: ' + name)
        entries = archive(data)
        if 'REPAIR_005' in name:
            for path, payload in entries.items():
                local = root / PurePosixPath(path).relative_to('LyvraGPT')
                if local.is_symlink() or local.read_bytes() != payload:
                    raise ValueError('Entpackte Originaldatei verändert: ' + path)
            embedded = entries['LyvraGPT/releases/LYVRA_GPT_AUDIT_REPAIR_FREEZE_004_2026-10-01.zip']
            if sha(embedded) != HASHES['LYVRA_GPT_AUDIT_REPAIR_FREEZE_004_2026-10-01.zip']:
                raise ValueError('Eingebettete Freeze 004 verändert')
    checked = set()
    manifests = ['SHA256SUMS_HANDOFF_006.txt', 'validation/v007/SHA256SUMS.txt']
    for manifest in manifests:
        for line in (root / manifest).read_text().splitlines():
            if not line.strip():
                continue
            expected, rel = line.split('  ', 1)
            safe_path(rel)
            p = root / rel
            if p.is_symlink() or sha(p.read_bytes()) != expected:
                raise ValueError('Repository-Prüfsumme: ' + rel)
            if rel in checked:
                raise ValueError('Doppelter Prüfsummenpfad: ' + rel)
            checked.add(rel)
    actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
    expected_inventory = checked | set(manifests)
    if actual != expected_inventory:
        raise ValueError('Ungeprüfte oder fehlende Dateien: ' + repr(sorted(actual ^ expected_inventory)))
    print(json.dumps({'REPOSITORY_INTEGRITY': 'VERIFIED', 'ORIGINAL_ARCHIVES': 'VERIFIED',
                      'ORIGINAL_FILES_PRESERVED': True, 'files': len(actual),
                      'REHYDRATION_STATUS': 'NOT_TESTED'}, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[2])
    args = parser.parse_args()
    try:
        validate(args.root)
    except (OSError, ValueError, KeyError, zipfile.BadZipFile) as exc:
        print('REPOSITORY_INTEGRITY=FAIL: ' + str(exc), file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
