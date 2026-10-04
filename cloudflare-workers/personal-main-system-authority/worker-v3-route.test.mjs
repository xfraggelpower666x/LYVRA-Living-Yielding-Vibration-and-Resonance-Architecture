import test from "node:test";
import assert from "node:assert/strict";
import {handleNativeV3Route,NativeV3NonceGate} from "./worker-v3-route.mjs";
import {makeNativeClientProof} from "./worker-native-v3.mjs";
import {NATIVE_REQUIRED_DOMAINS,NATIVE_EXPECTED_REPOSITORY} from "./worker-native-context.mjs";
const client="client-secret-abcdefghijklmnopqrstuvwxyz123456";
const signer="signing-secret-abcdefghijklmnopqrstuvwxyz1234";
const nonce="nonce-0123456789abcdefghijk";
const hex="a".repeat(40);
function body(){return {purpose:"BOOT",envelope:{schema:"LYVRA_NATIVE_EVIDENCE_CONTEXT_V1",system_id:"LYVRA",
 namespace:"LYVRA",branch_class:"MAIN_PERSONAL",repository:NATIVE_EXPECTED_REPOSITORY,
 branch:"lyvra",commit_sha:hex,pointer_blob_sha:hex,manifest_blob_sha:hex,
 fingerprint_registry_blob_sha:hex,freshness_epoch:"2026-10-01-REV92-U4-NEWCHAT",
 domain_coverage:Object.fromEntries(NATIVE_REQUIRED_DOMAINS.map(x=>[x,"VERIFIED"])),request_nonce:nonce}};}
function req(path="/v3/native-evidence",data=body(),extra={}) {return new Request("https://lyvrasystem.666soundsdesign-broadcaster.com"+path,{
 method:"POST",headers:{"content-type":"application/json",...extra},body:JSON.stringify(data)});}
function env(overrides={}) {return {NATIVE_V3_ENABLED:"true",NATIVE_V3_CLIENT_SECRET:client,
 NATIVE_V3_TICKET_SECRET:signer,...overrides};}
function nonceStore(){const seen=new Map();const storage={transaction:async fn=>fn({get:async key=>seen.get(key),
 put:async(key,value)=>{seen.set(key,value);}})};
 const gate=new NativeV3NonceGate({storage});
 return {idFromName:name=>name,get:()=>({fetch:(url,options)=>gate.fetch(new Request(url,options))})};}
async function signedHeaders(data=body(),now=Math.floor(Date.now()/1000)){
 return {"x-lyvra-timestamp":String(now),"x-lyvra-nonce":nonce,
 "x-lyvra-proof":await makeNativeClientProof({timestamp:now,nonce,body:data,clientSecret:client})};}
test("default v3 route is explicitly disabled",async()=>{
 const x=await handleNativeV3Route(req(),{});assert.equal(x.status,404);
 assert.equal((await x.json()).state,"V3_DISABLED");
});
test("opt-in with missing client secrets must fail closed",async()=>{
 const x=await handleNativeV3Route(req(),{NATIVE_V3_ENABLED:"true"});
 assert.equal(x.status,503);assert.equal((await x.json()).state,"AUTH_NOT_CONFIGURED");
});
test("no replay backend means no ticket issuance",async()=>{
 const x=await handleNativeV3Route(req(),env());assert.equal(x.status,503);
 assert.equal((await x.json()).state,"ATOMIC_REPLAY_STORE_NOT_CONFIGURED");
});
test("bad client proof denied before replay consumption",async()=>{
 const x=await handleNativeV3Route(req(undefined,undefined,{"x-lyvra-proof":"wrong",
 "x-lyvra-timestamp":String(Math.floor(Date.now()/1000)),
 "x-lyvra-nonce":nonce}),env({NATIVE_V3_NONCES:nonceStore()}));
 assert.equal(x.status,403);assert.equal((await x.json()).state,"CLIENT_NOT_AUTHENTICATED");
});
test("valid v3 ticket verifies against the exact native context",async()=>{
 const replay=nonceStore();const data=body();
 const issued=await handleNativeV3Route(req("/v3/native-evidence",data,await signedHeaders(data)),
 env({NATIVE_V3_NONCES:replay}));
 assert.equal(issued.status,200);
 const v=await issued.json();assert.equal(v.state,"SIGNED_NATIVE_CONTEXT_CLAIM");assert.equal(v.native_rehydration_verified_by_worker,false);
 const checked=await handleNativeV3Route(req("/v3/verify-native-evidence",{
 ticket:v.ticket,expectedEnvelope:data.envelope,expectedPurpose:"BOOT"}),env({NATIVE_V3_NONCES:replay}));
 assert.equal(checked.status,200);assert.equal((await checked.json()).state,"NATIVE_CONTEXT_TICKET_VERIFIED");
});
test("replayed native nonce rejected by atomic store",async()=>{
 const replay=nonceStore();const data=body(),headers=await signedHeaders(data);
 const a=await handleNativeV3Route(req("/v3/native-evidence",data,headers),env({NATIVE_V3_NONCES:replay}));
 const b=await handleNativeV3Route(req("/v3/native-evidence",data,headers),env({NATIVE_V3_NONCES:replay}));
 assert.equal(a.status,200);assert.equal(b.status,403);assert.equal((await b.json()).state,"REPLAY_DETECTED");
});
test("browser origin cannot use privileged ticket route",async()=>{
 const x=await handleNativeV3Route(req(undefined,undefined,{origin:"https://malicious.example"}),env({NATIVE_V3_NONCES:nonceStore()}));
 assert.equal(x.status,403);assert.equal((await x.json()).state,"BROWSER_ORIGIN_REJECTED");
});
test("oversized payload refused",async()=>{
 const x=await handleNativeV3Route(req("/v3/native-evidence",{padding:"x".repeat(8500)}),env({NATIVE_V3_NONCES:nonceStore()}));
 assert.equal(x.status,400);
});
test("a missing binding never becomes writable fallback",async()=>{
 const x=await handleNativeV3Route(req(),env({NATIVE_V3_NONCES:{get:()=>({})}}));
 assert.equal(x.status,503);
});
test("object transaction prevents duplicate tickets in serial backend",async()=>{
 const storage=new Map();const gate=new NativeV3NonceGate({storage:{transaction:async cb=>cb({
 get:async key=>storage.get(key),put:async(key,value)=>storage.set(key,value)})}});
 const body={key:"LYVRA:"+nonce,expires:Math.floor(Date.now()/1000)+90};
 const make=()=>gate.fetch(new Request("https://native-v3-internal/consume",{
 method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}));
 const a=await(await make()).json(),b=await(await make()).json();
 assert.equal(a.consumed,true);assert.equal(b.consumed,false);
});
