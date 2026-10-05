import test from "node:test";
import assert from "node:assert/strict";
import worker from "./worker.js";

const secret="test-secret-abcdefghijklmnopqrstuvwxyz-0123456789";
const env={LYVRA_BOOT_SIGNING_SECRET:secret,CLIC_AUTHORITY_SIGNING_SECRET:"clic-secret-abcdefghijklmnopqrstuvwxyz-0123456789"};

function req(path, method="GET", body=null){
  return new Request("https://lyvrasystem.666soundsdesign-broadcaster.com"+path,{
    method,
    headers: body ? {"content-type":"application/json"} : undefined,
    body: body ? JSON.stringify(body) : undefined
  });
}
async function json(r){return await r.json();}
function b64uDecode(v){
  const n=v.replace(/-/g,"+").replace(/_/g,"/");
  return JSON.parse(Buffer.from(n+"=".repeat((4-n.length%4)%4),"base64").toString("utf8"));
}
function b64u(bytes){return Buffer.from(bytes).toString("base64url");}
async function sign(header,payload){
  const h=b64u(Buffer.from(JSON.stringify(header)));
  const p=b64u(Buffer.from(JSON.stringify(payload)));
  const input=h+"."+p;
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const sig=await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(input));
  return input+"."+b64u(new Uint8Array(sig));
}

test("health reports v2.1.0",async()=>{
  const r=await worker.fetch(req("/health"),env);
  assert.equal(r.status,200);
  assert.equal((await json(r)).version,"2.1.0");
});

test("built-in LYVRA registry cannot be overwritten by server registry JSON",async()=>{
  const malicious={LYVRA:{
    enabled:true,system_id:"LYVRA",namespace:"LYVRA",authority_context:"ATTACKER",
    branch_class:"MAIN_PERSONAL",architectural_owner:"ATTACKER",execution_host:"OTHER",
    execution_role:"OWNER",signing_secret_binding:"OTHER_SECRET",root_revision:"EVIL"
  }};
  const r=await worker.fetch(req("/v2/authority-root?system=LYVRA"),{...env,MAIN_SYSTEM_REGISTRY_JSON:JSON.stringify(malicious)});
  const d=await json(r);
  assert.equal(r.status,200);
  assert.equal(d.authority_root.architectural_owner,"LYVRA");
  assert.equal(d.authority_root.authority_context,"LYVRA_MAIN_PERSONAL");
  assert.equal(d.authority_root.root_revision,"LYVRA-AUTHORITY-ROOT-1.0.0");
});

test("an alias may not shadow LYVRA by system id or namespace",async()=>{
  const malicious={EVIL:{
    enabled:true,system_id:"LYVRA",namespace:"EVIL",authority_context:"EVIL_MAIN_PERSONAL",
    branch_class:"MAIN_PERSONAL",architectural_owner:"ATTACKER",execution_host:"CHATGPT_EXECUTION_LAYER",
    execution_role:"TECHNICAL_EXECUTOR_ONLY",signing_secret_binding:"LYVRA_BOOT_SIGNING_SECRET",root_revision:"EVIL"
  }};
  const r=await worker.fetch(req("/v2/systems"),{...env,MAIN_SYSTEM_REGISTRY_JSON:JSON.stringify(malicious)});
  const d=await json(r);
  assert.equal(d.systems.some(x=>x.namespace==="EVIL"),false);
});

test("new v2 evidence tickets are limited to five minutes",async()=>{
  const r=await worker.fetch(req("/v2/evidence-ticket","POST",{system:"LYVRA",purpose:"BOOT"}),env);
  const d=await json(r);
  assert.equal(r.status,200);
  const p=b64uDecode(d.ticket.split(".")[1]);
  assert.equal(p.exp-p.iat,300);
  const v=await worker.fetch(req("/v2/verify-evidence","POST",{ticket:d.ticket}),env);
  assert.equal(v.status,200);
  assert.equal((await json(v)).valid,true);
});

test("validly signed token with wrong issuer is rejected semantically",async()=>{
  const issued=await json(await worker.fetch(req("/v2/evidence-ticket","POST",{system:"LYVRA",purpose:"BOOT"}),env));
  const [h,p]=issued.ticket.split(".");
  const header=b64uDecode(h),payload=b64uDecode(p);
  payload.iss="not-lyvra.example";
  const forged=await sign(header,payload);
  const r=await worker.fetch(req("/v2/verify-evidence","POST",{ticket:forged}),env);
  assert.equal(r.status,409);
  assert.equal((await json(r)).reason,"AUTHORITY_CLAIM_MISMATCH");
});

test("legacy v1 compatibility still issues and verifies",async()=>{
  const i=await worker.fetch(req("/v1/boot-ticket","POST",{}),env);
  assert.equal(i.status,200);
  const d=await json(i);
  const v=await worker.fetch(req("/v1/verify-ticket","POST",{ticket:d.ticket}),env);
  assert.equal(v.status,200);
  assert.equal((await json(v)).valid,true);
});
