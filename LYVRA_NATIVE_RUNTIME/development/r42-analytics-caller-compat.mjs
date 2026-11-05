// R42 — Existing native Analytics selective caller contract, NOT a router or facet migration.
// Source: productive Analytics CAPABILITY_REGISTRY and Speech Design FACET_CONTRACT.
// Host deployment of any future parentage change remains separately governed.
export const REQUIRED_REQUEST_FIELDS=Object.freeze(['CALLER_FACET','TASK','REQUIRED_CAPABILITIES','CONTEXT','EVIDENCE_SCOPE','FRESHNESS_REQUIREMENT','EXPECTED_RESULT','RETURN_TARGET']);
export const SPEECH_CAPABILITIES=Object.freeze(['VOICE_LYRIC_FUNCTION_ANALYSIS','SOURCE_CLASSIFICATION','OWN_RENDER_EVIDENCE_ANALYSIS','CONTRADICTION_ANALYSIS','CONFIDENCE_AND_SCOPE_ANALYSIS','RENDERER_CAPABILITY_CHECK','RENDERER_INTERPRETABILITY_FORECAST','FIELD_RESPONSIBILITY_ANALYSIS','CONTROLLED_AB_TEST_DESIGN','EXPECTED_VS_ACTUAL_ANALYSIS','FRESHNESS_CHECK']);
export const SOURCE_BLOBS=Object.freeze({
  capabilityRegistry:'3af1e58f566bd0b4ff6742ba63d3e5ed8e793ca2',
  speechContract:'ccaf08e6d5bf85837feee24d2f16b6d8650eb012',
  specialistHandoff:'d4293dafed9e0b7da4cee7b94ef9b167ac30bda7'
});
const fail=message=>{throw new TypeError(message)};
export function prepareSelectiveAnalyticsRequest(request,{sourceBlobs=SOURCE_BLOBS}={}){
 if(!request||typeof request!=='object')fail('REQUEST_REQUIRED');
 for(const key of REQUIRED_REQUEST_FIELDS)if(!(key in request)||request[key]===null||request[key]===undefined)fail('REQUIRED_FIELD_'+key);
 if(!Array.isArray(request.REQUIRED_CAPABILITIES)||!request.REQUIRED_CAPABILITIES.length||new Set(request.REQUIRED_CAPABILITIES).size!==request.REQUIRED_CAPABILITIES.length)fail('NONEMPTY_UNIQUE_CAPABILITIES_REQUIRED');
 if(request.CALLER_FACET==='SPEECH_DESIGN'){
   if(request.RETURN_TARGET!=='SPEECH_DESIGN'||request.REQUIRED_CAPABILITIES.some(c=>!SPEECH_CAPABILITIES.includes(c)))fail('SPEECH_SCOPE_OR_RETURN_VIOLATION');
 } else {
   // Other native caller profiles must first be inspected and separately bound.
   fail('CALLER_PROFILE_SOURCE_READBACK_PENDING');
 }
 if(Object.entries(SOURCE_BLOBS).some(([k,v])=>sourceBlobs[k]!==v))fail('NATIVE_SOURCE_SUPERSEDED_REVALIDATE');
 return {schema:'LYVRA_R42_ANALYTICS_SELECTIVE_CALL',request:{...request,REQUIRED_CAPABILITIES:[...request.REQUIRED_CAPABILITIES]},owner:'WHOLE_LYVRA',
  target:'LYVRA_ANALYTICS',returnFacet:request.CALLER_FACET,
  analyticsAuthority:'CENTRAL_SHARED_NATIVE_LYVRA_FACET',
  callerRetainsDomainAuthority:true,hostActionInvoked:false,
  newRouter:false,productiveMigration:false,requiredHostGatesOpen:18,
  sourceBlobs:{...sourceBlobs}};
}
export function verifySelectiveAnalyticsReturn(call,response){
 if(call?.schema!=='LYVRA_R42_ANALYTICS_SELECTIVE_CALL'||response?.caller!==call.request.CALLER_FACET)fail('CALLER_RETURN_MISMATCH');
 if(response.returnTarget!==call.returnFacet)fail('RETURN_TARGET_MISMATCH');
 if(response.authority==='WHOLE_LYVRA'||response.isCompositionAuthority===true)fail('AUTHORITY_ESCALATION');
 if(!response.sourceRef||!response.evidenceClass)fail('RESULT_PROVENANCE_REQUIRED');
 return {schema:'LYVRA_R42_ANALYTICS_RETURN_CHECK',returnTarget:call.returnFacet,evidenceClass:response.evidenceClass,
    evidenceRef:response.sourceRef,decisionAuthority:'LYVRA_ONLY',callersIndependent:true,
    resultClass:'NATIVE_SOURCE_SCOPE_CHECK_ONLY',hostVerified:false};
}
