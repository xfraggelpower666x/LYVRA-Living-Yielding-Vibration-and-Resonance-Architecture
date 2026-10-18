import assert from 'node:assert/strict';
import {inspectGitHubCapability,bindAuthorizedGitHubFetchFile} from './github-provider-binding.mjs';
const request={
 capability_id:'LYVRA_GITHUB_COMMIT_FILE_READBACK_V1',origin_system:'LYVRA',native_authority:'WHOLE_LYVRA',
 caller:'LYVRA_SUPERCODEFORGE',permission:'READ_ONLY_SELF_REPOSITORY',operation:'READ_FILE',
 repository:'xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture',
 source_commit:'49ef14775d23a4aa63d9dcb132fd55148ceb539e',
 path:'LYVRA_NATIVE_RUNTIME/current/thinking/CODEFORGE_TECHNICAL_SELF_UNDERSTANDING.md',
 expected_blob_sha:'e5ae05bed19bfef3612ada3e0ed533da0d23a28f'
};
let calls=[];
const good=async args=>{calls.push(args);return {result:{sha:request.expected_blob_sha,content:'known-source-text',encoding:'utf-8'}}};
assert.equal(bindAuthorizedGitHubFetchFile(undefined),null);
assert.equal((await inspectGitHubCapability(request,{})).status,'PENDING');
const p=await inspectGitHubCapability(request,{fetchFile:good});
assert.equal(p.status,'SOURCE_READBACK_MATCH');
assert.equal(p.host_verified,false);
assert.equal(p.evidence_class,'PROVIDER_RESPONSE_NOT_INDEPENDENTLY_AUTHENTICATED');
assert.deepEqual(calls,[{repository_full_name:request.repository,path:request.path,ref:request.source_commit,encoding:'utf-8'}]);
for(const patch of [{caller:'666CLIC'},{origin_system:'666PFS'},{operation:'WRITE_FILE'},{repository:'foreign/repo'},{path:'LYVRA_NATIVE_RUNTIME/../secret'},{source_commit:'lyvra'},{expected_blob_sha:''},{mutation:true}]){
 calls=[];assert.equal((await inspectGitHubCapability({...request,...patch},{fetchFile:good})).status,'DENIED');assert.equal(calls.length,0);
}
for(const bad of [
 async()=>({result:{sha:'0'.repeat(40),content:'bad',encoding:'utf-8'}}),
 async()=>({result:{sha:request.expected_blob_sha,content:123,encoding:'utf-8'}}),
 async()=>({result:{sha:request.expected_blob_sha,content:'text',encoding:'base64'}}),
 async()=>{throw Error('network disabled')}
]){
 const outcome=await inspectGitHubCapability(request,{fetchFile:bad});
 assert.ok(['REVIEW','PENDING'].includes(outcome.status));assert.equal(outcome.host_verified,false);
}
console.log('PASS: provider binding arguments, fail-closed guards, no external execution claims');
