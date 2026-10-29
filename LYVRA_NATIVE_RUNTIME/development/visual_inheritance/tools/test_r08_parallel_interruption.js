"use strict";
// R08 deterministic offline interruption and intake behavior acceptance.
// No network, timers, plugin actions, mail, host access or repository writes.
const VISUAL=["WHOLE_VISUAL_INHERITANCE","AUTOMATIC_VISUAL_GUIDANCE","INTELLIGENT_ACTIVE_CHAT_FALLBACK","TRACK_DESIGN_VISUAL_NONREGRESSION","NATIVE_PLUGIN","ALIVE_PLUGIN","FAMILY_MAIL_PLUGIN","HOST_VISUAL_ACCEPTANCE","GOVERNED_PROMOTION"];
const UPDATE=["UPDATE_IMPACT_GRAPH","PLUGIN_TO_ZIP_COHERENCE","RECOVERY_AND_POINTER_LAST","PARALLEL_CONTINUITY","VISUAL_HOST_BEHAVIOR"];
const PARALLEL=["INTAKE_SEMANTIC_CLASSIFIER","INTERRUPTION_TACTICS","PARALLEL_DEPENDENCY_GRAPH","EVIDENCE_RETURN_ANCHORS","ADAPTIVE_VISUAL_CONTINUITY"];
const sha="260d8cb02875a6689342bd8436d25aa808f13d44";
const clone=x=>JSON.parse(JSON.stringify(x));
function initial(){
return {authority:"WHOLE_LYVRA",branch:"lyvra-visual-inheritance-family-mail-track-preservation-20261029-r01",head:sha,visual:VISUAL.map(id=>({id,status:id==="HOST_VISUAL_ACCEPTANCE"?"BLOCKED_EXTERNAL":"DEV_ACTIVE",passed:["R01_SOURCE_BASELINE"]})),update:UPDATE.map(id=>({id,status:"DEV_ACTIVE"})),parallel:PARALLEL.map(id=>({id,status:"DEV_ACTIVE"})),inputs:[],dependencies:[["NATIVE_PLUGIN","PLUGIN_TO_ZIP_COHERENCE"],["ALIVE_PLUGIN","PLUGIN_TO_ZIP_COHERENCE"],["HOST_VISUAL_ACCEPTANCE","GOVERNED_PROMOTION"]],frozen:[],blocks:["CHATGPT_BROWSER_SECURITY_POLICY"],repeatedPassedTests:0,pluginReleased:false,zipMirrored:false,pointerPublished:false,foreignWrite:false,backgroundWorkClaimed:false};
}
function intake(prev,input){
 const s=clone(prev);
 if(!input||!input.id||!input.kind||!input.scope)throw Error("missing provenance/scope");
 if(s.inputs.some(x=>x.id===input.id))return s; // idempotent
 if(input.kind==="HOST_BLOCKED"){
  s.inputs.push({...input,tactic:"BLOCKED_EXTERNAL",result:"NO_BYPASS"});
  return s;
 }
 if(input.kind==="FOREIGN_NOTICE"&&!input.nativeAuthorityRead){
  s.inputs.push({...input,tactic:"HOLD_AND_RESUME",result:"CANDIDATE_NOT_AUTHORITY"});
  return s;
 }
 if(input.kind==="NEW_TOPIC"){
  s.frozen.push({head:s.head,returnAnchor:input.returnAnchor||s.head,unaffectedVisualIds:s.visual.map(x=>x.id),unaffectedUpdateIds:s.update.map(x=>x.id),blocked:s.blocks.slice(),passedTests:s.visual.map(x=>[x.id,x.passed])});
  s.inputs.push({...input,tactic:"PARALLEL_NEW",result:"PAUSED_WITH_ANCHOR"});
  return s;
 }
 if(input.kind==="USER_CORRECTION"){
  s.inputs.push({...input,tactic:"INLINE_ADD",result:"UPDATE_REPO_FIRST_CANDIDATE"});
  return s;
 }
 if(input.kind==="DEPENDENCY_CHANGED"){
  const downstream=s.dependencies.filter(([up])=>up===input.scope).map(([,down])=>down);
  s.inputs.push({...input,tactic:"INLINE_ADD",result:"INVALIDATE_AFFECTED_GATES_ONLY",downstream});
  return s;
 }
 if(input.kind==="RESUME"){
  if(!s.frozen.length)throw Error("no recorded anchor");
  const last=s.frozen[s.frozen.length-1];
  if(input.returnAnchor!==last.returnAnchor)throw Error("mismatched return anchor");
  s.inputs.push({...input,tactic:"HOLD_AND_RESUME",result:"RESTORE_SCOPE_NO_REPLAY"});
  return s;
 }
 s.inputs.push({...input,tactic:"INLINE_ADD",result:"REFERENCE_ONLY"});
 return s;
}
function assert(x,message){if(!x)throw Error(message);}
const tests=[
 ["positive/new-topic-retains-all-threads",()=>{const s=intake(initial(),{id:"n1",kind:"NEW_TOPIC",scope:"R08",returnAnchor:"r08-anchor"});assert(s.visual.length===9&&s.update.length===5&&s.parallel.length===5,"thread loss");assert(s.frozen[0].head===sha,"missing frozen SHA");}],
 ["positive/user-correction-keeps-history",()=>{const s=intake(initial(),{id:"c1",kind:"USER_CORRECTION",scope:"PLUGIN_TO_ZIP_COHERENCE",provenance:"creator"});assert(s.inputs[0].result==="UPDATE_REPO_FIRST_CANDIDATE"&&s.visual.length===9,"correction overwrote prior work");}],
 ["negative/browser-security-no-bypass",()=>{const s=intake(initial(),{id:"h1",kind:"HOST_BLOCKED",scope:"HOST_VISUAL_ACCEPTANCE"});assert(s.inputs[0].result==="NO_BYPASS"&&s.visual.at(-2).status==="BLOCKED_EXTERNAL","blocked gate changed");}],
 ["negative/foreign-notice-not-native-current",()=>{const s=intake(initial(),{id:"f1",kind:"FOREIGN_NOTICE",scope:"FAMILY_MAIL_PLUGIN",nativeAuthorityRead:false});assert(s.inputs[0].result==="CANDIDATE_NOT_AUTHORITY"&&!s.foreignWrite,"foreign promotion");}],
 ["positive/affected-only-invalidation",()=>{const s=intake(initial(),{id:"d1",kind:"DEPENDENCY_CHANGED",scope:"NATIVE_PLUGIN"});assert(JSON.stringify(s.inputs[0].downstream)==='["PLUGIN_TO_ZIP_COHERENCE"]',"invalidated unrelated threads");assert(s.visual.every(x=>x.passed.length===1),"repeated passed tests");}],
 ["positive/pause-and-exact-resume",()=>{let s=intake(initial(),{id:"n2",kind:"NEW_TOPIC",scope:"TRACK_DESIGN_VISUAL_NONREGRESSION",returnAnchor:"x123"});s=intake(s,{id:"r1",kind:"RESUME",scope:"TRACK_DESIGN_VISUAL_NONREGRESSION",returnAnchor:"x123"});assert(s.inputs[1].result==="RESTORE_SCOPE_NO_REPLAY"&&s.visual.length===9,"resume lost work");}],
 ["negative/incorrect-resume-anchor-rejected",()=>{let s=intake(initial(),{id:"n3",kind:"NEW_TOPIC",scope:"TRACK_DESIGN_VISUAL_NONREGRESSION",returnAnchor:"correct"});let blocked=false;try{intake(s,{id:"r2",kind:"RESUME",scope:"TRACK_DESIGN_VISUAL_NONREGRESSION",returnAnchor:"wrong"})}catch{blocked=true}assert(blocked,"incorrect anchor accepted");}],
 ["negative/duplicate-input-idempotent",()=>{const a={id:"c2",kind:"USER_CORRECTION",scope:"PLUGIN_TO_ZIP_COHERENCE"};let s=intake(initial(),a);s=intake(s,a);assert(s.inputs.length===1,"duplicate task generated");}],
 ["negative/no-implicit-operations",()=>{let s=intake(initial(),{id:"n4",kind:"NEW_TOPIC",scope:"R08"});assert(!s.pluginReleased&&!s.zipMirrored&&!s.pointerPublished&&!s.foreignWrite&&!s.backgroundWorkClaimed,"unauthorized action");}],
];
function run(){const rows=tests.map(([name,fn])=>{try{fn();return {name,result:"PASS"}}catch(e){return {name,result:"FAIL",error:String(e)}}});return {schema:"lyvra.r08.interruption_acceptance.v1",passed:rows.filter(x=>x.result==="PASS").length,total:rows.length,rows,scope:"OFFLINE_SIMULATED_TRANSITIONS_NOT_HOST_OR_PRODUCTIVE_RUNTIME"};}
const report=run();
if(report.passed!==report.total)throw Error(JSON.stringify(report));
report;
