import test from "node:test";
import assert from "node:assert/strict";
import {makeNativeClientProof,issueNativeContextTicket,verifyNativeContextTicket} from "./worker-native-v3.mjs";
import {NATIVE_REQUIRED_DOMAINS,NATIVE_EXPECTED_REPOSITORY} from "./worker-native-context.mjs";
const client="client-auth-secret-very-long-at-least-32-characters";
const server="ticket-sign-secret-very-long-at-least-32-characters";
const time=1791153600, nonce="nonce-0123456789abcdefghijk",hex="a".repeat(40);
const envelope=()=>({schema:"LYVRA_NATIVE_EVIDENCE_CONTEXT_V1",system_id:"LYVRA",namespace:"LYVRA",
 branch_class:"MAIN_PERSONAL",repository:NATIVE_EXPECTED_REPOSITORY,branch:"lyvra",commit_sha:hex,
 pointer_blob_sha:hex,manifest_blob_sha:hex,fingerprint_registry_blob_sha:hex,
 freshness_epoch:"2026-10-01-REV92-U4-NEWCHAT",
 domain_coverage:Object.fromEntries(NATIVE_REQUIRED_DOMAINS.map(d=>[d,"VERIFIED"])),request_nonce:nonce});
const request=()=>({purpose:"BOOT",envelope:envelope()});
const replays=()=>{const set=new Set();return async(key)=>{if(set.has(key))return false;set.add(key);return true;};};
async function issue(overrides={}) {const body=overrides.body??request();const timestamp=overrides.timestamp??time;
 const n=overrides.nonce??nonce;const secret=overrides.clientSecret??client;
 const proof=overrides.proof??await makeNativeClientProof({timestamp,nonce:n,body,clientSecret:secret});
 return issueNativeContextTicket({body,timestamp,nonce:n,proof,clientSecret:client,ticketSecret:server,
   consumeNonce:overrides.consumeNonce??replays(),now:overrides.now??time});
}
test("valid authenticated BOOT issuance signs repository context and verifies",async()=>{
 const r=await issue();assert.equal(r.ok,true);assert.equal(r.native_rehydration_verified_by_worker,false);
 const v=await verifyNativeContextTicket({ticket:r.ticket,expectedEnvelope:envelope(),expectedPurpose:"BOOT",ticketSecret:server,now:time});
 assert.equal(v.ok,true);assert.equal(v.context_digest,r.context_digest);
});
test("wrong client proof rejected before nonce consumption",async()=>{
 let consumed=false;const r=await issue({clientSecret:"wrong-long-secret-not-equal-client-key",consumeNonce:async()=>{consumed=true;return true;}});
 assert.equal(r.state,"CLIENT_NOT_AUTHENTICATED");assert.equal(consumed,false);
});
test("missing secret and missing replay infrastructure fail closed",async()=>{
 const b=request(),p=await makeNativeClientProof({timestamp:time,nonce,body:b,clientSecret:client});
 const a=await issueNativeContextTicket({body:b,timestamp:time,nonce,proof:p,clientSecret:"",ticketSecret:server,consumeNonce:replays(),now:time});
 const z=await issueNativeContextTicket({body:b,timestamp:time,nonce,proof:p,clientSecret:client,ticketSecret:server,now:time});
 assert.equal(a.state,"AUTH_NOT_CONFIGURED");assert.equal(z.state,"ATOMIC_REPLAY_STORE_NOT_CONFIGURED");
});
test("replaying an already-used nonce is rejected",async()=>{
 const consumed=replays();assert.equal((await issue({consumeNonce:consumed})).ok,true);
 assert.equal((await issue({consumeNonce:consumed})).state,"REPLAY_DETECTED");
});
test("timestamp older than skew is rejected",async()=>{assert.equal((await issue({now:time+61})).state,"STALE_REQUEST");});
test("nonce must match bound native context",async()=>{
 const n="another-valid-nonce-0123456789abc";
 const r=await issue({nonce:n});assert.equal(r.state,"NONCE_CONTEXT_MISMATCH");
});
test("forged payload and forged signature fail verification",async()=>{
 const r=await issue();let parts=r.ticket.split(".");parts[1]=parts[1].slice(0,-1)+(parts[1].at(-1)==="a"?"b":"a");
 const v=await verifyNativeContextTicket({ticket:parts.join("."),expectedEnvelope:envelope(),expectedPurpose:"BOOT",ticketSecret:server,now:time});
 assert.equal(v.ok,false);
});
test("stale ticket rejected",async()=>{
 const r=await issue();const v=await verifyNativeContextTicket({ticket:r.ticket,expectedEnvelope:envelope(),expectedPurpose:"BOOT",ticketSecret:server,now:time+100});
 assert.equal(v.state,"TOKEN_EXPIRED_OR_FUTURE");
});
test("wrong purpose rejected",async()=>{
 const r=await issue();const v=await verifyNativeContextTicket({ticket:r.ticket,expectedEnvelope:envelope(),expectedPurpose:"RECOVERY",ticketSecret:server,now:time});
 assert.equal(v.state,"BAD_CLAIMS");
});
test("mismatched native GitHub commit rejected",async()=>{
 const r=await issue();const e=envelope();e.commit_sha="c".repeat(40);
 const v=await verifyNativeContextTicket({ticket:r.ticket,expectedEnvelope:e,expectedPurpose:"BOOT",ticketSecret:server,now:time});
 assert.equal(v.state,"NATIVE_CONTEXT_CONFLICT");
});
test("foreign context fails before signing",async()=>{
 const b=request();b.envelope.namespace="666CLIC";
 assert.equal((await issue({body:b})).state,"NATIVE_CONTEXT_INVALID");
});
test("atomic replay store errors prevent issuance",async()=>{
 const r=await issue({consumeNonce:async()=>{throw Error("storage unavailable");}});
 assert.equal(r.state,"REPLAY_STORE_UNAVAILABLE");
});
