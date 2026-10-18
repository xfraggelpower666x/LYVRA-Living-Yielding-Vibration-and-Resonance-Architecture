import assert from 'node:assert/strict';
import {executeAuthorizedReadOnlyCapability,EXECUTOR_BOUNDARY} from './authorized-host-executor.mjs';
const request={capability_id:'LYVRA_GITHUB_COMMIT_FILE_READBACK_V1',origin_system:'LYVRA',native_authority:'WHOLE_LYVRA',caller:'LYVRA_SUPERCODEFORGE',permission:'READ_ONLY_SELF_REPOSITORY',operation:'READ_FILE',repository:'xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture',source_commit:'49ef14775d23a4aa63d9dcb132fd55148ceb539e',path:'LYVRA_NATIVE_RUNTIME/current/thinking/CODEFORGE_TECHNICAL_SELF_UNDERSTANDING.md',expected_blob_sha:'e5ae05bed19bfef3612ada3e0ed533da0d23a28f'};
let calls=0;let actualArguments;
const provider=async args=>{calls++;actualArguments=args;return {result:{sha:request.expected_blob_sha,content:'evidence',encoding:'utf-8'}}};
const allowed=await executeAuthorizedReadOnlyCapability({request,authorizedGitHubFetchFile:provider});
assert.equal(allowed.status,'SOURCE_READBACK_MATCH');
assert.equal(allowed.original_repository_adapter_invoked,true);
assert.equal(allowed.host_verified,false);
assert.equal(allowed.plugin_parity_verified,false);
assert.equal(calls,1);
assert.deepEqual(actualArguments,{repository_full_name:request.repository,path:request.path,ref:request.source_commit,encoding:'utf-8'});
for(const change of [{origin_system:'666CLIC'},{caller:'666PFS'},{operation:'WRITE_FILE'},{mutation:true},{repository:'elsewhere/foreign'},{source_commit:'lyvra'},{path:'LYVRA_NATIVE_RUNTIME/../secrets'},{expected_blob_sha:''},{capability_id:'UNKNOWN'}]){
 const before=calls;const rejected=await executeAuthorizedReadOnlyCapability({request:{...request,...change},authorizedGitHubFetchFile:provider});
 assert.equal(rejected.status,'DENIED');assert.equal(calls,before);assert.equal(rejected.host_verified,false);
}
assert.equal((await executeAuthorizedReadOnlyCapability({request})).status,'PENDING');
assert.equal((await executeAuthorizedReadOnlyCapability({request,authorizedGitHubFetchFile:async()=>{throw Error('offline')}})).status,'PENDING');
assert.equal((await executeAuthorizedReadOnlyCapability({request,authorizedGitHubFetchFile:async()=>({result:{sha:'0'.repeat(40),content:'wrong',encoding:'utf-8'}})})).status,'REVIEW');
assert.equal(EXECUTOR_BOUNDARY.host_pass_claim,false);
console.log('PASS: imported original adapter via executor; nine denied without provider calls; no host promotion');
