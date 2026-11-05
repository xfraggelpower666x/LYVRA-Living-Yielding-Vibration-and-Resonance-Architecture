// R50 additive task-intake projection for the EXISTING LYVRA parallel lifecycle.
// No scheduler, router, background worker, host acceptance or root authority.
const SIX=Object.freeze(['DICTATION','ANALYTICS','CHARACTER_RELATIONS','VISUAL','INTERRUPTION_CONTINUITY','RESEARCH']);
const BACKLOG=Object.freeze(['T07','T18','T19','T20','T21','T22','T23','T24','T25']);
const PAUSED=Object.freeze(['POST','SCEERI_MYCEL','PLUGIN_HOST_ACCEPTANCE']);
const TYPES=new Set(['NEW_REQUIREMENT','NEW_EVIDENCE','BLOCKER','RESUME','CORRECTION']);
const SHA=/^[0-9a-f]{40}$/;
export {SIX as R50_STRANDS};

function requireTrue(condition,code){if(!condition)throw new Error(code)}
function canonical(s){return String(s).normalize('NFKC').toLowerCase().trim().replace(/\s+/g,' ')}
export function projectR50Intake(ledger,events=[],{head,pointerBlob,knownTasks=[]}={}){
  requireTrue(SHA.test(head||'')&&SHA.test(pointerBlob||''),'FRESH_WHOLE_SOURCE_REQUIRED');
  requireTrue(ledger?.productive_head===head&&ledger?.productive_pointer_blob===pointerBlob,'STALE_WHOLE_SOURCE');
  requireTrue(JSON.stringify(ledger.strands?.map(s=>s.id))===JSON.stringify(SIX),'STRANDS_NOT_PRESERVED');
  requireTrue(JSON.stringify(ledger.r30_open_ids)===JSON.stringify(BACKLOG),'R30_BACKLOG_CHANGED');
  requireTrue(JSON.stringify(ledger.paused_return_lanes)===JSON.stringify(PAUSED)&&ledger.return_anchor==='ANALYTICS','ANCHORS_CHANGED');
  requireTrue(ledger.host_gates_open===18&&ledger.host_gates_closed_by_this_round===0,'HOST_GATE_INFLATION');
  requireTrue(ledger.writes?.production===0,'PRODUCTIVE_WRITE_NOT_AUTHORIZED');
  requireTrue(Array.isArray(events)&&Array.isArray(knownTasks),'INVALID_INPUT');
  const taskMap=new Map(), acceptanceKeys=new Set();
  for(const task of knownTasks){
    requireTrue(SIX.includes(task.strand)&&typeof task.id==='string'&&task.id&&typeof task.acceptance_key==='string'&&task.acceptance_key,'INVALID_KNOWN_TASK');
    requireTrue(!taskMap.has(task.id),'DUPLICATE_KNOWN_TASK');
    const scopedKey=task.strand+'\u0000'+canonical(task.acceptance_key);
    requireTrue(!acceptanceKeys.has(scopedKey),'AMBIGUOUS_KNOWN_ACCEPTANCE_KEY');
    acceptanceKeys.add(scopedKey);taskMap.set(task.id,task);
  }
  const seen=new Set(),results=[];
  for(const event of events){
    requireTrue(TYPES.has(event?.kind)&&SIX.includes(event?.strand),'INVALID_EVENT_SCOPE');
    requireTrue(typeof event.id==='string'&&event.id&&typeof event.source==='string'&&event.source.trim()&&typeof event.description==='string'&&event.description.trim(),'EVENT_PROVENANCE_REQUIRED');
    requireTrue(!seen.has(event.id),'DUPLICATE_EVENT_ID');seen.add(event.id);
    requireTrue(!event.host_verified&&!event.productive_write,'EVENT_CANNOT_PROMOTE_HOST_OR_WRITES');
    const links=Array.isArray(event.related_strands)?event.related_strands:[];
    requireTrue(links.every(s=>SIX.includes(s)&&s!==event.strand),'FOREIGN_OR_SELF_DEPENDENCY');
    const match=knownTasks.find(x=>x.strand===event.strand&&canonical(x.acceptance_key)===canonical(event.acceptance_key||''));
    results.push({id:event.id,strand:event.strand,kind:event.kind,source:event.source,
      classification:match?'EXISTING_GATE_NEW_EVIDENCE':'CANDIDATE_NOT_AUTO_PROMOTED',
      related_task_id:match?.id??null,
      related_strands:[...new Set(links)],
      // Caller claims never become verified checkpoints without independent source readback.
      checkpoint:null,checkpoint_claim:event.verified_checkpoint||null,
      resume_status:event.kind==='RESUME'?'CHECKPOINT_READBACK_REQUIRED':'SOURCE_REVIEW_REQUIRED',
      host_accepted:false,productive_write:false});
  }
  return {schema:'LYVRA_R50_PARALLEL_INTAKE_SOURCE_PROJECTION',state:'ISOLATED_SOURCE_ONLY',
    head,pointerBlob,events:results,
    preserved:{strands:[...SIX],r30_open:[...BACKLOG],host_gates_open:18,
      return_anchor:'ANALYTICS',paused:[...PAUSED]},
    new_scheduler:false,auto_activation:false,persistent_write:false,host_accepted:false,
    next_action:'REVIEW_SOURCE_AND_EXISTING_LIFECIRCLE_BEFORE_GOVERNED_ADOPTION'};
}
