// LYVRA Visual Intelligence additive continuity view. No new engine or authority.
import {projectDualLayer} from '../dual-layer-visual-projection.mjs';
const STATES=new Set(['DISCOVERED','EVIDENCE_BOUND','REGISTERED','VISIBLE','IN_PROGRESS','VERIFIED','CLOSED','BLOCKED']);
const CLOSED=new Set(['CLOSED']);
const SAFE_HOFF=new Set(['NOT_SENT','PROPOSED','DELIVERED','ACKNOWLEDGED','ADOPTED','REJECTED']);
function checkItem(r){
 if(!r||typeof r.id!=='string'||!/^LYVRA_[A-Z0-9_]+$/.test(r.id)||!STATES.has(r.stage))throw new TypeError('invalid continuity id/stage');
 if(typeof r.title!=='string'||!r.title.trim()||!r.origin?.evidence_id||!r.origin?.classification)throw new TypeError('missing origin evidence');
 if(typeof r.resume?.anchor!=='string'||!r.resume.anchor.trim()||!SAFE_HOFF.has(r.handoff?.status))throw new TypeError('missing resume/handoff');
 if(r.stage==='CLOSED' && (!r.outcome?.verified_receipt||r.handoff?.status==='PROPOSED'))throw new TypeError('closure needs verified outcome');
 if(['DELIVERED','ACKNOWLEDGED','ADOPTED'].includes(r.handoff.status)&&!r.handoff.receipt)throw new TypeError('handoff status needs receipt');
 if(['REGISTERED','VISIBLE','IN_PROGRESS','VERIFIED','CLOSED'].includes(r.stage)&&!r.registration?.receipt)throw new TypeError('registered stage needs native receipt');
 if(['VISIBLE','IN_PROGRESS','VERIFIED','CLOSED'].includes(r.stage)&&!r.visibility?.receipt)throw new TypeError('visible stage needs host receipt');
}
export function projectDevelopmentContinuity(registry, ledger, opts={}){
 const base=projectDualLayer(registry,opts); // authoritative existing two-layer projector
 if(!ledger||ledger.schema!=='LYVRA_DEVELOPMENT_CONTINUITY_V1'||ledger.authority!=='WHOLE_LYVRA'||!Array.isArray(ledger.records))throw new TypeError('unverified continuity ledger');
 const seen=new Set();
 const records=ledger.records.map(r=>{
   checkItem(r);
   if(seen.has(r.id))throw new TypeError('duplicate continuity id');seen.add(r.id);
   // Strict display allowlist: do not emit private references, raw chat, tokens or provider payloads.
   return {id:r.id,title:r.title,stage:r.stage,source_class:r.origin.classification,
     evidence_id:r.origin.evidence_id,handoff_status:r.handoff.status,
     resume_anchor:r.resume.anchor,blocked:!!r.blocked,closed:!!r.outcome?.verified_receipt};
 });
 const pending=records.filter(r=>!CLOSED.has(r.stage));
 const selected=[...pending].sort((a,b)=>Number(b.blocked)-Number(a.blocked)||a.id.localeCompare(b.id));
 return {authority:base.authority,projects:{dynamic:base.dynamic,persistent:base.persistent},
   continuity:{dynamic:selected,persistent:records},source_project_count:base.source_count,
   source_continuity_count:records.length,no_autoactivation:true,no_private_content:true,
   decision_authority:'LYVRA_ONLY',writes_performed:false};
}

// Pure governed transition proposal: caller persists only with separate native approval.
const NEXT={DISCOVERED:['EVIDENCE_BOUND'],EVIDENCE_BOUND:['REGISTERED'],REGISTERED:['VISIBLE'],VISIBLE:['IN_PROGRESS','BLOCKED'],IN_PROGRESS:['VERIFIED','BLOCKED'],BLOCKED:['IN_PROGRESS'],VERIFIED:['CLOSED'],CLOSED:[]};
export function advanceDevelopmentRecord(ledger,id,patch){
 if(!ledger||ledger.schema!=='LYVRA_DEVELOPMENT_CONTINUITY_V1'||!Array.isArray(ledger.records))throw new TypeError('invalid ledger');
 const found=ledger.records.find(r=>r.id===id);
 if(!found)throw new TypeError('unknown continuity id');
 if(!patch||!NEXT[found.stage]?.includes(patch.stage))throw new TypeError('invalid stage transition');
 if(patch.id&&patch.id!==id)throw new TypeError('identity change forbidden');
 if(patch.origin&&JSON.stringify(patch.origin)!==JSON.stringify(found.origin))throw new TypeError('evidence origin immutable');
 const next={...found,...patch,id,origin:found.origin,
   handoff:{...found.handoff,...patch.handoff},resume:{...found.resume,...patch.resume},
   outcome:{...found.outcome,...patch.outcome},registration:{...found.registration,...patch.registration},
   visibility:{...found.visibility,...patch.visibility}};
 checkItem(next);
 return {...ledger,records:ledger.records.map(r=>r.id===id?next:r)};
}
