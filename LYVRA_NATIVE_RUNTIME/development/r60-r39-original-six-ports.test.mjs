import test from 'node:test';
import assert from 'node:assert/strict';
import {executeR39OriginalBridge,nativeGuardedDictation,verifyOriginalContinuity} from './r39-native-original-bridge.mjs';
const head='6337840188b0f2b15ef070f9872f65b0ae2bba53';
const pointerSha='87b6d6cfd400e3866b211bb8b49d683098fbff65';
const inputs={dictation:{text:'Lübber Musik',trustedSpeech:true},analytics:{kind:'RESEARCH',sourceId:'R60_ORIGINAL',sourceRevision:'R60',observedAt:'2026-11-05',contentDigest:'a'.repeat(64),assertion:'Source-bound original test',costUSD:0},learning:{problemKey:'CHARACTER',strand:'CHARACTER_RELATIONS',context:{scope:'r60'}},visual:{command:'LYVRA VISUAL WEITER'},research:{tool:'TinyFish',operation:'Fetch',priceUSD:0,costChecked:true}};
test('original R39 bridge executes all six real source ports without new host',async()=>{
 const r=await executeR39OriginalBridge({head,pointerSha,ports:{},inputs,lineageId:'R60_LOCAL',conversationAnchor:'R60 original integration'});
 assert.deepEqual(r.execution.results.map(x=>x.id),['DICTATION','ANALYTICS','CHARACTER_RELATIONS','VISUAL','INTERRUPTION_CONTINUITY','RESEARCH']);
 assert.ok(r.execution.results.every(x=>x.status==='ORIGINAL_R26_FUNCTION_EXECUTED'));
 assert.equal(r.execution.results.find(x=>x.id==='DICTATION').value.text,'LYVRA Musik');
 assert.equal(r.execution.results.find(x=>x.id==='ANALYTICS').value.independentHostVerification,false);
 assert.equal(r.execution.results.find(x=>x.id==='CHARACTER_RELATIONS').value.automaticExecute,false);
 assert.equal(r.execution.results.find(x=>x.id==='VISUAL').value.isHostInstalled,false);
 assert.ok(r.execution.results.find(x=>x.id==='VISUAL').value.command.endsWith('Visuelle Führung.'));
 assert.equal(r.execution.results.find(x=>x.id==='INTERRUPTION_CONTINUITY').value.payload.writeStatus,'NOT_ATTEMPTED');
 assert.equal(r.execution.results.find(x=>x.id==='RESEARCH').value.status,'ZERO_COST_VERIFIED_FOR_OPERATION');
 assert.equal(r.originalImpact.hostBackground,false);assert.equal(r.hostGatesOpen,18);assert.equal(r.productiveWrites,0);
 assert.equal(r.pluginHostVerified,false);assert.equal(r.returnFacet,'LYVRA_ANALYTICS');
});
test('untrusted speech cannot auto rewrite and protected code is not changed',()=>{
 const plain=nativeGuardedDictation('Lübber Musik',undefined,{trustedSpeech:false});
 assert.equal(plain.text,'Lübber Musik');
 const protectedText=nativeGuardedDictation('Lübber Musik and `Lübber Musik`',undefined,{trustedSpeech:true});
 assert.equal(protectedText.text,'LYVRA Musik and `Lübber Musik`');
});
test('original R39 handoff requires real lineage and remains copy-only without host readback',()=>{
 const c=verifyOriginalContinuity({head,lineageId:'R60_LOCAL',conversationAnchor:'R60 checkpoint'});
 assert.equal(c.receipt.status,'COPY_ONLY_PARTIAL');assert.equal(c.receipt.returnForeground,'LYVRA_ANALYTICS');assert.equal(c.receipt.strands.length,6);
 assert.equal(c.productiveWrites,0);
});
test('original bridge does not invent zero-cost approval if operation is unpriced',async()=>{
 const r=await executeR39OriginalBridge({head,pointerSha,ports:{},inputs:{...inputs,research:{tool:'TinyFish',operation:'Fetch'}},lineageId:'R60_LOCAL'});
 assert.equal(r.execution.results.find(x=>x.id==='RESEARCH').value.allowed,false);
 assert.equal(r.execution.results.find(x=>x.id==='RESEARCH').value.status,'COST_UNVERIFIED');
});
