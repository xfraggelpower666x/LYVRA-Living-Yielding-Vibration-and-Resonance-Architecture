#!/usr/bin/env python3
"""Prüft einen fixierten öffentlichen Git-Snapshot; keine Branch-Promotion."""
import argparse
import hashlib
import json
import re
import subprocess
import sys
import tempfile
from pathlib import Path

REPOSITORY = 'https://github.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture.git'
ROOT = Path(__file__).resolve().parents[2]


def git(repo, *args):
    return subprocess.check_output(['git', '-C', str(repo), *args], stderr=subprocess.PIPE)


def verify(repo, commit, lock):
    if not re.fullmatch(r'[0-9a-f]{40}', commit):
        raise ValueError('Vollständige Commit-SHA erforderlich')
    resolved = git(repo, 'rev-parse', commit + '^{commit}').decode().strip()
    if resolved != commit:
        raise ValueError('Commit-Auflösung abweichend')
    def source(path):
        if not path.startswith('LYVRA_NATIVE_RUNTIME/') or '..' in path.split('/'):
            raise ValueError('Pfad außerhalb der nativen Snapshot-Prüfung')
        return git(repo, 'show', commit + ':' + path)
    manifest = json.loads(source('LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json'))
    pointer = json.loads(source('LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json'))
    registry_bytes = source('LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json')
    registry = json.loads(registry_bytes)
    def blob(data):
        return hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
    if blob(registry_bytes) != pointer['version_freshness']['registry_content_sha']:
        raise ValueError('Pointer-/Registry-Hashabweichung')
    if registry['freshness_epoch'] != pointer['version_freshness']['freshness_epoch']:
        raise ValueError('Epoch-Abweichung')
    if commit == lock['verified_source_commit']:
        tree = git(repo, 'rev-parse', commit + '^{tree}').decode().strip()
        if tree != lock['verified_source_tree']:
            raise ValueError('Freeze-Treeabweichung')
    carriers = registry['critical_carriers']
    for path, expected in carriers.items():
        if blob(source(path)) != expected:
            raise ValueError('Kritischer Fingerprint: ' + path)
    paths = {p for group in manifest['domain_path_map'].values() for p in group}
    for path in paths:
        data = source(path)
        if path.endswith('.json'):
            json.loads(data)
    missing_domains = [d for d in manifest['required_order'] if d not in manifest['domain_path_map']]
    print(json.dumps({'SNAPSHOT_INTEGRITY': 'VERIFIED', 'commit': commit,
                      'critical_carriers': len(carriers), 'mapped_paths': len(paths),
                      'unmapped_domains': missing_domains, 'PUBLIC_COVERAGE': 'PARTIAL' if missing_domains else 'STRUCTURAL_VERIFIED',
                      'WHOLE_REHYDRATION': 'PARTIAL', 'PRIVATE_RECOVERY': 'NOT_PERFORMED',
                      'branch_head_equality_required': False}, ensure_ascii=False))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--repo-dir', type=Path, help='Vorhandene Git-Kopie, nur lesend')
    group.add_argument('--online', action='store_true', help='Temporärer Clone des offiziellen öffentlichen Repositories')
    parser.add_argument('--commit', help='Vollständige SHA; Standard ist historischer Freeze-Anker')
    args = parser.parse_args()
    try:
        lock = json.loads((ROOT / 'freeze/FREEZE_LOCK.json').read_text())
        commit = args.commit or lock['verified_source_commit']
        if args.online:
            with tempfile.TemporaryDirectory(prefix='lyvra-snapshot-') as temp:
                repo = Path(temp) / 'repo'
                subprocess.run(['git', 'clone', '--bare', REPOSITORY, str(repo)], check=True,
                               stdout=subprocess.PIPE, stderr=subprocess.PIPE)
                verify(repo, commit, lock)
        else:
            verify(args.repo_dir, commit, lock)
    except (OSError, ValueError, KeyError, subprocess.CalledProcessError) as exc:
        print('SNAPSHOT_INTEGRITY=FAIL: ' + str(exc), file=sys.stderr)
        return 1
    return 0

if __name__ == '__main__':
    sys.exit(main())
