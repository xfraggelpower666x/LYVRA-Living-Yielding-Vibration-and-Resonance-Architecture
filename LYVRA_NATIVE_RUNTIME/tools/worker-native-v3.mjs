/**
 * LYVRA Native GitHub Context Evidence v3 — DEV-only standalone protocol.
 * NOT ROUTED, NOT DEPLOYED. Never change existing v1/v2 routes here.
 * Two separate ephemeral server-held secrets: client authentication and ticket signing.
 * The caller's rehydration claim is NOT an independent Github readback.
 * A globally atomic consumeNonce is REQUIRED; Workers KV alone is not an atomic replay lock.
 */
import {nativeEnvelopeDigest, validateNativeEnvelope, stableStringify} from "./worker-native-context.mjs";
const coder = new TextEncoder();
const TIMESTAMP_SKEW = 60;
const TICKET_TTL = 90;
const NONCE_PATTERN = /^[a-zA-Z0-9_-]{24,128}$/;
const HEX64 = /^[a-f0-9]{64}$/;
const ctx = "LYVRA_NATIVE_CONTEXT_V3";
function bytes(s){return coder.encode(s);}
function b64(s) {return btoa(String.fromCharCode(...s)).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");}
function fromB64(s) {if(!/^[a-zA-Z0-9_-]+$/.test(s)) throw Error("MALFORMED_TOKEN"); const pad=s.replace(/-/g,"+").replace(/_/g,"/");return Uint8Array.from(atob(pad+"=".repeat((4-pad.length%4)%4)),c=>c.charCodeAt(0));}
function plain(o){return o!==null&&typeof o==="object"&&!Array.isArray(o);}
async function mac(key,text){if(typeof key!=="string"||key.length<32)throw Error("SECRET_NOT_CONFIGURED");const k=await crypto.subtle.importKey("raw",bytes(key),"HMAC",false,["sign"]);return new Uint8Array(await crypto.subtle.sign("HMAC",k,bytes(text)));}
async function verifyMac(key,text,signature){if(typeof key!=="string"||key.length<32)return false;
  try {const k=await crypto.subtle.importKey("raw",bytes(key),"HMAC",false,["verify"]);return await crypto.subtle.verify("HMAC",k,fromB64(signature),bytes(text));}
  catch{return false;}}
const fail=(code)=>Object.freeze({ok:false,state:code});
function describeBody(b){
 if(!plain(b)||Object.keys(b).sort().join("|")!=="envelope|purpose")return false;
 return ["BOOT","FOREGROUND","RECOVERY"].includes(b.purpose);
}
function requestPreimage(timestamp,nonce,body){return stableStringify({context:ctx,method:"POST",path:"/v3/native-evidence",timestamp,nonce,body});}
function signInput(h,p){return b64(bytes(JSON.stringify(h)))+"."+b64(bytes(JSON.stringify(p)));}
export async function makeNativeClientProof({timestamp,nonce,body,clientSecret}){
 return b64(await mac(clientSecret,requestPreimage(timestamp,nonce,body)));
}
export async function issueNativeContextTicket({
 body,timestamp,nonce,proof,clientSecret,ticketSecret,consumeNonce,now=Math.floor(Date.now()/1000)
}){
 if(!describeBody(body))return fail("INVALID_REQUEST");
 if(!Number.isSafeInteger(timestamp)||!Number.isSafeInteger(now)||Math.abs(now-timestamp)>TIMESTAMP_SKEW)return fail("STALE_REQUEST");
 if(typeof nonce!=="string"||!NONCE_PATTERN.test(nonce)||typeof proof!=="string")return fail("INVALID_PROOF");
 if(typeof clientSecret!=="string"||clientSecret.length<32||typeof ticketSecret!=="string"||ticketSecret.length<32||clientSecret===ticketSecret)return fail("AUTH_NOT_CONFIGURED");
 if(typeof consumeNonce!=="function")return fail("ATOMIC_REPLAY_STORE_NOT_CONFIGURED");
 try {validateNativeEnvelope(body.envelope);}catch{return fail("NATIVE_CONTEXT_INVALID");}
 if(body.envelope.request_nonce!==nonce)return fail("NONCE_CONTEXT_MISMATCH");
 const signed=requestPreimage(timestamp,nonce,body);
 if(!(await verifyMac(clientSecret,signed,proof)))return fail("CLIENT_NOT_AUTHENTICATED");
 // A globally atomic server-controlled nonce store must return true only once.
 let consumed=false;
 try{consumed=await consumeNonce("LYVRA:"+nonce,now+TICKET_TTL);}
 catch{return fail("REPLAY_STORE_UNAVAILABLE");}
 if(consumed!==true)return fail("REPLAY_DETECTED");
 const digest=await nativeEnvelopeDigest(body.envelope);
 const header={alg:"HS256",typ:"LYVRA-NATIVE-CONTEXT-V3",kid:"LYVRA:NATIVE:V3"};
 const payload={iss:"lyvrasystem.666soundsdesign-broadcaster.com",
   sub:"LYVRA_NATIVE_CONTEXT_COUNTERCHECK",iat:now,nbf:now,exp:now+TICKET_TTL,
   system_id:"LYVRA",namespace:"LYVRA",branch_class:"MAIN_PERSONAL",
   authority_context:"LYVRA_MAIN_PERSONAL",purpose:body.purpose,
   repository:body.envelope.repository,branch:body.envelope.branch,
   commit_sha:body.envelope.commit_sha,context_digest:digest,
   request_nonce:nonce,worker_is_absolute_root_of_trust:false,
   worker_executes_native_command:false,native_rehydration_verified_by_worker:false};
 const input=signInput(header,payload),ticket=input+"."+b64(await mac(ticketSecret,input));
 return Object.freeze({ok:true,state:"SIGNED_NATIVE_CONTEXT_CLAIM",ticket,expires_at:payload.exp,
   context_digest:digest,native_rehydration_verified_by_worker:false});
}
export async function verifyNativeContextTicket({ticket,expectedEnvelope,expectedPurpose,ticketSecret,now=Math.floor(Date.now()/1000)}){
 if(typeof ticket!=="string"||ticket.length>8192||typeof ticketSecret!=="string"||ticketSecret.length<32)return fail("BAD_TOKEN");
 if(!["BOOT","FOREGROUND","RECOVERY"].includes(expectedPurpose))return fail("INVALID_PURPOSE");
 try {validateNativeEnvelope(expectedEnvelope);}catch{return fail("NATIVE_CONTEXT_INVALID");}
 const parts=ticket.split(".");if(parts.length!==3)return fail("BAD_TOKEN");
 const input=parts[0]+"."+parts[1];
 if(!(await verifyMac(ticketSecret,input,parts[2])))return fail("BAD_SIGNATURE");
 let h,p;
 try {h=JSON.parse(new TextDecoder().decode(fromB64(parts[0])));p=JSON.parse(new TextDecoder().decode(fromB64(parts[1])));}catch{return fail("BAD_TOKEN");}
 if(!plain(h)||!plain(p)||h.alg!=="HS256"||h.typ!=="LYVRA-NATIVE-CONTEXT-V3"||h.kid!=="LYVRA:NATIVE:V3")return fail("BAD_HEADER");
 if(p.iss!=="lyvrasystem.666soundsdesign-broadcaster.com"||p.sub!=="LYVRA_NATIVE_CONTEXT_COUNTERCHECK"||
    p.system_id!=="LYVRA"||p.namespace!=="LYVRA"||p.branch_class!=="MAIN_PERSONAL"||
    p.authority_context!=="LYVRA_MAIN_PERSONAL"||p.purpose!==expectedPurpose||
    p.worker_is_absolute_root_of_trust!==false||p.worker_executes_native_command!==false||
    p.native_rehydration_verified_by_worker!==false)return fail("BAD_CLAIMS");
 if(!Number.isSafeInteger(now)||!Number.isSafeInteger(p.iat)||!Number.isSafeInteger(p.nbf)||!Number.isSafeInteger(p.exp)||
    p.nbf>now||p.iat>now||p.exp<=now||p.exp-p.iat>TICKET_TTL||p.exp<=p.iat)return fail("TOKEN_EXPIRED_OR_FUTURE");
 const digest=await nativeEnvelopeDigest(expectedEnvelope);
 if(p.context_digest!==digest||!HEX64.test(p.context_digest)||p.repository!==expectedEnvelope.repository||
    p.commit_sha!==expectedEnvelope.commit_sha||p.branch!==expectedEnvelope.branch||
    p.request_nonce!==expectedEnvelope.request_nonce)return fail("NATIVE_CONTEXT_CONFLICT");
 return Object.freeze({ok:true,state:"NATIVE_CONTEXT_TICKET_VERIFIED",context_digest:digest,expires_at:p.exp,
    native_rehydration_verified_by_worker:false});
}
