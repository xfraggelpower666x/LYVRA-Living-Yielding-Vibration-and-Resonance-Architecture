// Source-only host adapter: no connector discovery, elevated authorization, or host claim.
import {executeAuthorizedReadOnlyCapability} from './authorized-host-executor.mjs';
export const HOST_ENTRYPOINT_BOUNDARY = Object.freeze({owner:'WHOLE_LYVRA',read_only:true,plugin_host_verified:false,foreign_writes:false,foreign_activation:false});
export async function invokeWithAuthorizedGitHubHandle({request,hostActions}={}) {
  const action=hostActions?.mcp__GitHub__fetch_file;
  // Only a real, explicitly injected callable may reach the original executor.
  // The original capability gate still runs before every provider call.
  return executeAuthorizedReadOnlyCapability({request,authorizedGitHubFetchFile:typeof action==='function' ? args=>action(args) : undefined});
}
