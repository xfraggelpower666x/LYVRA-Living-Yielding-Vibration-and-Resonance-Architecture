// R17: Live public GitHub read-only provider through EXISTING SuperCodeForge native entrypoint.
// This is a CI provider acceptance, NOT a ChatGPT Native/ALIVE plugin-host acceptance.
import {spawnSync} from "node:child_process";
import {invokeWithAuthorizedGitHubHandle} from "../../facets/super_codeforge/host-entrypoint.mjs";
const REPO="xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture";
const PATH="LYVRA_NATIVE_RUNTIME/facets/analytics/development/RESULT_QUEUE.json";
function git(args){
  const p=spawnSync("git",args,{encoding:"utf8",maxBuffer:1024*1024});
  if(p.status!==0||p.error)throw new Error("Git checkout authority unavailable");
  return p.stdout.trim();
}
function strictSha(s){if(!/^[a-f0-9]{40}$/.test(s))throw new Error("invalid immutable SHA");return s}
export async function runLiveSuperCodeForgeRead({head=git(["rev-parse","HEAD"]),
  blob=git(["rev-parse","HEAD:"+PATH]),provider=globalThis.fetch}={}) {
  strictSha(head);strictSha(blob);
  if(typeof provider!=="function")throw new Error("AUTHORIZED_HOST_PROVIDER_MISSING");
  let calls=0;
  const hostActions={async mcp__GitHub__fetch_file({repository_full_name,path,ref,encoding}){
    if(repository_full_name!==REPO||path!==PATH||ref!==head||encoding!=="utf-8")
      throw new Error("PROVIDER_REQUEST_SCOPE_MISMATCH");
    calls++;
    const url="https://api.github.com/repos/"+REPO+"/contents/"+PATH+"?ref="+head;
    const response=await provider(url,{headers:{Accept:"application/vnd.github+json","User-Agent":"LYVRA-R17-Original-Provider-Probe","X-GitHub-Api-Version":"2022-11-28"}});
    if(!response.ok)throw new Error("GITHUB_PROVIDER_RESPONSE_"+response.status);
    const json=await response.json();
    if(json.encoding!=="base64"||json.sha!==blob||typeof json.content!=="string")
      throw new Error("PROVIDER_BLOB_OR_ENCODING_MISMATCH");
    const bytes=Buffer.from(json.content.replace(/\\s/g,""),"base64");
    return {result:{sha:json.sha,content:bytes.toString("utf8"),encoding:"utf-8"}};
  }};
  const request={capability_id:"LYVRA_GITHUB_COMMIT_FILE_READBACK_V1",origin_system:"LYVRA",
    native_authority:"WHOLE_LYVRA",caller:"LYVRA_SUPERCODEFORGE",
    permission:"READ_ONLY_SELF_REPOSITORY",operation:"READ_FILE",
    repository:REPO,source_commit:head,path:PATH,expected_blob_sha:blob};
  const receipt=await invokeWithAuthorizedGitHubHandle({request,hostActions});
  if(receipt.status!=="SOURCE_READBACK_MATCH"||calls!==1)throw new Error("PROVIDER_ACCEPTANCE_NOT_MET:"+receipt.status);
  if(receipt.host_verified!==false||receipt.plugin_parity_verified!==false)throw new Error("ILLEGAL_HOST_PROMOTION");
  return {schema:"LYVRA_R17_SUPERCODEFORGE_LIVE_PROVIDER_READ",head,blob,provider_calls:calls,
    capability:receipt.capability_id,source_readback:receipt.status,
    native_plugin_host:"NOT_VERIFIED",alive_plugin_host:"NOT_VERIFIED",
    caller_result:"REAL_PROVIDER_READ_ONLY_MATCH",writes:0,foreign_activation:false};
}
if(import.meta.url===`file://${process.argv[1]}`)console.log(JSON.stringify(await runLiveSuperCodeForgeRead()));
