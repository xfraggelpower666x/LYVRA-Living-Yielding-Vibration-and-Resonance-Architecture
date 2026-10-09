// LYVRA SHEB DEV: pure validation, no delivery side effects.
const transitions={PROPOSED:['SENT','WRITE_BLOCKED'],SENT:['RECEIVED','WRITE_BLOCKED'],RECEIVED:['VERIFIED','QUARANTINED'],VERIFIED:['EVALUATED','QUARANTINED'],EVALUATED:['ADOPTED','REJECTED'],ADOPTED:['APPLIED'],APPLIED:['READBACK_PASS']};
export function validateHandoff(m){
 if(!m||typeof m!=='object'||Array.isArray(m))throw Error('INVALID_HANDOFF');
 for(const f of ['handoff_id','lineage_id','sender','receiver','workspace_id','source_revision','causal_reason','created_at'])if(typeof m[f]!=='string'||!m[f].trim()||m[f].length>500)throw Error('INVALID_'+f.toUpperCase());
 if(!Number.isSafeInteger(m.version)||m.version<1||m.version>1000000)throw Error('INVALID_VERSION');
 if(!/^[a-f0-9]{40}$/.test(m.source_revision)||!Number.isFinite(Date.parse(m.created_at)))throw Error('INVALID_PROVENANCE');
 if(!Array.isArray(m.evidence_refs)||!m.evidence_refs.every(x=>typeof x==='string'&&x.length<=500))throw Error('INVALID_EVIDENCE');
 return Object.freeze({...m,evidence_refs:Object.freeze([...m.evidence_refs])});
}
export function transitionReceipt(m,previous,next,{recipientReadback=false,authorized=false}={}){
 const msg=validateHandoff(m);
 if(!(transitions[previous]||[]).includes(next))throw Error('ILLEGAL_TRANSITION');
 if(next==='RECEIVED'&&!recipientReadback)throw Error('RECEIPT_NEEDS_READBACK');
 if(['ADOPTED','APPLIED','READBACK_PASS'].includes(next)&&!authorized)throw Error('GOVERNANCE_REQUIRED');
 if(next==='READBACK_PASS'&&!recipientReadback)throw Error('APPLIED_READBACK_REQUIRED');
 return Object.freeze({handoff_id:msg.handoff_id,version:msg.version,lineage_id:msg.lineage_id,receiver:msg.receiver,source_revision:msg.source_revision,state:next});
}
export function classifyIntake(msg,existing){
 const item=validateHandoff(msg);
 if(!existing)return 'NEW';
 if(existing.handoff_id===item.handoff_id&&existing.version===item.version)return existing.source_revision===item.source_revision?'DUPLICATE':'QUARANTINE';
 if(existing.lineage_id===item.lineage_id&&existing.workspace_id===item.workspace_id&&item.version>existing.version)return 'SUPERSEDES_IN_LINEAGE';
 return 'SEPARATE_LINEAGE';
}
