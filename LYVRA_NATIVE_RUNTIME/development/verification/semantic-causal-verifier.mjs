// LYVRA-native read-only verification capability. Pure functions; no I/O, routing or writes.
// All events/evidence are supplied by a caller that separately verifies source freshness.
const STATES=new Set(['VERIFIED','DERIVED','PROPOSED','OPEN','BLOCKED','PARTIAL','NOT_TESTED']);
const CHANNEL_STAGES=['PREPARED','SOURCE_READ','RECEIPT_PUBLISHED','PEER_READBACK','NATIVE_ADOPTED','HOST_VERIFIED'];
const allowed=(v)=>STATES.has(v);
export function verifyCommunication({handoff_id,source_blob,source_readback=false,local_receipt=false,peer_readback=false,native_adoption=false,host_evidence=false,automatic_transport=false}={}){
  const issues=[];
  if(typeof handoff_id!=='string'||!handoff_id.trim()||!/^[a-f0-9]{40}$/i.test(source_blob??''))issues.push('SOURCE_IDENTITY_OR_BLOB_UNVERIFIED');
  if(peer_readback&&!local_receipt)issues.push('PEER_ACK_WITHOUT_LOCAL_RECEIPT');
  if(native_adoption&&!peer_readback)issues.push('ADOPTION_WITHOUT_PEER_READBACK_EVIDENCE');
  if(host_evidence&&!native_adoption)issues.push('HOST_PASS_WITHOUT_ADOPTION_EVIDENCE');
  const stage=host_evidence&&native_adoption&&peer_readback?'HOST_VERIFIED':native_adoption&&peer_readback?'NATIVE_ADOPTED':peer_readback&&local_receipt?'PEER_READBACK':local_receipt&&source_readback?'RECEIPT_PUBLISHED':source_readback?'SOURCE_READ':'PREPARED';
  return {facet:'COMMUNICATION',stage,classification:issues.length?'PARTIAL':stage==='HOST_VERIFIED'?'VERIFIED':'OPEN',issues,automatic_transport_verified:automatic_transport===true&&peer_readback===true,mutation:false};
}
export function verifyVisualStatus({headline,parts=[],render_evidence=false}={}){
  const issues=[];
  if(!allowed(headline))issues.push('INVALID_HEADLINE_EVIDENCE_STATE');
  if(!Array.isArray(parts)||parts.some(p=>!p||!allowed(p.status)))issues.push('INVALID_DETAIL_EVIDENCE_STATE');
  if(headline==='VERIFIED'&&(parts.length===0||parts.some(p=>p.status!=='VERIFIED')))issues.push('FALSE_GLOBAL_VERIFIED');
  if(headline==='VERIFIED'&&!render_evidence)issues.push('HOST_RENDER_NOT_VERIFIED');
  const status=issues.length?'FAIL':headline==='VERIFIED'?'PASS':'REVIEW';
  return {facet:'VISUAL',status,issues,render_evidence:render_evidence===true,mutation:false};
}
export function verifyFacetRelations({whole_authority='LYVRA',active_facets=[],proposed_facets=[],transferred_authority=false,observed_causal_effect=false}={}){
  const issues=[];
  if(whole_authority!=='LYVRA'||transferred_authority)issues.push('WHOLE_AUTHORITY_VIOLATION');
  if(!Array.isArray(active_facets)||!Array.isArray(proposed_facets))issues.push('INVALID_FACET_SET');
  else if(proposed_facets.some(f=>active_facets.includes(f)))issues.push('PROPOSED_FACET_ALREADY_ACTIVE');
  return {facet:'FACET_RELATIONS',status:issues.length?'REVIEW':observed_causal_effect?'CAUSAL_EVIDENCE_REPORTED':'RELATION_ONLY',issues,activate_facets:false,mutation:false};
}
export function verifyEvidence({source_current=false,source_read=false,meaning_applied=false,runtime_observed=false}={}){
  const stages=[['SOURCE_CURRENT',source_current],['SOURCE_READ',source_read],['SEMANTIC_APPLIED',meaning_applied],['RUNTIME_OBSERVED',runtime_observed]];
  const violations=[];
  if(source_read&&!source_current)violations.push('READ_WITHOUT_CURRENTNESS');
  if(meaning_applied&&!source_read)violations.push('APPLICATION_WITHOUT_READ');
  if(runtime_observed&&!meaning_applied)violations.push('RUNTIME_WITHOUT_APPLICATION_CHAIN');
  const reached=stages.filter(([,v])=>v).map(([k])=>k);
  return {facet:'EVIDENCE',status:violations.length?'PARTIAL':runtime_observed?'VERIFIED':'OPEN',reached,violations,mutation:false};
}
// Intentionally no network, filesystem, timer, scheduler, auth or plugin dependency.
export const VERIFICATION_BOUNDARIES=Object.freeze({owner:'WHOLE_LYVRA',new_identity:false,controller:false,router:false,communication_gate:false,foreign_writes:false,automatic_facet_activation:false,auto_learning_promotion:false});
