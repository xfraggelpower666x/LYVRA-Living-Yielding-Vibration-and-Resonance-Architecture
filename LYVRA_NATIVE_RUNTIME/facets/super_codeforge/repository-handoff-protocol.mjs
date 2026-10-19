// Whole-LYVRA SuperCodeForge: read-only repository envelope examination.
// Never authenticates a peer, issues an ACK, sends a handoff or promotes host status.
import {createHash} from 'node:crypto';
const REPO='xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture';
const SHA=/^[a-f0-9]{40}$/i;
const ID=/^[A-Za-z0-9][A-Za-z0-9._:-]{7,127}$/;
const fail=(code)=>Object.freeze({status:'DENIED',code,source_verified:false,delivery_verified:false,receipt_verified:false,adoption_verified:false,host_verified:false,mutation:false});
const pending=(code)=>Object.freeze({status:'PENDING',code,source_verified:false,delivery_verified:false,receipt_verified:false,adoption_verified:false,host_verified:false,mutation:false});
export const PROTOCOL_BOUNDARY=Object.freeze({owner:'WHOLE_LYVRA',scope:'SELF_REPOSITORY_SOURCE_ONLY',mutation:false,foreign_activation:false,delivery_verified:false,host_verified:false});
export function gitBlobSha(text){const bytes=Buffer.from(text,'utf8');return createHash('sha1').update(Buffer.from(`blob ${bytes.length}\0`)).update(bytes).digest('hex');}
export function inspectEnvelope(e){
 if(!e||typeof e!=='object'||Array.isArray(e))return fail('INVALID_ENVELOPE');
 if(e.schema!=='LYVRA_SUPERCODEFORGE_REPO_HANDOFF_V1')return fail('SCHEMA_DENIED');
 if(e.owner!=='WHOLE_LYVRA'||e.sender!=='LYVRA'||e.receiver!=='LYVRA_SUPERCODEFORGE')return fail('AUTHORITY_SCOPE_DENIED');
 if(e.intent!=='PROPOSAL'||e.permission!=='READ_ONLY_SELF_REPOSITORY'||e.mutation!==false)return fail('OPERATION_DENIED');
 if(e.repository!==REPO||e.branch!=='lyvra')return fail('REPOSITORY_SCOPE_DENIED');
 if(!ID.test(e.handoff_id)||!ID.test(e.replay_key))return fail('HANDOFF_ID_DENIED');
 if(!SHA.test(e.source_commit)||!SHA.test(e.source_blob))return fail('IMMUTABLE_SOURCE_REQUIRED');
 if(typeof e.source_path!=='string'||!e.source_path.startsWith('LYVRA_NATIVE_RUNTIME/')||e.source_path.includes('..')||e.source_path.includes('\\')||e.source_path.includes('//'))return fail('SOURCE_PATH_DENIED');
 if(!Number.isSafeInteger(e.sequence)||e.sequence<1)return fail('SEQUENCE_INVALID');
 if(typeof e.supersedes!=='string'&&e.supersedes!==null)return fail('SUPERSESSION_INVALID');
 if(e.supersedes!==null&&!ID.test(e.supersedes))return fail('SUPERSESSION_INVALID');
 if(e.supersedes===e.handoff_id)return fail('SELF_SUPERSESSION_DENIED');
 if(typeof e.expires_at!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.\d+)?Z$/.test(e.expires_at)||!Number.isFinite(Date.parse(e.expires_at)))return fail('EXPIRY_INVALID');
 return Object.freeze({status:'ELIGIBLE_SOURCE_REVIEW',code:'REQUIRES_AUTHENTICATED_SOURCE_AND_LEDGER',source_verified:false,delivery_verified:false,receipt_verified:false,adoption_verified:false,host_verified:false,mutation:false});
}
export async function inspectRepositoryHandoff(e,{fetchFile,readLedger,now}={}){
 const gate=inspectEnvelope(e);if(gate.status!=='ELIGIBLE_SOURCE_REVIEW')return gate;
 if(!(now instanceof Date)||!Number.isFinite(now.getTime()))return pending('TRUSTED_CLOCK_REQUIRED');
 if(Date.parse(e.expires_at)<=now.getTime())return fail('HANDOFF_EXPIRED');
 if(typeof fetchFile!=='function'||typeof readLedger!=='function')return pending('AUTHORIZED_READBACKS_MISSING');
 let ledger;
 try{ledger=await readLedger({repository:REPO,receiver:e.receiver});}catch{return pending('LEDGER_READ_FAILED');}
 // Caller supplied facts are not sufficient; adapter must provide independent, authenticated ledger.
 if(!ledger||ledger.authenticated_readback!==true||ledger.authority!=='WHOLE_LYVRA'||!Array.isArray(ledger.entries))return pending('AUTHENTICATED_LEDGER_REQUIRED');
 if(ledger.entries.some(x=>x.handoff_id===e.handoff_id||x.replay_key===e.replay_key))return fail('REPLAY_DENIED');
 if(ledger.entries.some(x=>x.supersedes===e.handoff_id))return fail('SUPERSEDED_DENIED');
 if(e.supersedes!==null){const old=ledger.entries.find(x=>x.handoff_id===e.supersedes);if(!old)return pending('SUPERSESSION_PREDECESSOR_UNVERIFIED');if(old.sender!==e.sender||old.receiver!==e.receiver||old.sequence>=e.sequence)return fail('SUPERSESSION_LINEAGE_DENIED');}
 if(ledger.entries.some(x=>x.sender===e.sender&&x.receiver===e.receiver&&x.sequence>=e.sequence))return fail('STALE_SEQUENCE_DENIED');
 let observed;
 try{observed=await fetchFile({repository_full_name:REPO,path:e.source_path,ref:e.source_commit,encoding:'utf-8'});}catch{return pending('SOURCE_READ_FAILED');}
 const file=observed?.result;
 if(!file||file.encoding!=='utf-8'||typeof file.content!=='string'||!SHA.test(file.sha))return pending('SOURCE_RESPONSE_INCOMPLETE');
 if(file.sha!==e.source_blob||gitBlobSha(file.content)!==e.source_blob)return fail('SOURCE_BLOB_MISMATCH');
 return Object.freeze({status:'SOURCE_READBACK_MATCH',code:'SOURCE_ONLY_NOT_DELIVERY',source_commit:e.source_commit,source_blob:e.source_blob,source_verified:true,evidence_class:'INJECTED_PROVIDER_RESPONSE_NOT_INDEPENDENTLY_ATTESTED',ledger_claimed_authenticated:true,delivery_verified:false,receipt_verified:false,adoption_verified:false,host_verified:false,mutation:false});
}
