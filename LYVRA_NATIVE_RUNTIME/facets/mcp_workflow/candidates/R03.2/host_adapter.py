"""GitHub-Hostadapter; der Host stellt die autorisierten Toolhandles bereit."""
import base64
import json
import re
from publisher import BRANCH, PRODUCTION, PREFIX, require

REPO = 'xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture'
API = 'https://api.github.com/repos/' + REPO

class GitHubHostAdapter:
    def __init__(self, call):
        self.call = call

    def _call(self, name, **args):
        result = self.call(name, args)
        require(isinstance(result, dict) and isinstance(result.get('result'), dict), 'HOST_RESPONSE')
        return result['result']

    def _get(self, path):
        return json.loads(self._call('fetch', url=API+path)['content'])

    def head(self, branch):
        require(branch in (BRANCH, PRODUCTION), 'BRANCH_SCOPE')
        return self._call('fetch_commit', repo_full_name=REPO, commit_sha=branch)['commit']['sha']

    def tree(self, ref):
        require(re.fullmatch('[a-f0-9]{40}', ref), 'SHA')
        # Nur ein expliziter Git-Tree-404 erlaubt die Auflösung als Commit.
        try:
            result = self._get('/git/trees/'+ref+'?recursive=1')
        except FileNotFoundError:
            tree = self._get('/git/commits/'+ref)['tree']['sha']
            result = self._get('/git/trees/'+tree+'?recursive=1')
        require(result.get('truncated') is False, 'TREE_INCOMPLETE')
        return {x['path']:x['sha'] for x in result['tree'] if x['type']=='blob'}

    def create_blob(self, data):
        return self._call('create_blob', repository_full_name=REPO, encoding='base64', content=base64.b64encode(data).decode('ascii'))['sha']

    def create_tree(self, parent, additions):
        require(all(p.startswith(PREFIX) for p in additions), 'PATH_SCOPE')
        base = self._get('/git/commits/'+parent)['tree']['sha']
        entries = [dict(path=p,sha=s,type='blob',mode='100644') for p,s in additions.items()]
        return self._call('create_tree',repository_full_name=REPO,base_tree_sha=base,tree_elements=entries)['sha']

    def commit(self, tree, parent, message):
        require('[CI Skip]' in message and '[skip ci]' in message, 'CI_SKIP')
        return self._call('create_commit',repository_full_name=REPO,tree_sha=tree,parent_sha=parent,message=message)['sha']

    def compare_and_swap(self, branch, expected, commit):
        require(branch == BRANCH, 'WRITE_SCOPE')
        require(all(re.fullmatch('[a-f0-9]{40}',s) for s in (expected,commit)), 'SHA')
        return self._call('update_ref',repository_full_name=REPO,branch_name=branch,expected_sha=expected,sha=commit,force=False).get('success') is True
