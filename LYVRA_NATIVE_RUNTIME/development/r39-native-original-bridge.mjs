// LYVRA R39: Two ORIGINAL R26 imports bound directly to existing R38 six-facet path.
// All external host actions still require separately verified permissions and receipts.
import {executeR38Ports} from './r38-six-facet-ports.mjs';
import {buildHandoff,recoverHandoff,assessContext} from './r38_original_r26/chat-handoff-r09.mjs';
import {planImpactForAnyTask,SIX} from './r38_original_r26/always-on-impact-r09.mjs';
import {withVisualGuidance} from './r38_original_r26/visual-action-inheritance-r10.mjs';
import {correct,defaultState} from './r38_original_r26/dictation.mjs';
import {ingestAnalyticsEvidence,learningProbe,researchCostGate} from './r39-r26-functional-extracts.mjs';


const R39_PROTECTED=/(?:\x60\x60\x60[\s\S]*?\x60\x60\x60|\x60[^\x60\n]*\x60|https?:\/\/[^\s<>"']+|\[[^\]\n]{1,200}\]\([^\)\n]+\)|"[^"\n]*"|“[^”\n]*”|\[[A-Z_][A-Z0-9_]*\])/g;
// Uses exact R26 original correct/defaultState. No OS interception.
export function nativeGuardedDictation(text,state=defaultState(),{trustedSpeech=false}={}){
 if(typeof text!=='string')throw TypeError('INVALID_SPEECH');
 if(!trustedSpeech)return {text,applied:[],status:'NO_AUTHENTICATED_SPEECH_SOURCE'};
 const spans=[];
 const masked=text.replace(R39_PROTECTED,part=>{
   const key=String.fromCharCode(0xE000)+spans.length+String.fromCharCode(0xE001);
   spans.push(part);return key;
 });
 const st=structuredClone(state);
 st.rules=(st.rules||[]).filter(x=>x.id==='LYVRA_NAME_001').map(x=>({...x,observed:['Lübber']}));
 const result=correct(masked,st);
 return {text:result.text.replace(/\uE000(\d+)\uE001/g,(_,n)=>spans[Number(n)]||''),
   applied:result.applied,withheld:result.withheld,protectedCount:spans.length,
   status:'CONTEXTUAL_CANDIDATE_NO_OS_INTERCEPTION'};
}

export {buildHandoff,recoverHandoff,assessContext,planImpactForAnyTask};
export function verifyOriginalContinuity({head,lineageId,conversationAnchor,checkpoints={}}={}) {
  const handoff=buildHandoff({
    head,workspaceId:'WHOLE_LYVRA_NATIVE_RUNTIME',
    facet:'LYVRA_ANALYTICS',lineageId,conversationAnchor,
    strands:[...SIX],checkpoints,writeStatus:'NOT_ATTEMPTED',
  });
  const receipt=recoverHandoff({handoff:handoff.payload,verifiedCurrentHead:head,authorizedLineage:lineageId});
  return {handoff,receipt,productiveWrites:0,independentHostReadback:false};
}
export async function executeR39OriginalBridge({head,pointerSha,ports,inputs={},lineageId='R39_LOCAL',conversationAnchor='R39 original native scope',observations=[]}={}) {
  const originalImpact=planImpactForAnyTask({
    task:'LYVRA R39 six original-facet integration',origin:'LYVRA_ANALYTICS',
    strands:[...SIX],observations,authorized:false,
  });
  // Only three original R26 providers live natively; four others stay explicitly injected.
  // The R26 visualAction shape is preserved, not reinterpreted as host execution.
  const provided={
    ...ports,
    guardedDictation:nativeGuardedDictation,
    ingestAnalyticsEvidence,
    learningProbe,
    researchCostGate,
    buildHandoff,
    visualAction({label,command,owner='LYVRA',kind='CONTINUATION'}={}){
      if(!label?.trim()||!command?.trim()||owner!=='LYVRA'||!['CONTINUATION','FACET','RECOVERY'].includes(kind))throw Error('ACTION_CONTRACT');
      return {label,kind,owner,command:withVisualGuidance(command),presentation:'EXISTING_NATIVE_VISUAL_INTELLIGENCE',isHostInstalled:false};
    },
  };
  const execution=await executeR38Ports({head,pointerSha,ports:provided,inputs:{
    ...inputs,continuity:{...inputs.continuity,lineageId,conversationAnchor}
  }});
  return {schema:'LYVRA_R39_NATIVE_ORIGINAL_BINDING',originalImpact,execution,
    sources:['R26/always-on-impact-r09.mjs','R26/chat-handoff-r09.mjs','R26/visual-action-inheritance-r10.mjs'],
    originalProviderCoverage:'FOUR_ORIGINAL_MODULES_PLUS_THREE_FUNCTIONAL_EXTRACTS',
    missingNativeOriginalProviders:[],
    originalWholeModuleFilesPending:['r13-native-bridges.mjs','causal-learning-r08.mjs','research-reconcile-r04.mjs'],
    parityStatus:'PENDING_EXACT_ORIGINAL_BEHAVIOR_COMPARISON',
    allSixFunctionalPortsInSource:true,
    hostGatesOpen:18,productiveWrites:0,pluginHostVerified:false,returnFacet:'LYVRA_ANALYTICS',
    supplemental:['POST','SCEERI_MYCEL','PLUGIN_HOST_ACCEPTANCE'],
    visualGuidance:'CHAT_NATIVE'};
}
