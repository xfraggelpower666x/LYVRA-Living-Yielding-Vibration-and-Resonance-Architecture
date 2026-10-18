// LYVRA-owned read-only receiver pilot CONTRACT CHECK; does not act as 666CLIC.
import {SOURCE} from "./r02-intake-compatibility.mjs";
export const R02_PILOT_PIN=Object.freeze({
 origin_commit:"bea8f8e65465534e205bbafecb467ca073b921b2",
 origin_blob:"8a26ae9f129061584e12fd308ff85bf7eb959ea9",
 lyvra_action_run:39153440316,
 lyvra_action_commit:"0a54b350f39f396d720b569a62c7586b820ca481",
 clic_repo:"xfraggelpower666x/666CLICPRO",
 clic_branch:"clic-migration-rev79-staging",
 clic_inbox:"666CLIC_NATIVE_RUNTIME/inbox/LYVRA/CURRENT.json",
 clic_receipts:"666CLIC_NATIVE_RUNTIME/inbox/LYVRA/receipts",
 clic_inbox_contract_blob:"37c6f22c78eb317c3c607cffbd0e51e95cb45624",
 clic_starbridge_classifier_blob:"f63ff737f1d12636e312a39c61de98209a392f21"
});
const SHA=/^[0-9a-f]{40}$/i;
const denied=reason=>({status:"BLOCKED",reason,receiver_ready:false,source_verified:false,delivery_verified:false,adoption_verified:false,host_verified:false,may_mutate_foreign:false});
const own=Object.prototype.hasOwnProperty;
const required=["handoff_id","source_system","source_repo","source_branch","source_head","created_at","affected_facets","relation_delta","analysis_request","supersedes","authority_transfer"];
// Operates only on independently verified source-readback evidence; does not trust caller booleans as delivery proof.
export function inspectR02PilotContract({sourceProof,inboxProposal,clicContract,existingIntakeIds=[],clicAuthorization}={}){
 if(sourceProof?.status!=="SOURCE_VERIFIED_INBOX_PROPOSAL_ONLY"||sourceProof.source_verified!==true||
    sourceProof.evidence?.pinned_commit!==R02_PILOT_PIN.origin_commit||
    sourceProof.evidence?.blob_sha!==R02_PILOT_PIN.origin_blob||
    !SHA.test(sourceProof.evidence?.live_head??""))return denied("EXACT_SOURCE_PROOF_REQUIRED");
 if(!inboxProposal||required.some(k=>!own.call(inboxProposal,k)))return denied("CLIC_INBOX_FIELDS_MISSING");
 if(inboxProposal.schema!=="CLIC_REPO_HANDOFF_V1"||inboxProposal.handoff_id!==SOURCE.id||
    inboxProposal.source_system!=="LYVRA"||inboxProposal.source_repo!==SOURCE.repo||
    inboxProposal.source_branch!==SOURCE.branch||inboxProposal.source_head!==R02_PILOT_PIN.origin_commit||
    inboxProposal.authority_transfer!==false)return denied("CLIC_INBOX_AUTHORITY_OR_SHA_MISMATCH");
 if(!Array.isArray(inboxProposal.affected_facets)||inboxProposal.affected_facets.length===0||
    !Array.isArray(inboxProposal.analysis_request?.instructions)||!inboxProposal.analysis_request.instructions.length||
    inboxProposal.relation_delta?.starbridge_owner!=="666CLIC"||
    inboxProposal.relation_delta?.source_path!==SOURCE.path||
    inboxProposal.relation_delta?.source_blob!==R02_PILOT_PIN.origin_blob||
    inboxProposal.analysis_request.requested_action!=="CLIC_NATIVE_READ_ONLY_REVIEW")return denied("CLIC_INBOX_RELATION_OR_SCOPE_MISMATCH");
 if(clicContract?.repo!==R02_PILOT_PIN.clic_repo||
    clicContract.branch!==R02_PILOT_PIN.clic_branch||
    clicContract.inbox_blob!==R02_PILOT_PIN.clic_inbox_contract_blob||
    clicContract.starbridge_blob!==R02_PILOT_PIN.clic_starbridge_classifier_blob||
    !SHA.test(clicContract.observed_head??""))return denied("CLIC_NATIVE_CONTRACT_READBACK_REQUIRED");
 if(!Array.isArray(existingIntakeIds))return denied("INVALID_INTAKE_ID_SET");
 if(existingIntakeIds.includes(SOURCE.id))return denied("NATIVE_R02_INTAKE_ALREADY_EXISTS_RECHECK_CLIC");
 if(clicAuthorization===true)return denied("CHAT_OR_LYVRA_CANNOT_AUTHORIZE_CLIC");
 return {
  status:"CLIC_NATIVE_DECISION_REQUIRED",receiver_ready:false,
  source_verified:true,delivery_verified:false,adoption_verified:false,host_verified:false,
  may_mutate_foreign:false,may_create_receipt:false,may_execute_host:false,
  proposed_read_only_steps:[
   "CLIC_INDEPENDENTLY_READ_CURRENT_POINTER_AND_SOURCE_REFS",
   "CLIC_VALIDATE_PINNED_LYVRA_COMMIT_TREE_BLOB_AND_CURRENTNESS",
   "CLIC_REVIEW_CLiC_REPO_HANDOFF_V1_MAPPING_NO_CURRENT_OVERWRITE",
   "CLIC_CHECK_IDEMPOTENCE_REPLAY_SUPERSESSION_AND_PDI_PRIORITIES",
   "CLIC_OPTIONAL_NATIVE_SOURCE_INTAKE_RECEIPT_AFTER_CLIC_AUTHORIZATION"
  ],
  source:{repo:SOURCE.repo,commit:R02_PILOT_PIN.origin_commit,blob:R02_PILOT_PIN.origin_blob,path:SOURCE.path},
  receiver:{owner:"666CLIC",repo:R02_PILOT_PIN.clic_repo,branch:R02_PILOT_PIN.clic_branch,observed_head:clicContract.observed_head},
  evidence_scope:"CONTRACT_COMPATIBILITY_PROPOSAL_NOT_CLIC_ACCEPTANCE"
 };
}
