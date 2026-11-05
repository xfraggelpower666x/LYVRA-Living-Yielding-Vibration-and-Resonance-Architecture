// LYVRA R38: native read-only ports for the ORIGINAL R26 facet functions.
// Implementations remain original R26; this only binds them to Whole's R37 visual projection.
// No host interception, no foreign activation, no file writes, no automatic learning promotion.
export const STRANDS=Object.freeze(['DICTATION','ANALYTICS','CHARACTER_RELATIONS','VISUAL','INTERRUPTION_CONTINUITY','RESEARCH']);
const SHA=/^[a-f0-9]{40}$/;
const required={
 DICTATION:'guardedDictation',ANALYTICS:'ingestAnalyticsEvidence',
 CHARACTER_RELATIONS:'learningProbe',VISUAL:'visualAction',
 INTERRUPTION_CONTINUITY:'buildHandoff',RESEARCH:'researchCostGate'
};
function validate(ports){
 for(const [id,fn] of Object.entries(required))if(typeof ports?.[fn]!=='function')throw new TypeError('ORIGINAL_R26_PORT_MISSING:'+id+':'+fn);
}
export async function executeR38Ports({head,pointerSha,ports,inputs={},returnFacet='LYVRA_ANALYTICS'}={}) {
 if(!SHA.test(head||'')||!SHA.test(pointerSha||''))throw new TypeError('FRESH_WHOLE_AUTHORITY_REQUIRED');
 if(returnFacet!=='LYVRA_ANALYTICS')throw new TypeError('ANALYTICS_RETURN_REQUIRED');
 validate(ports);
 const run={
  DICTATION:()=>ports.guardedDictation(inputs.dictation?.text??'',inputs.dictation?.state,{trustedSpeech:inputs.dictation?.trustedSpeech===true}),
  ANALYTICS:()=>inputs.analytics?.sourceId?ports.ingestAnalyticsEvidence(inputs.analytics):{status:'REAL_MONITOR_SOURCE_NOT_PROVIDED',ingested:false},
  CHARACTER_RELATIONS:()=>inputs.learning?.problemKey?ports.learningProbe(inputs.learning):{status:'LEARNING_CASE_NOT_PROVIDED',automaticExecute:false},
  VISUAL:()=>ports.visualAction({label:'Sechs Stränge weiterbauen',command:inputs.visual?.command||'LYVRA PARALLEL WEITER — Alle sechs Stränge und aktuelle Rückkehrpunkte erhalten. Visuelle Führung.',owner:'LYVRA'}),
  INTERRUPTION_CONTINUITY:()=>ports.buildHandoff({head,workspaceId:'WHOLE_LYVRA_NATIVE_RUNTIME',lineageId:inputs.continuity?.lineageId||'R38_ISOLATED',conversationAnchor:inputs.continuity?.conversationAnchor||'R38 six-strand source integration; fresh Whole boot required',strands:STRANDS,checkpoints:inputs.continuity?.checkpoints||{},writeStatus:'NOT_ATTEMPTED'}),
  RESEARCH:()=>ports.researchCostGate({tool:inputs.research?.tool||'TinyFish',operation:inputs.research?.operation||'Fetch',priceUSD:inputs.research?.priceUSD,costChecked:inputs.research?.costChecked===true})
 };
 const settlements=await Promise.allSettled(STRANDS.map(async id=>({id,result:await run[id]()})));
 const results=settlements.map((s,i)=>s.status==='fulfilled'?{id:STRANDS[i],status:'ORIGINAL_R26_FUNCTION_EXECUTED',value:s.value.result,hostVerified:false}:{id:STRANDS[i],status:'INPUT_ORIGINAL_FUNCTION_BLOCKED',reason:String(s.reason),hostVerified:false});
 return {schema:'LYVRA_R38_ORIGINAL_SIX_NATIVE_PORTS',head,pointerSha,returnFacet,results,allSixInvoked:results.length===6,
  hostGatesOpen:18,productiveWrites:0,pluginHostVerified:false,crossChatPersisted:false,
  supplemental:['POST','SCEERI_MYCEL','PLUGIN_HOST_ACCEPTANCE'],
  execution:'LOCAL_ORIGINAL_R26_FUNCTIONS_DEPENDENCY_INJECTED',
  visualGuidance:'CHAT_NATIVE_EXISTING_SEMANTIC_VISUAL',fullWholeRehydrated:false};
}
