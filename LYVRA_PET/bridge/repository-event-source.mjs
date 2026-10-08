import {canonicalPetEvent,createSignedEventProducer} from './signed-event-transport.mjs';
export const EXPRESSION_CARRIER='LYVRA_PET/runtime/APPROVED_EXPRESSION_CURRENT.json';
const REPO='xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture';
const PET='pet_6ab791129364819183885f44a21497a2';
const KINDS=['shared_success','beautiful_moment','shared_joke','explicit_frustration','explicit_boredom','music_work','serious_attention'];
const FACETS=['whole','track_design','speech_design','suno_studio_2'];
// Nur numerische Rate-Limit-Evidenz veröffentlichen; keine Antworttexte oder URLs.
const githubReadStates=new WeakMap();
function numericHeader(response,name){const value=response.headers.get(name);return value!==null&&/^[0-9]+$/.test(value)&&Number.isSafeInteger(Number(value))?Number(value):null;}
export function publicNativeSourceFailure(error){
 if(error?.nativeDiagnostic)return {status:'SOURCE_UNAVAILABLE',reason:error.message,diagnostic:error.nativeDiagnostic,retry_at:error.retryAt};
 return {status:'SOURCE_UNAVAILABLE',reason:/^NATIVE_SOURCE_HTTP_[0-9]{3}$/.test(error?.message||'')?error.message:'NATIVE_SOURCE_OR_APPROVAL_REJECTED'};
}
async function githubFailure(response,now){
 const remaining=numericHeader(response,'x-ratelimit-remaining'),reset=numericHeader(response,'x-ratelimit-reset'),retry=numericHeader(response,'retry-after');
 let category='GITHUB_HTTP_REJECTED';
 if([403,429].includes(response.status)){
  if(remaining===0)category='GITHUB_PRIMARY_RATE_LIMIT';
  else{let message='';try{const reader=response.body?.getReader();if(reader){const first=await reader.read();await reader.cancel();message=new TextDecoder().decode(first.value||new Uint8Array()).slice(0,4096);}}catch{}
   category=retry!==null||/secondary rate limit|abuse detection/i.test(message)?'GITHUB_SECONDARY_RATE_LIMIT':response.status===429?'GITHUB_RATE_LIMIT':'GITHUB_FORBIDDEN';}
 }
 const error=Error('NATIVE_SOURCE_HTTP_'+response.status);
 error.nativeDiagnostic={category,http_status:response.status};
 if(remaining!==null)error.nativeDiagnostic.rate_limit_remaining=remaining;
 if(reset!==null)error.nativeDiagnostic.rate_limit_reset=reset;
 if(retry!==null)error.nativeDiagnostic.retry_after_seconds=retry;
 // Kein Retry-Loop: dieselbe Isolate pausiert bis zum bestätigten Reset/Retry-After.
 if([403,429].includes(response.status)){
  const deadline=Math.max(now+60000,remaining===0&&reset!==null?reset*1000+1000:0,retry!==null?now+retry*1000:0);
  if(Number.isFinite(deadline)&&deadline<=8640000000000000)error.retryAt=new Date(deadline).toISOString();
 }
 return error;
}
// Read-only attestation: only a dedicated, current Whole-approved repository commit
// may produce an envelope. This endpoint accepts no event supplied by a caller.
export async function readApprovedRepositoryEvent({fetcher=fetch,clock=()=>Date.now(),githubToken}={}){
 if(typeof githubToken!=='string'||!githubToken.trim())return {status:'AUTH_NOT_CONFIGURED'};
 const api='https://api.github.com/repos/'+REPO,headers={'User-Agent':'LYVRA-Pet-ReadOnly-Producer','Accept':'application/vnd.github+json','Authorization':'Bearer '+githubToken.trim(),'X-GitHub-Api-Version':'2022-11-28'};
 async function read(url,allowAbsent=false){
  const isApi=url.startsWith(api+'/'),state=githubReadStates.get(fetcher);
  if(isApi&&state&&clock()<state.until)throw state.error;
  const r=await fetcher(url,{headers,cache:'no-store'});
  if(allowAbsent&&r.status===404)return null;
  if(!r.ok){const error=await githubFailure(r,clock());if(isApi&&error.retryAt)githubReadStates.set(fetcher,{until:Date.parse(error.retryAt),error});throw error;}
  const text=await r.text();if(text.length>30000)throw Error('Native source too large');return JSON.parse(text);
 }
 const first=await read(api+'/branches/lyvra'),head=first.commit?.sha;
 if(!/^[a-f0-9]{40}$/.test(head||''))throw Error('Invalid native HEAD');
 const carrier=await read('https://raw.githubusercontent.com/'+REPO+'/'+head+'/'+EXPRESSION_CARRIER,true);
 if(!carrier||carrier.status==='NONE')return {status:'NO_APPROVED_EVENT',head};
 if(carrier.schema!=='lyvra.pet.approved-expression.v1'||carrier.approved_by!=='WHOLE_LYVRA'||carrier.status!=='APPROVED')throw Error('Native approval missing');
 const event=Object.freeze(JSON.parse(canonicalPetEvent(carrier.event)));
 if(event.pet_id!==PET||!KINDS.includes(event.kind)||!FACETS.includes(event.facet)||!['dad','none'].includes(event.relation)||!/^[a-f0-9]{32,64}$/.test(event.evidence_id))throw Error('Invalid public expression');
 if(Object.keys(event).some(k=>!['pet_id','authority','source_revision','evidence_id','observed_at','kind','facet','relation','sensitive'].includes(k)))throw Error('Private or unbounded event fields');
 const age=clock()-Date.parse(event.observed_at);if(age<0||age>60000)return {status:'EXPIRED',head};
 const commit=await read(api+'/commits/'+head);
 if(commit.parents?.length!==1||commit.parents[0].sha!==event.source_revision||commit.files?.length!==1||commit.files[0].filename!==EXPRESSION_CARRIER)throw Error('Dedicated native publication required');
 const last=await read(api+'/branches/lyvra');if(last.commit?.sha!==head)throw Error('Native HEAD changed');
 return {status:'APPROVED',head,event};
}
export async function produceRepositoryEnvelope({privateKey,keyId,githubToken,fetcher=fetch,cryptoApi=crypto,clock=()=>Date.now()}={}){
 if(!privateKey||!keyId)return {status:'NOT_CONFIGURED'};
 const approved=await readApprovedRepositoryEvent({fetcher,clock,githubToken});if(approved.status!=='APPROVED')return approved;
 const canonical=canonicalPetEvent(approved.event);
 const producer=createSignedEventProducer({privateKey,keyId,cryptoApi,clock,verifyNativeEvent:event=>canonicalPetEvent(event)===canonical});
 return {status:'APPROVED',head:approved.head,envelope:await producer.produce(approved.event)};
}
