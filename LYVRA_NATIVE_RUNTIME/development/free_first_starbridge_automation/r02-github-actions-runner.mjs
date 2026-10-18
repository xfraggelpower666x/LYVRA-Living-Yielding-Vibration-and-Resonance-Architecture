// LYVRA R02 read-only GitHub Actions provider. Existing original verifier imported unchanged.
// This is NOT a CLIC receiver, an automatic transport, or a ChatGPT Native/ALIVE host.
import {createHash} from "node:crypto";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {SOURCE,verifyR02Source,gitBlobSHA} from "./r02-intake-compatibility.mjs";
export const R02_PIN=Object.freeze({commit:"bea8f8e65465534e205bbafecb467ca073b921b2",blob:"8a26ae9f129061584e12fd308ff85bf7eb959ea9"});
const fail=x=>{throw Error(x)};
const root="https://api.github.com/repos/"+SOURCE.repo;
const branchURL=root+"/branches/"+SOURCE.branch;
const treeURL=(sha)=>root+"/git/trees/"+sha+"?recursive=1";
const fileURL=root+"/contents/"+SOURCE.path.split("/").map(encodeURIComponent).join("/")+"?ref="+R02_PIN.commit;
const SHA=/^[a-f0-9]{40}$/i;
export async function runR02GitHubActions({token,repository=SOURCE.repo,fetchImpl=globalThis.fetch}={}){
 if(repository!==SOURCE.repo)fail("FOREIGN_REPOSITORY_DENIED");
 if(typeof token!=="string"||token.length===0)fail("AUTHORIZED_TOKEN_MISSING");
 if(typeof fetchImpl!=="function")fail("AUTHORIZED_FETCH_MISSING");
 let callCount=0;
 async function read(url){
  if(![branchURL,treeURL(R02_PIN.commit),fileURL].includes(url)&&
    !(url.startsWith(root+"/git/trees/")&&url.endsWith("?recursive=1")&&SHA.test(url.slice((root+"/git/trees/").length,-"?recursive=1".length))))
     fail("GITHUB_API_SCOPE_DENIED");
  if(++callCount>6)fail("GITHUB_CALL_BUDGET_EXCEEDED");
  const response=await fetchImpl(url,{method:"GET",headers:{"Accept":"application/vnd.github+json","Authorization":"Bearer "+token,"X-GitHub-Api-Version":"2022-11-28"}});
  if(!response?.ok)fail("GITHUB_READ_FAILED_"+(response?.status??"UNKNOWN"));
  return response.json();
 }
 const fetch=async ({url}={})=>{
  if(url!==branchURL && url!==treeURL(R02_PIN.commit)&&
    !(typeof url==="string"&&url.startsWith(root+"/git/trees/")&&url.endsWith("?recursive=1")&&SHA.test(url.slice((root+"/git/trees/").length,-"?recursive=1".length))))
    fail("GITHUB_API_SCOPE_DENIED");
  return {result:{content:JSON.stringify(await read(url))}};
 };
 const fetchFile=async ({repository_full_name,path,ref}={})=>{
  if(repository_full_name!==SOURCE.repo||path!==SOURCE.path||ref!==R02_PIN.commit)fail("FILE_SCOPE_DENIED");
  const f=await read(fileURL);
  if(f.type!=="file"||f.sha!==R02_PIN.blob||f.encoding!=="base64"||typeof f.content!=="string")fail("FILE_RESPONSE_UNTRUSTED");
  const encoded=f.content.replace(/\s/g,"");
  if(!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded)||encoded.length%4!==0)fail("INVALID_BASE64");
  const bytes=Buffer.from(encoded,"base64");
  const actual=createHash("sha1").update(Buffer.from("blob "+bytes.length+"\0")).update(bytes).digest("hex");
  if(actual!==R02_PIN.blob||!bytes.toString("utf8").includes('"handoff_id"'))fail("FILE_RAW_BLOB_MISMATCH");
  const content=bytes.toString("utf8");
  if(gitBlobSHA(content)!==R02_PIN.blob)fail("FILE_UTF8_BLOB_MISMATCH");
  return {result:{sha:actual,content,encoding:"utf-8"}};
 };
 const outcome=await verifyR02Source({fetch,fetchFile,publishedCommit:R02_PIN.commit,sourceBlob:R02_PIN.blob});
 const receipt=Object.freeze({
  result:outcome.status,reason:outcome.reason??null,original_validator_invoked:true,
  source_verified:outcome.source_verified===true,source_commit:R02_PIN.commit,source_blob:R02_PIN.blob,
  provider_calls:callCount,branch_head:outcome.evidence?.live_head??null,
  delivery_verified:false,adoption_verified:false,host_verified:false,
  native_plugin_host_verified:false,alive_plugin_host_verified:false,
  foreign_writes:false,automation_active:false
 });
 if(!receipt.source_verified||receipt.result!=="SOURCE_VERIFIED_INBOX_PROPOSAL_ONLY"||receipt.provider_calls!==5)
  fail("R02_SOURCE_PROBE_BLOCKED_"+(outcome.reason??outcome.status));
 return receipt;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 runR02GitHubActions({token:process.env.GITHUB_TOKEN,repository:process.env.GITHUB_REPOSITORY})
 .then(x=>process.stdout.write(JSON.stringify(x)+"\n"))
 .catch(e=>{process.stderr.write("LYVRA_R02_READONLY_BLOCKED: "+e.message+"\n");process.exitCode=1;});
}
