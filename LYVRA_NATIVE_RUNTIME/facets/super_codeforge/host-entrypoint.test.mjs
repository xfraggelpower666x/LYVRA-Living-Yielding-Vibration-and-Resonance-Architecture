import assert from 'node:assert/strict';
import {invokeWithAuthorizedGitHubHandle,HOST_ENTRYPOINT_BOUNDARY} from './host-entrypoint.mjs';
const request={capability_id:'LYVRA_GITHUB_COMMIT_FILE_READBACK_V1',origin_system:'LYVRA',native_authority:'WHOLE_LYVRA',caller:'LYVRA_SUPERCODEFORGE',permission:'READ_ONLY_SELF_REPOSITORY',operation:'READ_FILE',repository:'xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture',source_commit:'49ef14775d23a4aa63d9dcb132fd55148ceb539e',path:'LYVRA_NATIVE_RUNTIME/current/thinking/CODEFORGE_TECHNICAL_SELF_UNDERSTANDING.md',expected_blob_sha:'e5ae05bed19bfef3612ada3e0ed533da0d23a28f'};
let calls=0;let lastArgs;
const hostActions={mcp__GitHub__fetch_file:async args=>{calls++;lastArgs=args;return {result:{sha:request.expected_blob_sha,content:'fixture',encoding:'utf-8'}}}};
const ok=await invokeWithAuthorizedGitHubHandle({request,hostActions});
assert.equal(ok.status,'SOURCE_READBACK_MATCH');assert.equal(ok.original_repository_adapter_invoked,true);assert.equal(ok.host_verified,false);assert.equal(ok.plugin_parity_verified,false);assert.equal(calls,1);
assert.deepEqual(lastArgs,{repository_full_name:request.repository,path:request.path,ref:request.source_commit,encoding:'utf-8'});
const negatives=[{origin_system:'666CLIC'},{native_authority:'FOREIGN'},{caller:'666PFS'},{permission:'WRITE'},{operation:'WRITE_FILE'},{mutation:true},{repository:'elsewhere/foreign'},{source_commit:'lyvra'},{path:'LYVRA_NATIVE_RUNTIME/../secrets'},{path:'LYVRA_NATIVE_RUNTIME/\\escape'},{expected_blob_sha:''},{capability_id:'UNKNOWN'}];
for(const patch of negatives){const before=calls;const x=await invokeWithAuthorizedGitHubHandle({request:{...request,...patch},hostActions});assert.equal(x.status,'DENIED');assert.equal(calls,before);assert.equal(x.host_verified,false)}
for(const bad of [undefined,null,{}, {mcp__GitHub__fetch_file:true}]){const x=await invokeWithAuthorizedGitHubHandle({request,hostActions:bad});assert.equal(x.status,'PENDING');assert.equal(x.host_verified,false)}
for(const [action,status] of [[async()=>{throw Error('offline')},'PENDING'],[async()=>({result:{sha:'0'.repeat(40),content:'wrong',encoding:'utf-8'}}),'REVIEW'],[async()=>({result:{sha:request.expected_blob_sha,content:'abc',encoding:'base64'}}),'PENDING']]){
  const x=await invokeWithAuthorizedGitHubHandle({request,hostActions:{mcp__GitHub__fetch_file:action}});assert.equal(x.status,status);assert.equal(x.host_verified,false);
}
assert.equal(HOST_ENTRYPOINT_BOUNDARY.plugin_host_verified,false);assert.equal(HOST_ENTRYPOINT_BOUNDARY.foreign_writes,false);
console.log('PASS: 1 authorized provider fixture; 12 denied without calls; 4 missing/non-callable handles; 3 provider failure/mismatch/encoding cases; no host promotion');
