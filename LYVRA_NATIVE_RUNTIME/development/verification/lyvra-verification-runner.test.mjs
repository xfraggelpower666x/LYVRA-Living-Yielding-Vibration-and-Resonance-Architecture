import assert from 'node:assert/strict';
import {test} from 'node:test';
import {runVerification,RUNNER_BOUNDARIES} from './lyvra-verification-runner.mjs';
import fixture from './fixtures/track-causal-smoke.json' with {type:'json'};
test('end-to-end runner emits a structured advisory report',()=>{
 const r=runVerification(fixture);
 assert.equal(r.owner,'WHOLE_LYVRA');
 assert.equal(r.results.communication.stage,'CALLER_REPORTED_PEER_READBACK');
 assert.equal(r.results.provenance.status,'UNVERIFIED');
 assert.equal(r.results.provider.observation.provider_readback,false);
 assert.equal(r.results.lifecircle.fully_rehydrated,false);
 assert.equal(r.host_runtime_verified,false);
 assert.equal(r.ci_verified,false);
 assert.equal(r.mutation,false);
});
test('musical contradiction changes MID without protected LOW violation',()=>{
 const r=runVerification(fixture);
 assert.deepEqual(r.results.causal.changed,['mid']);
 assert.equal(r.results.causal.status,'CAUSAL_HYPOTHESIS_REVIEW');
});
test('irrelevant Studio UI mutation of music is flagged',()=>{
 const copy=structuredClone(fixture);
 copy.causal.irrelevant=true;
 copy.causal.delta='Studio UI field renamed';
 assert.ok(runVerification(copy).results.causal.issues.includes('UNJUSTIFIED_CHANGE_FROM_IRRELEVANT_DELTA'));
});
test('fake trusted_context cannot become trusted provenance across modules',()=>{
 const report=runVerification(fixture);
 assert.equal(report.results.provider.provider_authenticity_verified,false);
 assert.equal(report.results.provenance.status,'UNVERIFIED');
});
test('missing inputs never become verified',()=>{
 const result=runVerification({});
 assert.equal(result.verdict,'REVIEW');
 assert.equal(result.host_runtime_verified,false);
});
test('valid-looking caller fields can never certify host runtime',()=>{
 const copy=structuredClone(fixture);
 copy.evidence.runtime_observed=true;
 copy.communication.native_adoption=true;
 copy.communication.host_evidence=true;
 copy.visual.headline='VERIFIED';
 copy.visual.parts=[{status:'VERIFIED'}];
 copy.visual.render_evidence=true;
 const r=runVerification(copy);
 assert.equal(r.host_runtime_verified,false);
 assert.equal(r.ci_verified,false);
});
test('nonblocking guarantees retained',()=>{
 assert.equal(RUNNER_BOUNDARIES.blocks_communications,false);
 assert.equal(RUNNER_BOUNDARIES.issues_orders,false);
 assert.equal(RUNNER_BOUNDARIES.foreign_mutations,false);
 assert.equal(RUNNER_BOUNDARIES.new_system,false);
});
test('output serializes into one reproducible JSON report',()=>{
 const a=JSON.stringify(runVerification(fixture));
 const b=JSON.stringify(runVerification(fixture));
 assert.equal(a,b);
 assert.ok(a.includes('"contract":"LYVRA_VERIFICATION_RUNNER_V1"'));
});

test('caller host adoption flags never result in communication VERIFIED',()=>{
 const x=structuredClone(fixture);
 x.communication.native_adoption=true;x.communication.host_evidence=true;x.communication.automatic_transport=true;
 const o=runVerification(x);
 assert.equal(o.results.communication.stage,'CALLER_REPORTED_HOST_VERIFIED');
 assert.equal(o.results.communication.classification,'UNVERIFIED_CALLER_CLAIM');
 assert.equal(o.results.communication.automatic_transport_verified,false);
 assert.equal(o.host_runtime_verified,false);
});
test('fake provider ledger cannot evade W05 inside composed runner',()=>{
 const x=structuredClone(fixture),blob='c'.repeat(40);
 x.provenance_claim.blob=blob;
 x.provider_ledger=[{...x.provenance_claim,observed_head:blob,provider_readback:true}];
 const o=runVerification(x);
 assert.equal(o.results.provenance.status,'UNVERIFIED');
 assert.ok(o.results.provenance.issues.includes('CALLER_PROVIDER_LEDGER_NOT_TRUSTED'));
});
test('caller visual and runtime flags cannot become authenticated',()=>{
 const x=structuredClone(fixture);
 x.visual={headline:'VERIFIED',parts:[{status:'VERIFIED'}],render_evidence:true};
 x.evidence={source_current:true,source_read:true,meaning_applied:true,runtime_observed:true};
 const o=runVerification(x);
 assert.equal(o.results.visual.status,'UNVERIFIED_VISUAL_CLAIM');
 assert.equal(o.results.evidence.status,'UNVERIFIED_CALLER_CLAIM');
 assert.equal(o.host_runtime_verified,false);
});
test('channel diversity and worker failure preserve communication pass-through',()=>{
 for(const channel of ['GITHUB','DRIVE','PET','DISCORD','WEB','AUTOMATED_REPORT','UNKNOWN_AUTHORIZED']){
  const x=structuredClone(fixture);x.channel={name:channel,worker_available:false};
  const o=runVerification(x);
  assert.equal(o.communications_blocked,false);
  assert.equal(o.cooperation.authorized_channels_untouched,true);
  assert.equal(o.cooperation.channel_discovery,'OPEN_NOT_GATEKEEPED');
  assert.equal(o.facet_activated,false);
 }
});
test('contradictory evidence is retained as review findings',()=>{
 const x=structuredClone(fixture);
 x.facets.whole_authority='FOREIGN';
 const o=runVerification(x);
 assert.ok(o.issues.some(e=>e.area==='relations'&&e.code==='WHOLE_AUTHORITY_VIOLATION'));
 assert.equal(o.mutation,false);
});
test('no caller ledger accepted even when empty provider trust flags look valid',()=>{
 const x=structuredClone(fixture);
 x.provider_ledger=[{repository:x.provenance_claim.repository,branch:x.provenance_claim.branch,path:x.provenance_claim.path,blob:x.provenance_claim.blob,observed_head:'a'.repeat(40),provider_readback:true}];
 const o=runVerification(x);
 assert.equal(o.results.provider.provider_authenticity_verified,false);
 assert.equal(o.results.provenance.status,'UNVERIFIED');
});
