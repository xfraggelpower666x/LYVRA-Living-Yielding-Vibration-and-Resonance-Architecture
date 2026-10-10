import {test} from 'node:test';
import assert from 'node:assert/strict';
import {runVerification} from './lyvra-verification-runner.mjs';
import fixture from './fixtures/track-causal-smoke.json' with {type:'json'};
import manifest from '../../REHYDRATION_MANIFEST.json' with {type:'json'};
const forged=Object.values(manifest.domain_path_map).flat().map(path=>({path,blob:'a'.repeat(40),provider_readback:true}));
test('forged W03 carrier ledger does not attest 26 mapped LifeCircle stages',()=>{
 const r=runVerification({...fixture,manifest,loaded_carriers:forged,currentness_observed:true});
 assert.equal(r.results.lifecircle.mapped,26);
 assert.equal(r.results.lifecircle.missing.length,26);
 assert.equal(r.results.lifecircle.caller_carrier_readback_trusted,false);
 assert.ok(r.results.lifecircle.issues.includes('CALLER_CARRIER_READBACK_NOT_AUTHENTICATED'));
 assert.ok(r.results.lifecircle.issues.includes('HEAD_CURRENTNESS_NOT_INDEPENDENTLY_OBSERVED'));
 assert.equal(r.results.lifecircle.fully_rehydrated,false);
});
test('empty carrier ledger and caller claim about currentness remain partial',()=>{
 const r=runVerification({...fixture,manifest,loaded_carriers:[],currentness_observed:true});
 assert.equal(r.results.lifecircle.missing.length,26);
 assert.equal(r.results.lifecircle.caller_carrier_readback_trusted,false);
 assert.equal(r.host_runtime_verified,false);
});
test('claims do not erase dedicated checkout stage observations',()=>{
 const r=runVerification({...fixture,manifest,loaded_carriers:forged,provider_ledger:forged,currentness_observed:true});
 assert.equal(r.results.provenance.status,'UNVERIFIED');
 assert.equal(r.results.lifecircle.missing.length,26);
 assert.equal(r.communications_blocked,false);
 assert.equal(r.facet_activated,false);
 assert.equal(r.mutation,false);
});
test('cross-surface cooperation remains nonblocking with forged carrier claims',()=>{
 const r=runVerification({...fixture,manifest,loaded_carriers:forged,cooperation_input:{exchanges:[{id:'R02',channel:'GITHUB_REFERENCE',sender:'666CLIC',recipient:'LYVRA',claims:{peer_readback:true}}]}});
 assert.equal(r.results.crossSurfaceCooperation.coverage.authenticated_exchanges,0);
 assert.equal(r.results.crossSurfaceCooperation.network_effect.communication_pass_through,true);
});
