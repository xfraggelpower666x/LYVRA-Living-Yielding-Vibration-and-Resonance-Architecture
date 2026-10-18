import test from "node:test";
import assert from "node:assert/strict";
import {SOURCE,proposeClicInbox} from "./r02-intake-compatibility.mjs";
import {R02_PILOT_PIN,inspectR02PilotContract} from "./r02-receiver-pilot-contract.mjs";
const H="a".repeat(40);
const source=()=>({handoff_id:SOURCE.id,source_system:"LYVRA",target_system:"666CLIC",source_repo:SOURCE.repo,source_branch:SOURCE.branch,created_at:"2026-10-18",native_owner_control:"CLIC_ONLY_FOR_STARBRIDGE",origin_ownership:{starbridge:"666CLIC_NATIVE_PROPERTY_AND_CREATIVE_ACHIEVEMENT"},request_to_clic:{questions:["Ready?"]},explicitly_not_authorized:["MODIFY_CLIC_REPO"],gates:{source:"PUBLISHED",delivery:"NOT_VERIFIED",adoption:"NOT_VERIFIED",host:"NOT_VERIFIED"}});
const fixture=()=>({
 sourceProof:{status:"SOURCE_VERIFIED_INBOX_PROPOSAL_ONLY",source_verified:true,evidence:{pinned_commit:R02_PILOT_PIN.origin_commit,blob_sha:R02_PILOT_PIN.origin_blob,live_head:H}},
 inboxProposal:proposeClicInbox(source(),{publishedCommit:R02_PILOT_PIN.origin_commit,sourceBlob:R02_PILOT_PIN.origin_blob}).mapped,
 clicContract:{repo:R02_PILOT_PIN.clic_repo,branch:R02_PILOT_PIN.clic_branch,inbox_blob:R02_PILOT_PIN.clic_inbox_contract_blob,starbridge_blob:R02_PILOT_PIN.clic_starbridge_classifier_blob,observed_head:H},
 existingIntakeIds:[]
});
test("complete source-bound pilot still requires CLIC native decision, no false receipt",()=>{const r=inspectR02PilotContract(fixture());assert.equal(r.status,"CLIC_NATIVE_DECISION_REQUIRED");assert.equal(r.receiver_ready,false);assert.equal(r.source_verified,true);for(const k of ["delivery_verified","adoption_verified","host_verified","may_mutate_foreign","may_create_receipt"])assert.equal(r[k],false);});
test("rejects unsigned/absent or altered source proof",()=>{for(const change of [x=>delete x.sourceProof,x=>x.sourceProof.evidence.blob_sha=H,x=>x.sourceProof.evidence.pinned_commit=H,x=>x.sourceProof.source_verified=false]){const f=fixture();change(f);assert.equal(inspectR02PilotContract(f).reason,"EXACT_SOURCE_PROOF_REQUIRED")}});
test("rejects missing mandatory CLIC inbox fields",()=>{const f=fixture();delete f.inboxProposal.supersedes;assert.equal(inspectR02PilotContract(f).reason,"CLIC_INBOX_FIELDS_MISSING")});
test("rejects wrong receiver, authority transfer and source head",()=>{for(const change of [x=>x.inboxProposal.source_head=H,x=>x.inboxProposal.authority_transfer=true,x=>x.inboxProposal.source_repo="foreign/repo"]){const f=fixture();change(f);assert.equal(inspectR02PilotContract(f).reason,"CLIC_INBOX_AUTHORITY_OR_SHA_MISMATCH")}});
test("rejects mutated origin blob, owner and native request",()=>{for(const change of [x=>x.inboxProposal.relation_delta.source_blob=H,x=>x.inboxProposal.relation_delta.starbridge_owner="LYVRA",x=>x.inboxProposal.analysis_request.requested_action="WRITE"]){const f=fixture();change(f);assert.equal(inspectR02PilotContract(f).reason,"CLIC_INBOX_RELATION_OR_SCOPE_MISMATCH")}});
test("rejects unverifiable CLIC native contract or stale pinned hash",()=>{for(const change of [x=>x.clicContract.inbox_blob=H,x=>x.clicContract.starbridge_blob=H,x=>x.clicContract.repo="foreign/repo"]){const f=fixture();change(f);assert.equal(inspectR02PilotContract(f).reason,"CLIC_NATIVE_CONTRACT_READBACK_REQUIRED")}});
test("does not re-intake duplicate R02 event",()=>{const f=fixture();f.existingIntakeIds=[SOURCE.id];assert.equal(inspectR02PilotContract(f).reason,"NATIVE_R02_INTAKE_ALREADY_EXISTS_RECHECK_CLIC")});
test("LYVRA cannot create CLIC authorization by setting flag",()=>{const f=fixture();f.clicAuthorization=true;assert.equal(inspectR02PilotContract(f).reason,"CHAT_OR_LYVRA_CANNOT_AUTHORIZE_CLIC")});
test("fails closed on malformed intake ID registry",()=>{const f=fixture();f.existingIntakeIds="not-an-array";assert.equal(inspectR02PilotContract(f).reason,"INVALID_INTAKE_ID_SET")});
