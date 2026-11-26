"""Additiver Publisher für den vorhandenen Kandidatenbranch; kein Deployment."""
import hashlib
import re

BRANCH = 'lyvra-mcp-workflow-source-20261125'
PREFIX = 'LYVRA_NATIVE_RUNTIME/facets/mcp_workflow/candidates/R03.2/'
PRODUCTION = 'lyvra'

class Conflict(RuntimeError):
    pass

def require(ok, message):
    if not ok:
        raise Conflict(message)

def blob(data):
    return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()

def plan(files):
    require(bool(files), 'EMPTY')
    result = {}
    for path, data in files.items():
        require(isinstance(path,str) and re.fullmatch(r'[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_.-]+)*',path) and all(p not in ('.','..') for p in path.split('/')), 'PATH')
        require(isinstance(data,bytes), 'BYTES')
        result[PREFIX+path] = blob(data)
    return result

def publish(api, files, expected_head, expected_production, *, confirmed_source_only=False, dry_run=True):
    """Adaptervertrag: head, tree, create_blob, create_tree, commit, compare_and_swap.
    compare_and_swap muss atomar sein; kein unsicheres Force-Update als Fallback.
    tree(commit_or_tree) liefert die vollständige Pfad/SHA-Map aller Blobs.
    """
    desired = plan(files)
    if dry_run:
        return {'status':'DRY_RUN','files':desired}
    require(confirmed_source_only is True,'SIDE_EFFECTS_UNCONFIRMED')
    require(all(isinstance(s,str) and re.fullmatch('[a-f0-9]{40}',s) for s in (expected_head,expected_production)), 'SHA')
    def heads():
        require(api.head(PRODUCTION)==expected_production,'PRODUCTION_MOVED')
        require(api.head(BRANCH)==expected_head,'BRANCH_MOVED')
    heads()
    old = api.tree(expected_head)
    require(not any(p.startswith(PREFIX) and desired.get(p)!=s for p,s in old.items()),'REVISION_CONFLICT')
    additions = {p:s for p,s in desired.items() if p not in old}
    if not additions:
        heads()
        return {'status':'ALREADY_PRESENT','commit':expected_head,'files':desired}
    for path, sha in additions.items():
        require(api.create_blob(files[path[len(PREFIX):]])==sha,'BLOB_MISMATCH')
    tree = api.create_tree(expected_head,additions)
    require(api.tree(tree)=={**old,**additions},'TREE_MISMATCH')
    heads()
    commit = api.commit(tree,expected_head,'[CI Skip] [skip ci] LYVRA MCP Workflow R03.2 source only')
    require(api.tree(commit)=={**old,**additions},'COMMIT_TREE_MISMATCH')
    heads()
    require(api.compare_and_swap(BRANCH,expected_head,commit) is True,'REF_CONFLICT')
    require(api.head(BRANCH)==commit,'READBACK_HEAD')
    require(api.tree(commit)=={**old,**additions},'READBACK_TREE')
    require(api.head(PRODUCTION)==expected_production,'PRODUCTION_MOVED_AFTER_WRITE')
    return {'status':'SOURCE_READBACK_MATCH','commit':commit,'files':desired}
