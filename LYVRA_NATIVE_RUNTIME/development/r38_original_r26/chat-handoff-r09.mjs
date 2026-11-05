import {SIX} from './always-on-impact-r09.mjs';
const SHA=/^[0-9a-f]{40}$/;
const SAFE=/^[A-Za-z0-9][A-Za-z0-9_-]{0,95}$/;
export function assessContext({hostPercent=null,estimatePercent=null,measurementSource=null,hostWarning=false}={}){
 for(const v of [hostPercent,estimatePercent])if(v!==null&&(!Number.isFinite(v)||v<0||v>100))throw Error('INVALID_CONTEXT_PERCENT');
 const measured=hostPercent!==null&&typeof measurementSource==='string'&&measurementSource.trim()!=='';
 const p=measured?hostPercent:estimatePercent;
 const recommendation=hostWarning===true||(p!==null&&p>=85);
 return {schema:'LYVRA_R09_CONTEXT_SIGNAL',contextPercent:measured?p:null,approximationPercent:measured?null:estimatePercent,confidence:measured?'HOST_REPORTED':estimatePercent!==null?'HEURISTIC_UNVERIFIED':'UNKNOWN',recommendation:recommendation?'PREPARE_NEW_CHAT':'NO_THRESHOLD_EVIDENCE',claimExactHostUsage:measured,mode:hostWarning===true?'HOST_WARNING':measured?'HOST_TELEMETRY':estimatePercent!==null?'ESTIMATE':'UNKNOWN'};
}
export function buildHandoff({head,workspaceId,facet='LYVRA_ANALYTICS',lineageId,conversationAnchor,strands=SIX,checkpoints={},learningRef=null,sourceRefs=[],writeStatus='NOT_ATTEMPTED',handoffRef=null}={}){
 if(!SHA.test(head||''))throw Error('CURRENT_HEAD_REQUIRED');
 if(!SAFE.test(workspaceId||'')||!SAFE.test(lineageId||''))throw Error('SCOPED_LINEAGE_REQUIRED');
 if(!conversationAnchor||typeof conversationAnchor!=='string')throw Error('REAL_CONVERSATION_ANCHOR_REQUIRED');
 if(!Array.isArray(strands)||strands.length!==6||SIX.some(s=>!strands.includes(s)))throw Error('SIX_STRANDS_REQUIRED');
 if(!['NOT_ATTEMPTED','WRITE_BLOCKED','READBACK_PENDING','PERSISTED_VERIFIED'].includes(writeStatus))throw Error('INVALID_WRITE_STATUS');
 if(writeStatus==='PERSISTED_VERIFIED'&&!handoffRef)throw Error('PERSISTENCE_READBACK_REFERENCE_REQUIRED');
 const safeCheckpoints={};for(const [key,value] of Object.entries(checkpoints)){if(!SIX.includes(key)||!value||!value.anchor||!value.provenance)throw Error('INVALID_CHECKPOINT');safeCheckpoints[key]={anchor:value.anchor,provenance:value.provenance,gate:value.gate||'READBACK_PENDING'};}
 const payload={schema:'LYVRA_PARALLEL_R09_CHAT_HANDOFF',authority:'NONE_HANDOFF_EVIDENCE_ONLY',sourceHead:head,workspaceId,lineageId,facet,returnForeground:facet,conversationAnchor,strands:[...strands],checkpoints:safeCheckpoints,learningRef,sourceRefs:[...sourceRefs],writeStatus,handoffRef,requiresFreshWholeCurrent:true,noAutomaticWorkspaceGuess:true,hostReadback:writeStatus==='PERSISTED_VERIFIED'?'VERIFIED':'NOT_VERIFIED'};
 const continuation=['LYVRA NEXT CHAT — Whole-LYVRA-Current frisch rehydrieren.','Workspace: '+workspaceId,'Lineage: '+lineageId,'Aktiver Fachfokus: '+facet,'Fortsetzung: '+conversationAnchor,'Sechs Parallelstränge: '+strands.join(', '),'Handoff-Status: '+writeStatus+(handoffRef?' ('+handoffRef+')':''),'Nichts als produktiv gespeichert behandeln, solange kein unabhängiger Repo-Readback vorliegt. Zeige nach Wiederaufnahme sechs Einzelaktionen und „Alle sechs fortsetzen“; erhalte '+facet+' als Rückkehrziel.'];
 return {payload,copyText:continuation.join('\n')};
}
export function recoverHandoff({handoff,verifiedCurrentHead,authorizedLineage,independentReadback=false}={}){
 if(!handoff||handoff.schema!=='LYVRA_PARALLEL_R09_CHAT_HANDOFF'||!SHA.test(verifiedCurrentHead||''))throw Error('VALID_CURRENT_AND_HANDOFF_REQUIRED');
 if(handoff.lineageId!==authorizedLineage)throw Error('LINEAGE_MISMATCH');
 if(handoff.writeStatus==='PERSISTED_VERIFIED'&&!independentReadback)throw Error('HANDOFF_READBACK_REQUIRED');
 return {status:handoff.writeStatus==='PERSISTED_VERIFIED'?'REHYDRATION_CANDIDATE_VERIFIED_HANDOFF':'COPY_ONLY_PARTIAL',returnForeground:handoff.returnForeground,strands:[...handoff.strands],checkpointCount:Object.keys(handoff.checkpoints||{}).length,currentHead:verifiedCurrentHead,mustRevalidateIfHeadChanged:verifiedCurrentHead!==handoff.sourceHead,automaticExecution:false};
}
