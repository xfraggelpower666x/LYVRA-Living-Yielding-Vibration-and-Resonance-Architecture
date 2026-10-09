import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
// Disposable, local-only Git repository. Never uses a remote or user branch.
const dir=await mkdtemp(join(tmpdir(),'lyvra-git-cleanup-'));
function run(...args){return spawnSync('git',args,{cwd:dir,encoding:'utf8'});}
function ok(...args){const r=run(...args);assert.equal(r.status,0,r.stderr);return r.stdout.trim();}
try{
 ok('init','-b','main');ok('config','user.name','Isolated Git Test');ok('config','user.email','isolated@example.invalid');
 await writeFile(join(dir,'core.txt'),'base\n');ok('add','.');ok('commit','-m','base');
 ok('switch','-c','dev-complete');await writeFile(join(dir,'done.txt'),'completed\n');ok('add','.');ok('commit','-m','completed feature');const featureSha=ok('rev-parse','HEAD');
 ok('switch','main');ok('merge','--no-ff','dev-complete','-m','integrate');
 const mergeSha=ok('rev-parse','HEAD');assert.notEqual(mergeSha,featureSha);
 assert.equal(ok('merge-base','--is-ancestor',featureSha,'main'),'');
 // Immutable recovery reference before any deletion.
 ok('tag','recovery-validated-main',mergeSha);
 assert.equal(ok('rev-parse','recovery-validated-main'),mergeSha);
 assert.equal(ok('branch','-d','dev-complete').includes('Deleted branch'),true);
 assert.equal(ok('rev-parse','recovery-validated-main'),mergeSha);
 ok('switch','-c','dev-active');await writeFile(join(dir,'unfinished.txt'),'pending\n');ok('add','.');ok('commit','-m','unfinished');
 ok('switch','main');const initialMain=ok('rev-parse','HEAD');
 const deletion=run('branch','-d','dev-active');assert.notEqual(deletion.status,0,'unmerged active branch must resist safe deletion');
 assert.equal(ok('rev-parse','HEAD'),initialMain);
 assert.ok(ok('branch','--list','dev-active').includes('dev-active'));
 console.log('PASS actual disposable git post-merge safe delete and immutable recovery tag; unmerged branch retained; no remote mutation');
}finally{await rm(dir,{recursive:true,force:true});}
