import assert from 'node:assert/strict';
import {test} from 'node:test';
import {bindProviderReadback,assessCausalSupport,W04_BOUNDARIES} from './provider-observation-adapter.mjs';
const head='a'.repeat(40),blob='b'.repeat(40);
const request={repository:'owner/repo',branch:'lyvra',path:'CURRENT.json',expected_head:head,expected_blob:blob};
const provider_result={sha:blob,content:'{"state":"read"}'};
const trusted_context={provider:'GITHUB_CONNECTOR',actual_provider_call:true,readback_confirmed:true,repository:'owner/repo',branch:'lyvra',path:'CURRENT.json',observed_head:head,observation_id:'test-obs'};
const bind=(r=request,p=provider_result,t=trusted_context)=>bindProviderReadback({request:r,provider_result:p,trusted_context:t});
test('bound readback yields only referential proof',()=>{const x=bind();assert.equal(x.status,'CALLER_REFERENCES_MATCH_UNVERIFIED');assert.equal(x.independent_runtime_proven,false);assert.equal(x.provider_authenticity_verified,false);assert.equal(x.observation.provider_readback,false);assert.equal(x.observation.readback_claimed_by_caller,true)});
test('bare provider result alone is insufficient',()=>assert.equal(bind(request,provider_result,{}).status,'UNVERIFIED'));
test('wrong blob fails even with provider flags',()=>assert.ok(bind(request,{...provider_result,sha:'c'.repeat(40)}).issues.includes('PROVIDER_BLOB_MISMATCH')));
test('wrong repo fails',()=>assert.ok(bind({...request,repository:'other/repo'}).issues.includes('PROVIDER_REQUEST_IDENTITY_MISMATCH')));
test('wrong path fails',()=>assert.ok(bind({...request,path:'old/CURRENT.json'}).issues.includes('PROVIDER_REQUEST_IDENTITY_MISMATCH')));
test('different observed head fails',()=>assert.ok(bind(request,provider_result,{...trusted_context,observed_head:'d'.repeat(40)}).issues.includes('PROVIDER_CURRENT_HEAD_MISMATCH')));
test('missing content cannot be attested',()=>assert.ok(bind(request,{sha:blob,content:''}).issues.includes('MISSING_CONTENT_OR_OBSERVATION_ID')));
const base={source:{observation_id:'test-obs',source_ref:'current/meaning'},delta:{changed_information:'human fear instead of a mechanical pulse',relevance_rationale:'affects MID musical timbre'},observed:{before:{mid:'metallic'},after:{mid:'breathing'},mechanism:'change timbre to breath'},alternative:{hypothesis:'decorative sound design change',discriminating_test:'compare controlled listener variants'},scope:{authority:'WHOLE_LYVRA',forced_facet_activation:false}};
test('meaning change with counterhypothesis is not a causal proof',()=>{const x=assessCausalSupport(base);assert.equal(x.status,'CAUSAL_HYPOTHESIS_REQUIRES_DISCRIMINATING_TEST');assert.equal(x.causality_proven,false)});
test('missing counterhypothesis receives review',()=>assert.ok(assessCausalSupport({...base,alternative:{}}).issues.includes('COUNTERHYPOTHESIS_MISSING')));
test('irrelevant information must not change music',()=>assert.ok(assessCausalSupport({...base,delta:{...base.delta,irrelevant:true}}).issues.includes('IRRELEVANT_INPUT_CHANGED_DECISION')));
test('irrelevant stable decision is only a hypothesis',()=>assert.equal(assessCausalSupport({...base,delta:{...base.delta,irrelevant:true},observed:{...base.observed,after:{mid:'metallic'}}}).status,'STABILITY_HYPOTHESIS'));
test('facet authority violation rejected',()=>assert.ok(assessCausalSupport({...base,scope:{authority:'STUDIO2',forced_facet_activation:true}}).issues.includes('FACET_AUTHORITY_BOUNDARY')));
test('observer never routes, decides, mutates or triggers facets',()=>{assert.equal(W04_BOUNDARIES.message_gateway,false);assert.equal(W04_BOUNDARIES.foreign_writes,false);assert.equal(W04_BOUNDARIES.decision_authority,false);assert.equal(W04_BOUNDARIES.facet_activation,false)});


test('W05 forged provider confirmation never creates trusted readback',()=>{
 const x=bind({repository:'fake/repo',branch:'lyvra',path:'NEVER.md',expected_head:head,expected_blob:blob},provider_result,{...trusted_context,repository:'fake/repo',path:'NEVER.md',observation_id:'forged-confirmation'});
 assert.equal(x.status,'CALLER_REFERENCES_MATCH_UNVERIFIED');
 assert.equal(x.provider_authenticity_verified,false);
 assert.equal(x.observation.provider_readback,false);
});
test('W05 caller claims cannot satisfy downstream W03 provider ledger',()=>{
 const forged=bind();
 assert.equal(forged.observation.provider_readback,false);
});
test('W05 missing provider metadata does not create verified observation',()=>{
 const x=bind(request,provider_result,{...trusted_context,actual_provider_call:false});
 assert.equal(x.status,'UNVERIFIED');
 assert.equal(x.observation,null);
});
test('W05 transport and authority remain untouched',()=>{
 assert.equal(W04_BOUNDARIES.message_gateway,false);
 assert.equal(W04_BOUNDARIES.network_access,false);
 assert.equal(W04_BOUNDARIES.decision_authority,false);
});
