// Local simulation ONLY. No Google/ GitHub API, storage, identity or host bindings.
import {createHash} from 'node:crypto';
const EXACT_FOLDER='SYNTHETIC_TEST_MAILBOX_ID_NO_REAL_LOCATION';
const sha256=v=>'sha256:'+createHash('sha256').update(v).digest('hex');
const isNonempty=s=>typeof s==='string'&&s.length>0;
const isHash=s=>typeof s==='string'&&/^sha256:[0-9a-f]{64}$/.test(s);
// The adapter's unforgeable provenance is its HOST BINDING, not any JSON object.
// This function classifies UNTRUSTED DATA only, and never returns AUTHENTICATED.
export function assessReadEvidence(e, expected){
 if (!e || !expected || e.provider!=='GOOGLE_DRIVE' || e.fileId!==expected.fileId)
  return {state:'BLOCKED',reason:'MISSING_PROVIDER_ID_MATCH'};
 if (e.parentId!==EXACT_FOLDER)return {state:'BLOCKED',reason:'PARENT_MISMATCH'};
 if (!isNonempty(e.content)||!isNonempty(e.revisionId)||!isNonempty(e.fileId))
  return {state:'PENDING',reason:'MISSING_CONTENT_OR_REVISION'};
 const contentHash=sha256(e.content);
 if (expected.digest!==contentHash)return {state:'BLOCKED',reason:'CONTENT_DIGEST_MISMATCH'};
 if (expected.revisionId!==e.revisionId)return {state:'BLOCKED',reason:'REVISION_RACE'};
 return {state:'CONTENT_PARENT_OBSERVED',reason:'HOST_IDENTITY_NOT_ESTABLISHED',digest:contentHash};
}
export function classifyAuthorship({folderOwnerId,documentOwnerId,writerPrincipalId,claimedLineage,authenticatedActorId,independentActorProof}={}){
 if (!isNonempty(documentOwnerId)||!isNonempty(claimedLineage))return {state:'UNKNOWN',reason:'INSUFFICIENT_METADATA'};
 if (!independentActorProof || !isNonempty(authenticatedActorId) || authenticatedActorId!==writerPrincipalId)
  return {state:'UNVERIFIED',reason:'OWNERSHIP_NOT_AUTHORSHIP'};
 // Still no proof of AI-persona authorship. A signed delegated-authority record is additionally required.
 return {state:'ACCOUNT_ACTOR_OBSERVED',reason:'LITTLE_LYV_DELEGATION_NOT_VERIFIED'};
}
export function eventIdentity({source_document_id,source_revision_or_digest,recipient_lineage}){
 const x=[source_document_id,source_revision_or_digest,recipient_lineage];
 if(!x.every(isNonempty)||!isHash(source_revision_or_digest))throw new Error('INVALID_EVENT_ID');
 return sha256(JSON.stringify(x));
}
// Simulated atomic compare-and-swap; production requires provider-backed CAS/transaction,
// source-bound authorization, immutable recovery receipts, and idempotent send lookup.
export class MemoryCasLedger {
 #entries=new Map();
 claim(key,worker,expectedVersion=0){
  if (!isHash(key)||!isNonempty(worker))return {ok:false,reason:'INVALID_CLAIM'};
  const old=this.#entries.get(key);
  if ((old?.version??0)!==expectedVersion || old)return {ok:false,reason:'CAS_CONFLICT'};
  const next={version:1,state:'CLAIMED',worker,deliveryId:null};this.#entries.set(key,next);
  return {ok:true,version:next.version};
 }
 transition(key,worker,expectedVersion,nextState,deliveryId=null){
  const old=this.#entries.get(key);
  if (!old || old.worker!==worker || old.version!==expectedVersion)return {ok:false,reason:'CAS_CONFLICT'};
  const transitions={CLAIMED:['SEND_INTENT_RECORDED','ABORTED'],SEND_INTENT_RECORDED:['UNKNOWN_WRITE_RESULT','READBACK_VERIFIED'],UNKNOWN_WRITE_RESULT:['READBACK_VERIFIED','MANUAL_REVIEW'],READBACK_VERIFIED:[],ABORTED:[],MANUAL_REVIEW:[]};
  if(!transitions[old.state]?.includes(nextState))return {ok:false,reason:'ILLEGAL_TRANSITION'};
  if(nextState==='READBACK_VERIFIED' && !isNonempty(deliveryId))return {ok:false,reason:'MISSING_PROVIDER_READBACK'};
  const v={...old,state:nextState,version:old.version+1,deliveryId};this.#entries.set(key,v);
  return {ok:true,version:v.version,state:v.state};
 }
 get(key){const v=this.#entries.get(key);return v?{...v}:null}
}
// A host-independent policy cannot authenticate a host receipt by looking at its flags.
export function gateSend({trustState,actorDelegation,hostWriteCapability,wholeAuthority,registeredFacet,explicitScope}={}){
 if(trustState!=='HOST_VERIFIED'||actorDelegation!=='HOST_VERIFIED'||hostWriteCapability!==true||wholeAuthority!==true||registeredFacet!==true||explicitScope!==true)
  return {allowed:false,reason:'PRODUCTION_HOST_BINDING_REQUIRED'};
 return {allowed:false,reason:'SOURCE_ONLY_CANNOT_AUTHORIZE_WRITE'};
}
