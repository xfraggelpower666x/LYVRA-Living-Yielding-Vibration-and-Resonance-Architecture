import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inspect,release} from './track-mcp-r062.mjs';
const discovery={revision:'live-fixture',models:[{id:'fixture',can_use:true}]};
function draft(){return {mode:'custom',title:'Test',extended:'Dry motor 🌀',style:'Dry motor 🌀',lyrics:'[Outro] Silence',tasteMode:'OFF',taste:'',modelId:'fixture',discoveryRevision:discovery.revision,sourceRevision:'fixture-source',weirdness:86,styleInfluence:86,variety:1,duration:355,durationStrict:false,maxMode:false,translation:[{field:'style',text:'Dry motor 🌀'}],audit:{sourceRevision:'fixture-source',...Object.fromEntries(['motor','relations','pressure','ending','drift','functionalEmoji','extendedTranslation'].map(k=>[k,{status:'PASS',evidence:'synthetic fixture, not audio evidence'}]))}};}
test('UTF16 exact',()=>assert.equal(inspect(draft(),discovery).counts.extended,12));
test('emoji overflow',()=>assert.ok(inspect({...draft(),style:'🌀'.repeat(501)},discovery).errors.includes('LIMIT_style')));
test('86 contextual warning',()=>assert.equal(inspect(draft(),discovery).warnings.length,2));
test('87 needs reason',()=>assert.ok(inspect({...draft(),weirdness:87},discovery).errors.includes('REASON_weirdness')));
test('Taste Off dependency',()=>assert.ok(inspect({...draft(),variety:0,tasteMode:'ON'},discovery).errors.includes('VARIETY_TASTE_CONFLICT')));
test('Taste no invented provider field',()=>assert.ok(inspect({...draft(),tasteMode:'ON'},discovery).errors.includes('TASTE_MANUAL_ROUTE_REQUIRED')));
test('model unavailable',()=>assert.ok(inspect({...draft(),modelId:'missing'},discovery).errors.includes('MODEL_NOT_VERIFIED')));
test('audit required',()=>assert.equal(inspect({...draft(),audit:{}},discovery).status,'HOLD'));
test('translation missing',()=>assert.equal(inspect({...draft(),translation:[]},discovery).status,'HOLD'));
test('strict truncation rejected',()=>assert.equal(inspect({...draft(),durationStrict:true},discovery).status,'HOLD'));
test('approval invalidated by changes',()=>{const d=draft(),a={revision:inspect(d,discovery).revision,explicit:true};assert.equal(release(d,discovery,a).status,'LOCAL_APPROVAL_MATCH');assert.equal(release({...d,title:'Changed'},discovery,a).status,'HOLD');});
test('max needs named consent',()=>{const d={...draft(),maxMode:true};assert.equal(release(d,discovery,{revision:inspect(d,discovery).revision,explicit:true}).status,'HOLD');});
test('no execution',()=>assert.equal(inspect(draft(),discovery).providerExecution,false));
