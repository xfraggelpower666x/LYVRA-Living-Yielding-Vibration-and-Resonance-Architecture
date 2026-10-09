import assert from 'node:assert/strict';

// Executable in-memory model only. Never mutates GitHub branches or production.
class IntegrationQueue {
  constructor(){this.main={sha:'M0',files:{pet:'v0',speech:'v0',dashboard:'v0'}};this.lease=null;this.recovery=[];this.completed=new Map();}
  acquire(owner,expected){if(this.lease||expected!==this.main.sha)return false;this.lease={owner,expected};return true;}
  integrate(work,{backup=true,ci=true,approval=true,parity=true}={}){
    if(this.lease?.owner!==work.id||this.lease.expected!==this.main.sha)return {status:'BLOCKED',reason:'LEASE_OR_HEAD'};
    if(!backup||!ci||!approval||!parity)return {status:'BLOCKED',reason:'GATE_FAILED'};
    if(work.base!==this.main.sha){
      for(const [file,original] of Object.entries(work.baseFiles)){
        if(Object.hasOwn(work.changes,file)&&this.main.files[file]!==original)return {status:'BLOCKED',reason:'SEMANTIC_OR_FILE_CONFLICT'};
      }
    }
    if(Object.keys(work.changes).some(k=>!work.scope.includes(k)))return {status:'BLOCKED',reason:'SCOPE'};
    const prior=structuredClone(this.main);this.recovery.push(prior);
    this.main={sha:'M'+(this.recovery.length),files:{...this.main.files,...work.changes}};
    this.completed.set(work.id,{mergedSha:this.main.sha,recoverySha:prior.sha,cleanup:'PENDING'});
    this.lease=null;
    return {status:'MERGED',head:this.main.sha};
  }
  release(owner){if(this.lease?.owner===owner)this.lease=null;}
  cleanup(id,{activeReferences=[],dependentPRs=[],deployments=[],recoveryVerified=false}={}){
    const record=this.completed.get(id);
    if(!record||!recoveryVerified||activeReferences.length||dependentPRs.length||deployments.length)return 'BLOCKED';
    record.cleanup='ELIGIBLE_FOR_SCOPED_DELETE';return record.cleanup;
  }
}
const q=new IntegrationQueue();
const pet={id:'chat-pet',base:'M0',baseFiles:{pet:'v0'},scope:['pet'],changes:{pet:'v1'}};
const speech={id:'chat-speech',base:'M0',baseFiles:{speech:'v0'},scope:['speech'],changes:{speech:'v1'}};
assert.ok(q.acquire(pet.id,'M0'));
assert.equal(q.acquire(speech.id,'M0'),false,'one serialized main lease');
assert.equal(q.integrate(pet,{backup:false}).status,'BLOCKED');
assert.equal(q.main.sha,'M0','no premature promotion');
assert.equal(q.integrate(pet).status,'MERGED');
assert.equal(q.main.files.speech,'v0','unrelated work preserved');
assert.equal(q.acquire(speech.id,'M0'),false,'stale main CAS denied');
assert.ok(q.acquire(speech.id,'M1'));
assert.equal(q.integrate(speech).status,'MERGED','disjoint changes converge despite stale base');
assert.deepEqual(q.main.files,{pet:'v1',speech:'v1',dashboard:'v0'});
assert.equal(q.recovery.length,2);
assert.equal(q.cleanup(pet.id,{recoveryVerified:true,activeReferences:['active-chat']}),'BLOCKED');
assert.equal(q.cleanup(pet.id,{recoveryVerified:true,deployments:['staging-worker']}),'BLOCKED');
assert.equal(q.cleanup(pet.id,{recoveryVerified:true,dependentPRs:['open-pr']}),'BLOCKED');
assert.equal(q.cleanup(pet.id,{recoveryVerified:false}),'BLOCKED');
assert.equal(q.cleanup(pet.id,{recoveryVerified:true}),'ELIGIBLE_FOR_SCOPED_DELETE');
const conflicting={id:'chat-pet-two',base:'M0',baseFiles:{pet:'v0'},scope:['pet'],changes:{pet:'new-conflict'}};
assert.ok(q.acquire(conflicting.id,'M2'));
assert.equal(q.integrate(conflicting).reason,'SEMANTIC_OR_FILE_CONFLICT');
assert.equal(q.main.files.pet,'v1');
q.release(conflicting.id);
const forbidden={id:'scope-escape',base:'M2',baseFiles:{pet:'v1'},scope:['pet'],changes:{dashboard:'intrusion'}};
assert.ok(q.acquire(forbidden.id,'M2'));
assert.equal(q.integrate(forbidden).reason,'SCOPE');
q.release(forbidden.id);
assert.equal(q.main.sha,'M2');
console.log('PASS modeled serialized main lease, fresh HEAD CAS, disjoint cross-chat convergence, conflict quarantine, scope boundary, recovery and cleanup. MODEL ONLY: no live GitHub branch merge/deletion performed.');
