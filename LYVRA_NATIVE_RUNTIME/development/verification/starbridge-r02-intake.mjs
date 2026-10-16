// LYVRA-owned SB-04: pure receipt/source reconciliation, NOT an automatic repository poller.
// Callers must independently read GitHub source and target contents and provide verified blobs.
const HASH=/^[a-f0-9]{40}$/i;
const ID=/^[A-Za-z0-9][A-Za-z0-9._-]{5,127}$/;
const SOURCE_REPO='xfraggelpower666x/666CLICPRO';
const SOURCE_PATH='666CLIC_NATIVE_RUNTIME/outbox/LYVRA/CLIC-LYVRA-VISUAL-DEVELOPMENT-REPORT-20261010-R02.json';
export function inspectR02Evidence({source={},receiver={},clicAck={},proof={}}={}){
 const errors=[];
 if(source.handoff_id!=='CLIC-LYVRA-VISUAL-DEVELOPMENT-REPORT-20261010-R02'||source.source_system!=='666CLIC'||source.target_system!=='LYVRA'||source.source?.repository!==SOURCE_REPO||source.source?.source_path!==SOURCE_PATH||source.stage!=='PREPARED')errors.push('SOURCE_ENVELOPE_MISMATCH');
 if(receiver.handoff_id!==source.handoff_id||receiver.source_repository!==SOURCE_REPO||receiver.source_path!==SOURCE_PATH||!HASH.test(receiver.source_blob_sha??'')||!ID.test(receiver.receipt_id??''))errors.push('RECEIVER_RECEIPT_MISMATCH');
 if(clicAck.handoff_id!==source.handoff_id||clicAck.target_receipt?.receipt_id!==receiver.receipt_id||clicAck.target_receipt?.blob_sha!==proof.receiver_blob||clicAck.source_report?.blob_sha!==proof.source_blob)errors.push('CLIC_ACK_MISMATCH');
 if(!HASH.test(proof.source_blob??'')||!HASH.test(proof.receiver_blob??'')||!HASH.test(proof.clic_ack_blob??''))errors.push('MISSING_CONTENT_ADDRESSED_BLOBS');
 if(proof.source_repository_readback!==true||proof.receiver_repository_readback!==true||proof.clic_ack_repository_readback!==true)errors.push('INDEPENDENT_GITHUB_READBACK_REQUIRED');
 if(receiver.source_blob_sha!==proof.source_blob)errors.push('ORIGINAL_SOURCE_BLOB_MISMATCH');
 const verified=errors.length===0;
 return {status:verified?'RECIPROCAL_REPOSITORY_READBACK_VERIFIED':'PARTIAL',errors,source_pass:verified,receipt_pass:verified,delivery_pass:false,adoption_pass:false,fresh_host_pass:false,automatic_delivery_verified:false,native_adoption:false,foreign_mutation:false,pet_changed:false};
}
export function classifyCandidateIntake(candidate={},existing=[]){
 if(!ID.test(candidate.handoff_id??'')||!HASH.test(candidate.source_blob_sha??'')||candidate.source_repository!==SOURCE_REPO||candidate.target_system!=='LYVRA')return {status:'REJECT_INVALID',write:false};
 const match=existing.find(x=>x.handoff_id===candidate.handoff_id);
 if(match&&match.source_blob_sha!==candidate.source_blob_sha)return {status:'CONFLICT_QUARANTINE',write:false};
 if(match)return {status:'IDEMPOTENT_EXISTING',write:false};
 return {status:'REQUIRES_NATIVE_SOURCE_READBACK_AND_DECISION',write:false};
}
export function assessLineageReadiness({workspace_id,lineage_id,source_head,receipt_id,source_verified=false,target_verified=false}={}){
 const scope=typeof workspace_id==='string'&&workspace_id.length>0;
 const lineage=typeof lineage_id==='string'&&lineage_id.length>0;
 const ready=scope&&lineage&&HASH.test(source_head??'')&&ID.test(receipt_id??'')&&source_verified&&target_verified;
 return {status:ready?'SOURCE_REFERENCES_READY_HOST_PENDING':'FRESH_CHAT_NOT_VERIFIED',fresh_host_pass:false,persisted_handoff_claim:false,no_global_latest:true,no_cross_workspace_merge:true};
}
