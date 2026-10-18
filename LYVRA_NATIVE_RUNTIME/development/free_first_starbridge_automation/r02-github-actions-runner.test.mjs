import test from "node:test";
import assert from "node:assert/strict";
import {SOURCE,gitBlobSHA} from "./r02-intake-compatibility.mjs";
import {R02_PIN,runR02GitHubActions} from "./r02-github-actions-runner.mjs";
const REPO=SOURCE.repo,HEAD="4".repeat(40);
const base=()=>({handoff_id:SOURCE.id,source_system:"LYVRA",target_system:"666CLIC",source_repo:REPO,source_branch:"lyvra",source_base_head:"5".repeat(40),created_at:"2026-10-18",native_owner_control:"CLIC_ONLY_FOR_STARBRIDGE",origin_ownership:{starbridge:"666CLIC_NATIVE_PROPERTY_AND_CREATIVE_ACHIEVEMENT"},request_to_clic:{questions:["Readiness?"]},explicitly_not_authorized:["MODIFY_CLIC_REPO"],gates:{delivery:"NOT_VERIFIED",adoption:"NOT_VERIFIED",host:"NOT_VERIFIED"}});
function mock({badHTTP=false,foreignBlob=false,headRace=false}={}){
 let calls=0;
 // Fixture is intentionally NOT the real pinned R02 blob; negative-only mocks must be blocked.
 const content=JSON.stringify(base()),sha=gitBlobSHA(content);
 const fetchImpl=async(url,opts)=>{
  calls++;assert.equal(opts.method,"GET");assert.match(url,/^https:\/\/api\.github\.com\/repos\/xfraggelpower666x\/LYVRA-/);
  if(badHTTP)return {ok:false,status:403};
  if(url.includes("/branches/"))return {ok:true,json:async()=>({commit:{sha:headRace&&calls>3?"6".repeat(40):HEAD}})};
  if(url.includes("/git/trees/"))return {ok:true,json:async()=>({truncated:false,tree:[{path:SOURCE.path,type:"blob",sha:foreignBlob?"a".repeat(40):R02_PIN.blob}]})};
  return {ok:true,json:async()=>({type:"file",sha,encoding:"base64",content:Buffer.from(content).toString("base64")})};
 };
 return {fetchImpl,getCalls:()=>calls};
}
test("rejects foreign repository before any provider call",async()=>{const m=mock();await assert.rejects(runR02GitHubActions({token:"fake",repository:"foreign/repo",fetchImpl:m.fetchImpl}),/FOREIGN_REPOSITORY_DENIED/);assert.equal(m.getCalls(),0)});
test("rejects missing token and provider before calls",async()=>{const m=mock();await assert.rejects(runR02GitHubActions({token:"",fetchImpl:m.fetchImpl}),/AUTHORIZED_TOKEN_MISSING/);await assert.rejects(runR02GitHubActions({token:"fake",fetchImpl:null}),/AUTHORIZED_FETCH_MISSING/);assert.equal(m.getCalls(),0)});
test("rejects real-provider HTTP error without upgrading status",async()=>{const m=mock({badHTTP:true});await assert.rejects(runR02GitHubActions({token:"fake",fetchImpl:m.fetchImpl}),/R02_SOURCE_PROBE_BLOCKED_READBACK_FAILED:GITHUB_READ_FAILED_403/)});
test("rejects forged source tree",async()=>{const m=mock({foreignBlob:true});await assert.rejects(runR02GitHubActions({token:"fake",fetchImpl:m.fetchImpl}),/PINNED_LIVE_BLOB_MISMATCH/)});
test("rejects forged committed blob bytes",async()=>{const m=mock();await assert.rejects(runR02GitHubActions({token:"fake",fetchImpl:m.fetchImpl}),/FILE_RESPONSE_UNTRUSTED/)});
test("retains pinned source binding and no CLIC write",()=>{assert.equal(R02_PIN.commit,"bea8f8e65465534e205bbafecb467ca073b921b2");assert.equal(R02_PIN.blob,"8a26ae9f129061584e12fd308ff85bf7eb959ea9")});
