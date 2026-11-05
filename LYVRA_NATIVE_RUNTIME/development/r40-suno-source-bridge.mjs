// R40: Source readback gate for existing scheduled Suno Gesamtmonitor. No external task calls.
import {createHash} from 'node:crypto';
import {ingestAnalyticsEvidence} from './r39-r26-functional-extracts.mjs';
export const SUNO_TASK_ID='6ad3035a13c8819188a27f9b6de6e2ec';
const isISO=x=>typeof x==='string'&&!Number.isNaN(Date.parse(x));
const WEB=/^https:\/\/[^\s]+$/;
export function ingestSunoMonitorResult({taskId,enabled,lastRunTime,result,currentHead,sourceRevision,reviewedSources=[]}={}){
 if(taskId!==SUNO_TASK_ID||enabled!==true||!isISO(lastRunTime))return {status:'MONITOR_PROVIDER_UNVERIFIED',accepted:false,sourceReadback:false};
 if(!result?.content_text||result.content_truncated!==false||result.is_failure_message===true||result.recorded_status==='failed')return {status:'RUN_METADATA_ONLY',accepted:false,sourceReadback:false,lastRunTime};
 if(!isISO(result.completed_at)||!result.run_id||!result.content_text.trim())return {status:'RUN_RESULT_READBACK_INCOMPLETE',accepted:false,sourceReadback:false};
 if(!/^[a-f0-9]{40}$/.test(currentHead||'')||typeof sourceRevision!=='string'||!sourceRevision.trim())return {status:'FRESH_WHOLE_CURRENT_REQUIRED',accepted:false,sourceReadback:false};
 // R41: A caller's bare readback=true is NOT source content evidence. Require
 // an actual retrieved source body, its matching SHA256, and a bounded origin.
 // The host must separately attest that it fetched this exact URL; this local
 // digest check is integrity, not independent provider/host attestation.
 const verified=reviewedSources.filter(s=>{
   if(!s||!WEB.test(s.url||'')||!['OFFICIAL_SUNO','CURRENT_COMMUNITY','HYPOTHESIS'].includes(s.class)||
      s.readback!==true||!s.revision||!isISO(s.accessedAt)||
      typeof s.content_text!=='string'||!s.content_text.trim()||
      !/^[a-f0-9]{64}$/.test(s.content_sha256||'')||s.content_truncated!==false||
      !s.retrieval_ref||typeof s.retrieval_ref!=='string')return false;
   return createHash('sha256').update(s.content_text,'utf8').digest('hex')===s.content_sha256;
 });
 if(verified.length===0)return {status:'LINKED_ORIGINAL_SOURCE_READBACK_PENDING',accepted:false,sourceReadback:false,runId:result.run_id};
 const digest=createHash('sha256').update(result.content_text,'utf8').digest('hex');
 const evidence=ingestAnalyticsEvidence({kind:'SUNO_MONITOR',sourceId:'AUTOMATION_'+SUNO_TASK_ID+':'+result.run_id,sourceUrl:verified[0].url,sourceRevision,observedAt:result.completed_at,contentDigest:digest,assertion:'Original monitor result with '+verified.length+' independently read-back source links; classification retained as evidence-only',confidence:'OBSERVED',costUSD:0,completeReadback:false});
 return {status:'SOURCE_LINKED_ANALYTICS_CANDIDATE',accepted:true,taskId,lastRunTime,sourceReadback:true,readbackSourceCount:verified.length,integrityVerified:true,independentHostAttestation:false,sourceClasses:verified.map(s=>s.class),evidence,automaticRulePromotion:false,monitorModified:false,hostGateClosed:false,originalContentDigest:digest};
}
