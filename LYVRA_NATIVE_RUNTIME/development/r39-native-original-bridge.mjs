// LYVRA R39: Two ORIGINAL R26 imports bound directly to existing R38 six-facet path.
// All external host actions still require separately verified permissions and receipts.
import {executeR38Ports} from './r38-six-facet-ports.mjs';
import {buildHandoff,recoverHandoff,assessContext} from './r38_original_r26/chat-handoff-r09.mjs';
import {planImpactForAnyTask,SIX} from './r38_original_r26/always-on-impact-r09.mjs';
import {withVisualGuidance} from './r38_original_r26/visual-action-inheritance-r10.mjs';

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
    originalProviderCoverage:'CONTINUITY_AND_VISUAL_PLUS_IMPACT',
    missingNativeOriginalProviders:['DICTATION','ANALYTICS','CHARACTER_RELATIONS','RESEARCH'],
    hostGatesOpen:18,productiveWrites:0,pluginHostVerified:false,returnFacet:'LYVRA_ANALYTICS',
    supplemental:['POST','SCEERI_MYCEL','PLUGIN_HOST_ACCEPTANCE'],
    visualGuidance:'CHAT_NATIVE'};
}
