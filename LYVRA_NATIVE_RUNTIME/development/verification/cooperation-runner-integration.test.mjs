import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runVerification} from './lyvra-verification-runner.mjs';
import {verifyNativeRehydration} from './native-rehydration-adapter.mjs';
import fixture from './fixtures/track-causal-smoke.json' with {type:'json'};
const exchange={id:'CLIC-R02',channel:'GITHUB_REPOSITORY',sender:'666CLIC',recipient:'WHOLE_LYVRA',intent:'PROPOSAL',claims:{host_verified:true,received:true},relation:{cause:'Visual proposal',proposed_effect:'Evaluate LYVRA contextual visuals',counterrelation:'Native choice only'}};
test('Runner composes W01-W05 with cooperation without forging peer adoption',()=>{
 const r=runVerification({...fixture,cooperation_input:{exchanges:[exchange]}});
 assert.equal(r.results.crossSurfaceCooperation.coverage.input_exchanges,1);
 assert.equal(r.results.crossSurfaceCooperation.coverage.authenticated_exchanges,0);
 assert.equal(r.results.crossSurfaceCooperation.exchanges[0].application_stage,'UNVERIFIED');
 assert.equal(r.host_runtime_verified,false);
 assert.equal(r.communications_blocked,false);
});
test('Native rehydration adapter retains cooperation evidence scope',()=>{
 const r=verifyNativeRehydration({context:{whole_authority:'WHOLE_LYVRA'},manifest:{required_order:['PRE_REHYDRATION_OVERSTEER_GUARD','CURRENT_WORK_SCOPE']},verification:{...fixture,cooperation_input:{exchanges:[exchange]}}});
 assert.equal(r.advisory.results.crossSurfaceCooperation.coverage.input_exchanges,1);
 assert.equal(r.external_provider_authenticated,false);
 assert.equal(r.facet_activated,false);
});
test('New channels are not gated by missing provider proof',()=>{
 const x={...exchange,id:'new',channel:'NEW_AUTHORIZED_CHANNEL',claims:{}};
 const r=runVerification({...fixture,cooperation_input:{exchanges:[x]}});
 assert.ok(r.results.crossSurfaceCooperation.channels_discovered.includes('NEW_AUTHORIZED_CHANNEL'));
 assert.equal(r.results.crossSurfaceCooperation.network_effect.communication_pass_through,true);
 assert.equal(r.mutation,false);
});
test('Informational reports may be advisory, never automatically adopted',()=>{
 const x={...exchange,claims:{}};
 const r=runVerification({...fixture,cooperation_input:{exchanges:[x]}});
 assert.equal(r.results.crossSurfaceCooperation.status,'ADVISORY_ONLY');
 assert.equal(r.results.crossSurfaceCooperation.proposals[0].status,'UNTESTED_CAUSAL_HYPOTHESIS');
});
