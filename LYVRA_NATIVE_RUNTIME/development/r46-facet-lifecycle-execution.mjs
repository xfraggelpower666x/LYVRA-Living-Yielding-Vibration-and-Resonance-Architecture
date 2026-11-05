// R46: Bound existing R40 six-facet execution to productive Facet Sub-LifeCircle.
// Explicit task only, read-only, no independent controller/router or plugin-host claim.
// Existing functions are imported (not copied); external host evidence is never fabricated.
import {executeR40ChatWork} from './dual-layer-visual-projection.mjs';
const SHA=/^[a-f0-9]{40}$/;
export const R46_GATES=Object.freeze([
 'WHOLE_CURRENT','FACET_CONTRACT','CURRENT_CAPABILITY_SET','CURRENT_INTELLIGENCE_SET',
 'CURRENT_CAPABILITY_RELATIONS','FACET_DNA','REFERENCE_MAPS','CAPABILITY_MAPS',
 'EVIDENCE_STATUS','OPEN_VALIDATION_GATES'
]);
export const SIX=Object.freeze(['DICTATION','ANALYTICS','CHARACTER_RELATIONS','VISUAL','INTERRUPTION_CONTINUITY','RESEARCH']);
export function assessR46FacetCoverage({head,pointerSha,wholeCoverage='PARTIAL',carrierReadbacks=[]}={}){
 if(!SHA.test(head||'')||!SHA.test(pointerSha||''))throw Error('WHOLE_CURRENT_AND_POINTER_REQUIRED');
 if(!Array.isArray(carrierReadbacks))throw TypeError('CARRIER_LIST_REQUIRED');
 const matched=[],missing=[];
 for(const gate of R46_GATES){
   const refs=carrierReadbacks.filter(x=>x?.gate===gate);
   if(refs.length!==1){missing.push({gate,reason:refs.length?'DUPLICATE':'NO_ORIGINAL_CARRIER'});continue}
   const x=refs[0];
   if(!SHA.test(x.blob_sha||'')||x.current_head!==head||x.complete!==true||
      x.readback_type!=='GITHUB_FETCH_FILE'||!x.path?.startsWith('LYVRA_NATIVE_RUNTIME/')||!x.fetch_ref){
     missing.push({gate,reason:'INVALID_OR_STALE_SOURCE_READBACK'});continue
   }
   matched.push(gate);
 }
 const complete=wholeCoverage==='VERIFIED'&&missing.length===0;
 return {schema:'LYVRA_R46_FACET_LIFECIRCLE_COVERAGE',wholeCoverage,
   status:complete?'SOURCE_BUNDLE_VERIFIED_NOT_HOST':'PARTIAL_READBACK_PENDING',
   complete,covered:matched,missing,authoritativeWholeClaim:false,
   hostVerified:false,hostGatesOpen:18,productiveWrite:false};
}
export async function executeR46FacetLifecycle({explicitIntent=false,scope='ALL_SIX',
  expectedHead,expectedPointer,wholeCoverage='PARTIAL',carrierReadbacks=[],
  r40Inputs={},allowPartialSourceWork=true}={}){
 if(explicitIntent!==true||scope!=='ALL_SIX')throw Error('EXPLICIT_NATIVE_TASK_REQUIRED');
 const coverage=assessR46FacetCoverage({head:expectedHead,pointerSha:expectedPointer,
   wholeCoverage,carrierReadbacks});
 if(coverage.missing.length&&allowPartialSourceWork!==true)throw Error('FACET_REHYDRATION_INCOMPLETE');
 const out=await executeR40ChatWork({...r40Inputs,creatorIntent:true,scope:'SIX_NATIVE_FACETS',
   expectedHead,expectedPointer,wholeCoverage});
 if(out.hostGatesOpen!==18||out.productiveWrites!==0||out.pluginHostVerified!==false||
    out.execution?.results?.length!==6)throw Error('FACET_EXECUTION_BOUNDARY_FAILED');
 const resultClasses=out.execution.results.map(x=>({facet:x.id,
   class:x.status==='ORIGINAL_R26_FUNCTION_EXECUTED'?'SOURCE_EXECUTION_ONLY':'BLOCKED_OR_UNVERIFIED',
   hostAccepted:false}));
 return {schema:'LYVRA_R46_EXISTING_FACET_LIFECIRCLE_EXECUTION',source:coverage,
   results:resultClasses,sixStrands:[...SIX],
   returnAnchor:'ANALYTICS',otherReturns:['POST','SCEERI_MYCEL','PLUGIN_HOST_ACCEPTANCE'],
   r30ItemsStillOpen:9,hostGatesOpen:18,
   observedSunoResult:out.monitorResultReadback?'NO_CHANGE_REPORT_READBACK':'NOT_PROVIDED_OR_BLOCKED',
   selectiveCaller:out.analytics_selective_caller||out.analytics_specialist_caller||null,
   visualGuidanceAction:out.visualGuidanceAction,
   wholeRehydrated:coverage.complete&&wholeCoverage==='VERIFIED',
   productiveHostInstalled:false,actualHostResult:null,productiveWrites:0,
   nextGate:coverage.complete?'INDEPENDENT_NATIVE_ALIVE_FRESH_HOST_READBACK':'COMPLETE_WHOLE_FACET_CARRIER_READBACKS'};
}
