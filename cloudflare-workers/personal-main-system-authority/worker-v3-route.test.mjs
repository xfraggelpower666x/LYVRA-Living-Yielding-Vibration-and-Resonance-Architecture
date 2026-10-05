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
function makeMockDOStorage(){
 const seen=new Map();let alarm=null;let tail=Promise.resolve();
 const storage={
  // Serialize each transaction to approximate single-actor DO storage behavior.
  transaction:async fn=>{
   let unlock;const prior=tail;tail=new Promise(resolve=>{unlock=resolve;});
   await prior;
   const backup=new Map(seen),priorAlarm=alarm;
   try{return await fn({});}
   catch(e){seen.clear();for(const [k,v] of backup)seen.set(k,v);alarm=priorAlarm;throw e;}
   finally{unlock();}
  },
  get:async key=>seen.get(key),
  put:async(key,value)=>{seen.set(key,value);},
  delete:async key=>seen.delete(key),
  list:async({prefix,limit})=>new Map([...seen].filter(([key])=>key.startsWith(prefix)).sort((a,b)=>a[0].localeCompare(b[0])).slice(0,limit)),
  setAlarm:async ms=>{alarm=ms;},getAlarm:async()=>alarm,
  snapshot:()=>new Map(seen)
 };
 return storage;
}
function nonceStore(){const storage=makeMockDOStorage();const gate=new NativeV3NonceGate({storage});
 return {idFromName:name=>name,get:()=>({fetch:(url,options)=>gate.fetch(new Request(url,options))}),
   storage,gate};}
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
test("replay backend HTTP failure is unavailable, never replay denial",async()=>{
 const data=body(),headers=await signedHeaders(data);
 const broken={idFromName:()=>"test",get:()=>({fetch:async()=>new Response("failure",{status:503})})};
 const response=await handleNativeV3Route(req("/v3/native-evidence",data,headers),env({NATIVE_V3_NONCES:broken}));
 assert.equal(response.status,503);
 assert.equal((await response.json()).state,"REPLAY_STORE_UNAVAILABLE");
});
test("malformed replay backend reply fails closed as unavailable",async()=>{
 const data=body(),headers=await signedHeaders(data);
 const broken={idFromName:()=>"test",get:()=>({fetch:async()=>new Response(JSON.stringify({other:true}),{status:200,headers:{"content-type":"application/json"}})})};
 const response=await handleNativeV3Route(req("/v3/native-evidence",data,headers),env({NATIVE_V3_NONCES:broken}));
 assert.equal(response.status,503);
 assert.equal((await response.json()).state,"REPLAY_STORE_UNAVAILABLE");
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
 const verifyBody={ticket:v.ticket,expectedEnvelope:data.envelope,expectedPurpose:"BOOT"};
 const verifyTime=Math.floor(Date.now()/1000);
 const verifyProof=await makeNativeClientProof({path:"/v3/verify-native-evidence",timestamp:verifyTime,
   nonce,body:verifyBody,clientSecret:client});
 const checked=await handleNativeV3Route(req("/v3/verify-native-evidence",verifyBody,{
 "x-lyvra-timestamp":String(verifyTime),"x-lyvra-nonce":nonce,"x-lyvra-proof":verifyProof
 }),env({NATIVE_V3_NONCES:replay}));
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
 const storage=makeMockDOStorage();const gate=new NativeV3NonceGate({storage});
 const body={key:"LYVRA:"+nonce,expires:Math.floor(Date.now()/1000)+90};
 const make=()=>gate.fetch(new Request("https://native-v3-internal/consume",{
 method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}));
 const a=await(await make()).json(),b=await(await make()).json();
 assert.equal(a.consumed,true);assert.equal(b.consumed,false);
});

test("verify endpoint rejects absent client HMAC proof",async()=>{
 const payload={ticket:"fake.ticket.value",expectedEnvelope:body().envelope,expectedPurpose:"BOOT"};
 const r=await handleNativeV3Route(req("/v3/verify-native-evidence",payload),env());
 assert.equal(r.status,403);assert.equal((await r.json()).state,"CLIENT_NOT_AUTHENTICATED");
});
test("issue proof cannot be replayed at verify path",async()=>{
 const payload={ticket:"fake.ticket.value",expectedEnvelope:body().envelope,expectedPurpose:"BOOT"};
 const timestamp=Math.floor(Date.now()/1000);
 const other=await makeNativeClientProof({timestamp,nonce,body:payload,clientSecret:client,path:"/v3/native-evidence"});
 const r=await handleNativeV3Route(req("/v3/verify-native-evidence",payload,{
 "x-lyvra-timestamp":String(timestamp),"x-lyvra-nonce":nonce,"x-lyvra-proof":other}),env());
 assert.equal(r.status,403);assert.equal((await r.json()).state,"CLIENT_NOT_AUTHENTICATED");
});
test("stale verify timestamp is rejected",async()=>{
 const payload={ticket:"fake.ticket.value",expectedEnvelope:body().envelope,expectedPurpose:"BOOT"};
 const timestamp=Math.floor(Date.now()/1000)-70;
 const p=await makeNativeClientProof({timestamp,nonce,body:payload,clientSecret:client,path:"/v3/verify-native-evidence"});
 const r=await handleNativeV3Route(req("/v3/verify-native-evidence",payload,{
 "x-lyvra-timestamp":String(timestamp),"x-lyvra-nonce":nonce,"x-lyvra-proof":p}),env());
 assert.equal(r.status,403);assert.equal((await r.json()).state,"CLIENT_NOT_AUTHENTICATED");
});

test("replayed signed verify request fails after first successful verification",async()=>{
 const replay=nonceStore(),data=body();
 const issued=await handleNativeV3Route(req("/v3/native-evidence",data,await signedHeaders(data)),
  env({NATIVE_V3_NONCES:replay}));
 assert.equal(issued.status,200);
 const ticket=(await issued.json()).ticket;
 const verifyBody={ticket,expectedEnvelope:data.envelope,expectedPurpose:"BOOT"};
 const at=Math.floor(Date.now()/1000);
 const proof=await makeNativeClientProof({path:"/v3/verify-native-evidence",timestamp:at,
   nonce,body:verifyBody,clientSecret:client});
 const headers={"x-lyvra-timestamp":String(at),"x-lyvra-nonce":nonce,"x-lyvra-proof":proof};
 const first=await handleNativeV3Route(req("/v3/verify-native-evidence",verifyBody,headers),
  env({NATIVE_V3_NONCES:replay}));
 const second=await handleNativeV3Route(req("/v3/verify-native-evidence",verifyBody,headers),
  env({NATIVE_V3_NONCES:replay}));
 assert.equal(first.status,200);
 assert.equal(second.status,403);
 assert.equal((await second.json()).state,"REPLAY_DETECTED");
});
test("verify fails closed without nonce store even for a valid signed ticket",async()=>{
 const replay=nonceStore(),data=body();
 const issued=await handleNativeV3Route(req("/v3/native-evidence",data,await signedHeaders(data)),
  env({NATIVE_V3_NONCES:replay}));
 const ticket=(await issued.json()).ticket;
 const verifyBody={ticket,expectedEnvelope:data.envelope,expectedPurpose:"BOOT"};
 const at=Math.floor(Date.now()/1000);
 const proof=await makeNativeClientProof({path:"/v3/verify-native-evidence",timestamp:at,
   nonce,body:verifyBody,clientSecret:client});
 const response=await handleNativeV3Route(req("/v3/verify-native-evidence",verifyBody,
 {"x-lyvra-timestamp":String(at),"x-lyvra-nonce":nonce,"x-lyvra-proof":proof}),env());
 assert.equal(response.status,503);
 assert.equal((await response.json()).state,"ATOMIC_REPLAY_STORE_NOT_CONFIGURED");
});
test("nonce gate refuses an invalid verification-prefixed key",async()=>{
 const gate=new NativeV3NonceGate({storage:{transaction:async()=>{throw Error("should not persist");}}});
 const body={key:"LYVRA:V:bad",expires:Math.floor(Date.now()/1000)+90};
 const r=await gate.fetch(new Request("https://native-v3-internal/consume",{
 method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)}));
 assert.equal(r.status,400);
});

test("transactional nonce store creates expiry index and schedules cleanup alarm",async()=>{
 const storage=makeMockDOStorage(),gate=new NativeV3NonceGate({storage});
 const expires=Math.floor(Date.now()/1000)+90,key="LYVRA:"+nonce;
 const r=await gate.fetch(new Request("https://native-v3-internal/consume",{
 method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key,expires})}));
 assert.equal((await r.json()).consumed,true);
 assert.equal(storage.snapshot().get(key).expires,expires);
 assert.ok([...storage.snapshot().keys()].some(x=>x.startsWith("EXP:")));
 assert.equal(await storage.getAlarm(),expires*1000+1000);
});
test("alarm keeps unexpired nonces and deletes once expired",async()=>{
 const storage=makeMockDOStorage(),gate=new NativeV3NonceGate({storage});
 const expires=Math.floor(Date.now()/1000)+80,key="LYVRA:"+nonce;
 await gate.fetch(new Request("https://native-v3-internal/consume",{
 method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key,expires})}));
 const before=await gate.alarm();
 assert.equal(before.processed,0);assert.ok(storage.snapshot().has(key));
 // Emulate a scheduled alarm firing after expiration without wall-clock waits.
 const realNow=Date.now; Date.now=()=>expires*1000+2000;
 try{const after=await gate.alarm();assert.equal(after.processed,1);}
 finally{Date.now=realNow;}
 assert.equal(storage.snapshot().has(key),false);
 assert.equal([...storage.snapshot().keys()].filter(x=>x.startsWith("EXP:")).length,0);
});
test("storage lacking transactional alarms is fail-closed",async()=>{
 const gate=new NativeV3NonceGate({storage:{transaction:async fn=>fn({
 get:async()=>undefined,put:async()=>{}})}});
 const expires=Math.floor(Date.now()/1000)+90;
 const r=await gate.fetch(new Request("https://native-v3-internal/consume",{
 method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key:"LYVRA:"+nonce,expires})}));
 assert.equal(r.status,503);assert.equal((await r.json()).state,"REPLAY_STORE_UNAVAILABLE");
});

test("concurrent identical nonce issue requests commit exactly once",async()=>{
 const store=nonceStore(),data=body(),headers=await signedHeaders(data);
 const results=await Promise.all(Array.from({length:32},()=>handleNativeV3Route(req("/v3/native-evidence",data,headers),env({NATIVE_V3_NONCES:store}))));
 const codes=results.map(x=>x.status);assert.equal(codes.filter(x=>x===200).length,1);
 assert.equal(codes.filter(x=>x===403).length,31);
 assert.equal([...store.storage.snapshot().keys()].filter(x=>x.startsWith("EXP:")).length,1);
});
test("expiry alarm drains a multi-page backlog without deleting live nonces",async()=>{
 const storage=makeMockDOStorage(),gate=new NativeV3NonceGate({storage});
 const fixed=Math.floor(Date.now()/1000),base=Date.now;
 for(let i=0;i<260;i++){
   const key="LYVRA:"+("nonce-abcdefghijklmnopqrstuv"+String(i).padStart(6,"0"));
   const expires=fixed+(i<258?2:100);
   const r=await gate.fetch(new Request("https://native-v3-internal/consume",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key,expires})}));
   assert.equal((await r.json()).consumed,true);
 }
 Date.now=()=> (fixed+4)*1000;
 try {
   let count=0;for(let k=0;k<4;k++){const v=await gate.alarm();count+=v.processed;if(count===258)break;}
   assert.equal(count,258);
 } finally{Date.now=base;}
 assert.equal([...storage.snapshot().keys()].filter(k=>k.startsWith("EXP:")).length,2);
 assert.equal([...storage.snapshot().keys()].filter(k=>k.startsWith("LYVRA:")).length,2);
});
test("failed alarm write atomically rolls back nonce and its expiry index",async()=>{
 const storage=makeMockDOStorage();
 storage.setAlarm=async()=>{throw Error("ALARM_UNAVAILABLE");};
 const gate=new NativeV3NonceGate({storage});
 const key="LYVRA:"+nonce,expires=Math.floor(Date.now()/1000)+60;
 const r=await gate.fetch(new Request("https://native-v3-internal/consume",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key,expires})}));
 assert.equal(r.status,503);
 assert.equal(storage.snapshot().size,0);
});

test("expiry alarm preserves earlier alarm added concurrently by a new issuance",async()=>{
 const storage=makeMockDOStorage(),gate=new NativeV3NonceGate({storage});
 const expires=Math.floor(Date.now()/1000)+80,key="LYVRA:"+nonce;
 const response=await gate.fetch(new Request("https://native-v3-internal/consume",{
 method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key,expires})}));
 assert.equal(response.status,200);
 const earlier=expires*1000-5000;
 const originalList=storage.list;
 storage.list=async args=>{
   const rows=await originalList(args);
   // Simulate a different issuance changing the current DO alarm during the scan.
   await storage.setAlarm(earlier);
   return rows;
 };
 const result=await gate.alarm();
 assert.equal(result.processed,0);
 assert.equal(await storage.getAlarm(),earlier);
 assert.equal(storage.snapshot().has(key),true);
});
test("expiry alarm replaces an obsolete elapsed alarm with next live expiry",async()=>{
 const storage=makeMockDOStorage(),gate=new NativeV3NonceGate({storage});
 const expires=Math.floor(Date.now()/1000)+80,key="LYVRA:"+nonce;
 await gate.fetch(new Request("https://native-v3-internal/consume",{
 method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({key,expires})}));
 await storage.setAlarm(Date.now()-10000);
 const result=await gate.alarm();
 assert.equal(result.processed,0);
 assert.equal(await storage.getAlarm(),expires*1000+1000);
});
