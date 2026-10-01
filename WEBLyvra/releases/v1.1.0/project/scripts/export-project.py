"""Reproduzierbarer WEBLyvra-Export: keine Writes, Netzwerkzugriffe oder Live-Annahmen."""
from pathlib import Path
import argparse, subprocess, tarfile, io, zipfile, json, hashlib
root = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser()
parser.add_argument('output', type=Path)
parser.add_argument('--source-ref', help='Expliziter Git-Quellstand; sonst Dateien dieses Projektordners')
parser.add_argument('--published-version', type=int)
parser.add_argument('--published-commit')
parser.add_argument('--prechange-ref', help='Optionaler alter Git-Stand zur Wiederherstellung')
args = parser.parse_args()
paths = ['dist', '.openai', 'docs', 'tests', 'scripts']
entries = {}
def sha(data): return hashlib.sha256(data).hexdigest()
def add_tree(label, ref=None):
    if ref:
        commit = subprocess.check_output(['git', 'rev-parse', '--verify', ref + '^{commit}'], cwd=root, text=True).strip()
        archive = subprocess.check_output(['git', 'archive', commit, *paths], cwd=root)
        with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
            for member in tar:
                if member.isfile(): entries[label + '/' + member.name] = tar.extractfile(member).read()
        return commit
    for folder in paths:
        for file in sorted((root / folder).rglob('*')):
            if file.is_file():
                assert not file.is_symlink()
                if '__pycache__' not in file.parts: entries[label + '/' + str(file.relative_to(root))] = file.read_bytes()
    return None
source = add_tree('project', args.source_ref)
prechange = add_tree('prechange', args.prechange_ref) if args.prechange_ref else None
for name in entries:
    assert not any(part in {'.git', 'node_modules', '.env', '.env.local', 'backups'} for part in Path(name).parts)
entries['README.md'] = (root / 'docs/WEBLYVRA_EXPORT_README.md').read_bytes()
manifest = {'format': 'WEBLyvra_SOURCE_FREEZE_v1', 'source_commit': source, 'prechange_commit': prechange, 'published_version': args.published_version, 'published_commit': args.published_commit, 'source_matches_published': bool(source and source == args.published_commit), 'publication_status': 'EXPLICIT_METADATA' if args.published_commit else 'NOT_ASSERTED', 'files': {name: sha(data) for name, data in sorted(entries.items())}}
entries['MANIFEST.json'] = (json.dumps(manifest, ensure_ascii=False, indent=2) + '\n').encode()
output = args.output.resolve()
output.parent.mkdir(parents=True, exist_ok=True)
with zipfile.ZipFile(output, 'w', compression=zipfile.ZIP_DEFLATED) as archive:
    for name, data in sorted(entries.items()):
        info = zipfile.ZipInfo(name, date_time=(2026, 10, 1, 0, 0, 0))
        info.compress_type = zipfile.ZIP_DEFLATED
        info.external_attr = 0o100644 << 16
        archive.writestr(info, data)
with zipfile.ZipFile(output) as archive:
    assert archive.testzip() is None
    for name, digest in manifest['files'].items(): assert sha(archive.read(name)) == digest
print(json.dumps({'zip': str(output), 'files': len(entries), 'bytes': output.stat().st_size, 'sha256': sha(output.read_bytes()), 'source_commit': source}))
