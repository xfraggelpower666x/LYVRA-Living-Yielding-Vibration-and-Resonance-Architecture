import test from "node:test";
import assert from "node:assert/strict";
import { observeWorkerAfterRehydration, WORKER_URL } from "./worker-native-bridge.mjs";
import { NATIVE_REQUIRED_DOMAINS, NATIVE_EXPECTED_REPOSITORY } from "./worker-native-context.mjs";
const h="a".repeat(40);
function native() {return {
 schema:"LYVRA_NATIVE_EVIDENCE_CONTEXT_V1",system_id:"LYVRA",namespace:"LYVRA",
 branch_class:"MAIN_PERSONAL",repository:NATIVE_EXPECTED_REPOSITORY,branch:"lyvra",
 commit_sha:h,pointer_blob_sha:h,manifest_blob_sha:h,fingerprint_registry_blob_sha:h,
 freshness_epoch:"2026-10-01-REV92-U4-NEWCHAT",
 domain_coverage:Object.fromEntries(NATIVE_REQUIRED_DOMAINS.map(x=>[x,"VERIFIED"])),
 request_nonce:"nonce-0123456789abcdefghijk"
};}
function root() {return {ok:true,worker_status:"WORKER_VERIFIED",root_checksum:"demo",authority_root:{
 system_id:"LYVRA",namespace:"LYVRA",authority_context:"LYVRA_MAIN_PERSONAL",
 branch_class:"MAIN_PERSONAL",execution_host:"CHATGPT_EXECUTION_LAYER",
 authority:{
 worker_is_absolute_root_of_trust:false,worker_is_system_owner:false,
 worker_is_creative_authority:false,worker_replaces_canonical_storage:false,
 host_may_claim_authority:false,host_may_impersonate_system:false},
 evidence_policy:{worker_unavailable_is_system_failure:false,
 personal_main_system_only:true,portable_branch_inherits_worker:false,
 cross_system_authority_inheritance:false}
}};}
function response(data=root()){return {status:200,headers:{get:()=> "application/json"},text:async()=>JSON.stringify(data)};}
test("never touches Worker if native readback has not been externally verified",async()=>{
 let calls=0;const x=await observeWorkerAfterRehydration({nativeEnvelope:native(),fetchImpl:()=>{calls++;throw Error("BAD");}});
 assert.equal(x.state,"NATIVE_REHYDRATION_PENDING");assert.equal(calls,0);
});
test("successful public GET observes contract without claiming signed authority",async()=>{
 let u,opts;
 const x=await observeWorkerAfterRehydration({nativeReadbackVerified:true,nativeEnvelope:native(),
 fetchImpl:async(url,options)=>{u=url;opts=options;return response();}});
 assert.equal(x.state,"WORKER_PUBLIC_CONTEXT_OBSERVED");assert.equal(x.worker_evidence_valid,false);
 assert.match(x.native_context_digest,/^[a-f0-9]{64}$/);
 assert.equal(u,WORKER_URL+"/v2/authority-root?system=LYVRA");
 assert.equal(opts.method,"GET");assert.equal(opts.redirect,"error");
});
test("foreign namespace and worker owner takeover are rejected",async()=>{
 for(const edit of [r=>r.authority_root.namespace="666CLIC",
 r=>r.authority_root.authority.worker_is_absolute_root_of_trust=true,
 r=>r.authority_root.evidence_policy.worker_unavailable_is_system_failure=true]){
  const r=root();edit(r);
  const x=await observeWorkerAfterRehydration({nativeReadbackVerified:true,nativeEnvelope:native(),fetchImpl:async()=>response(r)});
  assert.equal(x.state,"WORKER_CONTEXT_CONFLICT");
 }
});
test("unreachable or malformed worker never erases native success",async()=>{
 for(const fetchImpl of [async()=>{throw Error("network");},async()=>({status:503}),async()=>response({ok:true})]){
  const x=await observeWorkerAfterRehydration({nativeReadbackVerified:true,nativeEnvelope:native(),fetchImpl});
  assert.ok(["WORKER_UNAVAILABLE","WORKER_CONTEXT_CONFLICT"].includes(x.state));
  assert.equal(x.worker_evidence_valid,false);
 }
});
test("invalid native envelope rejects before network",async()=>{
 let calls=0;const e=native();e.domain_coverage.THINKING_CONTINUITY="READBACK_PENDING";
 const x=await observeWorkerAfterRehydration({nativeReadbackVerified:true,nativeEnvelope:e,fetchImpl:async()=>{calls++;return response();}});
 assert.equal(x.state,"NATIVE_CONTEXT_INVALID");assert.equal(calls,0);
});
test("oversized response fails without accepting worker",async()=>{
 const x=await observeWorkerAfterRehydration({nativeReadbackVerified:true,nativeEnvelope:native(),fetchImpl:async()=>({
 status:200,headers:{get:k=>k==="content-length"?"70000":"application/json"},text:async()=>JSON.stringify(root())})});
 assert.equal(x.state,"WORKER_INVALID_RESPONSE");
});
