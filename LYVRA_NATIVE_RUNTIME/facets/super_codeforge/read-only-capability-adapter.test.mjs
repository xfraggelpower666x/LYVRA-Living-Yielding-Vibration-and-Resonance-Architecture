import assert from 'node:assert/strict';
import {inspectCapabilityRequest,runReadOnlyProbe} from './read-only-capability-adapter.mjs';
const request={
  "capability_id": "LYVRA_GITHUB_COMMIT_FILE_READBACK_V1",
  "origin_system": "LYVRA",
  "native_authority": "WHOLE_LYVRA",
  "caller": "LYVRA_SUPERCODEFORGE",
  "permission": "READ_ONLY_SELF_REPOSITORY",
  "operation": "READ_FILE",
  "repository": "xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture",
  "source_commit": "49ef14775d23a4aa63d9dcb132fd55148ceb539e",
  "path": "LYVRA_NATIVE_RUNTIME/current/thinking/CODEFORGE_TECHNICAL_SELF_UNDERSTANDING.md",
  "expected_blob_sha": "e5ae05bed19bfef3612ada3e0ed533da0d23a28f"
};
const reject=(changes)=>assert.equal(inspectCapabilityRequest({...request,...changes}).status,'DENIED');
assert.equal(inspectCapabilityRequest(request).status,'ELIGIBLE_LOCAL_READ_ONLY');
reject({origin_system:'666CLIC'});reject({caller:'666PFS'});reject({mutation:true});reject({operation:'WRITE_FILE'});reject({repository:'somebody/other'});reject({source_commit:'lyvra'});reject({path:'LYVRA_NATIVE_RUNTIME/../secrets'});reject({expected_blob_sha:''});reject({capability_id:'UNKNOWN'});
assert.equal((await runReadOnlyProbe(request,{})).status,'PENDING');
assert.equal((await runReadOnlyProbe(request,{readCommitFile:async()=>({sha:'0'.repeat(40),content:'x'})})).status,'REVIEW');
const result=await runReadOnlyProbe(request,{readCommitFile:async()=>({sha:request.expected_blob_sha,content:'hello'})});
assert.equal(result.status,'SOURCE_READBACK_MATCH');assert.equal(result.host_verified,false);assert.equal(result.evidence_class,'PROVIDER_RESPONSE_NOT_INDEPENDENTLY_AUTHENTICATED');
console.log('PASS: SuperCodeForge read-only adapter positive/negative tests');
