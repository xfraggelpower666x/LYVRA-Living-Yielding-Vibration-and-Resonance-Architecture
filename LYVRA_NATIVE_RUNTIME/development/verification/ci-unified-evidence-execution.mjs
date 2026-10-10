// Whole LYVRA unified *CI checkout* evidence execution. Never a host/peer router.
// This combines actual committed-source observations with diagnostic reasoning,
// retaining the strict distinction from independent runtime / provider verification.
import {execFileSync} from 'node:child_process';
import {inspectCheckoutManifest} from './ci-manifest-carrier-readback.mjs';
import {inspectCheckoutPeerReceipt} from './ci-peer-receipt-cooperation.mjs';
import {runTrustedCheckout} from './ci-checkout-readback.mjs';
import {verifyNativeRehydration} from './native-rehydration-adapter.mjs';

const git=(...args)=>execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
export function executeUnifiedCheckoutEvidence({expectedHead}={}){
 const head=git('rev-parse','HEAD');
 if(!expectedHead||expectedHead!==head)throw Error('CHECKOUT_HEAD_MISMATCH');
 const manifest=inspectCheckoutManifest({expectedHead:head});
 const peer=inspectCheckoutPeerReceipt({expectedHead:head});
 const source=runTrustedCheckout({
  expectedHead:head,
  fixturePath:'LYVRA_NATIVE_RUNTIME/development/verification/fixtures/track-causal-smoke.json',
  outputPath:'LYVRA_NATIVE_RUNTIME/development/verification/examples/TRACK_CAUSAL_VERIFICATION_REPORT.json'
 });
 const cooperationInput={exchanges:peer.cooperation.exchanges.map(x=>({
  id:x.id,channel:x.channel,sender:x.sender,recipient:x.recipient,
  intent:x.intent,scope_owner:x.scope_owner,source_ref:x.source_reference,
  relation:x.relation,claims:{}}
 }))};
 // Compose real source observations and the existing LYVRA semantic adapter.
 // Source and peer claims MUST NOT be upgraded to provider/host truth.
 const rehydration=verifyNativeRehydration({
  context:{whole_authority:'WHOLE_LYVRA',guard_passed:false,
   current_pointer_readback:false,current_head_readback:false,specialist_foregrounded:false},
  // Preserve the provider-readback stage topology. These paths are *not*
  // forwarded as authenticated caller carrier receipts or semantic successes.
  manifest:{required_order:manifest.stages.map(x=>x.stage),
   domain_path_map:Object.fromEntries(manifest.stages.filter(x=>x.carrier_results.length)
    .map(x=>[x.stage,x.carrier_results.map(y=>y.path)]))},
  carriers:[],verification:{cooperation_input:cooperationInput}
 });
 const continuity={required_stages:manifest.stages.length,source_readback_stages:manifest.coverage.readback,
  unmapped_stages:manifest.stages.filter(x=>x.coverage==='UNMAPPED').map(x=>x.stage),
  derived_semantics_verified:false,host_fresh_boot_verified:false};
 return {contract:'LYVRA_UNIFIED_CI_EVIDENCE_V1',owner:'WHOLE_LYVRA',
  observed_checkout_head:head,manifest,peer_receipt:peer,track_source:source,
  cooperation:rehydration.advisory.results.crossSurfaceCooperation,
  rehydration_advisory:rehydration,continuity,
  evidence_boundary:{local_git_source_proven:true,remote_provider_authenticated:false,
   peer_remote_current_verified_in_this_run:false,semantic_understanding_verified:false,
   actual_host_execution_verified:false,both_plugin_releases_runtime_verified:false,
   render_visual_or_audio_verified:false},
  no_new_authority:true,no_router:true,communications_blocked:false,
  foreign_mutation:false,facet_activated:false,mutation:false};
}
if(process.argv[1]&&import.meta.url.endsWith(process.argv[1].replaceAll('\\','/'))){
 try{process.stdout.write(JSON.stringify(executeUnifiedCheckoutEvidence({expectedHead:process.env.GITHUB_SHA}),null,2)+'\n')}
 catch(e){console.error('LYVRA_UNIFIED_CI_EVIDENCE_OPEN',String(e.message||e));process.exitCode=2}
}
