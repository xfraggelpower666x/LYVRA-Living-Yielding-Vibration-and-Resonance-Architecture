// R06.2: lokaler Renderer-Adapter, keine Provider-Ausführung oder neue Authority.
import {createHash} from 'node:crypto';
export const LIMITS=Object.freeze({title:80,extended:1000,style:1000,lyrics:5000,taste:2000});
const digest=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const canonical=x=>Array.isArray(x)?x.map(canonical):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,canonical(x[k])])):x;
export function inspect(d,discovery){
 const errors=[],warnings=[],counts={};
 if(!d||typeof d!=='object')return {status:'HOLD',errors:['DRAFT_REQUIRED']};
 for(const [k,n] of Object.entries(LIMITS)){const v=d[k]??'';if(typeof v!=='string'){errors.push('TYPE_'+k);continue;}counts[k]=v.length;if(v.length>n)errors.push('LIMIT_'+k);}
 for(const k of ['title','extended','style','lyrics'])if(typeof d[k]!=='string'||!d[k].trim())errors.push('REQUIRED_'+k);
 if(d.mode!=='custom')errors.push('CUSTOM_REQUIRED');
 if(!discovery?.revision||d.discoveryRevision!==discovery.revision)errors.push('DISCOVERY_STALE');
 if(!Array.isArray(discovery?.models)||!discovery.models.some(m=>m.id===d.modelId&&m.can_use===true))errors.push('MODEL_NOT_VERIFIED');
 for(const k of ['weirdness','styleInfluence']){if(!Number.isInteger(d[k])||d[k]<0||d[k]>100)errors.push('RANGE_'+k);else if(d[k]>=86){warnings.push('CRITICAL_'+k);if(d[k]>86&&!d.reasons?.[k]?.trim())errors.push('REASON_'+k);}}
 if(!Number.isInteger(d.variety)||d.variety<0||d.variety>4)errors.push('VARIETY_RANGE');
 if(!['ON','OFF'].includes(d.tasteMode))errors.push('TASTE_DECISION');
 if(d.variety===0&&d.tasteMode==='ON')errors.push('VARIETY_TASTE_CONFLICT');
 if(d.tasteMode==='ON')errors.push('TASTE_MANUAL_ROUTE_REQUIRED');
 if(d.tasteMode==='OFF'&&d.taste)errors.push('UNEXPECTED_TASTE');
 if(!Number.isInteger(d.duration)||d.duration<15||d.duration>360)errors.push('DURATION_RANGE');
 if(d.durationStrict!==false)errors.push('ENDING_PROTECTION_REQUIRED');
 // Der musikalische Befund kommt aus Track Design; dieses Modul erfindet keine Semantik.
 for(const k of ['motor','relations','pressure','ending','drift','functionalEmoji','extendedTranslation']){
 const e=d.audit?.[k];if(e?.status!=='PASS'||typeof e.evidence!=='string'||!e.evidence.trim())errors.push('AUDIT_'+k);
 }
 if(d.audit?.sourceRevision!==d.sourceRevision||!d.sourceRevision)errors.push('AUDIT_SOURCE');
 // Extended hat kein eigenes MCP-Feld. Jede explizite Übersetzung braucht eine belegte Zielstelle.
 if(!Array.isArray(d.translation)||!d.translation.length||d.translation.some(x=>!['style','lyrics'].includes(x?.field)||typeof x?.text!=='string'||!x.text.trim()||typeof d[x.field]!=='string'||!d[x.field].includes(x.text)))errors.push('EXTENDED_MAPPING');
 if(d.maxMode!==true&&d.maxMode!==false)errors.push('MAX_DECISION');
 const payload=errors.length?null:{title:d.title,style:d.style,lyrics:d.lyrics,custom_model_id:d.modelId,controls:{weirdness:d.weirdness/100,style_influence:d.styleInfluence/100,variety:d.variety,duration:d.duration,duration_strict:false,max_mode:d.maxMode}};
 // Freigabe bindet den gesamten Entwurf inklusive Audit, Discovery und kompiliertem Inhalt.
 const revision=payload?digest(canonical({draft:d,discovery,payload})):null;
 return {status:errors.length?'HOLD':'REVIEW_REQUIRED',errors,warnings,counts,revision,payload,providerExecution:false};
}
export function release(d,discovery,approval){
 const result=inspect(d,discovery);
 if(result.status!=='REVIEW_REQUIRED'||approval?.revision!==result.revision||approval?.explicit!==true||(d.maxMode&&approval.maxExplicit!==true))return {...result,status:'HOLD',payload:null};
 return {...result,status:'LOCAL_APPROVAL_MATCH',providerExecution:false};
}
