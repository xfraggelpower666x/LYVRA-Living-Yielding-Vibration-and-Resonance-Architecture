"""Nicht destruktiver Originalquell-Export. Keine Migration, keine Netzwerkzugriffe."""
from pathlib import Path
import subprocess,tarfile,io,zipfile,json,hashlib,sys
root=Path(__file__).resolve().parents[1]
output=Path(sys.argv[1]).resolve()
live='95f2b9d88d36cfc09ab58b7a00b2b4abfefc29b9'
draft=subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip()
entries={}
for label,ref in [('live-project',live),('draft-project',draft)]:
 paths=['dist','.openai','docs']
 if label=='draft-project':paths+=['tests','scripts']
 data=subprocess.check_output(['git','archive',ref,*paths],cwd=root)
 with tarfile.open(fileobj=io.BytesIO(data)) as tar:
  for member in tar:
   if member.isfile():
    name=label+'/'+member.name
    assert not any(v in Path(name).parts for v in ['.git','node_modules','.env','.env.local','backups'])
    entries[name]=tar.extractfile(member).read()
entries['README.md']=(root/'docs/WEBLYVRA_EXPORT_README.md').read_bytes()
manifest={'live_source_commit':live,'draft_source_commit':draft,'published_source_version':5,'draft_is_unpublished':True,'mode':'READ_ONLY_SOURCE_EXPORT','files':{name:hashlib.sha256(data).hexdigest() for name,data in sorted(entries.items())}}
entries['MANIFEST.json']=(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
output.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(output,'w',compression=zipfile.ZIP_DEFLATED) as archive:
 for name,data in sorted(entries.items()):archive.writestr(name,data)
with zipfile.ZipFile(output) as archive:
 assert archive.testzip() is None
 for name,digest in manifest['files'].items():assert hashlib.sha256(archive.read(name)).hexdigest()==digest
print(json.dumps({'zip':str(output),'file_count':len(entries),'bytes':output.stat().st_size,'sha256':hashlib.sha256(output.read_bytes()).hexdigest(),'live_commit':live,'draft_commit':draft}))
