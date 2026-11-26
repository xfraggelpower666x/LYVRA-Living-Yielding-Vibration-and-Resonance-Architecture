#!/usr/bin/env python3
"""Optionaler, nicht ausgeführter Publisher. Keine Live-Promotion. Standard: Dry-run."""
import argparse, hashlib, json, os, pathlib, urllib.request, urllib.error, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
REPO='xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture'
BASE='63c045fd55ada6e1511222c2eded03ff4e1079c2'
PREFIX='LYVRA_NATIVE_RUNTIME/facets/mcp_workflow/candidates/R03_1/'
BRANCH='lyvra-mcp-workflow-r03-1-source-20261125'
def blob(b): return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def api(method,path,body=None):
    token=os.environ.get('GITHUB_TOKEN'); assert token, 'GITHUB_TOKEN fehlt (privat konfigurieren)'
    req=urllib.request.Request('https://api.github.com/repos/'+REPO+path,data=None if body is None else json.dumps(body).encode(),method=method,headers={'Authorization':'Bearer '+token,'Accept':'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json','User-Agent':'LYVRA-R03-candidate-publisher'})
    with urllib.request.urlopen(req,timeout=30) as r: return json.load(r)
def main():
    p=argparse.ArgumentParser();p.add_argument('--publish',action='store_true');p.add_argument('--confirmed-zero-cost-and-preview-skip',action='store_true');p.add_argument('--confirmed-source-only-no-metered-side-effects',action='store_true');a=p.parse_args()
    files={PREFIX+f.relative_to(ROOT).as_posix():f.read_bytes() for f in sorted(ROOT.rglob('*')) if f.is_file() and '__pycache__' not in f.parts}
    expected={k:blob(v) for k,v in files.items()}; print(json.dumps({'branch':BRANCH,'base':BASE,'files':expected},indent=2))
    if not a.publish: return
    if not (a.confirmed_zero_cost_and_preview_skip or a.confirmed_source_only_no_metered_side_effects): raise SystemExit('BLOCKED: Publikations-Nebenwirkungen prüfen (CI/Preview/Deploy); kein allgemeiner Billing-Nachweis erforderlich')
    base=api('GET','/git/ref/heads/lyvra')['object']['sha'];assert base==BASE,'HEAD changed; refresh native governance'
    try: api('GET','/git/ref/heads/'+BRANCH)
    except urllib.error.HTTPError as e:
        if e.code!=404: raise
    else: raise SystemExit('Branch already exists; no overwrite')
    tree=api('GET','/git/commits/'+base)['tree']['sha']; t=api('GET','/git/trees/'+tree+'?recursive=1'); assert not t.get('truncated');assert not any(x['path'].startswith(PREFIX) for x in t['tree'])
    entries=[{'path':k,'mode':'100644','type':'blob','content':v.decode('utf-8')} for k,v in files.items()]
    newtree=api('POST','/git/trees',{'base_tree':tree,'tree':entries})['sha']; actual=api('GET','/git/trees/'+newtree+'?recursive=1'); assert not actual.get('truncated'); assert {x['path']:x['sha'] for x in actual['tree'] if x['type']=='blob' and x['path'].startswith(PREFIX)}==expected
    commit=api('POST','/git/commits',{'message':'[CI Skip] LYVRA MCP Workflow R03.1 isolated cost governance repair','tree':newtree,'parents':[base]})['sha']
    assert api('GET','/git/ref/heads/lyvra')['object']['sha']==base,'Concurrent change; do not create branch'
    api('POST','/git/refs',{'ref':'refs/heads/'+BRANCH,'sha':commit})
    assert api('GET','/git/ref/heads/'+BRANCH)['object']['sha']==commit
    for path,sha in expected.items(): assert api('GET','/contents/'+urllib.parse.quote(path,safe='/')+'?ref='+commit)['sha']==sha
    assert api('GET','/git/ref/heads/lyvra')['object']['sha']==base
    print('SOURCE_READBACK_MATCH',commit,'No deployment verification; check Pages/Actions separately.')
if __name__=='__main__': main()
