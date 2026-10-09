// Whole LYVRA native task-to-dashboard producer, pure and non-publishing.
// Caller must complete native authority, recovery, expected SHA and pointer-last governance.
const STATUSES=new Set(['OPEN','IN_PROGRESS','DONE','BLOCKED']);
const WORK_STATES=new Set(['ACTIVE','PAUSED','COMPLETED','INACTIVE']);
const SHA=/^[a-f0-9]{40}$/;
export function developmentProgress({status,current_work=null,source_revision=null,updated_at=null}={}){
 if(!WORK_STATES.has(status))throw Error('Invalid development lifecycle state');
 if(status==='INACTIVE')return {schema:'lyvra.development.progress.v1',status,authority:'WHOLE_LYVRA',source:'LYVRA_NATIVE_RUNTIME',current_work:null,updated_at};
 if(!current_work||typeof current_work.title!=='string'||!current_work.title.trim()||current_work.title.length>120||!SHA.test(source_revision||''))throw Error('Verified title and source revision required');
 const tasks=current_work.tasks;
 if(!Array.isArray(tasks)||tasks.length===0||tasks.length>1000)throw Error('Evidence-backed task list required');
 const ids=new Set();
 const clean=tasks.map(t=>{
  if(!t||typeof t.id!=='string'||!t.id.trim()||t.id.length>120||ids.has(t.id)||!STATUSES.has(t.status))throw Error('Invalid, duplicate or unverified task identity/status');
  ids.add(t.id);
  if(typeof t.evidence_ref!=='string'||!t.evidence_ref.trim()||t.evidence_ref.length>300)throw Error('Every task requires an evidence reference');
  if(t.status==='DONE'&&t.completion_verified!==true)throw Error('DONE requires explicit verified completion');
  return {id:t.id,status:t.status};
 });
 if(status==='COMPLETED'&&clean.some(t=>t.status!=='DONE'))throw Error('Completed work contains unfinished tasks');
 if(updated_at!==null&&(!Number.isFinite(Date.parse(updated_at))||typeof updated_at!=='string'))throw Error('Invalid timestamp');
 return {schema:'lyvra.development.progress.v1',status,authority:'WHOLE_LYVRA',source:'LYVRA_NATIVE_RUNTIME',current_work:{title:current_work.title,source_revision,tasks:clean},updated_at};
}
export function developmentProgressCount(payload){
 if(payload?.schema!=='lyvra.development.progress.v1'||payload.status!=='ACTIVE'||!Array.isArray(payload.current_work?.tasks))return null;
 const total=payload.current_work.tasks.length,done=payload.current_work.tasks.filter(t=>t.status==='DONE').length;
 return total>0?{done,total,percent:Math.round(done*100/total)}:null;
}
