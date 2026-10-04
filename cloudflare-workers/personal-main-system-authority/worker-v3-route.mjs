/**
 * OPTIONAL LYVRA Worker v3 route. Disabled unless NATIVE_V3_ENABLED=="true".
 * No mutation to legacy/v2 Worker routes. Never writes LYVRA native state.
 * The signing secret / client key are ONLY Cloudflare server-side bindings.
 */
import {issueNativeContextTicket,verifyNativeContextTicket,verifyNativeClientProof} from "./worker-native-v3.mjs";
const MAX_BYTES=8192;
const ALLOWED=new Set(["/v3/native-evidence","/v3/verify-native-evidence"]);
function respond(status,state,extra={}) {
 return new Response(JSON.stringify({ok:status>=200&&status<300,state,...extra}),{
 status,headers:{"content-type":"application/json; charset=utf-8","cache-control":"no-store","x-content-type-options":"nosniff"}});
}
async function boundedJson(request) {
 const length=Number(request.headers.get("content-length")||0);
 if(!Number.isFinite(length)||length>MAX_BYTES)throw Error("BODY_TOO_LARGE");
 const reader=request.body?.getReader();
 if(!reader)throw Error("BODY_REQUIRED");
 let total=0,bytes=[];
 try {
  while(true){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;
   if(total>MAX_BYTES)throw Error("BODY_TOO_LARGE");bytes.push(value);}
 }finally{reader.releaseLock();}
 const merged=new Uint8Array(total);let offset=0;
 for(const part of bytes){merged.set(part,offset);offset+=part.byteLength;}
 const value=JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(merged));
 if(!value||Array.isArray(value)||typeof value!=="object")throw Error("BAD_JSON");
 return value;
}
function replayConsumer(env){
 if(!env.NATIVE_V3_NONCES||typeof env.NATIVE_V3_NONCES.idFromName!=="function"||
    typeof env.NATIVE_V3_NONCES.get!=="function") return null;
 return async (key,expires)=> {
  const stub=env.NATIVE_V3_NONCES.get(env.NATIVE_V3_NONCES.idFromName("LYVRA_MAIN_PERSONAL_V3"));
  const response=await stub.fetch("https://native-v3-internal/consume",{
   method:"POST",headers:{"content-type":"application/json"},
   body:JSON.stringify({key,expires})});
  if(!response.ok)return false;
  const data=await response.json();
  return data?.consumed===true;
 };
}
export async function handleNativeV3Route(request,env={}) {
 const pathname=new URL(request.url).pathname;
 if(!ALLOWED.has(pathname))return null;
 if(env.NATIVE_V3_ENABLED!=="true")return respond(404,"V3_DISABLED");
 if(request.method!=="POST")return respond(405,"METHOD_NOT_ALLOWED");
 if(!request.headers.get("content-type")?.toLowerCase().startsWith("application/json"))
  return respond(415,"JSON_REQUIRED");
 if(request.headers.get("origin"))return respond(403,"BROWSER_ORIGIN_REJECTED");
 if(typeof env.NATIVE_V3_CLIENT_SECRET!=="string"||typeof env.NATIVE_V3_TICKET_SECRET!=="string"||
    env.NATIVE_V3_CLIENT_SECRET.length<32||env.NATIVE_V3_TICKET_SECRET.length<32||
    env.NATIVE_V3_CLIENT_SECRET===env.NATIVE_V3_TICKET_SECRET)
   return respond(503,"AUTH_NOT_CONFIGURED");
 let payload;
 try {payload=await boundedJson(request);}
 catch {return respond(400,"BAD_OR_OVERSIZED_JSON");}
 if(pathname==="/v3/native-evidence"){
  const consumeNonce=replayConsumer(env);
  if(!consumeNonce)return respond(503,"ATOMIC_REPLAY_STORE_NOT_CONFIGURED");
  const timestamp=Number(request.headers.get("x-lyvra-timestamp"));
  const nonce=request.headers.get("x-lyvra-nonce");
  const proof=request.headers.get("x-lyvra-proof");
  const result=await issueNativeContextTicket({body:payload,timestamp,nonce,proof,
    clientSecret:env.NATIVE_V3_CLIENT_SECRET,ticketSecret:env.NATIVE_V3_TICKET_SECRET,
    consumeNonce});
  return respond(result.ok?200:403,result.state,result.ok?{ticket:result.ticket,
    expires_at:result.expires_at,context_digest:result.context_digest,
    native_rehydration_verified_by_worker:false}:{});
 }
 if(Object.keys(payload).sort().join("|")!=="expectedEnvelope|expectedPurpose|ticket")
   return respond(400,"INVALID_VERIFY_REQUEST");
 const timestamp=Number(request.headers.get("x-lyvra-timestamp"));
 const nonce=request.headers.get("x-lyvra-nonce");
 const proof=request.headers.get("x-lyvra-proof");
 const authenticated=await verifyNativeClientProof({path:pathname,timestamp,nonce,body:payload,
   proof,clientSecret:env.NATIVE_V3_CLIENT_SECRET});
 if(!authenticated)return respond(403,"CLIENT_NOT_AUTHENTICATED");
 const result=await verifyNativeContextTicket({ticket:payload.ticket,expectedEnvelope:payload.expectedEnvelope,
    expectedPurpose:payload.expectedPurpose,ticketSecret:env.NATIVE_V3_TICKET_SECRET});
 if(!result.ok)return respond(403,result.state);
 // A verification proof is a one-time request, independently of issuance nonce scope.
 const consumeNonce=replayConsumer(env);
 if(!consumeNonce)return respond(503,"ATOMIC_REPLAY_STORE_NOT_CONFIGURED");
 let consumed=false;
 try {consumed=await consumeNonce("LYVRA:V:"+nonce,Math.floor(Date.now()/1000)+90);}
 catch {return respond(503,"REPLAY_STORE_UNAVAILABLE");}
 if(consumed!==true)return respond(403,"REPLAY_DETECTED");
 return respond(200,result.state,{context_digest:result.context_digest,
    expires_at:result.expires_at,native_rehydration_verified_by_worker:false});
}

/** Backend for a future Cloudflare Durable Object binding; NOT enabled in wrangler yet.
 * Cloudflare serializes storage transactions inside one DO instance.
 */
export class NativeV3NonceGate {
 constructor(state){this.state=state;}
 async fetch(request){
  if(new URL(request.url).pathname!=="/consume"||request.method!=="POST")
   return respond(404,"NOT_FOUND");
  let p;
  try{p=await request.json();}catch{return respond(400,"BAD_JSON");}
  if(typeof p?.key!=="string"||!/^LYVRA:(?:V:)?[a-zA-Z0-9_-]{24,128}$/.test(p.key)||
   !Number.isSafeInteger(p.expires))return respond(400,"INVALID_NONCE");
  const now=Math.floor(Date.now()/1000);
  if(p.expires<=now||p.expires>now+180)return respond(400,"INVALID_EXPIRY");
  // Both the nonce and its expiry index are committed atomically.
  // Scheduling the alarm is part of the same transaction: a failed alarm cannot
  // leave an uncollected nonce behind and still report success.
  const expiryIndex="EXP:"+String(p.expires).padStart(12,"0")+":"+p.key;
  let consumed=false;
  try{
   const storage=this.state.storage;
   if(typeof storage.transaction!=="function"||typeof storage.get!=="function"||
      typeof storage.put!=="function"||typeof storage.getAlarm!=="function"||
      typeof storage.setAlarm!=="function")throw Error("SQLITE_STORAGE_API_REQUIRED");
   // SQLite-backed DO transactions include operations on ctx.storage directly.
   // The transaction callback's txn object does not expose alarm operations.
   await storage.transaction(async ()=>{
     if(await storage.get(p.key)!==undefined)return;
     await storage.put(p.key,{expires:p.expires});
     await storage.put(expiryIndex,p.key);
     const scheduled=await storage.getAlarm();
     const wanted=p.expires*1000+1000;
     if(scheduled===null||scheduled>wanted)await storage.setAlarm(wanted);
     consumed=true;
   });
  }catch{return respond(503,"REPLAY_STORE_UNAVAILABLE");}
  return new Response(JSON.stringify({consumed}),{status:200,
   headers:{"content-type":"application/json","cache-control":"no-store"}});
 }
 async alarm(){
  // Sorted expiry index means a bounded scan always visits oldest entries.
  // A backlog is drained by a near-term alarm; an unexpired entry schedules
  // the next expiry. Never remove a live nonce.
  const storage=this.state.storage;
  const now=Date.now();
  const rows=await storage.list({prefix:"EXP:",limit:128});
  if(!(rows instanceof Map))throw Error("EXPIRY_INDEX_UNAVAILABLE");
  let next=null,processed=0;
  for(const [index,nonceKey] of rows){
   if(!/^EXP:[0-9]{12}:LYVRA:(?:V:)?[a-zA-Z0-9_-]{24,128}$/.test(index)||
      typeof nonceKey!=="string")throw Error("EXPIRY_INDEX_CORRUPTED");
   const expires=Number(index.slice(4,16));
   if(expires*1000+1000>now){next=expires*1000+1000;break;}
   await storage.transaction(async ()=>{
     // Do not delete a nonce if the expiry index was changed by another event.
     if(await storage.get(index)!==nonceKey)return;
     await storage.delete(index);
     await storage.delete(nonceKey);
   });
   processed++;
  }
  // An issuance may have scheduled an earlier alarm while this scan ran.
  // Re-arm with a serial storage transaction; never overwrite earlier future work.
  const desired=next!==null?next:(rows.size===128?now+1000:null);
  if(desired!==null){
   await storage.transaction(async()=>{
    const current=await storage.getAlarm();
    if(current===null||current<=now||current>desired)
      await storage.setAlarm(desired);
   });
  }
  // If no rows remain, this invocation can complete without rescheduling.
  return {processed,next};
 }
}
