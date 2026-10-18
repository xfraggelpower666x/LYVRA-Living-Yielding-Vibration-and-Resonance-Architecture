// Explicit LYVRA-only host contract. The original imported repository adapter executes.
// This module never discovers credentials, issues host calls by itself, changes permissions,
// mutates GitHub, promotes plugin parity, or claims fresh-host verification.
import {inspectGitHubCapability} from './github-provider-binding.mjs';
export const EXECUTOR_BOUNDARY=Object.freeze({owner:'WHOLE_LYVRA',read_only:true,foreign_activation:false,foreign_writes:false,host_pass_claim:false});
export async function executeAuthorizedReadOnlyCapability({request,authorizedGitHubFetchFile}={}){
  // Authorization and immutable SHA scope are checked inside the original adapter
  // BEFORE any injected provider action is called.
  const result=await inspectGitHubCapability(request,{fetchFile:authorizedGitHubFetchFile});
  return Object.freeze({...result,executor:'LYVRA_SUPERCODEFORGE_NATIVE_HOST_CONTRACT_V1',
    original_repository_adapter_invoked:true,host_verified:false,plugin_parity_verified:false});
}
