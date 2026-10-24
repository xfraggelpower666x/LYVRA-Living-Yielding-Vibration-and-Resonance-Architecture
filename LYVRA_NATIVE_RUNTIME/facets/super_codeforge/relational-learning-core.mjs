// LYVRA owned: pure, read-only, no external host/peer executor.
export const LEARNING_BOUNDARY=Object.freeze({owner:'WHOLE_LYVRA',foreignAuthority:false,remoteMutation:false,automaticAdoption:false,hostVerified:false});
const freeze=x=>Object.freeze(x);
const permitted=new Set(['direct-readback','creator-observation','peer-reported','derived-hypothesis']);
function nonempty(x){return typeof x==='string'&&x.trim().length>0}
export function recordEncounter(input){
  if(!input||!nonempty(input.caseId)||!nonempty(input.origin)||!nonempty(input.locator)||!nonempty(input.authorizedScope))throw Error('MISSING_PROVENANCE_OR_AUTHORIZATION');
  if(!permitted.has(input.sourceClass))throw Error('UNKNOWN_EVIDENCE_CLASS');
  if(input.requestedAction&&input.requestedAction!=='READ_ONLY')throw Error('WRITE_OR_FOREIGN_ACTION_DENIED');
  const relations=(input.relations||[]).map(r=>{
    if(!r||!nonempty(r.from)||!nonempty(r.to)||!['enables','depends_on','blocks','contradicts','supersedes','explains'].includes(r.type))throw Error('INVALID_RELATION');
    return freeze({from:r.from,to:r.to,type:r.type,evidence:r.evidence||null});
  });
  return freeze({caseId:input.caseId,origin:input.origin,locator:input.locator,authorizedScope:input.authorizedScope,sourceClass:input.sourceClass,revision:input.revision||null,observation:input.observation||null,relations:freeze(relations),outcome:input.outcome||'UNKNOWN',context:input.context||null,uncertainties:freeze([...(input.uncertainties||[])]),authority:'ORIGIN_SYSTEM_ONLY',localStatus:'OBSERVATION_NOT_ADOPTED'});
}
export function compareCases(a,b){
 if(!a||!b||a.caseId===b.caseId)throw Error('DISTINCT_EVIDENCE_REQUIRED');
 const changed=a.context===b.context?[]:['CONTEXT_DIFFERS'];
 const contradiction=a.outcome!==b.outcome;
 return freeze({cases:freeze([a.caseId,b.caseId]),contextDifferences:freeze(changed),contradiction,causalProof:false,lesson:contradiction?'RESULTS_ARE_CONTEXT_DEPENDENT_UNTIL_CAUSAL_TEST':'SAME_OUTCOME_DOES_NOT_PROVE_CAUSE',candidateStatus:'HYPOTHESIS'});
}
export function proposeSolutions({cases,relation,alternatives,uncertainties=[]}){
 if(!Array.isArray(cases)||cases.length<1||!nonempty(relation)||!Array.isArray(alternatives)||alternatives.length<2)throw Error('INSUFFICIENT_EVIDENCE_OR_ALTERNATIVES');
 const ids=cases.map(c=>c.caseId);
 if(ids.some(x=>!nonempty(x))||alternatives.some(x=>!nonempty(x)))throw Error('INVALID_CANDIDATE');
 return freeze({sourceCases:freeze(ids),hypothesis:relation,alternatives:freeze([...new Set(alternatives)]),uncertainties:freeze([...uncertainties]),status:'LOCAL_CANDIDATE_NOT_ADOPTED',executionVerified:false,foreignActivation:false,writeAuthority:false});
}
export function assessFeedback(proposal,{caseId,outcome,evidenceLocator,sourceClass}){
 if(!proposal||proposal.status!=='LOCAL_CANDIDATE_NOT_ADOPTED'||!nonempty(caseId)||!nonempty(evidenceLocator)||!permitted.has(sourceClass))throw Error('INVALID_FEEDBACK');
 return freeze({proposal,caseId,outcome:outcome||'UNKNOWN',evidenceLocator,sourceClass,status:'FEEDBACK_RECORDED_AWAIT_NATIVE_REVIEW',promoted:false,hostVerified:false});
}
