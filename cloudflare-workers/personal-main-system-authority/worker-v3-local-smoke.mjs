/**
 * CI-only loopback smoke of real Wrangler local Worker + SQLite Durable Object.
 * Uses runner-generated secrets. Never calls production, GitHub CURRENT or live.
 */
import assert from "node:assert/strict";
import {randomBytes} from "node:crypto";
import {makeNativeClientProof} from "./worker-native-v3.mjs";
import {NATIVE_REQUIRED_DOMAINS,NATIVE_EXPECTED_REPOSITORY} from "./worker-native-context.mjs";
const base="http://127.0.0.1:8789";
const client=process.env.CI_NATIVE_V3_CLIENT_SECRET;
if(!client||client.length<32)throw Error("NO_EPHEMERAL_CI_CLIENT");
const nonce=randomBytes(24).toString("base64url");
const h="a".repeat(40);
const envelope={schema:"LYVRA_NATIVE_EVIDENCE_CONTEXT_V1",system_id:"LYVRA",
 namespace:"LYVRA",branch_class:"MAIN_PERSONAL",repository:NATIVE_EXPECTED_REPOSITORY,
 branch:"lyvra",commit_sha:h,pointer_blob_sha:h,manifest_blob_sha:h,
 fingerprint_registry_blob_sha:h,freshness_epoch:"CI_WORKER_LOCAL_ONLY",
 domain_coverage:Object.fromEntries(NATIVE_REQUIRED_DOMAINS.map(x=>[x,"VERIFIED"])),
 request_nonce:nonce};
async function post(path,body,at,proof){const r=await fetch(base+path,{method:"POST",headers:{
 "content-type":"application/json","x-lyvra-timestamp":String(at),"x-lyvra-nonce":nonce,
 "x-lyvra-proof":proof},body:JSON.stringify(body),signal:AbortSignal.timeout(5000)});
 return {status:r.status,payload:await r.json()};}
const health=await fetch(base+"/health",{signal:AbortSignal.timeout(5000)});
assert.equal(health.status,200);
const data={purpose:"BOOT",envelope};
const now=Math.floor(Date.now()/1000);
const auth=await makeNativeClientProof({timestamp:now,nonce,body:data,clientSecret:client});
const issued=await post("/v3/native-evidence",data,now,auth);
assert.equal(issued.status,200,JSON.stringify(issued.payload));
assert.equal(issued.payload.state,"SIGNED_NATIVE_CONTEXT_CLAIM");
assert.equal(issued.payload.native_rehydration_verified_by_worker,false);
const repeated=await post("/v3/native-evidence",data,now,auth);
assert.equal(repeated.status,403,JSON.stringify(repeated.payload));
assert.equal(repeated.payload.state,"REPLAY_DETECTED");
const verifyBody={ticket:issued.payload.ticket,expectedEnvelope:envelope,expectedPurpose:"BOOT"};
const t=Math.floor(Date.now()/1000);
const vp=await makeNativeClientProof({path:"/v3/verify-native-evidence",timestamp:t,nonce,body:verifyBody,clientSecret:client});
const verified=await post("/v3/verify-native-evidence",verifyBody,t,vp);
assert.equal(verified.status,200,JSON.stringify(verified.payload));
assert.equal(verified.payload.state,"NATIVE_CONTEXT_TICKET_VERIFIED");
const twice=await post("/v3/verify-native-evidence",verifyBody,t,vp);
assert.equal(twice.status,403,JSON.stringify(twice.payload));
assert.equal(twice.payload.state,"REPLAY_DETECTED");
const bad=await post("/v3/native-evidence",{...data,purpose:"RECOVERY"},now,auth);
assert.equal(bad.status,403,JSON.stringify(bad.payload));
assert.equal(bad.payload.state,"CLIENT_NOT_AUTHENTICATED");
const raceNonce=randomBytes(24).toString("base64url");
const raceEnvelope={...envelope,request_nonce:raceNonce};
const raceData={purpose:"BOOT",envelope:raceEnvelope};
const raceAt=Math.floor(Date.now()/1000);
const raceProof=await makeNativeClientProof({timestamp:raceAt,nonce:raceNonce,body:raceData,clientSecret:client});
const race=await Promise.all(Array.from({length:32},async()=>{
 const r=await fetch(base+"/v3/native-evidence",{method:"POST",headers:{
 "content-type":"application/json","x-lyvra-timestamp":String(raceAt),
 "x-lyvra-nonce":raceNonce,"x-lyvra-proof":raceProof},
 body:JSON.stringify(raceData),signal:AbortSignal.timeout(10000)});
 return {status:r.status,data:await r.json()};
}));
assert.equal(race.filter(x=>x.status===200).length,1,"exactly one local DO issuance is required");
assert.equal(race.filter(x=>x.status===403&&x.data.state==="REPLAY_DETECTED").length,31,
 "other concurrent identical requests must be blocked atomically");
console.log("LOCAL_SQLITE_DO_32_PARALLEL_NONCE_RACE=PASS");
console.log("LOCAL_WRANGLER_DO_ISSUE_VERIFY_REPLAY=PASS");
console.log("LOCAL_WORKER_NATIVE_GITHUB_READBACK=NOT_VERIFIED");
console.log("PRODUCTION_DEPLOYMENT=FALSE");
