// LYVRA native candidate evaluation. No controller, scheduler, router, host invocation or writes.
export const EVIDENCE = Object.freeze(["SOURCE","DELIVERY","NATIVE_ADOPTION","HOST_EXECUTION","INDEPENDENT_OUTCOME"]);
const norm = x => String(x ?? "").trim().toLowerCase();
const uniq = xs => [...new Set(xs)];
export function evaluateBridgeCapability(task, bridges) {
  if (!task || !Array.isArray(task.required) || !Array.isArray(bridges)) throw new TypeError("Invalid task/capabilities");
  const required=uniq(task.required.map(norm).filter(Boolean));
  if(!required.length) throw new TypeError("Task must declare required capabilities");
  return bridges.map(b=>{
    const offered=Array.isArray(b.capabilities)?b.capabilities.map(norm):[];
    const coverage=required.filter(x=>offered.includes(x));
    const missing=required.filter(x=>!offered.includes(x));
    const reasons=[];
    if (missing.length) reasons.push("MISSING_CAPABILITY:"+missing.join(","));
    if (!b.owner || !b.source_ref) reasons.push("PROVENANCE_PENDING");
    if (b.authorization!=="AUTHORIZED") reasons.push("AUTHORIZATION_PENDING");
    if (b.host_status!=="HOST_VERIFIED") reasons.push("HOST_NOT_VERIFIED");
    if (b.cost_status!=="ZERO_ADDITIONAL_COST_VERIFIED") reasons.push("COST_NOT_VERIFIED");
    if (!b.recovery_ref) reasons.push("RECOVERY_PENDING");
    if (b.foreign_system && task.allow_foreign!==true) reasons.push("FOREIGN_AUTOACTIVATION_FORBIDDEN");
    const eligible=missing.length===0 && reasons.length===0;
    return {capability_id:b.capability_id,owner:b.owner||null,eligible,coverage,missing,reasons,
      evidence:{source:b.source_ref||null,host:b.host_status||"UNKNOWN",outcome:"NOT_EXECUTED"}};
  }).sort((a,b)=>Number(b.eligible)-Number(a.eligible)||b.coverage.length-a.coverage.length||String(a.capability_id).localeCompare(String(b.capability_id)));
}
export function evaluateBridgeComposition(task, bridges) {
  if (!task || !Array.isArray(task.required) || !task.required.length) throw new TypeError("Task requirements required");
  const required=uniq(task.required.map(norm).filter(Boolean));
  const assignments=required.map(capability=>{
    const candidates=evaluateBridgeCapability({...task,required:[capability]},bridges);
    const selected=candidates.find(x=>x.eligible);
    return {required_capability:capability,selected_capability_id:selected?.capability_id??null,
      blockers:selected?[]:uniq(candidates.flatMap(x=>x.reasons)),candidate_count:candidates.length};
  });
  return {eligible:assignments.every(a=>a.selected_capability_id!==null),
    assignments,execution:"NOT_STARTED",auto_dispatch:false,caller_result:"READBACK_PENDING"};
}
export function evaluateTasks(tasks,bridges) {
  if(!Array.isArray(tasks) || tasks.length===0) throw new TypeError("Nonempty tasks required");
  const ids=tasks.map(t=>t.id);
  if(ids.some(x=>!x)||new Set(ids).size!==ids.length) throw new TypeError("Unique task ids required");
  return tasks.map(t=>({task_id:t.id,candidates:evaluateBridgeCapability(t,bridges),composition:evaluateBridgeComposition(t,bridges),execution:"NOT_STARTED",caller_receipt:"PENDING"}));
}
export function classifyFeedback(receipt) {
  if(!receipt || !receipt.task_id || !receipt.capability_id) throw new TypeError("Receipt identity required");
  const evidence=receipt.independent_readback===true && receipt.outcome_observed===true && receipt.origin_ref;
  return {task_id:receipt.task_id,capability_id:receipt.capability_id,learning_state:evidence?"EVIDENCE_BACKED_LOCAL_CANDIDATE":"UNVERIFIED_OBSERVATION",
    outcome: evidence?receipt.outcome:"NOT_VERIFIED",auto_promote:false,may_change_permission:false};
}

export function discoverBridgeChanges(previous, current) {
  if(!Array.isArray(previous)||!Array.isArray(current))throw new TypeError("Bridge inventories required");
  const known=new Map(previous.filter(x=>x&&x.capability_id).map(x=>[x.capability_id,x]));
  const changes=[];
  for(const b of current){
    if(!b?.capability_id || !b.owner) throw new TypeError("Native identity and ownership required");
    const old=known.get(b.capability_id);
    const change=!old?"NEW":old.source_sha!==b.source_sha||JSON.stringify(old.capabilities||[])!==JSON.stringify(b.capabilities||[])?"CHANGED":"UNCHANGED";
    if(change==="UNCHANGED")continue;
    changes.push({capability_id:b.capability_id,owner:b.owner,change,
      source_state:b.source_verified===true&&Boolean(b.source_sha)&&Boolean(b.source_ref)?"SOURCE_VERIFIED":"SOURCE_READBACK_PENDING",
      native_adoption:"NOT_PROMOTED",host_execution:"NOT_VERIFIED",auto_activate:false,
      needs_native_review:true,previous_source_sha:old?.source_sha||null,source_sha:b.source_sha||null});
  }
  return {changes,detected:changes.length,auto_adoption:false,auto_discovery_execute:false};
}
export function learnBridgeOutcomes(receipts) {
  if(!Array.isArray(receipts))throw new TypeError("Evidence receipts required");
  const groups=new Map();
  for(const r of receipts){
    if(!r||!r.capability_id||!r.context_fingerprint)continue;
    const validated=r.independent_readback===true&&r.outcome_observed===true&&Boolean(r.origin_ref)&&
      (r.outcome==="PASS"||r.outcome==="FAIL");
    if(!validated)continue;
    const key=r.capability_id+"::"+r.context_fingerprint;
    const g=groups.get(key)||{capability_id:r.capability_id,context_fingerprint:r.context_fingerprint,pass:0,fail:0,source_refs:[]};
    if(r.outcome==="PASS")g.pass++;else g.fail++;
    if(!g.source_refs.includes(r.origin_ref))g.source_refs.push(r.origin_ref);
    groups.set(key,g);
  }
  return {cases:[...groups.values()].map(g=>({...g,relation_state:g.pass&&g.fail?"CONTRADICTORY_OUTCOMES":g.pass?"OBSERVED_SUCCESS":"OBSERVED_FAILURE",
    learning_state:"LOCAL_CAUSAL_CANDIDATE",independent_context_transfer:"NOT_VERIFIED",auto_promote:false})),
    ignored_without_independent_evidence:receipts.length-[...groups.values()].reduce((n,g)=>n+g.pass+g.fail,0),
    permissions_unchanged:true,automatic_rule_install:false};
}
