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
export function evaluateTasks(tasks,bridges) {
  if(!Array.isArray(tasks) || tasks.length===0) throw new TypeError("Nonempty tasks required");
  const ids=tasks.map(t=>t.id);
  if(ids.some(x=>!x)||new Set(ids).size!==ids.length) throw new TypeError("Unique task ids required");
  return tasks.map(t=>({task_id:t.id,candidates:evaluateBridgeCapability(t,bridges),execution:"NOT_STARTED",caller_receipt:"PENDING"}));
}
export function classifyFeedback(receipt) {
  if(!receipt || !receipt.task_id || !receipt.capability_id) throw new TypeError("Receipt identity required");
  const evidence=receipt.independent_readback===true && receipt.outcome_observed===true && receipt.origin_ref;
  return {task_id:receipt.task_id,capability_id:receipt.capability_id,learning_state:evidence?"EVIDENCE_BACKED_LOCAL_CANDIDATE":"UNVERIFIED_OBSERVATION",
    outcome: evidence?receipt.outcome:"NOT_VERIFIED",auto_promote:false,may_change_permission:false};
}
