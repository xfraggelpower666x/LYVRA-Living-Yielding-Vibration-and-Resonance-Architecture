// Whole LYVRA: bounded caller-to-parallel integration, no scheduler or authority transfer.
import {evaluateTasks} from "./bridge-capability-evaluation.mjs";
import {assessParallelWork,assessImpact,reviewDictation,projectParallelMonitor} from "./parallel-work-intelligence.mjs";
const asList=x=>Array.isArray(x)?x:[];
const nonempty=x=>typeof x==="string"&&x.trim().length>0;
const readback=e=>Boolean(e?.direct_readback===true&&nonempty(e.source_ref)&&nonempty(e.head));
const ANALYTICS_STATES=new Set(["PREPARED","PUBLISHED_INTERNAL","UNDER_REVIEW","ACCEPTED","ADAPTED","PARTIAL","ROUTED","HELD","REJECTED","INTEGRATED"]);
export function nativeParallelIntake({tasks,observations=[],bridges=[],dictation=null,source_head,options={}}) {
  if(!nonempty(source_head))throw new TypeError("fresh source head required");
  if(!Array.isArray(tasks))throw new TypeError("tasks must be current-source entries");
  const verified=tasks.filter(t=>readback(t?.current_evidence)&&t.current_evidence.head===source_head);
  const deferred=tasks.filter(t=>!verified.includes(t)).map(t=>({id:t?.id??null,reason:"CURRENT_SOURCE_READBACK_PENDING"}));
  // Reject stale host observations; source state and peer provenance must be independently read.
  const validObs=asList(observations).filter(o=>readback(o)&&o.head===source_head);
  const work=assessParallelWork(verified,validObs,options);
  const capabilities=asList(bridges).map(b=>({...b,authorization:b.authorization==="AUTHORIZED"&&b.authorization_head===source_head?"AUTHORIZED":"NOT_VERIFIED",
    host_status:b.host_status==="HOST_VERIFIED"&&b.host_evidence?.head===source_head&&readback(b.host_evidence)?"HOST_VERIFIED":"HOST_PENDING"}));
  const proposals=work.recommended.filter(x=>Array.isArray(verified.find(t=>t.id===x.id)?.required)&&verified.find(t=>t.id===x.id).required.length)
    .map(x=>evaluateTasks([verified.find(t=>t.id===x.id)],capabilities)[0]);
  const impact=verified.map(t=>assessImpact(t,validObs.filter(e=>e.kind==="CAUSAL_DEPENDENCY")));
  const reviewedDictation=dictation?reviewDictation(dictation):null;
  const menu=projectParallelMonitor(work,{source_head});
  return {schema:"LYVRA_PARALLEL_INTAKE_R13",authority:"LYVRA_ONLY",source_head,work,capability_proposals:proposals,impact,
    dictation:reviewedDictation,dictation_execution_blocked:Boolean(reviewedDictation?.needs_creator_review),
    deferred,unverified_observations:asList(observations).length-validObs.length,
    menu,execution:"NOT_EXECUTED",writes:"NONE",autoactivate:false};
}
export function nativeAnalyticsReturn(result, caller) {
  if(!result||!nonempty(result.RESULT_ID)||!nonempty(result.SOURCE_FACET)||!nonempty(result.REQUEST_ORIGIN)||!nonempty(result.TARGET))
    throw new TypeError("Analytics result identity/parentage required");
  if(!ANALYTICS_STATES.has(result.STATUS))throw new TypeError("Invalid native Analytics status");
  if(!caller||!nonempty(caller.caller_id)||!nonempty(caller.request_id))throw new TypeError("Caller return anchor required");
  const lineageMatch=result.REQUEST_ORIGIN===caller.caller_id && result.TARGET===caller.target;
  const delivered=lineageMatch&&result.STATUS==="INTEGRATED"&&readback(result.native_receiver_evidence)
    &&readback(result.independent_outcome_evidence);
  return {result_id:result.RESULT_ID,caller_id:caller.caller_id,request_id:caller.request_id,
    lineage_match:lineageMatch,result_status:result.STATUS,caller_state:delivered?"INDEPENDENT_OUTCOME_VERIFIED":"RETURN_PENDING",
    provenance:result.RELATED_EVIDENCE||null,causal_finding:result.CAUSAL_FINDING||null,
    permission_to_write:false,auto_promote:false};
}
export function nativeImpactGate(intake) {
  if(!intake||intake.schema!=="LYVRA_PARALLEL_INTAKE_R13")throw new TypeError("Verified intake required");
  return {open_targets:[...new Set(intake.impact.flatMap(x=>x.affected))].sort(),
    blockers:intake.deferred.map(x=>x.id).concat(intake.work.reviewed.filter(x=>!x.action_allowed).map(x=>x.id)),
    release_ready:false,needs_original_tests:true,needs_native_lifecycle:true,needs_host_readback:true,
    no_foreign_autowrites:true};
}

// Adapt original native Analytics OPEN_WORK without inventing completed experiments.
// A supplied source receipt must bind this exact current read; source is not a live host.
export function ingestNativeAnalyticsOpenWork(native,source) {
  if(!native||!Array.isArray(native.items)||!readback(source))throw new TypeError("Native Analytics source and original receipt required");
  return native.items.map(item=>{
    if(!nonempty(item.id)||!nonempty(item.state)||!nonempty(item.task))throw new TypeError("Invalid native Analytics item");
    const state=item.state==="ACTIVE_CURRENT_RESEARCH_AND_RENDER_LEARNING"?"ACTIVE":
      item.state==="OPEN_EVENT_GATED"?"OPEN":"DORMANT";
    return {id:item.id,title:item.task,strand:"ANALYTICS",state,origin_ref:source.source_ref,
      current_evidence:{...source},resource_key:"ANALYTICS:"+item.id,required:["semantic_handoff"],
      related_facets:["ANALYTICS"],impact_targets:[],native_state:item.state,
      creator_selected:false,blocks_other_tasks:false,outcome_readback:false};
  });
}
