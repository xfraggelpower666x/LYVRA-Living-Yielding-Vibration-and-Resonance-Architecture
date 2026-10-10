// LYVRA existing-rehydration integration adapter. Explicit call only, never auto-launch.
// Sequence: current context -> oversteer guard -> manifest -> composed advisory runner.
// Input carriers are caller supplied; no provenance claim is promoted without provider evidence.
import {runVerification} from './lyvra-verification-runner.mjs';
export const NATIVE_ADAPTER_BOUNDARY=Object.freeze({owner:'WHOLE_LYVRA',new_system:false,auto_hook:false,facet_activation:false,communication_gate:false,host_verified:false,plugin_released:false,mutation:false});
const asObj=x=>x&&typeof x==='object'&&!Array.isArray(x)?x:{};
export function verifyNativeRehydration({context={},manifest={},carriers=[],verification={}}={}){
 const ctx=asObj(context),issues=[];
 if(ctx.whole_authority!=='WHOLE_LYVRA')issues.push('WHOLE_AUTHORITY_NOT_PINNED');
 if(ctx.guard_passed!==true)issues.push('PRE_REHYDRATION_GUARD_NOT_VERIFIED');
 if(ctx.current_pointer_readback!==true)issues.push('CURRENT_POINTER_READBACK_NOT_VERIFIED');
 if(ctx.current_head_readback!==true)issues.push('CURRENT_HEAD_READBACK_NOT_VERIFIED');
 if(!Array.isArray(manifest.required_order)||manifest.required_order[0]!=='PRE_REHYDRATION_OVERSTEER_GUARD'||manifest.required_order.at(-1)!=='CURRENT_WORK_SCOPE')issues.push('MANIFEST_ORDER_INVALID');
 if(ctx.specialist_foregrounded===true&&!ctx.specialist_evidence_ref)issues.push('SPECIALIST_FOREGROUND_WITHOUT_EVIDENCE');
 // A specialized context may be used to interpret evidence, never to activate a facet.
 const payload={...asObj(verification),manifest,loaded_carriers:Array.isArray(carriers)?carriers:[],currentness_observed:false};
 const advisory=runVerification(payload);
 const currentness=ctx.current_head_readback===true&&ctx.current_pointer_readback===true;
 const rehydrationEvidence=advisory.results.lifecircle;
 return {contract:'LYVRA_NATIVE_REHYDRATION_VERIFY_V1',owner:'WHOLE_LYVRA',status:issues.length?'CONTEXT_REVIEW':'ADVISORY_EXECUTED_SOURCE_ONLY',issues,
  currentness_claimed_by_caller:currentness,manifest_stages:rehydrationEvidence.required??0,
  derived_stages:rehydrationEvidence.derived??[],advisory,semantic_rehydration_verified:false,
  external_provider_authenticated:false,host_runtime_verified:false,plugin_parity_verified:false,
  communication_blocked:false,facet_activated:false,mutation:false};
}
