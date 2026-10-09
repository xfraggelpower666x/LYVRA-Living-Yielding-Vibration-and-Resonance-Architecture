// Whole-LYVRA development events. Pure candidate transformation; no publishing.
import {developmentProgress} from './development-progress-producer.mjs';
const TYPES=new Set(['START','TASK_STATUS','PAUSE','RESUME','COMPLETE','INACTIVE']);
const TASK_STATES=new Set(['OPEN','IN_PROGRESS','DONE','BLOCKED']);
const SHA=/^[a-f0-9]{40}$/;
function validateEvent(e){
 if(!e||!TYPES.has(e.type)||!SHA.test(e.source_revision||'')||typeof e.event_id!=='string'||!e.event_id.trim()||typeof e.evidence_ref!=='string'||!e.evidence_ref.trim())throw Error('Verified event identity, revision and evidence required');
 if(e.updated_at!=null&&(!Number.isFinite(Date.parse(e.updated_at))||typeof e.updated_at!=='string'))throw Error('Invalid event timestamp');
}
function evidenceTasks(before,proofs){
 if(!proofs||typeof proofs!=='object'||Array.isArray(proofs))throw Error('Private evidence map required for all carried tasks');
 return before.current_work.tasks.map(t=>{
  const proof=Object.prototype.hasOwnProperty.call(proofs,t.id)?proofs[t.id]:null;
  if(!proof||typeof proof.evidence_ref!=='string'||!proof.evidence_ref.trim()||t.status==='DONE'&&proof.completion_verified!==true)throw Error('Missing verified prior task evidence');
  return {...t,evidence_ref:proof.evidence_ref,completion_verified:t.status==='DONE'};
 });
}
export function applyDevelopmentEvent(previous,event,{prior_task_evidence=null,seen_event_ids=null}={}){
 validateEvent(event);
 if(!(seen_event_ids instanceof Set)||seen_event_ids.has(event.event_id))throw Error('Unverified or replayed event ID');
 const before=previous??{schema:'lyvra.development.progress.v1',status:'INACTIVE',current_work:null};
 if(before.schema!=='lyvra.development.progress.v1'||before.authority&&before.authority!=='WHOLE_LYVRA')throw Error('Invalid previous carrier');
 if(event.type==='INACTIVE')return developmentProgress({status:'INACTIVE',updated_at:event.updated_at??null});
 if(event.type==='START'){
  if(before.status==='ACTIVE'||before.status==='PAUSED')throw Error('Development already active');
  return developmentProgress({status:'ACTIVE',source_revision:event.source_revision,updated_at:event.updated_at??null,current_work:{title:event.title,tasks:event.tasks}});
 }
 if(!before.current_work||!['ACTIVE','PAUSED'].includes(before.status))throw Error('No active development');
 const tasks=evidenceTasks(before,prior_task_evidence);
 if(event.type==='TASK_STATUS'){
  if(before.status!=='ACTIVE')throw Error('Paused development cannot change tasks');
  if(typeof event.task_id!=='string'||!TASK_STATES.has(event.task_status))throw Error('Invalid task transition');
  let found=false;
  const next=tasks.map(t=>{
   if(t.id!==event.task_id)return t;
   found=true;
   return {...t,status:event.task_status,evidence_ref:event.evidence_ref,completion_verified:event.task_status==='DONE'&&event.completion_verified===true};
  });
  if(!found)throw Error('Unknown task');
  return developmentProgress({status:'ACTIVE',source_revision:event.source_revision,updated_at:event.updated_at??null,current_work:{title:before.current_work.title,tasks:next}});
 }
 if(event.type==='RESUME'&&before.status!=='PAUSED'||event.type==='PAUSE'&&before.status!=='ACTIVE')throw Error('Invalid pause/resume transition');
 const target={PAUSE:'PAUSED',RESUME:'ACTIVE',COMPLETE:'COMPLETED'}[event.type];
 if(event.type==='COMPLETE'&&before.status!=='ACTIVE')throw Error('Only active work can complete');
 return developmentProgress({status:target,source_revision:event.source_revision,updated_at:event.updated_at??null,current_work:{title:before.current_work.title,tasks}});
}
// Caller: independently verify source revision, real proof map and event identity,
// keep replay ledger durable, check SHA/recovery, publish via native pointer-last governance.
