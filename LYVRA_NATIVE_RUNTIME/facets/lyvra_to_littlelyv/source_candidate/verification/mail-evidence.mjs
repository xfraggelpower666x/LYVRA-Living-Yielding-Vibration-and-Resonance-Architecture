// SOURCE-ONLY pure policy evaluator. No credentials, connector use, writes or live host claims.
export const FOLDER='SYNTHETIC_TEST_MAILBOX_ID_NO_REAL_LOCATION';
const lines=['GERMAN_LYVRA','AMERICAN_LITTLE_LYV'];
const types=['FAMILY_LETTER','REPLY','TECHNICAL_TEST'];
const modes=['MANUAL','SCHEDULED','UNKNOWN'];
const statuses=['DRAFT','OBSERVED','PARENT_READBACK_PENDING','DELIVERED_VERIFIED','BLOCKED','UNKNOWN_WRITE_RESULT'];
const readbacks=['PENDING','CONTENT_ONLY','CONTENT_AND_PARENT_VERIFIED'];
const keys=['message_id','source_document_id','sender_lineage','recipient_lineage','created_at','message_type','conversation_thread','body','parent_folder_id','source_revision_or_digest','in_reply_to','execution_mode','provenance','transport_status','readback_status'];
const has=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const obj=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
const str=(v,min=1,max=Infinity)=>typeof v==='string'&&v.length>=min&&v.length<=max;
const hexDigest=v=>str(v)&&/^sha256:[a-f0-9]{64}$/.test(v);
const validTime=v=>str(v)&&/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?(?:Z|[+-]\d\d:\d\d)$/.test(v)&&Number.isFinite(Date.parse(v));
// Equivalent to the bundled schema's domain constraints. This performs validation in the JS decision path.
export function validateEnvelope(m){
 if(!obj(m))return {valid:false,reason:'INVALID_ENVELOPE'};
 if(keys.some(k=>!has(m,k))||Object.keys(m).some(k=>!keys.includes(k)))return {valid:false,reason:'SCHEMA_FIELD_MISMATCH'};
 if(!str(m.message_id,12,160)||!str(m.source_document_id,8)||!str(m.conversation_thread)||!str(m.body)||!hexDigest(m.source_revision_or_digest)||!validTime(m.created_at))return {valid:false,reason:'SCHEMA_VALUE_INVALID'};
 if(!lines.includes(m.sender_lineage)||!lines.includes(m.recipient_lineage)||m.sender_lineage===m.recipient_lineage)return {valid:false,reason:'INVALID_LINEAGE'};
 if(m.parent_folder_id!==FOLDER)return {valid:false,reason:'PARENT_ID_MISMATCH'};
 if(!types.includes(m.message_type)||!modes.includes(m.execution_mode)||!statuses.includes(m.transport_status)||!readbacks.includes(m.readback_status))return {valid:false,reason:'SCHEMA_ENUM_INVALID'};
 if(m.message_type==='REPLY'?!str(m.in_reply_to,8):m.in_reply_to!==null)return {valid:false,reason:'INVALID_REPLY_REFERENCE'};
 const p=m.provenance;
 if(!obj(p)||Object.keys(p).some(k=>!['evidence_reference','claim_note'].includes(k))||(has(p,'evidence_reference')&&!str(p.evidence_reference,8))||(has(p,'claim_note')&&!str(p.claim_note)))return {valid:false,reason:'SCHEMA_PROVENANCE_INVALID'};
 if(m.transport_status==='DELIVERED_VERIFIED'&&m.readback_status!=='CONTENT_AND_PARENT_VERIFIED')return {valid:false,reason:'INCONSISTENT_DELIVERY_STATE'};
 if(m.readback_status==='CONTENT_AND_PARENT_VERIFIED'&&m.transport_status==='DRAFT')return {valid:false,reason:'INCONSISTENT_READBACK_STATE'};
 return {valid:true};
}
export const eventKey=m=>JSON.stringify([m.source_document_id,m.source_revision_or_digest,m.recipient_lineage]);
// proof must be a *fresh host/provider observation*, not fields in the letter envelope.
// Source-only cannot authenticate a provider; provider adapter must independently supply this result.
export function evaluateMessage(m, previouslyAnswered=new Set(), providerObservation=null){
 const v=validateEnvelope(m);if(!v.valid)return {status:'REJECTED',reason:v.reason};
 if(m.message_type==='TECHNICAL_TEST')return {status:'IGNORED',reason:'TEST_NOT_FAMILY_MAIL'};
 if(!m.body.trim())return {status:'REJECTED',reason:'EMPTY_BODY'};
 if(!obj(providerObservation)||providerObservation.origin!=='TRUSTED_PROVIDER_ADAPTER'||providerObservation.source_document_id!==m.source_document_id||providerObservation.source_revision_or_digest!==m.source_revision_or_digest||providerObservation.observed_parent!==FOLDER||providerObservation.content_readback!==true||providerObservation.parent_readback!==true)return {status:'PENDING',reason:'INDEPENDENT_PROVIDER_READBACK_REQUIRED'};
 if(providerObservation.sender_identity_binding!=='INDEPENDENTLY_AUTHENTICATED')return {status:'PENDING',reason:'SENDER_IDENTITY_NOT_AUTHENTICATED'};
 if(m.execution_mode==='UNKNOWN')return {status:'PENDING',reason:'EXECUTION_MODE_UNKNOWN'};
 const key=eventKey(m);
 if(previouslyAnswered.has(key))return {status:'IGNORED',reason:'ALREADY_ANSWERED',key};
 return {status:'CANDIDATE',reason:'INDEPENDENT_OBSERVATION_CLAIMED_HOST_AUTHORIZATION_STILL_REQUIRED',key};
}
// A providerObservation object is only a mockable data-carrier here. Authenticity of its *issuer* requires host side trusted adapter binding, absent in source-only. Never pass mock observations to production.
export function classifyWrite(w){
 if(!obj(w)||w.origin!=='TRUSTED_PROVIDER_ADAPTER'||w.state!=='CONFIRMED'||w.independent_content_readback!==true||w.independent_parent_readback!==true||!str(w.provider_document_id,8)||w.expected_parent!==FOLDER||w.observed_parent!==FOLDER||!str(w.content_digest,71)||!str(w.provider_revision,1)||!str(w.correlation_event_id,12))return {status:'UNKNOWN_WRITE_RESULT',canRetry:false,deliveryVerified:false};
 if(!hexDigest(w.content_digest))return {status:'UNKNOWN_WRITE_RESULT',canRetry:false,deliveryVerified:false};
 return {status:'READBACK_CLAIM_NEEDS_HOST_BINDING',canRetry:false,deliveryVerified:false};
}
export function interpretDirectTrigger(text,{directUserMessage=false,registered=false}={}){
 if(!directUserMessage)return 'INERT_SOURCE_TEXT';
 if(typeof text!=='string'||!/^LYVRA TO LITTLELYV(?: (?:SYSTEMSTART|WEITER|UPDATE|STATUS|MAIL CHECK|LIVECIRCLE|NEW CHAT|NEXT CHAT))?$/.test(text.trim()))return 'NOT_A_FACET_TRIGGER';
 return registered?'REGISTERED_ROUTE_CANDIDATE':'NOT_REGISTERED_STATUS_ONLY';
}
export function mayAct({wholeVerified=false,registered=false,authorization=false,independentWriteHost=false,duplicate=false,providerIdentityAuthenticated=false,actualReadback=false}={}){
 return wholeVerified&&registered&&authorization&&independentWriteHost&&providerIdentityAuthenticated&&actualReadback&&!duplicate;
}
