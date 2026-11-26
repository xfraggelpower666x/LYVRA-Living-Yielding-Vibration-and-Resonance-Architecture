// R01: isolierter, ausschließlich lesender Kandidat. Keine Live-Konfiguration.
const REPO='xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture';
const sha=/^[a-f0-9]{40}$/;
const json=(value,status=200)=>Response.json(value,{status,headers:{'Cache-Control':'no-store'}});
export function validJob(j){return !!j&&j.operation==='READ_FILE'&&j.repository===REPO&&sha.test(j.commit||'')&&sha.test(j.blob||'')&&typeof j.path==='string'&&/^LYVRA_NATIVE_RUNTIME\/[a-zA-Z0-9_./-]+$/.test(j.path)&&j.path.split('/').every(x=>x&&x!=='.'&&x!=='..')&&j.cost===0;}
export async function gitBlob(content){const bytes=new TextEncoder().encode(content);const prefix=new TextEncoder().encode(`blob ${bytes.length}\0`);const all=new Uint8Array(prefix.length+bytes.length);all.set(prefix);all.set(bytes,prefix.length);return [...new Uint8Array(await crypto.subtle.digest('SHA-1',all))].map(x=>x.toString(16).padStart(2,'0')).join('');}
// Client wird ausdrücklich durch den Betreiber injiziert; keine automatische Tool-Auswahl.
export async function execute(job,{client,verifier,policy}={}){
 const stop=(status,code)=>({status,code,host_verified:false});
 if(!validJob(job))return stop('DENIED','SCOPE');
 if(policy?.zeroCostVerified!==true)return stop('BLOCKED','COST_GATE');
 if(!client||typeof client.listTools!=='function'||typeof client.callTool!=='function'||typeof verifier!=='function')return stop('READBACK_PENDING','BINDINGS');
 try{
 const listing=await client.listTools(); const tool=listing.tools?.find(t=>t.name===policy.toolName);
 if(!tool||policy.toolName!=='fetch_file'||!tool.inputSchema?.properties?.repository_full_name||!tool.inputSchema?.properties?.ref||!tool.inputSchema?.properties?.path)return stop('DENIED','TOOL_SCHEMA');
 const args={repository_full_name:job.repository,ref:job.commit,path:job.path,encoding:'utf-8'};
 const result=await client.callTool({name:tool.name,arguments:args});
 if(result.isError)return stop('READBACK_PENDING','MCP_ERROR');
 const f=result.structuredContent?.result;
 if(typeof f?.content!=='string'||f.encoding!=='utf-8'||f.sha!==job.blob||await gitBlob(f.content)!==job.blob)return stop('REVIEW','BLOB');
 const second=await verifier(args);
 if(second?.sha!==job.blob||typeof second.content!=='string'||await gitBlob(second.content)!==job.blob)return stop('REVIEW','SECOND_READBACK');
 return {status:'DUAL_READBACK_MATCH',receipt:{repository:job.repository,commit:job.commit,path:job.path,blob:job.blob},host_verified:false,independent_provider_identity_verified:false};
 }catch{return stop('READBACK_PENDING','PROVIDER_ERROR');}
}
export function createWorker(bindings={}){return {async fetch(req){const u=new URL(req.url);if(req.method==='GET'&&u.pathname==='/health')return json({status:'CANDIDATE',live_verified:false});if(req.method!=='POST'||u.pathname!=='/readback')return json({status:'DENIED'},404);if(typeof bindings.authorize!=='function'||!await bindings.authorize(req))return json({status:'DENIED'},401);try{const body=await req.text();if(body.length>8192)return json({status:'DENIED'},413);return json(await execute(JSON.parse(body),bindings));}catch{return json({status:'DENIED'},400);}}};}
// Standardexport ist absichtlich ohne Provider und Autorisierung gesperrt.
export default createWorker();
