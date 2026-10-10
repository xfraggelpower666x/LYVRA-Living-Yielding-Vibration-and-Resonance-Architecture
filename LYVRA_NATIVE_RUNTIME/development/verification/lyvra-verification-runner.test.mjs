import assert from 'node:assert/strict';
import {test} from 'node:test';
import {runVerification,RUNNER_BOUNDARIES} from './lyvra-verification-runner.mjs';
import fixture from './fixtures/track-causal-smoke.json' with {type:'json'};
test('end-to-end runner emits a structured advisory report',()=>{
 const r=runVerification(fixture);
 assert.equal(r.owner,'WHOLE_LYVRA');
 assert.equal(r.results.communication.stage,'PEER_READBACK');
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
