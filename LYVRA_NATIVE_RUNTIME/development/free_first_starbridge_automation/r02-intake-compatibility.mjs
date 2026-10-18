// LYVRA source-only R02 preflight. CLIC owns StarBridge; this module never writes or dispatches.
import {createHash} from "node:crypto";
export const SOURCE=Object.freeze({
 repo:"xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture",
 branch:"lyvra",
 path:"LYVRA_NATIVE_RUNTIME/continuity/development_exchange/LYVRA_TO_CLIC_FREE_FIRST_STARBRIDGE_AUTOMATION_20261018_R02.json",
 id:"LYVRA-CLIC-FREE-FIRST-STARBRIDGE-AUTOMATION-20261018-R02"
});
const SHA=/^[a-f0-9]{40}$/i, ID=/^[A-Za-z0-9][A-Za-z0-9._-]{5,127}$/;
const denied=reason=>({status:"BLOCKED",reason,source_verified:false,delivery_verified:false,adoption_verified:false,host_verified:false,may_mutate_foreign:false});
export function gitBlobSHA(s) {const bytes=Buffer.from(s,"utf8");return createHash("sha1").update(Buffer.from("blob "+bytes.length+"\0")).update(bytes).digest("hex");}
const unwrap=r=>r?.result??r;
const json=r=>{const v=unwrap(r);return typeof v==="string"?JSON.parse(v):typeof v?.content==="string"?JSON.parse(v.content):v;};
export function proposeClicInbox(r,{publishedCommit,sourceBlob}={}) {
 if(!r||r.handoff_id!==SOURCE.id||r.source_system!=="LYVRA"||r.target_system!=="666CLIC")return denied("INVALID_NATIVE_BOUNDARY");
 if(r.source_repo!==SOURCE.repo||r.source_branch!==SOURCE.branch)return denied("SOURCE_REPO_MISMATCH");
 if(r.native_owner_control!=="CLIC_ONLY_FOR_STARBRIDGE"||r.origin_ownership?.starbridge!=="666CLIC_NATIVE_PROPERTY_AND_CREATIVE_ACHIEVEMENT")return denied("CLIC_OWNERSHIP_MISSING");
 if(!Array.isArray(r.request_to_clic?.questions)||r.request_to_clic.questions.length===0||!r.created_at)return denied("INCOMPLETE_REQUEST");
 if(!r.explicitly_not_authorized?.includes("MODIFY_CLIC_REPO"))return denied("NO_FOREIGN_WRITE_FENCE");
 if(!SHA.test(publishedCommit??"")||!SHA.test(sourceBlob??""))return denied("PUBLISHED_SOURCE_BINDING_REQUIRED");
 if(["delivery","adoption","host"].some(k=>r.gates?.[k]==="VERIFIED"))return denied("UNSUPPORTED_PASS_CLAIM");
 const mapped={
  schema:"CLIC_REPO_HANDOFF_V1",handoff_id:r.handoff_id,source_system:"LYVRA",source_repo:SOURCE.repo,source_branch:SOURCE.branch,
  source_head:publishedCommit,created_at:r.created_at,
  affected_facets:["LYVRA_SUPERCODEFORGE","LYVRA_FREE_FIRST_AUTOMATION","CLIC_STARBRIDGE_PROPOSAL","CLIC_PDI_RELATION"],
  relation_delta:{starbridge_owner:"666CLIC",offer:"LYVRA_PERMISSIONED_AUTOMATION_PROPOSAL",source_path:SOURCE.path,source_blob:sourceBlob,previous_source_base_head:r.source_base_head??null},
  analysis_request:{requested_action:"CLIC_NATIVE_READ_ONLY_REVIEW",instructions:[...r.request_to_clic.questions]},supersedes:null,authority_transfer:false
 };
 return {status:"MAPPING_PROPOSAL_ONLY",mapped,source_verified:false,delivery_verified:false,adoption_verified:false,host_verified:false,may_mutate_foreign:false};
}
export async function verifyR02Source({fetch,fetchFile,publishedCommit,sourceBlob}={}) {
 if(typeof fetch!=="function"||typeof fetchFile!=="function")return denied("TRUSTED_READ_CONNECTORS_REQUIRED");
 if(!SHA.test(publishedCommit??"")||!SHA.test(sourceBlob??""))return denied("PUBLISHED_SOURCE_BINDING_REQUIRED");
 try {
  const root="https://api.github.com/repos/"+SOURCE.repo;
  const getHead=async()=>{const o=json(await fetch({url:root+"/branches/"+SOURCE.branch}));if(!SHA.test(o?.commit?.sha??""))throw Error("INVALID_HEAD");return o.commit.sha;};
  const getBlob=async rev=>{const t=json(await fetch({url:root+"/git/trees/"+rev+"?recursive=1"}));if(t.truncated!==false||!Array.isArray(t.tree))throw Error("INCOMPLETE_TREE");const entry=t.tree.find(e=>e.path===SOURCE.path&&e.type==="blob");if(!SHA.test(entry?.sha??""))throw Error("MISSING_OR_INVALID_BLOB");return entry.sha;};
  const before=await getHead();
  const [pinned,live]=await Promise.all([getBlob(publishedCommit),getBlob(before)]);
  if(pinned!==sourceBlob||live!==sourceBlob)return denied("PINNED_LIVE_BLOB_MISMATCH");
  const f=unwrap(await fetchFile({repository_full_name:SOURCE.repo,path:SOURCE.path,ref:publishedCommit}));
  if(f.sha!==sourceBlob||typeof f.content!=="string"||gitBlobSHA(f.content)!==sourceBlob)return denied("CONTENT_SHA_MISMATCH");
  const mapping=proposeClicInbox(JSON.parse(f.content),{publishedCommit,sourceBlob});
  if(mapping.status!=="MAPPING_PROPOSAL_ONLY")return mapping;
  if(await getHead()!==before)return denied("CONCURRENT_HEAD_CHANGE");
  return {...mapping,status:"SOURCE_VERIFIED_INBOX_PROPOSAL_ONLY",source_verified:true,evidence:{pinned_commit:publishedCommit,blob_sha:sourceBlob,live_head:before,source_path:SOURCE.path}};
 }catch(e){return denied("READBACK_FAILED:"+String(e.message??e));}
}
export function reconcileProposals(records=[]) {
 const seen=new Map(),accepted=[],duplicates=[],conflicts=[];
 for(const r of records){
  if(!ID.test(r?.handoff_id??"")||!SHA.test(r?.source_head??"")||!SHA.test(r?.relation_delta?.source_blob??"")){conflicts.push({id:r?.handoff_id??null,reason:"INVALID_RECORD"});continue;}
  const fingerprint=[r.source_repo,r.source_branch,r.source_head,r.relation_delta.source_path,r.relation_delta.source_blob].join("|");
  if(!seen.has(r.handoff_id)){seen.set(r.handoff_id,fingerprint);accepted.push(r.handoff_id);}
  else if(seen.get(r.handoff_id)===fingerprint)duplicates.push(r.handoff_id);
  else conflicts.push({id:r.handoff_id,reason:"CONFLICT_QUARANTINE_ID_REUSE"});
 }
 return {accepted,duplicates,conflicts,may_mutate_foreign:false};
}
