// R43 source-bound caller binding, extension of R42 (NOT a new router).
// Caller-provided readback records are checked against fresh productive GitHub
// blob SHAs supplied by the host. An asserted receipt is not a host trace.
import {prepareSelectiveAnalyticsRequest,SOURCE_BLOBS} from './r42-analytics-caller-compat.mjs';
export const R43_PATHS=Object.freeze({
 capabilityRegistry:'LYVRA_NATIVE_RUNTIME/facets/analytics/CAPABILITY_REGISTRY.md',
 speechContract:'LYVRA_NATIVE_RUNTIME/facets/speech_design/FACET_CONTRACT.md',
 specialistHandoff:'LYVRA_NATIVE_RUNTIME/continuity/TRACK_DESIGN_SUNO_STUDIO2_REPO_HANDOFF_CONTRACT.md'
});
const SHA=/^[a-f0-9]{40}$/;
export function prepareR43SelectiveAnalyticsCall(request,{currentHead,sourceReadbacks=[],freshProductiveBlobs={}}={}){
 if(!SHA.test(currentHead||''))throw Error('FRESH_PRODUCTION_HEAD_REQUIRED');
 if(!Array.isArray(sourceReadbacks))throw Error('ORIGINAL_READBACKS_REQUIRED');
 const matched={};
 for(const [key,path] of Object.entries(R43_PATHS)){
   const original=SOURCE_BLOBS[key],current=freshProductiveBlobs[path];
   if(!SHA.test(current||'')||current!==original)throw Error('NATIVE_CALLER_SOURCE_SUPERSEDED_'+key);
   const found=sourceReadbacks.filter(x=>x?.path===path);
   if(found.length!==1)throw Error('MISSING_OR_DUPLICATE_ORIGINAL_READBACK_'+key);
   const r=found[0];
   if(r.blob_sha!==current||r.current_head!==currentHead||r.complete!==true||
      r.readback_type!=='GITHUB_FETCH_FILE'||!r.fetch_ref)throw Error('STALE_OR_UNVERIFIED_CALLER_READBACK_'+key);
   matched[key]=current;
 }
 const call=prepareSelectiveAnalyticsRequest(request,{sourceBlobs:matched});
 return {...call,schema:'LYVRA_R43_FRESH_SOURCE_SELECTIVE_ANALYTICS_CALL',
   verifiedSourceHead:currentHead,sourceReadbackCount:3,
   sourceIntegrationOnly:true,productivePluginHost:false,autoActivateOtherFacets:false,
   hostAcceptanceGatesClosed:0,stillOpenHostGates:18};
}
export function classifyR43CallerEvidence({caller,sourcePaths=[],explicitContract=false,capabilityBundle=false}={}){
 if(typeof caller!=='string'||!caller||!Array.isArray(sourcePaths))throw Error('CALLER_EVIDENCE_INVALID');
 const classification=explicitContract&&capabilityBundle?'EXPLICIT_SOURCE_BOUND_CALLER':
   capabilityBundle?'CAPABILITY_PROFILE_ONLY':'RELATED_NOT_IMPLEMENTED';
 return {caller,classification,sourcePaths:[...sourcePaths],
   permittedLiveInvocation:caller==='SPEECH_DESIGN'&&classification==='EXPLICIT_SOURCE_BOUND_CALLER',
   status:classification==='EXPLICIT_SOURCE_BOUND_CALLER'?'SOURCE_ONLY_NOT_HOST':'COVERAGE_PENDING',
   migrateAnalyticsAuthority:false};
}
