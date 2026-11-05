// R45: existing Track Design / Studio2 -> central Analytics request profiles.
// Read-only preparation; no router, no host execution, no parentage migration.
// Bounds verified in CURRENT Analytics capability registry and original Track music contract.
export const R45_SOURCE=Object.freeze({
 registry:{path:'LYVRA_NATIVE_RUNTIME/facets/analytics/CAPABILITY_REGISTRY.md',sha:'3af1e58f566bd0b4ff6742ba63d3e5ed8e793ca2'},
 music:{path:'LYVRA_NATIVE_RUNTIME/current/music/SEMANTIC_CAUSAL_MUSIC_ANALYTICS.md',sha:'e6c51293d72b56ebc24b8a1e217804da285695de'},
 studio:{path:'LYVRA_NATIVE_RUNTIME/facets/studio2/FACET_CONTRACT.md',sha:'048f6e780c2fc8709d95fbc931d04da286606d69'},
 track:{path:'LYVRA_NATIVE_RUNTIME/current/governance/TRACK_DESIGN_MASTER_BASE_AND_FACET_ADAPTATION.md',sha:'eb8af5f198e28ffdcb802ef4e50afdc015925ae0'},
});
const BUNDLES=Object.freeze({
 TRACK_DESIGN:Object.freeze(['SEMANTIC_PREANALYSIS','CAUSAL_COHERENCE_ANALYSIS','GENRE_DNA_ANALYSIS','MOTOR_RELATION_ANALYSIS','ENERGY_GEOMETRY_ANALYSIS','RENDERER_DRIFT_FORECAST','RENDERER_INTERPRETABILITY_FORECAST','FRESHNESS_CHECK']),
 STUDIO2:Object.freeze(['STUDIO_OPERATION_PREANALYSIS','PRESERVE_MUTATE_ANALYSIS','EDIT_SCOPE_ANALYSIS','OPERATION_CONTROL_CONTEXT_ANALYSIS','POST_OPERATION_RESULT_ANALYSIS','FRESHNESS_CHECK_WHEN_RENDERER_DEPENDENT'])
});
const SHA=/^[a-f0-9]{40}$/;
export function prepareR45Caller({caller,task,capabilities,context,evidenceScope,expectedResult,head,returnTarget,readbacks=[],currentBlobs={}}={}){
 if(!['TRACK_DESIGN','STUDIO2'].includes(caller))throw Error('R45_UNSUPPORTED_CALLER');
 if(!SHA.test(head||''))throw Error('FRESH_WHOLE_HEAD_REQUIRED');
 if(!task||typeof task!=='string'||!context||typeof context!=='object'||!evidenceScope||!expectedResult)throw Error('MISSING_REQUEST_FIELDS');
 if(returnTarget!==caller)throw Error('CALLER_RETURN_FENCE');
 if(!Array.isArray(capabilities)||!capabilities.length||new Set(capabilities).size!==capabilities.length||capabilities.some(x=>!BUNDLES[caller].includes(x)))throw Error('CAPABILITY_SCOPE_FENCE');
 const needed=caller==='STUDIO2'?['registry','music','studio']:['registry','music','track'];
 for(const key of needed){
   const ref=R45_SOURCE[key];
   if(currentBlobs[ref.path]!==ref.sha)throw Error('CURRENT_CARRIER_CHANGED_'+key);
   const sources=readbacks.filter(r=>r?.path===ref.path);
   if(sources.length!==1||sources[0].blob_sha!==ref.sha||sources[0].current_head!==head||
      sources[0].readback_type!=='GITHUB_FETCH_FILE'||sources[0].complete!==true||!sources[0].fetch_ref)throw Error('CURRENT_CARRIER_READBACK_MISSING_'+key);
 }
 return {schema:'LYVRA_R45_SELECTIVE_ANALYTICS_REQUEST_SOURCE_ONLY',callerFacet:caller,target:'LYVRA_ANALYTICS',returnFacet:caller,
  task,capabilities:[...capabilities],context,evidenceScope,expectedResult,
  sourceHead:head,sourceCarriers:needed.map(k=>R45_SOURCE[k]),currentAnalyticsPlacement:'CENTRAL_SHARED_NATIVE_LYVRA_FACET',
  readbackCount:needed.length,callerRetainsDomainAuthority:true,sourceProfileOnly:true,
  hostInvoked:false,hostGatesClosed:0,hostGatesOpen:18,noNewRouter:true,noParentageMigration:true};
}
export function verifyR45CallerReturn(call,{caller,returnTarget,provenance,evidenceClass,compositionAuthority=false}={}){
 if(call?.schema!=='LYVRA_R45_SELECTIVE_ANALYTICS_REQUEST_SOURCE_ONLY'||caller!==call.callerFacet||returnTarget!==call.returnFacet)throw Error('CALLER_OR_RETURN_MISMATCH');
 if(!provenance||!evidenceClass||compositionAuthority)throw Error('PROVENANCE_OR_AUTHORITY_FENCE');
 return {status:'SOURCE_RESULT_PROFILE_ONLY',caller,returnTarget,provenance,evidenceClass,hostVerified:false,productivelyInstalled:false,decisionAuthority:'LYVRA_ONLY'};
}
