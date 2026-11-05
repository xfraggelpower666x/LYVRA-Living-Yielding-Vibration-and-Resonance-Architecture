/** ALWAYS-ON means invoked with each authorized work operation, NOT a background daemon. */
export const SIX = Object.freeze(['DICTATION','ANALYTICS','CHARACTER_RELATIONS','VISUAL','INTERRUPTION_CONTINUITY','RESEARCH']);
export function planImpactForAnyTask({task,origin='LYVRA_ANALYTICS',strands=SIX,observations=[],authorized=false}={}){
 if(typeof task!=='string'||!task.trim())throw Error('TASK_REQUIRED');
 if(!Array.isArray(strands)||!strands.length||new Set(strands).size!==strands.length)throw Error('STRANDS_REQUIRED');
 if(!Array.isArray(observations))throw Error('OBSERVATIONS_REQUIRED');
 const impact=observations.map(o=>{
  if(!o||!strands.includes(o.strand)||!['VERIFIED','HYPOTHESIS','CONTRADICTED'].includes(o.evidenceClass)||!o.source)throw Error('PROVENANCE_REQUIRED');
  return {strand:o.strand,evidenceClass:o.evidenceClass,source:o.source,reason:o.reason||'NOT_SPECIFIED',action:o.evidenceClass==='VERIFIED'?'REVIEW_FOR_SCOPED_INTEGRATION':'HOLD_FOR_EVIDENCE'};
 });
 return {schema:'LYVRA_R09_IMPACT_HOOK',task,origin,invocation:'FOR_EVERY_NATIVE_DEVELOPMENT_TASK',hostBackground:false,authorizedExecution:authorized===true,allSixReachable:[...strands],impact,unrelatedStrandsRemainUnchanged:true,returnForeground:origin};
}
