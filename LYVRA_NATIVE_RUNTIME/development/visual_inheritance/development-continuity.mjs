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
 if(r.handoff.status==='ADOPTED'&&!r.handoff.receipt)throw new TypeError('adoption needs receipt');
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
