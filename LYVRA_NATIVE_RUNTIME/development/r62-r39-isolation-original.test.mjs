import test from 'node:test';
import assert from 'node:assert/strict';
import {executeR39OriginalBridge,verifyOriginalContinuity} from './r39-native-original-bridge.mjs';
const head='6337840188b0f2b15ef070f9872f65b0ae2bba53';
const pointerSha='87b6d6cfd400e3866b211bb8b49d683098fbff65';
const inputs={dictation:{text:'Lübber Musik',trustedSpeech:true},analytics:{kind:'RESEARCH',sourceId:'R62_REAL_ORIGINAL',sourceRevision:head,observedAt:'2026-11-06',contentDigest:'a'.repeat(64),assertion:'Original-local-check',costUSD:0},learning:{problemKey:'R62_REAL',strand:'CHARACTER_RELATIONS',context:{source:'original'}},visual:{command:'LYVRA PARALLEL R62 WEITER'},research:{tool:'TinyFish',operation:'Fetch',costChecked:false}};
test('real R39 original bridge isolates bad Analytics evidence without dropping any other port',async()=>{
  const r=await executeR39OriginalBridge({head,pointerSha,inputs:{...inputs,analytics:{...inputs.analytics,contentDigest:'bad'}},lineageId:'R62_LOCAL',conversationAnchor:'R62 Original integration'});
  assert.equal(r.execution.results.length,6);
  const byId=Object.fromEntries(r.execution.results.map(x=>[x.id,x]));
  assert.equal(byId.ANALYTICS.status,'INPUT_ORIGINAL_FUNCTION_BLOCKED');
  assert.match(byId.ANALYTICS.reason,/ANALYTICS_EVIDENCE_INVALID/);
  for(const id of ['DICTATION','CHARACTER_RELATIONS','VISUAL','INTERRUPTION_CONTINUITY','RESEARCH']) assert.equal(byId[id].status,'ORIGINAL_R26_FUNCTION_EXECUTED');
  assert.equal(r.execution.hostGatesOpen,18);assert.equal(r.execution.productiveWrites,0);assert.equal(r.returnFacet,'LYVRA_ANALYTICS');
});
test('real R39 original bridge keeps research cost unverified while other five original ports execute',async()=>{
  const r=await executeR39OriginalBridge({head,pointerSha,inputs,lineageId:'R62_LOCAL',conversationAnchor:'R62 Original integration'});
  assert.ok(r.execution.results.every(x=>x.status==='ORIGINAL_R26_FUNCTION_EXECUTED'));
  const research=r.execution.results.find(x=>x.id==='RESEARCH');
  assert.equal(research.value.allowed,false);assert.equal(research.value.status,'COST_UNVERIFIED');
  assert.equal(r.pluginHostVerified,false);assert.equal(r.productiveWrites,0);
});
test('real original continuity returns scoped copy-only handoff without claiming persistence',()=>{
  const r=verifyOriginalContinuity({head,lineageId:'R62_LOCAL',conversationAnchor:'R62 scope proof'});
  assert.equal(r.receipt.status,'COPY_ONLY_PARTIAL');assert.equal(r.receipt.strands.length,6);
  assert.equal(r.independentHostReadback,false);assert.equal(r.handoff.payload.hostReadback,'NOT_VERIFIED');
});
