import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {executeUnifiedCheckoutEvidence} from './ci-unified-evidence-execution.mjs';
const head=()=>execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
const manifestTopology=()=>{const m=JSON.parse(execFileSync('git',['show','HEAD:LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json'],{encoding:'utf8'}));return {stages:m.required_order,unmapped:m.required_order.filter(stage=>!m.domain_path_map[stage]||Array.isArray(m.domain_path_map[stage])&&m.domain_path_map[stage].length===0)};};
test('whole manifest, CLIC receipt, track source, and native diagnostics compose',()=>{
 const r=executeUnifiedCheckoutEvidence({expectedHead:head()});
 assert.equal(r.contract,'LYVRA_UNIFIED_CI_EVIDENCE_V1');
 assert.equal(r.observed_checkout_head,head());
 assert.equal(r.manifest.stages.length,manifestTopology().stages.length);
 assert.equal(r.peer_receipt.local_receipt_worktree_matches_commit,true);
 assert.equal(r.track_source.fixture_worktree_matches_commit,true);
 assert.equal(r.cooperation.coverage.input_exchanges,1);
});
test('verified local Git checkout cannot self promote to remote provider or host',()=>{
 const r=executeUnifiedCheckoutEvidence({expectedHead:head()});
 assert.equal(r.evidence_boundary.local_git_source_proven,true);
 assert.equal(r.evidence_boundary.remote_provider_authenticated,false);
 assert.equal(r.evidence_boundary.actual_host_execution_verified,false);
 assert.equal(r.evidence_boundary.both_plugin_releases_runtime_verified,false);
 assert.equal(r.rehydration_advisory.host_runtime_verified,false);
});
test('whole and sub-LiveCircle semantic verification remains independently open',()=>{
 const r=executeUnifiedCheckoutEvidence({expectedHead:head()});
 assert.equal(r.continuity.derived_semantics_verified,false);
 assert.equal(r.continuity.host_fresh_boot_verified,false);
 assert.equal(r.rehydration_advisory.semantic_rehydration_verified,false);
 assert.equal(r.manifest.coverage.unmapped,manifestTopology().unmapped.length);
 assert.equal(r.rehydration_advisory.advisory.results.lifecircle.mapped,manifestTopology().stages.length-manifestTopology().unmapped.length);
 assert.equal(r.rehydration_advisory.advisory.results.lifecircle.derived.length,manifestTopology().unmapped.length);
 assert.equal(r.rehydration_advisory.advisory.results.lifecircle.missing.length,manifestTopology().stages.length-manifestTopology().unmapped.length);
});
test('CLIC cooperation remains advisory, never automatic peer authority',()=>{
 const r=executeUnifiedCheckoutEvidence({expectedHead:head()});
 assert.equal(r.cooperation.coverage.authenticated_exchanges,0);
 assert.equal(r.cooperation.exchanges[0].source_stage,'CALLER_CLAIM_ONLY');
 assert.ok(!r.cooperation.issues.some(x=>x.code==='CLAIMED_PROGRESS_REQUIRES_INDEPENDENT_EVIDENCE'));
 assert.equal(r.peer_receipt.automatic_delivery_verified,false);
 assert.equal(r.peer_receipt.semantic_adoption_verified,false);
 assert.equal(r.no_new_authority,true);
});
test('real workflow makes no channel intercept or facet mutation',()=>{
 const r=executeUnifiedCheckoutEvidence({expectedHead:head()});
 assert.equal(r.communications_blocked,false);
 assert.equal(r.facet_activated,false);
 assert.equal(r.foreign_mutation,false);
 assert.equal(r.mutation,false);
});
test('forged HEAD cannot pass unified current gate',()=>{
 assert.throws(()=>executeUnifiedCheckoutEvidence({expectedHead:'e'.repeat(40)}),/CHECKOUT_HEAD_MISMATCH/);
});

test('only actual manifest stages are mapped, never elevated to rehydration proof',()=>{
 const r=executeUnifiedCheckoutEvidence({expectedHead:head()});
 const stage=r.rehydration_advisory.advisory.results.lifecircle;
 assert.equal(stage.required,manifestTopology().stages.length);
 assert.equal(stage.mapped,manifestTopology().stages.length-manifestTopology().unmapped.length);
 assert.deepEqual(stage.derived,manifestTopology().unmapped);
 assert.equal(stage.fully_rehydrated,false);
 assert.equal(r.rehydration_advisory.external_provider_authenticated,false);
 assert.equal(r.evidence_boundary.actual_host_execution_verified,false);
});
