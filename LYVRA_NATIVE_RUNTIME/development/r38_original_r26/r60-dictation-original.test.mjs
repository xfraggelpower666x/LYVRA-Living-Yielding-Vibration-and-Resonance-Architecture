import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {correct,defaultState,propose,recordCorrection,saveState,loadState} from './dictation.mjs';

test('original contextual LYVRA dictation corrects observed name with music context',()=>{
 const r=correct('Lübber Track Design',defaultState());
 assert.equal(r.text,'LYVRA Track Design');assert.equal(r.applied.length,1);
});
test('original context fence avoids editing unrelated street',()=>{
 const r=correct('Die Lübber Straße',defaultState());
 assert.equal(r.text,'Die Lübber Straße');assert.equal(r.withheld[0].reason,'CONTEXT_NOT_ESTABLISHED');
});
test('original missing context never silently rewrites creator words',()=>{
 const r=correct('Das ist Lübber',defaultState());assert.equal(r.text,'Das ist Lübber');
});
test('original observed Libra corrected only with known music context',()=>{
 assert.equal(correct('Libra Musik',defaultState()).text,'LYVRA Musik');
});
test('original same name repeated has no second uncontrolled mutation',()=>{
 assert.equal(correct('Lübber Musik. Lübber Musik.',defaultState()).text,'LYVRA Musik. LYVRA Musik.');
});
test('original proposal stays pending and does not modify active rules',()=>{
 const s=defaultState(), t=propose(s,{observed:'Livvah',canonical:'LYVRA',evidence:'CREATOR_PENDING'});
 assert.equal(s.proposals.length,0);assert.equal(t.proposals.length,1);
 assert.equal(t.proposals[0].state,'PENDING_CREATOR_OR_REPLICATED_EVIDENCE');
 assert.equal(correct('Livvah Musik',t).text,'Livvah Musik');
});
test('original correction appends evidence without mutating incoming registry',()=>{
 const s=defaultState(),t=recordCorrection(s,{source:'R60 local functional test',observed:'Lübber',canonical:'LYVRA'});
 assert.equal(s.ledger.length,0);assert.equal(t.ledger.length,1);assert.equal(t.ledger[0].seq,1);
});
test('original JSON save/load performs real local file write and readback',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'lyvra-r60-'));
 try{ const path=join(temp,'nested','dictation-state.json'),state=defaultState();
  const saved=await saveState(path,state);const loaded=await loadState(path);
  assert.deepEqual(saved,state);assert.deepEqual(loaded,state);
  assert.equal(JSON.parse(await readFile(path,'utf8')).schema,'LYVRA_DICTATION_LEARNING_v1');
 }finally{await rm(temp,{recursive:true,force:true});}
});
test('original rejects invalid persisted schemas without writing invalid state',async()=>{
 const temp=await mkdtemp(join(tmpdir(),'lyvra-r60-invalid-'));
 try{ await assert.rejects(()=>saveState(join(temp,'wrong.json'),{schema:'WRONG'}),/Ungültiges Schema/);
 }finally{await rm(temp,{recursive:true,force:true});}
});
