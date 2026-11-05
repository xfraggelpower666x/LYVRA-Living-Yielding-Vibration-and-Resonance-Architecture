import test from 'node:test';
import assert from 'node:assert/strict';
import {SIX,planImpactForAnyTask} from './always-on-impact-r09.mjs';
test('R39 original impact hook preserves all six strands, analytics return and no background daemon',()=>{
 const r=planImpactForAnyTask({task:'R60 native R39 work',strands:SIX,authorized:false});
 assert.deepEqual(r.allSixReachable,SIX);assert.equal(r.returnForeground,'LYVRA_ANALYTICS');
 assert.equal(r.hostBackground,false);assert.equal(r.authorizedExecution,false);
});
test('verified observation leads to scoped review, not execution',()=>{
 const r=planImpactForAnyTask({task:'R60 visual integration',observations:[{strand:'VISUAL',evidenceClass:'VERIFIED',source:'R59_GITHUB_READBACK'}]});
 assert.equal(r.impact[0].action,'REVIEW_FOR_SCOPED_INTEGRATION');assert.equal(r.authorizedExecution,false);
});
test('hypothesis and contradiction remain held for evidence',()=>{
 const observations=[{strand:'CHARACTER_RELATIONS',evidenceClass:'HYPOTHESIS',source:'isolated original test'},{strand:'RESEARCH',evidenceClass:'CONTRADICTED',source:'isolated original test'}];
 const r=planImpactForAnyTask({task:'R60 evidence classification',observations});
 assert.ok(r.impact.every(e=>e.action==='HOLD_FOR_EVIDENCE'));
});
test('original impact hook requires source provenance and valid strand',()=>{
 assert.throws(()=>planImpactForAnyTask({task:'R60',observations:[{strand:'RESEARCH',evidenceClass:'VERIFIED'}]}),/PROVENANCE_REQUIRED/);
 assert.throws(()=>planImpactForAnyTask({task:'R60',observations:[{strand:'666CLIC',evidenceClass:'VERIFIED',source:'x'}]}),/PROVENANCE_REQUIRED/);
});
