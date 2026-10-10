// Whole LYVRA W02: pure, read-only evidence inspection, not a transport or authority.
// Evidence objects are caller-supplied. This module cannot independently verify their authenticity.
const SHA=/^[a-f0-9]{40}$/i;
const CLAIMS=Object.freeze({
  SOURCE_READ:['SOURCE_CURRENT','SOURCE_CONTENT'],
  SEMANTIC_APPLIED:['SOURCE_CURRENT','SOURCE_CONTENT','MEANING_DECISION','COUNTEREXAMPLE'],
  PEER_DELIVERED:['SOURCE_CURRENT','SOURCE_CONTENT','LOCAL_RECEIPT','PEER_READBACK'],
  AUTOMATIC_TRANSPORT:['SOURCE_CURRENT','SOURCE_CONTENT','LOCAL_RECEIPT','PEER_READBACK','TRANSPORT_OBSERVATION'],
  HOST_VERIFIED:['SOURCE_CURRENT','SOURCE_CONTENT','MEANING_DECISION','COUNTEREXAMPLE','HOST_OBSERVATION']
});
export const W02_BOUNDARIES=Object.freeze({owner:'WHOLE_LYVRA',decision_authority:false,transport:false,router:false,blocking:false,foreign_writes:false,facet_activation:false});
function validReference(e){
 return !!e&&typeof e==='object'&&typeof e.ref==='string'&&e.ref.trim().length>0&&typeof e.source_head==='string'&&SHA.test(e.source_head)&&typeof e.observation_id==='string'&&e.observation_id.trim().length>0;
}
export function inspectClaim({claim,evidence=[],conflicts=[],external_readback_verified=false}={}){
 if(!Object.hasOwn(CLAIMS,claim))return {status:'REVIEW',issues:['UNKNOWN_CLAIM'],mutation:false};
 if(!Array.isArray(evidence)||!Array.isArray(conflicts))return {status:'REVIEW',issues:['INVALID_EVIDENCE_COLLECTION'],mutation:false};
 const required=CLAIMS[claim];
 const matching=new Map();
 const issues=[];
 for(const item of evidence){
  if(!validReference(item)){issues.push('UNTRUSTED_OR_INCOMPLETE_REFERENCE');continue;}
  if(!matching.has(item.kind))matching.set(item.kind,item);
 }
 const missing=required.filter(kind=>!matching.has(kind));
 if(missing.length)issues.push('REQUIRED_EVIDENCE_MISSING');
 if(conflicts.length)issues.push('COUNTEREVIDENCE_UNRESOLVED');
 // External readback must be established by the caller with independent source access;
 // this boolean is a claim of a caller, NOT proof from within this module.
 const status=issues.length?'REVIEW':external_readback_verified===true?'REFERENCES_COMPLETE_EXTERNAL_READBACK_CLAIMED':'REFERENCES_COMPLETE_UNVERIFIED';
 return {status,claim,missing,issues,source_refs:required.filter(k=>matching.has(k)).map(k=>({kind:k,ref:matching.get(k).ref,source_head:matching.get(k).source_head})),runtime_proven:false,mutation:false};
}
export function inspectFreshBoot({current_pointer,required_carriers=[],loaded_carriers=[],semantic_tests=[],observed_output=false}={}){
 const issues=[];
 if(!validReference(current_pointer))issues.push('CURRENT_POINTER_UNVERIFIED');
 if(!Array.isArray(required_carriers)||!Array.isArray(loaded_carriers)||!Array.isArray(semantic_tests))return {status:'REVIEW',issues:['INVALID_COLLECTION'],mutation:false};
 const missing=required_carriers.filter(k=>!loaded_carriers.some(v=>v.kind===k&&validReference(v)));
 if(missing.length)issues.push('REQUIRED_CARRIERS_MISSING');
 const causal=semantic_tests.some(t=>t&&t.context_a_decision&&t.context_b_decision&&t.context_a_decision!==t.context_b_decision&&t.evidence_ref&&t.counterrelation);
 if(!causal)issues.push('CAUSAL_COUNTERFACTUAL_NOT_DEMONSTRATED');
 if(!observed_output)issues.push('RENDERER_OR_HOST_EVIDENCE_OPEN');
 return {status:issues.length?'PARTIAL':'EVIDENCE_REFERENCED_NEEDS_INDEPENDENT_RUNTIME_READBACK',issues,missing,mutation:false,authority:'WHOLE_LYVRA'};
}
