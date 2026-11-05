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
