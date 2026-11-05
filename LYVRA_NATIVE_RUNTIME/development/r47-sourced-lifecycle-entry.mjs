// R47: actual source-bound invocation of the existing R46/R40 six-strand LifeCircle.
// Read-only source coverage; preserved semantic role boundaries; NEVER whole/host PASS.
import {executeR46FacetLifecycle,R46_GATES} from './r46-facet-lifecycle-execution.mjs';
import originalNew from './r47-six-carrier-original-source-evidence.json' with {type:'json'};
import originalFour from './r46-facet-lifecycle-source-coverage.json' with {type:'json'};
const SHA=/^[a-f0-9]{40}$/;
const newGates=Object.freeze(['CURRENT_INTELLIGENCE_SET','CURRENT_CAPABILITY_RELATIONS','FACET_DNA','REFERENCE_MAPS','CAPABILITY_MAPS','OPEN_VALIDATION_GATES']);
const expect=(condition,code)=>{if(!condition)throw new Error(code);};
export function assembleR47SourceCoverage({head,pointerSha,productiveSourceBlobs={},newReceipt=originalNew,oldReceipt=originalFour}={}){
 expect(SHA.test(head||'')&&SHA.test(pointerSha||''),'FRESH_CURRENT_REQUIRED');
 expect(newReceipt?.source_current_head===head&&newReceipt?.pointer_blob===pointerSha,'R47_SOURCE_CURRENT_MISMATCH');
 expect(oldReceipt?.head===head&&oldReceipt?.pointer_blob===pointerSha,'R46_SOURCE_CURRENT_MISMATCH');
 expect(newReceipt?.gate_evidence?.length===6&&oldReceipt?.provided?.length===4,'TEN_CARRIER_EVIDENCE_REQUIRED');
 const records=[...oldReceipt.provided,...newReceipt.gate_evidence];
 expect(records.length===10&&new Set(records.map(x=>x.gate)).size===10&&R46_GATES.every(x=>records.some(y=>y.gate===x)),'TEN_UNIQUE_GATES_REQUIRED');
 const checked=records.map(r=>{
   const valid=SHA.test(r.blob_sha||'')&&r.current_head===head&&r.complete===true&&
     r.readback_type==='GITHUB_FETCH_FILE'&&typeof r.path==='string'&&
     r.path.startsWith('LYVRA_NATIVE_RUNTIME/')&&r.fetch_ref&&productiveSourceBlobs[r.path]===r.blob_sha;
   expect(valid,'SOURCE_BLOB_READBACK_OR_HEAD_MISMATCH_'+r.gate);
   if(newGates.includes(r.gate))expect(r.semantic_marker&&r.semantic_role&&r.status==='ORIGINAL_SOURCE_MAPPED_READBACK_VERIFIED'&&r.facet_runtime_rehydrated===false,'SEMANTIC_BOUNDARY_MISSING_'+r.gate);
   return r;
 });
 expect(newReceipt.boundaries?.reference_registry_ne_current_authority===true&&newReceipt.boundaries?.sub_lifecircle_ne_whole_rehydration===true,'REFERENCE_OR_SUB_LIFECIRCLE_AUTHORITY_FENCE');
 return {schema:'LYVRA_R47_TEN_ORIGINAL_CARRIERS_SOURCE_VERIFIED',
   currentHead:head,pointerSha,readbacks:checked,covered:10,required:10,
   sourceReadbackComplete:true,semanticRehydrationVerified:false,wholeRehydrationVerified:false,
   currentNativeHostVerified:false,hostGatesOpen:18,productiveWrites:0,
   provenanceOriginalNotAuthority:true,returnAnchor:'ANALYTICS'};
}
export async function executeR47SourcedLifecycle({explicitIntent=false,scope='ALL_SIX',
  head,pointerSha,productiveSourceBlobs={},carrierEvidence={},r40Inputs={},
  execution=executeR46FacetLifecycle}={}){
 expect(explicitIntent===true&&scope==='ALL_SIX','EXPLICIT_TASK_ONLY');
 const provenance=assembleR47SourceCoverage({head,pointerSha,productiveSourceBlobs,...carrierEvidence});
 const r46=await execution({explicitIntent:true,scope:'ALL_SIX',expectedHead:head,
   expectedPointer:pointerSha,wholeCoverage:'PARTIAL',carrierReadbacks:provenance.readbacks,
   r40Inputs,allowPartialSourceWork:true});
 expect(r46?.hostGatesOpen===18&&r46?.productiveWrites===0&&r46?.results?.length===6,'EXISTING_R46_BOUNDARY');
 return {schema:'LYVRA_R47_SOURCE_BOUND_FACET_LIFECIRCLE',provenance,
   results:r46.results,facetSourceCoverage:r46.source,
   status:'SOURCE_BUNDLE_MAPPED_PARTIAL_SEMANTIC_AND_HOST',wholeRehydrated:false,
   nativeHostAcceptance:false,aliveHostAcceptance:false,
   returnAnchor:'ANALYTICS',preservedStrands:r46.sixStrands,
   paused:['POST','SCEERI_MYCEL','PLUGIN_HOST_ACCEPTANCE'],
   r30BacklogOpen:9,hostGatesOpen:18,
   sunoResult:r46.observedSunoResult,productiveWrites:0,
   visualGuidanceAction:r46.visualGuidanceAction};
}
