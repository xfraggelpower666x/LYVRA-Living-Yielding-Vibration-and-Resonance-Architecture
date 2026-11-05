import {prepareSelectiveAnalyticsRequest} from './r42-analytics-caller-compat.mjs';
import {ingestSunoMonitorResult} from './r40-suno-source-bridge.mjs';
import {assessAnalyticsMigration} from './r40-analytics-parentage-guard.mjs';
import {executeR39OriginalBridge} from './r39-native-original-bridge.mjs';
// LYVRA existing Semantic Cyber Field: two read-only projections, no new engine.
// Source evidence is supplied by the verified CURRENT registry, not inferred by this module.
export const STATES = Object.freeze(["PROPOSED","DEV_ACTIVE","DEFERRED_WITH_REASON","ADOPTED","SUPERSEDED","ARCHIVED"]);
export function projectDualLayer(registry, opts = {}) {
  if (!registry || registry.schema !== "LYVRA_DUAL_LAYER_PROJECT_VIEW_V1" || !Array.isArray(registry.items)) throw new TypeError("unverified registry");
  const items = registry.items.map(item => ({...item, priority_inputs:{...item.priority_inputs}}));
  const ids = new Set();
  for (const item of items) {
    if (!item.id || ids.has(item.id) || !STATES.includes(item.state) || !item.evidence_path) throw new TypeError("invalid or duplicate item");
    ids.add(item.id);
  }
  const persistent = items.filter(item => opts.includeArchived || !["ARCHIVED","SUPERSEDED"].includes(item.state));
  const score = item => Number(Boolean(item.priority_inputs?.creator_selected)) * 4 + Number(Boolean(item.priority_inputs?.blocked)) * 2 + Number(Boolean(item.priority_inputs?.urgent));
  const dynamic = persistent.filter(item => item.state !== "ADOPTED").sort((a,b) => score(b)-score(a) || a.id.localeCompare(b.id)).map(item=>({...item, priority_basis:{creator_selected:!!item.priority_inputs?.creator_selected,blocked:!!item.priority_inputs?.blocked,urgent:!!item.priority_inputs?.urgent}}));
  return {authority:"WHOLE_LYVRA", dynamic, persistent, source_count:items.length, no_autoactivation:true, no_private_content:true};
}

// R33: Nur additive Datenprojektion in der EXISTIERENDEN Chat-Visual-Intelligence.
// Kein HTML, keine zusätzliche Engine, keine automatische Task-Ausführung.
export {projectNativeDeployment,reconcileDeploymentEvidence,SIX_STRANDS,PAUSED_AREAS,VISUAL_GUIDANCE_PHRASE,withNativeVisualGuidance,visualGuidanceRecoveryQuery} from "./native-deployment-visual.mjs";


// R37: Vorhandenen Whole-LYVRA-Operations-Center-Dual-Layer-View nach
// Whole-Rehydration um die bestehende Deployment-Datenprojektion erweitern.
// Keine neue Facette, Engine, Task-Mutation, Host-PASS oder Produktivfreigabe.
export function projectWholeRehydrationDeployment({
  registry, deploymentSource, receipts=[], expectedHead, expectedPointer,
  wholeCoverage="PARTIAL", selection="ALL", openWork=true
}={}) {
  if(typeof expectedHead!=="string"||!/^[0-9a-f]{40}$/.test(expectedHead)||
     typeof expectedPointer!=="string"||!/^[0-9a-f]{40}$/.test(expectedPointer)) {
    throw new TypeError("Frischer Whole-LYVRA-Current erforderlich");
  }
  if(deploymentSource?.source_anchor?.head!==expectedHead||
     deploymentSource?.source_anchor?.pointer_blob!==expectedPointer){
    throw new TypeError("Deployment-Daten veraltet; aktuellen Pointer nachlesen");
  }
  const dualLayer=projectDualLayer(registry);
  const deployment=reconcileDeploymentEvidence(deploymentSource,receipts,{selection});
  if(!["VERIFIED","PARTIAL","READBACK_PENDING"].includes(wholeCoverage)) {
    throw new TypeError("Unbekannte Whole-Rehydration-Abdeckung");
  }
  return {
    schema:"LYVRA_WHOLE_OPERATIONS_DEPLOYMENT_R37_V1",
    owner:"WHOLE_LYVRA",
    surface:"EXISTING_SEMANTIC_VISUAL_INTELLIGENCE",
    integration:"SOURCE_BOUND_DEV_BRANCH_ONLY",
    boot_order:"CURRENT_POINTER > WHOLE_CONTEXT > OPERATIONS_CENTER > VISUAL_PROJECTION > WORK_SCOPE_LAST",
    current:{head:expectedHead,pointer_blob:expectedPointer,coverage:wholeCoverage},
    five_existing_main_choices_preserved:true,
    dual_layer:dualLayer,
    deployment:openWork?deployment:null,
    deployment_reachable:true,
    checkpoint_count:6,
    additional_areas:[...PAUSED_AREAS],
    open_host_gates:18,
    return_anchor:"ANALYTICS",
    visual_guidance_action:visualGuidanceRecoveryQuery(),
    resume_all_action:withNativeVisualGuidance(deployment.all_action_query),
    live_host_verified:false,
    productive_write:false,
    foreign_activation:false,
    not_a_new_controller:true
  };
}

// R38: Original-R26-Fachfunktionen werden ausschliesslich ueber explizite Ports aufgerufen.
// Keine automatische Aktivierung beim Rendern oder bei Whole-Rehydration.
export {executeR38Ports,STRANDS as R38_SIX_FACET_STRANDS} from "./r38-six-facet-ports.mjs";

// R38: originale R26-Visual-Fuehrung direkt erreichbar, nicht nur nachgebaut.
export {withVisualGuidance as originalR26VisualGuidance,actionForStrand as originalR26ActionForStrand,actionAll as originalR26ActionAll} from "./r38_original_r26/visual-action-inheritance-r10.mjs";

// R39: direkte Verwendung der originalen R26-Handoff-/Impact-/Visual-Fachquellen.
// Kein automatischer Aufruf beim Anzeigen des Operations Centers.
export {executeR39OriginalBridge,verifyOriginalContinuity} from "./r39-native-original-bridge.mjs";


// R39: ausdruecklich gewollte Fachausfuehrung + vorhandene chatnative Visual-Projektion.
// Ein Rehydration-Read oder reiner Dashboard-Render darf diesen Aufruf NIE starten.
export async function executeR39ChatWork({
  creatorIntent=false, scope, registry, deploymentSource, receipts=[],
  expectedHead, expectedPointer, wholeCoverage="PARTIAL", inputs={},
  lineageId="R39_LOCAL", conversationAnchor="LYVRA PARALLEL R39 ALL WEITER",
  observations=[]
}={}){
 if(creatorIntent!==true || scope!=="SIX_NATIVE_FACETS")throw TypeError("EXPLICIT_CREATOR_TASK_REQUIRED");
 const visual=projectWholeRehydrationDeployment({
   registry,deploymentSource,receipts,expectedHead,expectedPointer,
   wholeCoverage,selection:"ALL",openWork:true
 });
 const execution=await executeR39OriginalBridge({
   head:expectedHead,pointerSha:expectedPointer,ports:{},
   inputs,lineageId,conversationAnchor,observations
 });
 if(execution.execution.results.length!==6||execution.hostGatesOpen!==18||
    execution.productiveWrites!==0||execution.pluginHostVerified!==false){
   throw Error("FACET_SCOPE_OR_HOST_BOUNDARY");
 }
 return {
   schema:"LYVRA_R39_CHAT_NATIVE_SIX_EXECUTION_VIEW",
   visual,execution,
   explicitTask:true,
   operativeHostActions:false,
   productiveWrites:0,
   hostGatesOpen:18,
   wholeRehydration:wholeCoverage,
   returnFacet:"LYVRA_ANALYTICS",
   automaticTaskScheduling:false
 };
}


// R40: Explicit six-strand R39 execution PLUS safe T07/T19 original-source gates.
// These are read-only classifications; deployment authority remains Whole LYVRA.
export async function executeR40ChatWork({
  sunoTaskSnapshot=null, reviewedSunoSources=[],
  analyticsNativeContract=null, analyticsNativeState=null, carrierBlobs={},
  r23Plan=null, creatorDecision='CREATOR_AUTHORIZED_NOT_DEPLOYED',
  trackDnaGuard=false, analyticsCallerRequest=null, ...r39Inputs
}={}){
  const r39=await executeR39ChatWork(r39Inputs);
  const head=r39Inputs.expectedHead, pointerBlob=r39Inputs.expectedPointer;
  const suno=sunoTaskSnapshot?
    ingestSunoMonitorResult({...sunoTaskSnapshot,currentHead:head,sourceRevision:head,reviewedSources:reviewedSunoSources}):
    {status:'MONITOR_RUN_RESULT_NOT_SUPPLIED',accepted:false,sourceReadback:false};
  const analytics=analyticsNativeContract&&analyticsNativeState?
    assessAnalyticsMigration({currentHead:head,pointerBlob,contractText:analyticsNativeContract,state:analyticsNativeState,sourceBlobs:carrierBlobs,r23Plan,creatorDecision,trackDnaGuard}):
    {status:'ANALYTICS_NATIVE_CURRENT_READBACK_REQUIRED',candidateReadyForGovernedWriteReview:false,productiveMigrationApplied:false};
  const selectiveCaller=analyticsCallerRequest?
    prepareSelectiveAnalyticsRequest(analyticsCallerRequest):null;
  return {
    schema:'LYVRA_R40_SIX_NATIVE_WITH_SUNO_PARENTAGE_GATES',
    ...r39, t07_suno:suno,t19_analytics:analytics,
    analytics_selective_caller:selectiveCaller,
    sourceIntegrationReady:true,
    originalRunProviderReadback:suno.sourceReadback===true,
    analyticsParentageMigrated:false,
    hostGatesOpen:18,productiveWrites:0,
    pluginHostVerified:false,returnFacet:'LYVRA_ANALYTICS',
    visualGuidanceAction:r39.visual.visual_guidance_action,
    requiresExplicitCreatorTask:true
  };
}
