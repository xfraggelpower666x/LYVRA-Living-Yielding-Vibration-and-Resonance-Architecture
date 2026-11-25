// SuperCodeForge: LYVRA-only pure capability gate, NO transport, NO self-execution.
// Provider response is NOT independent authenticity or host evidence.
export function inspectCapabilityRequest(request={}) {
  const fail=(code)=>({status:"DENIED",code,mutation:false,foreign_activation:false,host_verified:false});
  if(!request||typeof request!=="object"||Array.isArray(request))return fail("INVALID_REQUEST");
  if(request.capability_id!=="LYVRA_GITHUB_COMMIT_FILE_READBACK_V1")return fail("UNKNOWN_CAPABILITY");
  if(request.origin_system!=="LYVRA"||request.native_authority!=="WHOLE_LYVRA")return fail("FOREIGN_PROVIDER_NOT_AUTHORIZED");
  if(request.caller!=="LYVRA_SUPERCODEFORGE"||request.permission!=="READ_ONLY_SELF_REPOSITORY")return fail("CALLER_PERMISSION_DENIED");
  if(request.operation!=="READ_FILE"||request.mutation===true)return fail("MUTATION_OR_OPERATION_DENIED");
  if(request.repository!=="xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture")return fail("REPOSITORY_SCOPE_DENIED");
  if(typeof request.source_commit!=="string"||!(/^[a-f0-9]{40}$/i).test(request.source_commit))return fail("IMMUTABLE_COMMIT_REQUIRED");
  if(typeof request.path!=="string"||!request.path.startsWith("LYVRA_NATIVE_RUNTIME/")||request.path.includes("..")||request.path.includes("\\")||request.path.includes("//"))return fail("PATH_SCOPE_DENIED");
  if(typeof request.expected_blob_sha!=="string"||!(/^[a-f0-9]{40}$/i).test(request.expected_blob_sha))return fail("EXPECTED_BLOB_REQUIRED");
  return {status:"ELIGIBLE_LOCAL_READ_ONLY",code:"REQUIRES_PROVIDER_READBACK",mutation:false,foreign_activation:false,host_verified:false};
}
export async function runReadOnlyProbe(request,provider){
  const gate=inspectCapabilityRequest(request);
  if(gate.status!=="ELIGIBLE_LOCAL_READ_ONLY")return gate;
  if(!provider||typeof provider.readCommitFile!=="function")return {status:"PENDING",code:"NO_AUTHORIZED_PROVIDER",mutation:false,host_verified:false};
  let observed;try{observed=await provider.readCommitFile({repository:request.repository,commit:request.source_commit,path:request.path})}
  catch{return {status:"PENDING",code:"PROVIDER_READ_FAILED",mutation:false,host_verified:false}}
  if(!observed||observed.sha!==request.expected_blob_sha||typeof observed.content!=="string")return {status:"REVIEW",code:"BLOB_MISMATCH_OR_INCOMPLETE_READBACK",mutation:false,host_verified:false};
  return {status:"SOURCE_READBACK_MATCH",capability_id:request.capability_id,origin_system:"LYVRA",caller:request.caller,source_commit:request.source_commit,source_blob:observed.sha,content_length:observed.content.length,evidence_class:"PROVIDER_RESPONSE_NOT_INDEPENDENTLY_AUTHENTICATED",mutation:false,foreign_activation:false,host_verified:false};
}
