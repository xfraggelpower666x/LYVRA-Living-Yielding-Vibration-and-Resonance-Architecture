import test from "node:test";
import assert from "node:assert/strict";
import {readGitOriginal,inspectRealNativeAnalytics,inspectAnalyticsReadiness} from "./parallel-repository-evidence.mjs";
const H="a".repeat(40),B="b".repeat(40);
const open="LYVRA_NATIVE_RUNTIME/facets/analytics/current/OPEN_WORK.json";
const queue="LYVRA_NATIVE_RUNTIME/facets/analytics/development/RESULT_QUEUE.json";
const experiment="LYVRA_NATIVE_RUNTIME/facets/analytics/current/EXPERIMENT_REGISTER.json";
const renderer="LYVRA_NATIVE_RUNTIME/facets/analytics/current/RENDERER_EVIDENCE_REGISTER.json";
const files={
 [open]:JSON.stringify({status:"CURRENT_PRODUCTIVE",items:[{id:"ANL-001",state:"OPEN_EVENT_GATED",task:"Existing analytics task"}]}),
 [queue]:JSON.stringify({status:"CURRENT_PRODUCTIVE",source_facet:"LYVRA_ANALYTICS",items:[]}),
 [experiment]:JSON.stringify({status:"CURRENT_PRODUCTIVE",controlled_test_law:{prompt:"CONSTANT"},active:[{id:"Existing analytics task",status:"OPEN_EVENT_GATED"}]}),
 [renderer]:JSON.stringify({status:"CURRENT_PRODUCTIVE",required_fields:["MODEL_ID","USER_VERDICT"]})
};
const provider={git(args){if(args.join(" ")==="rev-parse HEAD")return H;if(args[0]==="show")return files[args[1].slice(5)];if(args[0]==="rev-parse")return B;throw Error("unexpected git call")},readFileSync(path){return files[path]}};
test("original Git object and checkout match",()=>{const r=readGitOriginal(open,H,provider);assert.equal(r.receipt.head,H);assert.equal(r.blob,B)});
test("stale or alternate checkout is blocked",()=>assert.throws(()=>readGitOriginal(open,"c".repeat(40),provider),/HEAD mismatch/));
test("nonallowlisted repository sources cannot enter",()=>assert.throws(()=>readGitOriginal("README.md",H,provider),/allowlisted/));
test("differing worktree and Git original is blocked",()=>assert.throws(()=>readGitOriginal(open,H,{...provider,readFileSync(){return "{}"}}),/differs/));
test("original native analytics scope executes no writes",()=>{const r=inspectRealNativeAnalytics(H,provider);assert.deepEqual(r.original_task_ids,["ANL-001"]);assert.equal(r.actual_results,0);assert.equal(r.no_writes,true);assert.equal(r.host_execution,"NOT_VERIFIED")});
test("original experiment and renderer requirements enrich real source view without inventing outcomes",()=>{const r=inspectAnalyticsReadiness(H,provider);assert.equal(r.work[0].readiness,"EVENT_GATED");assert.equal(r.work[0].linked_experiment_count,1);assert.equal(r.actual_results,0);assert.deepEqual(r.renderer_required_fields,["MODEL_ID","USER_VERDICT"]);assert.equal(r.plugin_host,"NOT_VERIFIED");assert.equal(r.writes,"NONE")});
test("original readback source registry is allowlisted and required",()=>{assert.equal(readGitOriginal(experiment,H,provider).receipt.head,H);assert.equal(readGitOriginal(renderer,H,provider).blob,B)});
test("invalid renderer requirements do not masquerade as verified readiness",()=>{const altered={...provider,git(args){if(args[0]==="show"&&args[1].slice(5)===renderer)return JSON.stringify({required_fields:null});return provider.git(args)},readFileSync(path){if(path===renderer)return JSON.stringify({required_fields:null});return provider.readFileSync(path)}};assert.throws(()=>inspectAnalyticsReadiness(H,altered),/evidence structures required/)});
