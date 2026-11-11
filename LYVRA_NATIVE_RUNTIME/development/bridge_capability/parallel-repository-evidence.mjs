// Whole LYVRA R15: Read-only original repository source intake, run in CI checkout.
// Provider source is verified against Git objects, not assumed from a mock fixture.
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {ingestNativeAnalyticsOpenWork,nativeParallelIntake,assessAnalyticsQueueReturns,nativeImpactGate} from "./parallel-native-integration.mjs";
const nativeRoot="LYVRA_NATIVE_RUNTIME/facets/analytics/";
const SOURCES=Object.freeze({open:nativeRoot+"current/OPEN_WORK.json",results:nativeRoot+"development/RESULT_QUEUE.json",experiments:nativeRoot+"current/EXPERIMENT_REGISTER.json",renderer:nativeRoot+"current/RENDERER_EVIDENCE_REGISTER.json"});
function git(args){const p=spawnSync("git",args,{encoding:"utf8",maxBuffer:4*1024*1024});if(p.status!==0||p.error)throw new Error("Git readback failed: "+args[0]);return p.stdout.trimEnd()}
export function readGitOriginal(path,head,provider={git,readFileSync}) {
  if(!Object.values(SOURCES).includes(path))throw new TypeError("Not allowlisted native source");
  if(!/^[0-9a-f]{40}$/.test(head))throw new TypeError("Exact full Git commit expected");
  const current=provider.git(["rev-parse","HEAD"]);
  if(current!==head)throw new Error("Checkout HEAD mismatch");
  const gitBytes=provider.git(["show","HEAD:"+path]);
  const fileBytes=provider.readFileSync(path,"utf8").trimEnd();
  if(gitBytes!==fileBytes)throw new Error("Working tree differs from Git object");
  const blob=provider.git(["rev-parse","HEAD:"+path]);
  if(!/^[0-9a-f]{40}$/.test(blob))throw new Error("Git blob identity missing");
  return {data:JSON.parse(fileBytes),receipt:{direct_readback:true,source_ref:"git:"+path+"@"+blob,head,blob},blob};
}
// Directly compare original open work, experiments and renderer-evidence requirements.
// This is a read-only diagnostic view, never an Analytics outcome/host action.
export function inspectAnalyticsReadiness(head,provider){
  const open=readGitOriginal(SOURCES.open,head,provider);
  const results=readGitOriginal(SOURCES.results,head,provider);
  const experiments=readGitOriginal(SOURCES.experiments,head,provider);
  const renderer=readGitOriginal(SOURCES.renderer,head,provider);
  if(!Array.isArray(open.data.items)||!Array.isArray(results.data.items)
    ||!Array.isArray(experiments.data.active)||!Array.isArray(renderer.data.required_fields))
    throw new TypeError("Original Analytics evidence structures required");
  if(results.data.source_facet!=="LYVRA_ANALYTICS")
    throw new TypeError("Original Analytics source identity required");
  const active=experiments.data.active;
  const items=open.data.items.map(item=>{
    const candidates=active.filter(exp=>exp.id===item.task);
    const isRender=item.state==="PRE_RENDER_EVIDENCE_CALIBRATED_REAL_RENDER_OPEN";
    const gated=item.state==="OPEN_EVENT_GATED";
    const activeClaim=item.state==="ACTIVE_CURRENT_RESEARCH_AND_RENDER_LEARNING";
    return {id:item.id,task:item.task,native_state:item.state,
      linked_experiment_count:candidates.length,
      linked_experiment_status:candidates.length===1?candidates[0].status:null,
      readiness:isRender?"REAL_RENDER_PENDING":gated?"EVENT_GATED":activeClaim?"RESEARCH_ACTIVITY_HOST_UNVERIFIED":"ORIGINAL_STATE_UNCLASSIFIED",
      next_evidence:isRender?["ACTUAL_RENDER","USER_VERDICT","MODEL_CONTEXT"]:gated?["EVENT_AND_REAL_TEST"]:
        activeClaim?["INDEPENDENT_HOST_WORK_RECEIPT"]:["CURRENT_SOURCE_REVIEW"],
      output_observed:false,caller_delivered:false,autoactivate:false};
  });
  return {schema:"LYVRA_NATIVE_ANALYTICS_ORIGINAL_READINESS_R25",source_head:head,
    original_blobs:{open_work:open.blob,result_queue:results.blob,
      experiment_register:experiments.blob,renderer_requirements:renderer.blob},
    work:items,actual_results:results.data.items.length,
    renderer_required_fields:[...renderer.data.required_fields],
    experiment_control_law:{...experiments.data.controlled_test_law},
    source_readback:"ORIGINAL_GIT_OBJECT_AND_CHECKOUT",
    renderer_execution:"NOT_OBSERVED",caller_return:"NOT_DELIVERED",
    plugin_host:"NOT_VERIFIED",native_adoption:"NOT_VERIFIED",
    recommendation_only:true,writes:"NONE",no_auto_activation:true};
}
export function inspectRealNativeAnalytics(head,provider) {
  const open=readGitOriginal(SOURCES.open,head,provider);
  const results=readGitOriginal(SOURCES.results,head,provider);
  const tasks=ingestNativeAnalyticsOpenWork(open.data,open.receipt);
  const intake=nativeParallelIntake({source_head:head,tasks,bridges:[],observations:[]});
  const returns=assessAnalyticsQueueReturns(results.data,results.receipt,[]);
  const impact=nativeImpactGate(intake);
  return {schema:"LYVRA_NATIVE_ANALYTICS_ORIGINAL_CI_R15",source_head:head,
    original_blobs:{open_work:open.blob,result_queue:results.blob},original_task_ids:tasks.map(t=>t.id),
    work_states:intake.work.reviewed.map(t=>({id:t.id,state:t.state})),
    actual_results:returns.returns.length,caller_results:returns.returns.map(x=>x.caller_state),
    source_readback:"GIT_CHECKOUT_OBJECT_EQUAL",source_execution:"ORIGINAL_NODE_CI",
    host_execution:"NOT_VERIFIED",productive_adoption:"NOT_VERIFIED",
    readiness:inspectAnalyticsReadiness(head,provider),
    discovery_r02:"NOT_EXECUTED",pending_impacts:impact.open_targets,no_writes:true,no_auto_activation:true};
}
if(import.meta.url===`file://${process.argv[1]}`){
 const head=git(["rev-parse","HEAD"]);
 console.log(JSON.stringify(inspectRealNativeAnalytics(head)));
}
