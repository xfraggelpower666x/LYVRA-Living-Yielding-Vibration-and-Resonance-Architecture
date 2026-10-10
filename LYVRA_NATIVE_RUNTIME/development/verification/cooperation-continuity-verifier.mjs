// LYVRA native cooperation intelligence: advisory pure function, all input is UNTRUSTED.
// Reconstructs delivery/meaning/application/supersession relations without asserting host proof.
// Never routes, queues, blocks, writes, activates facets or chooses LYVRA decisions.
export const COOPERATION_BOUNDARY=Object.freeze({owner:'WHOLE_LYVRA',decision_authority:false,transport_control:false,gatekeeper:false,facet_activation:false,mutation:false,channels_open:true});
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v)?v:{};
const str=v=>typeof v==='string'?v.trim():'';
const array=v=>Array.isArray(v)?v:[];
export function inspectCooperation(input={}){
 const data=obj(input),issues=[],observations=[],proposals=[];
 const peers=array(data.exchanges);
 const active=new Set(array(data.active_facets).map(str).filter(Boolean));
 const facts=peers.map((raw,index)=>{
  const x=obj(raw),id=str(x.id),channel=str(x.channel),sender=str(x.sender),recipient=str(x.recipient);
  const intent=str(x.intent).toUpperCase(),scope=str(x.scope_owner);
  const supplied=obj(x.claims),relation=obj(x.relation);
  const entry={index,id:id||null,channel:channel||'UNSPECIFIED',sender:sender||null,recipient:recipient||null,intent:intent||'UNSPECIFIED',scope_owner:scope||null,
   source_reference:str(x.source_ref)||null,
   source_stage:'CALLER_CLAIM_ONLY',meaning_stage:'UNVERIFIED',application_stage:'UNVERIFIED',independent_host_evidence:false,
   evidence_tier:'NOT_AUTHENTICATED',automatic_transport_verified:false,authority_transfer:false,
   communication_blocked:false,facet_activated:false,
   relation:{cause:str(relation.cause)||null,proposed_effect:str(relation.proposed_effect)||null,counterrelation:str(relation.counterrelation)||null},
   issues:[]};
  if(!id||!sender||!recipient)entry.issues.push('INCOMPLETE_EXCHANGE_IDENTITY');
  if(!channel)entry.issues.push('UNKNOWN_CHANNEL_METADATA_NOT_A_BLOCKER');
  if(scope&&scope!=='WHOLE_LYVRA'&&scope!=='FACET_LOCAL'&&scope!=='FOREIGN_SYSTEM')entry.issues.push('UNRESOLVED_SCOPE_OWNER');
  if(intent==='REPORT'||intent==='PROPOSAL'||intent==='HANDOFF')observations.push({exchange:index,id:entry.id,code:'MESSAGE_NOT_AUTOMATIC_AUTHORITY'});
  if(supplied.received||supplied.peer_readback||supplied.semantic_understood||supplied.applied||supplied.host_verified)entry.issues.push('CLAIMED_PROGRESS_REQUIRES_INDEPENDENT_EVIDENCE');
  if(relation.proposed_effect&&!relation.cause)entry.issues.push('CAUSAL_EFFECT_WITHOUT_MECHANISM');
  if(relation.cause&&!relation.counterrelation)entry.issues.push('COUNTERRELATION_NOT_SUPPLIED');
  if(x.target_facet&&!active.has(str(x.target_facet)))entry.issues.push('TARGET_FACET_NOT_ACTIVE_NO_AUTOACTIVATION');
  if(x.supersedes&&!peers.some(e=>str(obj(e).id)===str(x.supersedes)))entry.issues.push('SUPERSEDED_REFERENCE_NOT_PRESENT');
  if(x.relevance==='IRRELEVANT'&&relation.proposed_effect)entry.issues.push('IRRELEVANT_INPUT_MUST_NOT_CAUSE_MUTATION');
  for(const code of entry.issues)issues.push({exchange:index,id:entry.id,code});
  return entry;
 });
 const ids=new Set();
 for(const f of facts){if(f.id&&ids.has(f.id))issues.push({exchange:f.index,id:f.id,code:'DUPLICATE_EXCHANGE_ID'});if(f.id)ids.add(f.id)}
 // Advice does not affect transports, only raises hypotheses for LYVRA to evaluate.
 for(const e of facts)if(e.relation.proposed_effect)proposals.push({exchange:e.id,relation:e.relation,status:'UNTESTED_CAUSAL_HYPOTHESIS',decision:'LYVRA_ONLY'});
 if(!peers.length)observations.push('NO_EXCHANGES_SUPPLIED_NOT_NO_COMMUNICATION');
 return {contract:'LYVRA_COOPERATION_CONTINUITY_V1',owner:'WHOLE_LYVRA',status:issues.length?'REVIEW':'ADVISORY_ONLY',
  exchanges:facts,issues,observations,proposals,channels_discovered:[...new Set(facts.map(x=>x.channel))],
  coverage:{input_exchanges:peers.length,authenticated_exchanges:0,host_verified_exchanges:0},
  network_effect:{communication_pass_through:true,worker_failure_must_not_block:true,new_channel_rejected:false,facet_activation:false,foreign_mutation:false},
  independent_provider_readback:false,runtime_verified:false,mutation:false};
}
