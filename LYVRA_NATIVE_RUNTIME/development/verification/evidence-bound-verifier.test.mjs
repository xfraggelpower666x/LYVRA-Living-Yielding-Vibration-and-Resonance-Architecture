import assert from 'node:assert/strict';
import {test} from 'node:test';
import {inspectClaim,inspectFreshBoot,W02_BOUNDARIES} from './evidence-bound-verifier.mjs';
const head='a'.repeat(40);
const proof=kind=>({kind,ref:'repo/'+kind,source_head:head,observation_id:'test-'+kind});
test('peer readback cannot be inferred from local receipt',()=>{
 const x=inspectClaim({claim:'PEER_DELIVERED',evidence:['SOURCE_CURRENT','SOURCE_CONTENT','LOCAL_RECEIPT'].map(proof)});
 assert.equal(x.status,'REVIEW');
 assert.deepEqual(x.missing,['PEER_READBACK']);
});
test('automatic transport needs independent transport observation',()=>{
 const x=inspectClaim({claim:'AUTOMATIC_TRANSPORT',evidence:['SOURCE_CURRENT','SOURCE_CONTENT','LOCAL_RECEIPT','PEER_READBACK'].map(proof)});
 assert.equal(x.status,'REVIEW');
 assert.deepEqual(x.missing,['TRANSPORT_OBSERVATION']);
});
test('boolean alone never creates runtime proof',()=>{
 const x=inspectClaim({claim:'HOST_VERIFIED',external_readback_verified:true});
 assert.equal(x.status,'REVIEW');
 assert.equal(x.runtime_proven,false);
});
test('complete referenced chain is not an independently proven runtime',()=>{
 const x=inspectClaim({claim:'HOST_VERIFIED',evidence:['SOURCE_CURRENT','SOURCE_CONTENT','MEANING_DECISION','COUNTEREXAMPLE','HOST_OBSERVATION'].map(proof)});
 assert.equal(x.status,'REFERENCES_COMPLETE_UNVERIFIED');
 assert.equal(x.runtime_proven,false);
});
test('unresolved counterevidence prevents promotion',()=>{
 const x=inspectClaim({claim:'SOURCE_READ',evidence:['SOURCE_CURRENT','SOURCE_CONTENT'].map(proof),conflicts:[{reason:'newer supersession'}]});
 assert.equal(x.status,'REVIEW');
 assert.ok(x.issues.includes('COUNTEREVIDENCE_UNRESOLVED'));
});
test('fresh boot with missing current and no counterfactual stays partial',()=>{
 const x=inspectFreshBoot({required_carriers:['MEANING','RELATIONS'],loaded_carriers:[proof('MEANING')]});
 assert.equal(x.status,'PARTIAL');
 assert.ok(x.issues.includes('CURRENT_POINTER_UNVERIFIED'));
 assert.deepEqual(x.missing,['RELATIONS']);
});
test('causal opposite contexts do not imply independent host verification',()=>{
 const x=inspectFreshBoot({current_pointer:proof('CURRENT'),required_carriers:['RELATIONS'],loaded_carriers:[proof('RELATIONS')],semantic_tests:[{context_a_decision:'MID_MOTION',context_b_decision:'LOW_LOCK',counterrelation:'DJ clock',evidence_ref:'test'}],observed_output:true});
 assert.equal(x.status,'EVIDENCE_REFERENCED_NEEDS_INDEPENDENT_RUNTIME_READBACK');
});
test('unknown claim and malformed evidence fail cautiously',()=>{
 assert.equal(inspectClaim({claim:'MAKE_LYVRA_OBEY',evidence:[]}).status,'REVIEW');
 assert.equal(inspectClaim({claim:'SOURCE_READ',evidence:[{kind:'SOURCE_CURRENT'}]}).status,'REVIEW');
});
test('worker never receives authority or communication routing power',()=>{
 assert.equal(W02_BOUNDARIES.decision_authority,false);
 assert.equal(W02_BOUNDARIES.router,false);
 assert.equal(W02_BOUNDARIES.blocking,false);
 assert.equal(W02_BOUNDARIES.foreign_writes,false);
});
