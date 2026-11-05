// LYVRA R44: bind ACTUAL existing Suno automation peek shape to original R40 intake.
// A complete NO_CHANGE report is a verified monitor RESULT, not a new Suno fact.
// No task mutation, paid provider run, source-readback fabrication or rule promotion.
import {ingestSunoMonitorResult,SUNO_TASK_ID} from './r40-suno-source-bridge.mjs';
const HEX=/^[a-f0-9]{40}$/;
const isIso=s=>typeof s==='string'&&Number.isFinite(Date.parse(s));
export function ingestR44AutomationPeek(peek,{currentHead,reviewedSources=[]}={}){
 if(!HEX.test(currentHead||''))throw TypeError('FRESH_WHOLE_CURRENT_HEAD_REQUIRED');
 const task=peek?.automations?.find(x=>x.id===SUNO_TASK_ID);
 if(!task||task.is_enabled!==true) return {status:'TASK_NOT_ENABLED_OR_NOT_FOUND',accepted:false};
 const run=task.run_details?.last_run,report=task.run_details?.latest_result;
 if(!run||!report||run.id!==report.run_id||
    run.recorded_status!=='completed'||
    run.completed_at!==report.completed_at||
    !isIso(run.completed_at)||!isIso(task.last_run_time)||
    report.content_truncated!==false||report.is_failure_message===true||
    typeof report.content_text!=='string'||!report.content_text.trim()) {
   return {status:'ORIGINAL_AUTOMATION_RUN_READBACK_PENDING',accepted:false,taskId:SUNO_TASK_ID};
 }
 if(!run.chat_ref?.id||run.chat_ref.type!=='chatgpt')return {status:'RUN_ORIGIN_UNVERIFIED',accepted:false};
 const mode=/^\*\*LYVRA Suno-Gesamtmonitor[^\n]*\bNO_CHANGE\*\*/u.test(report.content_text)?
   'NO_CHANGE':'REVIEW_REQUIRED';
 const meta={taskId:SUNO_TASK_ID,runId:run.id,completedAt:run.completed_at,reportComplete:true,
    reportText:report.content_text,reportChatRef:run.chat_ref.id,
    sourceStatus:'REPORT_RESULT_ONLY_NOT_ORIGINAL_SOURCE_READBACK',
    originalSunoSourceReadback:false,hostSunoExecutionVerified:false,productiveWrites:0,
    monitorTaskUnchanged:true,hostGatesClosed:0,mode};
 if(mode==='NO_CHANGE')return {status:'NO_CHANGE_REPORT_READBACK',accepted:true,newMusicFinding:false,
   analyticsEvidencePromoted:false,...meta};
 const intake=ingestSunoMonitorResult({taskId:SUNO_TASK_ID,enabled:true,
    lastRunTime:task.last_run_time,currentHead,sourceRevision:currentHead,
    result:{...report,recorded_status:run.recorded_status},
    reviewedSources});
 return {status:intake.status,accepted:intake.accepted===true,
    newMusicFinding:false,analyticsEvidencePromoted:false,
    sourceCandidate:intake, ...meta};
}
