import test from "node:test";
import assert from "node:assert/strict";
import {inspectWorkspaceHandoffs} from "./parallel-lineage-evidence.mjs";
const H="a".repeat(40),B="b".repeat(40),P="LYVRA_NATIVE_RUNTIME/continuity/workspaces/";
const fixtures=[
[P+"WEBLYVRA/line-one/a.json",{handoff_id:"a",lineage_id:"line-one",workspace_id:"WEBLYVRA"}],
[P+"WEBLYVRA/line-one/b.json",{handoff_id:"b",lineage_id:"line-one",workspace_id:"WEBLYVRA",supersedes_handoff_id:"a"}],
[P+"WEBLYVRA/line-two/c.json",{handoff_id:"c",lineage_id:"line-two",workspace_id:"WEBLYVRA"}],
[P+"LYVRA_TRACK_DESIGN/track/d.json",{handoff_id:"d",lineage_id:"track",workspace_id:"LYVRA_TRACK_DESIGN"}]];
const map=new Map(fixtures.map(([p,j])=>[p,JSON.stringify(j)]));
const provider={git(args){if(args.join(" ")==="rev-parse HEAD")return H;if(args[0]==="ls-tree")return [...map.keys()].join("\n");if(args[0]==="show")return map.get(args[1].slice(5));if(args[0]==="rev-parse")return B;throw Error("git request")},readFileSync(path){return map.get(path)}};
test("original lineage supersession applies only inside same lineage",()=>{const r=inspectWorkspaceHandoffs(H,provider);const a=r.lineages.find(x=>x.key==="WEBLYVRA/line-one");assert.equal(a.heads[0].handoff_id,"b");assert.equal(a.history_count,2)});
test("two independent WEBLYVRA lineages remain ambiguous, not latest wins",()=>{const r=inspectWorkspaceHandoffs(H,provider);assert.equal(r.workspace_summary.find(x=>x.workspace_id==="WEBLYVRA").status,"MULTIPLE_INDEPENDENT_LINEAGES");assert.equal(r.autoactivate,false)});
test("foreign or inconsistent lineage cannot be silently adopted",()=>{const altered=new Map(map);const k=P+"WEBLYVRA/line-two/c.json";altered.set(k,JSON.stringify({handoff_id:"c",lineage_id:"line-one",workspace_id:"WEBLYVRA"}));const p={...provider,git(args){if(args[0]==="show")return altered.get(args[1].slice(5));return provider.git(args)},readFileSync(path){return altered.get(path)}};const r=inspectWorkspaceHandoffs(H,p);assert.equal(r.invalid.length,1)});
test("worktree mismatch prevents source-verified handoff status",()=>{assert.throws(()=>inspectWorkspaceHandoffs(H,{...provider,readFileSync(){return "{}"}}),/mismatch/)});
test("no stale HEAD is permitted",()=>assert.throws(()=>inspectWorkspaceHandoffs("c".repeat(40),provider),/HEAD mismatch/));
