// LYVRA Parallel Development · evidence-first work/visual projection.
// No autonomous scheduler, no write, no router, no activation, no foreign ownership.
const STATES = new Set(["OPEN","ACTIVE","PAUSED","DORMANT","BLOCKED","DONE","PROPOSED"]);
const asArray=x=>Array.isArray(x)?x:[];
const unique=x=>[...new Set(x)];
const str=x=>String(x??"").trim();
const evidenceOK=e=>Boolean(e&&e.direct_readback===true&&str(e.source_ref)&&str(e.head));
const NATIVE_DONE_GATES=Object.freeze(["native_adoption_evidence","lifecycle_rehydration_evidence","host_execution_evidence","independent_outcome_evidence"]);
function nativeDoneGaps(item){
  const expected=item?.current_evidence?.head;
  if(!evidenceOK(item?.current_evidence)||item.current_evidence.head!==expected||!item.outcome_readback)return ["CURRENT_SOURCE_OR_RESULT_READBACK"];
  const gaps=NATIVE_DONE_GATES.filter(key=>!evidenceOK(item[key])||item[key].head!==expected);
  if(!gaps.includes("host_execution_evidence")&&item.host_execution_evidence.execution_observed!==true)gaps.push("HOST_EXECUTION_NOT_OBSERVED");
  if(!gaps.includes("independent_outcome_evidence")&&(item.independent_outcome_evidence.outcome_observed!==true||item.independent_outcome_evidence.independent!==true))gaps.push("INDEPENDENT_OUTCOME_NOT_OBSERVED");
  return gaps;
}

export const GLOSSARY=Object.freeze({
  BRIDGE:"Technische oder semantische Verbindung für eine bestimmte Aufgabe",
  CODEFORGE:"LYVRAs eigene Code- und Reparaturfähigkeit",
  SUPERCODEFORGE:"Prüft erlaubte technische Schnittstellen, keine automatische Ausführung",
  SCEERI:"Versteht Beziehungen, Ursachen, Widersprüche und Alternativen",
  HOST:"Tatsächliche Ausführungsumgebung eines Werkzeugs",
  READBACK:"Unabhängige Rückprüfung eines Ergebnisses",
  CURRENT:"Aktueller bestätigter Systemstand",
  CONFLICT:"Zwei Änderungen würden dieselbe Ressource gleichzeitig betreffen",
  DEPENDENCY:"Ein anderer Schritt muss vorher erledigt werden",
  DORMANT:"Bekannte Arbeit, für die aktuell keine echte Ausführung belegt ist",
  EVIDENCE:"Nachprüfbarer Herkunfts- oder Ergebnisbeleg"
});
export function reviewDictation(input) {
  if(!input||typeof input.original!=="string") throw new TypeError("original dictation required");
  const alternatives=asArray(input.alternatives).filter(x=>typeof x==="string"&&x!==input.original);
  const ambiguous=Boolean(input.uncertain)||alternatives.length>0;
  return {original_unchanged:input.original,alternatives,needs_creator_review:ambiguous && input.confirmed!==true,
    interpreted:input.confirmed===true && typeof input.confirmed_text==="string"?input.confirmed_text:input.original,
    auto_corrected:false,source_ref:input.source_ref||null};
}
export function assessDictatedNativeAddress(input) {
  if(!input||typeof input.original!=="string")throw new TypeError("Original dictation required");
  // Historical PC-source insight only. Current native authority retains execution control.
  const direct=input.direct_address===true && input.explicit_project_context===true;
  const prefix=input.original.match(/^\s*(LYVRA|Lyv)(?=\s|[,:;.!?]|$)/i);
  const recognized=direct&&Boolean(prefix);
  const alreadyCanonical=recognized&&prefix[1].toUpperCase()==="LYVRA";
  const suggested=direct&&(recognized || (Array.isArray(input.alternatives)&&input.alternatives.some(x=>typeof x==="string"&&x.trim().toUpperCase()==="LYVRA")));
  const needsReview=suggested&&!alreadyCanonical&&!(input.confirmed===true&&typeof input.confirmed_text==="string");
  const interpreted=input.confirmed===true&&suggested&&typeof input.confirmed_text==="string"?input.confirmed_text:input.original;
  return {original_unchanged:input.original,interpreted,normalized_candidate:suggested?"LYVRA":null,
    needs_creator_review:needsReview,ordinary_words_preserved:!direct,command_authorized:false,
    execute:false,auto_corrected:false,legacy_source_role:"HISTORICAL_PC_PROVENANCE_NOT_CURRENT_AUTHORITY"};
}
export function assessParallelWork(items,observations=[],options={}) {
  if(!Array.isArray(items)) throw new TypeError("tasks array required");
  const ids=new Set();
  for(const item of items){
    if(!item||!str(item.id)||ids.has(item.id)||!STATES.has(item.state)||!str(item.origin_ref)) throw new TypeError("invalid task, state or origin");
    ids.add(item.id);
  }
  const obs=asArray(observations);
  const perResource=key=>obs.filter(e=>e.resource_key===key && e.kind==="ACTIVE_WRITE" && evidenceOK(e));
  const occupied=new Set(items.filter(x=>x.state==="DONE"&&nativeDoneGaps(x).length===0).map(x=>x.id));
  // Verified active tasks reserve their specific resource; claims alone do not.
  const realHostWork=e=>e?.kind==="WORK_CURRENT"&&evidenceOK(e)&&e.execution_observed===true&&e.independent_host_readback===true&&str(e.host_receipt_ref);
  const hasOwnCurrent=item=>obs.some(e=>e.task_id===item.id&&realHostWork(e));
  const resources=new Map();
  for (const item of items.filter(x=>x.state==="ACTIVE"&&hasOwnCurrent(x)).concat(items.filter(x=>x.state==="OPEN"))) {
    if(!str(item.resource_key))continue;
    resources.set(item.resource_key,[...(resources.get(item.resource_key)||[]),item.id]);
  }
  const reviewed=items.map(item=>{
    const openDeps=asArray(item.depends_on).filter(id=>!occupied.has(id));
    const live=perResource(item.resource_key).filter(e=>e.actor_id!==item.actor_id);
    const matching=resources.get(item.resource_key)||[];
    const localCollision=matching.length>1&&matching[0]!==item.id;
    const own=obs.find(e=>e.task_id===item.id&&realHostWork(e));
    const sourceOnly=obs.some(e=>e.task_id===item.id&&e.kind==="WORK_CURRENT"&&evidenceOK(e)&&!realHostWork(e));
    const state=live.length?"PAUSED_CONCURRENT":localCollision?"WAIT_SAME_RESOURCE":openDeps.length?"DEPENDENCY_BLOCKED":
      item.state==="DORMANT"&&!own?"DORMANT_UNCONFIRMED":
      item.state==="DONE"&&nativeDoneGaps(item).length?"RESULT_READBACK_PENDING":
      item.state==="ACTIVE"&&!own?"ACTIVE_UNVERIFIED":
      item.state==="ACTIVE"&&own?"ACTIVE_VERIFIED":
      item.state==="DONE"?"DONE_VERIFIED":item.state;
    const score=(item.creator_selected?16:0)+(item.blocks_other_tasks?8:0)+(item.risk_reduction?4:0)+(item.impact_verified?2:0);
    const bridges=asArray(item.bridge_assignments).map(b=>({capability_id:b.capability_id,role:b.role,evidence:b.evidence||"NOT_VERIFIED",host:b.host||"HOST_PENDING"}));
    return {id:item.id,title:item.title||item.id,strand:item.strand||"UNCLASSIFIED",state,score,origin_ref:item.origin_ref,
      resource_key:item.resource_key||null,bridges,codeforge_role:item.codeforge_role||"NOT_ASSIGNED",
      dependent_ids:openDeps,missing_native_done_gates:item.state==="DONE"?nativeDoneGaps(item):[],concurrent_evidence:live.map(e=>({actor:e.actor_id,source:e.source_ref,head:e.head})),
      action_allowed:!["PAUSED_CONCURRENT","WAIT_SAME_RESOURCE","DEPENDENCY_BLOCKED","DORMANT_UNCONFIRMED","RESULT_READBACK_PENDING","ACTIVE_UNVERIFIED","ACTIVE_VERIFIED","BLOCKED","PAUSED","PROPOSED"].includes(state)&&item.state!=="DONE",
      related_facets:asArray(item.related_facets),impact_targets:asArray(item.impact_targets),
      evidence_state:own?"HOST_WORK_VERIFIED":sourceOnly?"SOURCE_ONLY_NOT_HOST":"CURRENT_WORK_NOT_VERIFIED"};
  });
  const ranked=reviewed.filter(x=>x.action_allowed).sort((a,b)=>b.score-a.score||a.id.localeCompare(b.id));
  const count=options.all===true?ranked.length:Math.max(6,Math.min(10,Number.isInteger(options.limit)?options.limit:8));
  const proposed=ranked.slice(0,count);
  return {authority:"WHOLE_LYVRA_ONLY",mode:items.length===1?"SINGLE":"MULTI",source_count:items.length,
    eligible_count:ranked.length,recommended:proposed,reviewed,
    unselected:ranked.filter(x=>!proposed.some(y=>x.id===y.id)).map(x=>x.id),
    execute:false,autoactivate:false,missing_native_host_proof:true};
}
export function assessImpact(task,dependencies=[]) {
  if(!task||!str(task.id)) throw new TypeError("task id required");
  const affected=new Set(asArray(task.impact_targets).filter(Boolean));
  for(const d of asArray(dependencies)){
    if(d&&evidenceOK(d)&&d.cause_id===task.id && d.effect_target) affected.add(d.effect_target);
  }
  return {task_id:task.id,affected:[...affected].sort(),unverified_links:asArray(dependencies).filter(d=>d?.cause_id===task.id&&!evidenceOK(d)).length,
    suggested_actions_only:true,automatic_mutation:false};
}
export function antiLoopReview(checks,execution) {
  const sequence=asArray(checks);
  const last=sequence.at(-1);
  let repeated=0;
  if(last?.result==="NO_NEW_EVIDENCE" && str(last.fingerprint)) for(let i=sequence.length-1;i>=0;i--){
    const item=sequence[i];
    if(item?.result!=="NO_NEW_EVIDENCE"||item.fingerprint!==last.fingerprint)break;
    repeated++;
  }
  if(repeated<3) return {mode:"CHECK_IF_MEANINGFUL",repeated,execution_authorized:false};
  const permitted=execution?.explicit_authorization===true&&execution?.host_verified===true&&execution?.recovery_verified===true;
  return {mode:permitted?"LEARNING_BY_DOING_AUTHORIZED":"PAUSE_REPEATED_CHECKS_HOST_GATE",repeated,
    execution_authorized:permitted,auto_bypass:false};
}
export function projectParallelMonitor(assessment,opts={}) {
  if(!assessment||!Array.isArray(assessment.reviewed)) throw new TypeError("assessment required");
  const glossary=Object.fromEntries(Object.entries(GLOSSARY));
  return {schema:"LYVRA_PARALLEL_VISUAL_PROJECTION_V1",identity:"ONE_WHOLE_LYVRA",
    scope:"FIFTH_MAIN_OPTION_SUBMENU_ONLY",verified_source_head:opts.source_head||null,
    strands:unique(assessment.reviewed.map(x=>x.strand)).map(id=>({id,count:assessment.reviewed.filter(x=>x.strand===id).length,
      active_verified:assessment.reviewed.filter(x=>x.strand===id&&x.state==="ACTIVE_VERIFIED"&&x.evidence_state==="HOST_WORK_VERIFIED").length})),
    tasks:assessment.reviewed.map(x=>({id:x.id,title:x.title,status:x.state,bridge_details:x.bridges,
      codeforge:x.codeforge_role,relations:x.related_facets,impact:x.impact_targets,blockers:x.dependent_ids,
      explanation:x.concurrent_evidence.length?"Belegter gleichzeitiger Schreibvorgang":x.state==="WAIT_SAME_RESOURCE"?"Eigene Aufträge benötigen dieselbe Datei: nacheinander bearbeiten":x.state==="DORMANT_UNCONFIRMED"?"Ruhende Aufgabe: erst Quelle prüfen":x.state==="ACTIVE_UNVERIFIED"?"Aktive Arbeit nicht unabhängig belegt":x.state==="ACTIVE_VERIFIED"?"Aktive Arbeit belegt: beobachten, nicht erneut starten":"Status aus bereitgestellter Evidenz"})),
    actions:[{id:"recommended",label:"Empfohlene 6–10 geeignete Aufträge prüfen",meaning:"Anzeigen, nicht automatisch starten"},
      {id:"all",label:"Alle geeigneten Stränge prüfen",meaning:"Breite Auswahl, jeder Write bleibt geschützt"},
      {id:"return_analytics",label:"Zu Analytics zurückkehren",meaning:"Bestehenden Rückkehranker verwenden"}],
    glossary,no_fake_percent:true,no_auto_deploy:true,no_auto_selection:true};
}
