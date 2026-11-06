// Whole LYVRA R15: Read-only original repository source intake, run in CI checkout.
// Provider source is verified against Git objects, not assumed from a mock fixture.
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
import {ingestNativeAnalyticsOpenWork,nativeParallelIntake,assessAnalyticsQueueReturns,nativeImpactGate} from "./parallel-native-integration.mjs";
const nativeRoot="LYVRA_NATIVE_RUNTIME/facets/analytics/";
const SOURCES=Object.freeze({open:nativeRoot+"current/OPEN_WORK.json",results:nativeRoot+"development/RESULT_QUEUE.json"});
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
    discovery_r02:"NOT_EXECUTED",pending_impacts:impact.open_targets,no_writes:true,no_auto_activation:true};
}
if(import.meta.url===`file://${process.argv[1]}`){
 const head=git(["rev-parse","HEAD"]);
 console.log(JSON.stringify(inspectRealNativeAnalytics(head)));
}
