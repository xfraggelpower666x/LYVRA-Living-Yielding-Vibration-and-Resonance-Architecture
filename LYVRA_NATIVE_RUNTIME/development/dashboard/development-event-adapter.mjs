// Evidence-gated native development event adapter. PURE: never publishes, writes or activates systems.
import {developmentProgress} from './development-progress-producer.mjs';
const TYPES=new Set(['START','TASK_STATUS','PAUSE','RESUME','COMPLETE','INACTIVE']);
const TASK_STATES=new Set(['OPEN','IN_PROGRESS','DONE','BLOCKED']);
const SHA=/^[a-f0-9]{40}$/;
function validEvent(e){
 if(!e||typeof e!=='object'||!TYPES.has(e.type)||!SHA.test(e.source_revision||'')||
 typeof e.event_id!=='string'||!e.event_id.trim()||typeof e.evidence_ref!=='string'||!e.evidence_ref.trim())throw Error('Verified event identity, revision and evidence required');
}
export function applyDevelopmentEvent(previous,event){
 validEvent(event);
 const before=previous??{schema:'lyvra.development.progress.v1',status:'INACTIVE',current_work:null};
 if(event.type==='INACTIVE')return developmentProgress({status:'INACTIVE',updated_at:event.updated_at??null});
 if(event.type==='START'){
  if(before.status==='ACTIVE'||before.status==='PAUSED')throw Error('Development already active');
  return developmentProgress({status:'ACTIVE',source_revision:event.source_revision,updated_at:event.updated_at??null,current_work:{title:event.title,tasks:event.tasks}});
 }
 if(!before.current_work||!['ACTIVE','PAUSED'].includes(before.status))throw Error('No active development');
 if(event.type==='TASK_STATUS'){
  if(before.status!=='ACTIVE')throw Error('Paused development cannot change tasks');
  if(typeof event.task_id!=='string'||!TASK_STATES.has(event.task_status))throw Error('Invalid task transition');
  let found=false;
  const tasks=before.current_work.tasks.map(t=>{
   if(t.id!==event.task_id)return {...t,evidence_ref:'prior/'+t.id,completion_verified:t.status==='DONE'};
   found=true;
   return {...t,status:event.task_status,evidence_ref:event.evidence_ref,completion_verified:event.task_status==='DONE'&&event.completion_verified===true};
  });
  if(!found)throw Error('Unknown task');
  return developmentProgress({status:'ACTIVE',source_revision:event.source_revision,updated_at:event.updated_at??null,current_work:{title:before.current_work.title,tasks}});
 }
 const target={PAUSE:'PAUSED',RESUME:'ACTIVE',COMPLETE:'COMPLETED'}[event.type];
 if(event.type==='RESUME'&&before.status!=='PAUSED')throw Error('Only paused work can resume');
 if(event.type==='PAUSE'&&before.status!=='ACTIVE')throw Error('Only active work can pause');
 const tasks=before.current_work.tasks.map(t=>({...t,evidence_ref:'prior/'+t.id,completion_verified:t.status==='DONE'}));
 return developmentProgress({status:target,source_revision:event.source_revision,updated_at:event.updated_at??null,current_work:{title:before.current_work.title,tasks}});
}
// Caller must validate event provenance, de-duplicate event_id, retain private task evidence,
// obtain fresh GitHub authority/recovery/expected SHA and publish pointer LAST.
