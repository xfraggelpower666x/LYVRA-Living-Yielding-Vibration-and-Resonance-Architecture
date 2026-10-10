import {test} from 'node:test';
import assert from 'node:assert/strict';
import {inspectCooperation,COOPERATION_BOUNDARY} from './cooperation-continuity-verifier.mjs';
const r02={id:'CLIC-LYVRA-VISUAL-DEVELOPMENT-REPORT-20261010-R02',channel:'GITHUB_REPO_REFERENCE',sender:'666CLIC',recipient:'WHOLE_LYVRA',intent:'PROPOSAL',scope_owner:'FOREIGN_SYSTEM',source_ref:'CLIC/outbox/R02',claims:{peer_readback:true,received:true},relation:{cause:'Proposal offers contextual visual intelligence',proposed_effect:'LYVRA may evaluate existing visual facets',counterrelation:'No automatic adoption'}};
test('CLIC R02 exchange cannot become authenticated by caller flags',()=>{const r=inspectCooperation({exchanges:[r02]});assert.equal(r.coverage.authenticated_exchanges,0);assert.equal(r.exchanges[0].evidence_tier,'NOT_AUTHENTICATED');assert.equal(r.exchanges[0].application_stage,'UNVERIFIED')});
test('new channels remain valid observation candidates',()=>{const r=inspectCooperation({exchanges:[{...r02,channel:'UNKNOWN_FUTURE_AUTHORIZED_CHANNEL'}]});assert.ok(r.channels_discovered.includes('UNKNOWN_FUTURE_AUTHORIZED_CHANNEL'));assert.equal(r.network_effect.new_channel_rejected,false)});
test('worker failure cannot be a communication gate',()=>{const r=inspectCooperation({});assert.equal(r.network_effect.worker_failure_must_not_block,true);assert.equal(r.network_effect.communication_pass_through,true);assert.equal(COOPERATION_BOUNDARY.gatekeeper,false)});
test('irrelevant Studio UI event cannot mutate Track Design',()=>{const r=inspectCooperation({exchanges:[{...r02,relevance:'IRRELEVANT'}]});assert.ok(r.issues.some(x=>x.code==='IRRELEVANT_INPUT_MUST_NOT_CAUSE_MUTATION'));assert.equal(r.mutation,false)});
test('new hypothesis is proposed without being promoted',()=>{const r=inspectCooperation({exchanges:[r02]});assert.equal(r.proposals[0].status,'UNTESTED_CAUSAL_HYPOTHESIS');assert.equal(r.proposals[0].decision,'LYVRA_ONLY')});
test('missing counterrelation is visible',()=>{const x=structuredClone(r02);delete x.relation.counterrelation;const r=inspectCooperation({exchanges:[x]});assert.ok(r.issues.some(x=>x.code==='COUNTERRELATION_NOT_SUPPLIED'))});
test('other facets cannot be silently foregrounded',()=>{const r=inspectCooperation({active_facets:['TRACK_DESIGN'],exchanges:[{...r02,target_facet:'MUSIC_ANALYTICS'}]});assert.ok(r.issues.some(x=>x.code==='TARGET_FACET_NOT_ACTIVE_NO_AUTOACTIVATION'));assert.equal(r.network_effect.facet_activation,false)});
test('out-of-scope owner reported without rewriting message',()=>{const r=inspectCooperation({exchanges:[{...r02,scope_owner:'WORKER'}]});assert.ok(r.issues.some(x=>x.code==='UNRESOLVED_SCOPE_OWNER'));assert.equal(r.exchanges[0].sender,'666CLIC')});
test('supersession requires traceable matching predecessor',()=>{const r=inspectCooperation({exchanges:[{...r02,supersedes:'MISSING-R01'}]});assert.ok(r.issues.some(x=>x.code==='SUPERSEDED_REFERENCE_NOT_PRESENT'))});
test('supersession identity present can be retained without pretending adoption',()=>{const r=inspectCooperation({exchanges:[{...r02,id:'R01'}, {...r02,id:'R02',supersedes:'R01'}]});assert.ok(!r.issues.some(x=>x.code==='SUPERSEDED_REFERENCE_NOT_PRESENT'));assert.equal(r.coverage.host_verified_exchanges,0)});
test('duplicate exchange identifiers are detected',()=>{const r=inspectCooperation({exchanges:[r02,r02]});assert.ok(r.issues.some(x=>x.code==='DUPLICATE_EXCHANGE_ID'))});
test('pet and Web dashboards remain distinct surfaces',()=>{const r=inspectCooperation({exchanges:[{...r02,id:'PET',channel:'PET_WORKER'},{...r02,id:'WEB',channel:'WEB_DASHBOARD'}]});assert.deepEqual(r.channels_discovered,['PET_WORKER','WEB_DASHBOARD']);assert.equal(r.network_effect.foreign_mutation,false)});

test('ordinary proposal without unsupported claims is advisory not a defect',()=>{
 const x=structuredClone(r02);x.claims={};x.relation={cause:'A visual relation was proposed',proposed_effect:'Evaluate LYVRA contextual presentation',counterrelation:'No automatic adoption'};
 const r=inspectCooperation({exchanges:[x]});
 assert.equal(r.status,'ADVISORY_ONLY');
 assert.ok(r.observations.some(x=>x.code==='MESSAGE_NOT_AUTOMATIC_AUTHORITY'));
 assert.ok(!r.issues.some(x=>x.code==='MESSAGE_NOT_AUTOMATIC_AUTHORITY'));
});
