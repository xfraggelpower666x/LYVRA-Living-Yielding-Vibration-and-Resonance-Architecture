// LYVRA SuperCodeForge adapter to an ALREADY AUTHORIZED GitHub fetch_file action.
// This is a caller-supplied read-only host interface; no hidden connector discovery,
// auth escalation, transport routing, foreign activation, writes or host-PASS assertions.
import {inspectCapabilityRequest,runReadOnlyProbe} from './read-only-capability-adapter.mjs';
export function bindAuthorizedGitHubFetchFile(fetchFile){
  if(typeof fetchFile!=='function')return null;
  return Object.freeze({
    async readCommitFile({repository,commit,path}){
      const response=await fetchFile({repository_full_name:repository,path,ref:commit,encoding:'utf-8'});
      const file=response?.result;
      if(!file||typeof file.sha!=='string'||typeof file.content!=='string'||file.encoding!=='utf-8')
        throw Error('GITHUB_READBACK_INCOMPLETE');
      return {sha:file.sha,content:file.content};
    }
  });
}
export async function inspectGitHubCapability(request,{fetchFile}={}){
  const gate=inspectCapabilityRequest(request);
  if(gate.status!=='ELIGIBLE_LOCAL_READ_ONLY')return gate;
  const provider=bindAuthorizedGitHubFetchFile(fetchFile);
  return runReadOnlyProbe(request,provider);
}
