import test from 'node:test';
import assert from 'node:assert/strict';
import {ingestAnalyticsEvidence,researchCostGate,newLearningRegistry,evaluateReuse,learningProbe} from './r39-r26-functional-extracts.mjs';
const sample={kind:'RESEARCH',sourceId:'R60_ORIGINAL_SOURCE',sourceRevision:'6337840188b0',observedAt:'2026-11-05',contentDigest:'a'.repeat(64),assertion:'Original module source evidence',costUSD:0};
test('original R39 Analytics preserves source provenance without host acceptance',()=>{
 const a=ingestAnalyticsEvidence(sample);assert.equal(a.sourceId,'R60_ORIGINAL_SOURCE');assert.equal(a.independentHostVerification,false);assert.equal(a.trackDesignTakeover,false);assert.equal(a.wholeAuthority,'LYVRA_ONLY');
});
test('original Analytics does not promote unverified validation',()=>{
 assert.throws(()=>ingestAnalyticsEvidence({...sample,confidence:'VALIDATED'}),/UNVERIFIED_PROMOTION/);
});
test('original Analytics rejects extra cost and bad digest',()=>{
 assert.throws(()=>ingestAnalyticsEvidence({...sample,costUSD:0.01}),/ANALYTICS_EVIDENCE_INVALID/);
 assert.throws(()=>ingestAnalyticsEvidence({...sample,contentDigest:'bad'}),/ANALYTICS_EVIDENCE_INVALID/);
});
test('original Research checks operation-specific zero cost instead of guessing',()=>{
 assert.deepEqual(researchCostGate({tool:'TinyFish',operation:'Fetch',priceUSD:0,costChecked:true}),{allowed:true,status:'ZERO_COST_VERIFIED_FOR_OPERATION'});
 assert.equal(researchCostGate({tool:'TinyFish',operation:'Fetch'}).allowed,false);
});
test('original Research rejects paid operation without owner approval',()=>{
 assert.equal(researchCostGate({tool:'TinyFish',operation:'Fetch',priceUSD:0.05,costChecked:true}).status,'ZERO_ADDITIONAL_COST_BLOCK');
});
test('original Learning registry retains all six strands and zero writes',()=>{
 const a=newLearningRegistry();assert.equal(a.strands.length,6);assert.equal(a.automaticPromotion,false);assert.equal(a.productiveWrites,0);assert.equal(a.returnForeground,'LYVRA_ANALYTICS');
});
test('original Character/causal Learning stays read-only on empty evidence',()=>{
 const a=learningProbe({problemKey:'R60_CHARACTER_CONTINUITY',strand:'CHARACTER_RELATIONS',context:{stage:'source'}});
 assert.equal(a.automaticExecute,false);assert.equal(a.proposals.length,0);assert.equal(a.codeforgeReview,'PENDING_EVIDENCE_CHECK');
});
test('original reuse marks outdated evidence stale, not executable',()=>{
 const registry=newLearningRegistry();registry.entries.push({problemKey:'R60',conditions:{work:'visual'},caseId:'case1',method:'original',stage:'VALIDATED',source:'test',sourceRevision:'older',evidenceId:'x',observedOutcome:'SUCCESS',outcomeReadback:'record'});
 const result=evaluateReuse(registry,{problemKey:'R60',strand:'VISUAL',context:{work:'visual'},sourceRevision:'newer'});
 assert.equal(result.proposals.length,0);assert.equal(result.matchingCases[0].confidenceClass,'STALE_REVALIDATE');assert.equal(result.automaticWrites,false);
});
