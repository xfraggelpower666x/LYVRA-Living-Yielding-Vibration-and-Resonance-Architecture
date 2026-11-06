import test from "node:test";
import assert from "node:assert/strict";
import {readGitOriginal,inspectRealNativeAnalytics} from "./parallel-repository-evidence.mjs";
const H="a".repeat(40),B="b".repeat(40);
const open="LYVRA_NATIVE_RUNTIME/facets/analytics/current/OPEN_WORK.json";
const queue="LYVRA_NATIVE_RUNTIME/facets/analytics/development/RESULT_QUEUE.json";
const files={
 [open]:JSON.stringify({status:"CURRENT_PRODUCTIVE",items:[{id:"ANL-001",state:"OPEN_EVENT_GATED",task:"Existing analytics task"}]}),
 [queue]:JSON.stringify({status:"CURRENT_PRODUCTIVE",source_facet:"LYVRA_ANALYTICS",items:[]})
};
const provider={git(args){if(args.join(" ")==="rev-parse HEAD")return H;if(args[0]==="show")return files[args[1].slice(5)];if(args[0]==="rev-parse")return B;throw Error("unexpected git call")},readFileSync(path){return files[path]}};
test("original Git object and checkout match",()=>{const r=readGitOriginal(open,H,provider);assert.equal(r.receipt.head,H);assert.equal(r.blob,B)});
test("stale or alternate checkout is blocked",()=>assert.throws(()=>readGitOriginal(open,"c".repeat(40),provider),/HEAD mismatch/));
test("nonallowlisted repository sources cannot enter",()=>assert.throws(()=>readGitOriginal("README.md",H,provider),/allowlisted/));
test("differing worktree and Git original is blocked",()=>assert.throws(()=>readGitOriginal(open,H,{...provider,readFileSync(){return "{}"}}),/differs/));
test("original native analytics scope executes no writes",()=>{const r=inspectRealNativeAnalytics(H,provider);assert.deepEqual(r.original_task_ids,["ANL-001"]);assert.equal(r.actual_results,0);assert.equal(r.no_writes,true);assert.equal(r.host_execution,"NOT_VERIFIED")});
