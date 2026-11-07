import test from "node:test";
import assert from "node:assert/strict";
import {reviewDictation,assessDictatedNativeAddress,assessParallelWork,assessImpact,antiLoopReview,projectParallelMonitor} from "./parallel-work-intelligence.mjs";
const task=(id,x={})=>({id,title:id,strand:"VISUAL",state:"OPEN",origin_ref:"git:verified",resource_key:id, ...x});
const verified=(x={})=>({direct_readback:true,source_ref:"git:receipt",head:"abc",...x});
test("single work item is not automatically executed",()=>{const r=assessParallelWork([task("one")]);assert.equal(r.mode,"SINGLE");assert.equal(r.execute,false)});
test("multi selects max eight by default while preserving all",()=>{const r=assessParallelWork(Array.from({length:14},(_,i)=>task("T"+i)));assert.equal(r.recommended.length,8);assert.equal(r.reviewed.length,14);assert.equal(r.unselected.length,6)});
test("explicit all covers full eligible load",()=>{assert.equal(assessParallelWork(Array.from({length:12},(_,i)=>task("T"+i)),[],{all:true}).recommended.length,12)});
test("unverified active actor does not create fake lock",()=>{const r=assessParallelWork([task("a")],[{kind:"ACTIVE_WRITE",resource_key:"a",actor_id:"other"}]);assert.equal(r.reviewed[0].state,"OPEN")});
test("verified foreign writer pauses only matching resource",()=>{const r=assessParallelWork([task("a"),task("b")],[verified({kind:"ACTIVE_WRITE",resource_key:"a",actor_id:"other"})]);assert.equal(r.reviewed[0].state,"PAUSED_CONCURRENT");assert.equal(r.reviewed[1].action_allowed,true)});
test("dormant without current receipt not promoted",()=>{assert.equal(assessParallelWork([task("d",{state:"DORMANT"})]).reviewed[0].state,"DORMANT_UNCONFIRMED")});
test("dependent tasks remain blocked",()=>{assert.equal(assessParallelWork([task("a",{depends_on:["missing"]})]).reviewed[0].state,"DEPENDENCY_BLOCKED")});
test("done without actual readback not closed",()=>{assert.equal(assessParallelWork([task("a",{state:"DONE"})]).reviewed[0].state,"RESULT_READBACK_PENDING")});
test("dictation preserves originals and requires review on ambiguity",()=>{const r=reviewDictation({original:"Screei",alternatives:["SCEERI"]});assert.equal(r.interpreted,"Screei");assert.equal(r.needs_creator_review,true);assert.equal(r.auto_corrected,false)});
test("impact inference stays evidence-scoped",()=>{const r=assessImpact(task("a",{impact_targets:["website"]}),[verified({cause_id:"a",effect_target:"cdn"}),{cause_id:"a",effect_target:"unknown"}]);assert.deepEqual(r.affected,["cdn","website"]);assert.equal(r.unverified_links,1)});
test("three repeated checks do not bypass permissions",()=>{const c=Array.from({length:3},()=>({fingerprint:"same",result:"NO_NEW_EVIDENCE"}));assert.equal(antiLoopReview(c,{}).mode,"PAUSE_REPEATED_CHECKS_HOST_GATE");assert.equal(antiLoopReview(c,{explicit_authorization:true,host_verified:true,recovery_verified:true}).mode,"LEARNING_BY_DOING_AUTHORIZED")});
test("monitor includes bridge+forge+legend and native scope",()=>{const r=projectParallelMonitor(assessParallelWork([task("a",{bridge_assignments:[{capability_id:"binary",role:"upload"}],codeforge_role:"HTML repair"})]));assert.equal(r.tasks[0].bridge_details.length,1);assert.equal(r.scope,"FIFTH_MAIN_OPTION_SUBMENU_ONLY");assert.ok(r.glossary.SCEERI);assert.equal(r.no_auto_deploy,true)});
test("two local tasks for one resource are serialized by proposal, not fake lock",()=>{const r=assessParallelWork([task("a",{resource_key:"same"}),task("b",{resource_key:"same"})]);assert.equal(r.reviewed[0].state,"OPEN");assert.equal(r.reviewed[1].state,"WAIT_SAME_RESOURCE");assert.equal(r.recommended.length,1)});
test("blocked paused and proposed work is never automatically actionable",()=>{for(const state of ["BLOCKED","PAUSED","PROPOSED"]){assert.equal(assessParallelWork([task(state,{state})]).recommended.length,0)}});
test("a paused task does not block independent open work for same resource",()=>{const r=assessParallelWork([task("paused",{state:"PAUSED",resource_key:"same"}),task("open",{resource_key:"same"})]);assert.equal(r.reviewed[1].state,"OPEN");assert.equal(r.recommended.length,1)});
test("anti-loop requires three consecutive equivalent checks",()=>{const checks=[{fingerprint:"A",result:"NO_NEW_EVIDENCE"},{fingerprint:"B",result:"NO_NEW_EVIDENCE"},{fingerprint:"A",result:"NO_NEW_EVIDENCE"},{fingerprint:"A",result:"NO_NEW_EVIDENCE"}];assert.equal(antiLoopReview(checks,{}).repeated,2);assert.equal(antiLoopReview([...checks,{fingerprint:"A",result:"NO_NEW_EVIDENCE"}],{}).repeated,3)});

test("DONE readback flag alone never closes native task or releases dependent",()=>{
 const r=assessParallelWork([task("done",{state:"DONE",outcome_readback:true}),task("dependent",{depends_on:["done"]})]);
 assert.equal(r.reviewed[0].state,"RESULT_READBACK_PENDING");
 assert.ok(r.reviewed[0].missing_native_done_gates.length>0);
 assert.equal(r.reviewed[1].state,"DEPENDENCY_BLOCKED");
});
test("DONE requires all four same-head native evidence gates plus independent outcome",()=>{
 const receipt=(x={})=>verified({head:"current-head",...x});
 const done=task("done",{state:"DONE",outcome_readback:true,current_evidence:receipt(),
   native_adoption_evidence:receipt(),lifecycle_rehydration_evidence:receipt(),
   host_execution_evidence:receipt({execution_observed:true}),
   independent_outcome_evidence:receipt({independent:true,outcome_observed:true})});
 const accepted=assessParallelWork([done,task("next",{depends_on:["done"]})]);
 assert.equal(accepted.reviewed[0].state,"DONE_VERIFIED");
 assert.equal(accepted.reviewed[1].state,"OPEN");
 for(const key of ["native_adoption_evidence","lifecycle_rehydration_evidence","host_execution_evidence","independent_outcome_evidence"]){
   const rejected=assessParallelWork([{...done,[key]:undefined}]);
   assert.equal(rejected.reviewed[0].state,"RESULT_READBACK_PENDING",key);
 }
});
test("stale host evidence and unobserved outcome never count as DONE",()=>{
 const receipt=(x={})=>verified({head:"current-head",...x});
 const done=task("x",{state:"DONE",outcome_readback:true,current_evidence:receipt(),
 native_adoption_evidence:receipt(),lifecycle_rehydration_evidence:receipt(),
 host_execution_evidence:receipt({execution_observed:true}),
 independent_outcome_evidence:receipt({independent:true,outcome_observed:true})});
 for(const candidate of [
   {...done,host_execution_evidence:receipt({head:"stale-head",execution_observed:true})},
   {...done,host_execution_evidence:receipt({execution_observed:false})},
   {...done,independent_outcome_evidence:receipt({independent:false,outcome_observed:true})},
   {...done,independent_outcome_evidence:receipt({independent:true,outcome_observed:false})}
 ])assert.equal(assessParallelWork([candidate]).reviewed[0].state,"RESULT_READBACK_PENDING");
});
test("historical LYV spoken shorthand is a review candidate only in explicit command context",()=>{const x=assessDictatedNativeAddress({original:"Lyv weiter",direct_address:true,explicit_project_context:true});assert.equal(x.normalized_candidate,"LYVRA");assert.equal(x.interpreted,"Lyv weiter");assert.equal(x.needs_creator_review,true);assert.equal(x.execute,false)});
test("ordinary words and indirect references never activate dictated system addresses",()=>{const x=assessDictatedNativeAddress({original:"lyv is a word",direct_address:false,explicit_project_context:true});assert.equal(x.normalized_candidate,null);assert.equal(x.ordinary_words_preserved,true);assert.equal(x.command_authorized,false)});
test("explicit confirmed utterance may be presented but never executed by normalization",()=>{const x=assessDictatedNativeAddress({original:"Lyv weiter",direct_address:true,explicit_project_context:true,confirmed:true,confirmed_text:"LYVRA WEITER"});assert.equal(x.interpreted,"LYVRA WEITER");assert.equal(x.needs_creator_review,false);assert.equal(x.command_authorized,false)});
test("phonetic alternative is not promoted when project context is missing",()=>{const x=assessDictatedNativeAddress({original:"live update",alternatives:["LYVRA"],direct_address:true,explicit_project_context:false});assert.equal(x.normalized_candidate,null);assert.equal(x.interpreted,"live update")});
test("verified ACTIVE remains visible but excluded from new dispatch",()=>{const r=assessParallelWork([task("busy",{state:"ACTIVE"})],[verified({kind:"WORK_CURRENT",task_id:"busy",resource_key:"busy",execution_observed:true,independent_host_readback:true,host_receipt_ref:"host:receipt"})]);assert.equal(r.reviewed[0].state,"ACTIVE_VERIFIED");assert.equal(r.reviewed[0].action_allowed,false);assert.equal(r.recommended.length,0)});
test("verified ACTIVE keeps matching new task waiting independent of input order",()=>{const r=assessParallelWork([task("open",{resource_key:"same"}),task("active",{resource_key:"same",state:"ACTIVE"})],[verified({kind:"WORK_CURRENT",task_id:"active",resource_key:"same",execution_observed:true,independent_host_readback:true,host_receipt_ref:"host:receipt"})]);assert.equal(r.reviewed[0].state,"WAIT_SAME_RESOURCE");assert.equal(r.reviewed[1].state,"ACTIVE_VERIFIED");assert.equal(r.recommended.length,0)});
test("unverified ACTIVE claim does not block independent open task",()=>{const r=assessParallelWork([task("open",{resource_key:"same"}),task("claim",{resource_key:"same",state:"ACTIVE"})]);assert.equal(r.reviewed[0].state,"OPEN");assert.equal(r.reviewed[1].state,"ACTIVE_UNVERIFIED");assert.equal(r.recommended.length,1)});
test("monitor explains why verified active task is not restarted",()=>{const r=projectParallelMonitor(assessParallelWork([task("a",{state:"ACTIVE"})],[verified({kind:"WORK_CURRENT",task_id:"a",execution_observed:true,independent_host_readback:true,host_receipt_ref:"host:receipt"})]));assert.equal(r.tasks[0].status,"ACTIVE_VERIFIED");assert.match(r.tasks[0].explanation,/nicht erneut starten/)});
test("source-only work report is not a verified running host",()=>{const r=assessParallelWork([task("a",{state:"ACTIVE"})],[verified({kind:"WORK_CURRENT",task_id:"a"})]);assert.equal(r.reviewed[0].state,"ACTIVE_UNVERIFIED");assert.equal(r.reviewed[0].evidence_state,"SOURCE_ONLY_NOT_HOST");assert.equal(r.recommended.length,0)});
test("source-only active claim cannot reserve a shared resource",()=>{const r=assessParallelWork([task("a",{state:"ACTIVE",resource_key:"shared"}),task("b",{resource_key:"shared"})],[verified({kind:"WORK_CURRENT",task_id:"a",resource_key:"shared"})]);assert.equal(r.reviewed[1].state,"OPEN");assert.equal(r.recommended.length,1)});
test("host receipt without independent readback cannot establish verified ACTIVE",()=>{const r=assessParallelWork([task("a",{state:"ACTIVE"})],[verified({kind:"WORK_CURRENT",task_id:"a",execution_observed:true,host_receipt_ref:"host:receipt",independent_host_readback:false})]);assert.equal(r.reviewed[0].state,"ACTIVE_UNVERIFIED")});
