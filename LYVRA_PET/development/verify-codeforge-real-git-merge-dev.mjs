import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
// Real git operations only inside a freshly created disposable temporary repository.
// No GitHub remote, no external branch, no productive merge or deletion.
const dir=await mkdtemp(join(tmpdir(),'lyvra-codeforge-git-'));
function git(...args){const r=spawnSync('git',args,{cwd:dir,encoding:'utf8'});if(r.status!==0)throw Error('git '+args.join(' ')+': '+r.stderr);return r.stdout.trim();}
function tryGit(...args){return spawnSync('git',args,{cwd:dir,encoding:'utf8'});}
async function put(file,value){await writeFile(join(dir,file),value);}
try{
 git('init','-b','main');git('config','user.name','CODEFORGE Test');git('config','user.email','codeforge-test@example.invalid');
 await put('pet.txt','pet base\n');await put('speech.txt','speech base\n');await put('shared.txt','baseline\n');
 git('add','.');git('commit','-m','main base');const base=git('rev-parse','HEAD');
 git('branch','dev-pet');git('branch','dev-speech');git('branch','dev-conflict');
 git('switch','dev-pet');await put('pet.txt','pet developed\n');git('add','.');git('commit','-m','pet');
 git('switch','dev-speech');await put('speech.txt','speech developed\n');git('add','.');git('commit','-m','speech');
 git('switch','main');git('merge','--no-ff','dev-pet','-m','merge pet');
 const afterPet=git('rev-parse','HEAD');assert.notEqual(afterPet,base);
 git('merge','--no-ff','dev-speech','-m','merge speech');
 assert.equal(await readFile(join(dir,'pet.txt'),'utf8'),'pet developed\n');
 assert.equal(await readFile(join(dir,'speech.txt'),'utf8'),'speech developed\n');
 assert.equal(git('branch','--list','dev-conflict').includes('dev-conflict'),true,'unrelated branch retained');
 git('switch','dev-conflict');await put('shared.txt','conflicting change\n');git('add','.');git('commit','-m','concurrent shared edit');
 git('switch','main');await put('shared.txt','main new change\n');git('add','.');git('commit','-m','main shared update');
 const protectedHead=git('rev-parse','HEAD');
 const conflict=tryGit('merge','--no-ff','dev-conflict','-m','unsafe merge');
 assert.notEqual(conflict.status,0,'real conflict must be detected');
 assert.equal(git('rev-parse','HEAD'),protectedHead,'main HEAD not advanced on conflict');
 git('merge','--abort');
 assert.equal(git('rev-parse','HEAD'),protectedHead,'merge abort restores clean main');
 assert.equal(await readFile(join(dir,'shared.txt'),'utf8'),'main new change\n');
 assert.equal(git('branch','--list','dev-conflict').includes('dev-conflict'),true,'unmerged branch cannot be removed by workflow');
 console.log('PASS real isolated git merges of two parallel branches, main preserves both, conflict blocks head change, abort restores main, active branch retained. NO REMOTE MUTATION.');
}finally{await rm(dir,{recursive:true,force:true});}
