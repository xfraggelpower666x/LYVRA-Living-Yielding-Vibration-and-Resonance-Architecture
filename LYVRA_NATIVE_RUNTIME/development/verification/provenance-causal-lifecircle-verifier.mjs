// LYVRA W03: advisory semantic-causal and LifeCircle verification, read-only pure functions.
// The caller must independently build the observed repository ledger from provider readbacks.
// This module checks correspondence; it cannot authenticate a caller or access a host/browser.
const SHA=/^[a-f0-9]{40}$/i;
const nonempty=x=>typeof x==='string'&&x.trim().length>0;
export const W03_BOUNDARIES=Object.freeze({owner:'WHOLE_LYVRA',authority:false,router:false,gatekeeper:false,transport:false,foreign_write:false,facet_activation:false,auto_promotion:false});
export function verifyProvenance(claim={},observations=[]){
 if(!Array.isArray(observations))return {status:'REVIEW',issues:['INVALID_OBSERVATION_LEDGER'],mutation:false};
 if(!nonempty(claim.repository)||!nonempty(claim.branch)||!nonempty(claim.path)||!SHA.test(claim.blob??''))return {status:'REVIEW',issues:['INVALID_SOURCE_IDENTITY'],mutation:false};
 const matching=observations.filter(o=>o&&o.repository===claim.repository&&o.branch===claim.branch&&o.path===claim.path&&o.provider_readback===true&&SHA.test(o.blob??''));
 if(!matching.length)return {status:'UNVERIFIED',issues:['NO_MATCHING_PROVIDER_READBACK'],mutation:false};
 const unique=[...new Set(matching.map(o=>o.blob))];
 if(unique.length>1)return {status:'REVIEW',issues:['CONFLICTING_PROVIDER_OBSERVATIONS'],mutation:false};
 const o=matching[0],issues=[];
 if(o.blob!==claim.blob)issues.push('BLOB_MISMATCH');
 if(nonempty(claim.observed_head)&&claim.observed_head!==o.observed_head)issues.push('HEAD_MISMATCH');
 if(nonempty(claim.expected_current_head)&&claim.expected_current_head!==o.observed_head)issues.push('CURRENTNESS_MISMATCH');
 if(issues.length)return {status:'CONFLICT',issues,mutation:false};
 return {status:'READBACK_MATCHED_NOT_RUNTIME_PROVEN',issues:[],source:{repository:claim.repository,branch:claim.branch,path:claim.path,blob:claim.blob,observed_head:o.observed_head},independently_authenticated_by_module:false,mutation:false};
}
export function verifyCausalDecision({before={},after={},delta,source_ref,mechanism,counterrelation,irrelevant=false,protected_relations=[],exception_reason}={}){
 const issues=[];if(!nonempty(delta)||!nonempty(source_ref)||!nonempty(mechanism)||!nonempty(counterrelation))issues.push('CAUSAL_CHAIN_INCOMPLETE');
 if(!before||!after||Array.isArray(before)||Array.isArray(after)||typeof before!=='object'||typeof after!=='object')return {status:'REVIEW',issues:['INVALID_DECISION_STATE'],mutation:false};
 const keys=[...new Set([...Object.keys(before),...Object.keys(after)])];
 const changed=keys.filter(k=>before[k]!==after[k]);
 const protectedChanged=changed.filter(k=>Array.isArray(protected_relations)&&protected_relations.includes(k));
 if(irrelevant&&changed.length)issues.push('UNJUSTIFIED_CHANGE_FROM_IRRELEVANT_DELTA');
 if(protectedChanged.length)issues.push(nonempty(exception_reason)?'PROTECTED_RELATION_EXCEPTION_REQUIRES_LYVRA_REVIEW':'PROTECTED_RELATION_CHANGED_WITHOUT_EXCEPTION');
 if(issues.length)return {status:'REVIEW',issues,changed,protectedChanged,causality_proven:false,mutation:false};
 if(irrelevant)return {status:'STABILITY_CONSISTENT',issues,changed,causality_proven:false,mutation:false};
 if(!changed.length)return {status:'NO_OBSERVED_DECISION_DELTA',issues,changed,causality_proven:false,mutation:false};
 return {status:'CAUSAL_HYPOTHESIS_REVIEW',issues,changed,causality_proven:false,mutation:false};
}
export function inspectLifeCircleManifest({manifest={},loaded=[],currentness_observed=false}={}){
 if(!Array.isArray(manifest.required_order)||!Array.isArray(loaded)||!manifest.domain_path_map||typeof manifest.domain_path_map!=='object')return {status:'REVIEW',issues:['INVALID_MANIFEST_OR_READBACK'],mutation:false};
 const order=manifest.required_order,issues=[];
 if(new Set(order).size!==order.length)issues.push('DUPLICATE_REHYDRATION_STAGE');
 if(order[0]!=='PRE_REHYDRATION_OVERSTEER_GUARD'||order[1]!=='AUTHORITY_AND_CURRENT_POINTER'||order.at(-1)!=='CURRENT_WORK_SCOPE')issues.push('WHOLE_REHYDRATION_ORDER_VIOLATION');
 const mapped=order.filter(k=>Array.isArray(manifest.domain_path_map[k])&&manifest.domain_path_map[k].length);
 const derived=order.filter(k=>!mapped.includes(k));
 const missing=mapped.filter(k=>!manifest.domain_path_map[k].some(path=>loaded.some(o=>o&&o.path===path&&o.provider_readback===true&&SHA.test(o.blob??''))));
 if(missing.length)issues.push('MAPPED_STAGES_LACK_PROVIDER_READBACK');
 if(derived.length)issues.push('DERIVED_STAGES_REQUIRE_SEMANTIC_ASSESSMENT');
 if(!currentness_observed)issues.push('HEAD_CURRENTNESS_NOT_INDEPENDENTLY_OBSERVED');
 return {status:issues.length?'PARTIAL':'SOURCE_COVERAGE_ONLY',required:order.length,mapped:mapped.length,derived,missing,issues,fully_rehydrated:false,mutation:false};
}
