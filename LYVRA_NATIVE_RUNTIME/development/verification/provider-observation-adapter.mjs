// W04 native LYVRA: PURE adapter for externally independently read provider observations.
// Authenticity is asserted only by the permitted provider boundary, never by this library.
// Does not fetch, mutate, gate, route, dispatch, activate facets, or verify host execution.
const sha=/^[0-9a-f]{40}$/i;
const nonempty=s=>typeof s==='string'&&s.trim().length>0;
export const W04_BOUNDARIES=Object.freeze({owner:'WHOLE_LYVRA',decision_authority:false,network_access:false,foreign_writes:false,transport:false,message_gateway:false,facet_activation:false,auto_promotion:false,host_verified:false});
export function bindProviderReadback({request={},provider_result={},trusted_context={}}={}){
 const issues=[];
 // Identity comes from the independently bound request, NEVER from fetched content.
 const {repository,branch,path,expected_head,expected_blob}=request;
 if(![repository,branch,path].every(nonempty)||!sha.test(expected_head??'')||!sha.test(expected_blob??''))issues.push('INVALID_BOUND_REQUEST');
 if(trusted_context.provider!=='GITHUB_CONNECTOR'||trusted_context.actual_provider_call!==true||trusted_context.readback_confirmed!==true)issues.push('PROVIDER_BOUNDARY_NOT_ATTESTED');
 if(trusted_context.repository!==repository||trusted_context.branch!==branch||trusted_context.path!==path)issues.push('PROVIDER_REQUEST_IDENTITY_MISMATCH');
 if(trusted_context.observed_head!==expected_head)issues.push('PROVIDER_CURRENT_HEAD_MISMATCH');
 if(provider_result.sha!==expected_blob)issues.push('PROVIDER_BLOB_MISMATCH');
 if(!nonempty(provider_result.content)||!nonempty(trusted_context.observation_id))issues.push('MISSING_CONTENT_OR_OBSERVATION_ID');
 const ok=issues.length===0;
 return {status:ok?'REFERENTIAL_READBACK_MATCH':'UNVERIFIED',issues,observation:ok?{repository,branch,path,blob:expected_blob,observed_head:expected_head,provider_readback:true,observation_id:trusted_context.observation_id}:null,independent_runtime_proven:false,mutation:false};
}
// An observation's trust is always conditional upon the externally attested call.
// The same caller can lie about trusted_context; avoid any "cryptographically verified" claim.
export function assessCausalSupport({source={},delta={},observed={},alternative={},scope={}}={}){
 const issues=[];
 if(!source.observation_id||!source.source_ref)issues.push('SOURCE_PROVENANCE_UNBOUND');
 if(!delta.changed_information||!delta.relevance_rationale)issues.push('MEANING_DELTA_UNEXPLAINED');
 if(!observed.before||!observed.after||!observed.mechanism)issues.push('DECISION_CHAIN_UNEXPLAINED');
 if(!alternative.hypothesis||!alternative.discriminating_test)issues.push('COUNTERHYPOTHESIS_MISSING');
 if(scope.authority!=='WHOLE_LYVRA'||scope.forced_facet_activation===true)issues.push('FACET_AUTHORITY_BOUNDARY');
 if(issues.length)return {status:'REVIEW',issues,causality_proven:false,mutation:false};
 const changed=JSON.stringify(observed.before)!==JSON.stringify(observed.after);
 if(delta.irrelevant===true&&changed)return {status:'REVIEW',issues:['IRRELEVANT_INPUT_CHANGED_DECISION'],causality_proven:false,mutation:false};
 if(delta.irrelevant===true)return {status:'STABILITY_HYPOTHESIS',issues:[],causality_proven:false,mutation:false};
 if(!changed)return {status:'CAUSAL_DELTA_NOT_OBSERVED',issues:[],causality_proven:false,mutation:false};
 return {status:'CAUSAL_HYPOTHESIS_REQUIRES_DISCRIMINATING_TEST',issues:[],counter_test:alternative.discriminating_test,causality_proven:false,mutation:false};
}
