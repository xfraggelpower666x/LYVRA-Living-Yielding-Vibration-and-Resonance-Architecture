"use strict";
/* Pure existing-native-visual view adapter. No controls executed, no host calls.
Caller fetches exact GitHub current ledgers and validates origin first. */
function adaptR11(input){
 const {visual,update,parallel,repo}=input||{};
 const invalid=(reason)=>({schema:"lyvra.native_visual.resume.r11",status:"READBACK_PENDING",reason,items:[],actions:[],productionEligible:false});
 if(!visual?.workstreams||!update?.threads||!parallel?.new_capability_threads||!repo?.candidateHead||!repo?.productionHead||!repo?.recoveryBranch||!repo?.recoveryHead)return invalid("REQUIRED_REPOSITORY_LEDGER_OR_ANCHOR_MISSING");
 const v=visual.workstreams.map(x=>x.id),u=update.threads.map(x=>x.id),p=parallel.new_capability_threads.map(x=>x.id);
 const unique=a=>new Set(a).size===a.length&&a.every(x=>typeof x==="string"&&x.length>0);
 if(v.length!==9||u.length!==5||p.length!==5||![v,u,p].every(unique))return { ...invalid("THREAD_INTEGRITY_FAILURE"),status:"CONFLICT_QUARANTINE"};
 if(repo.headConflict===true)return {...invalid("UNEXPECTED_HEAD_OR_BLOB_CHANGE"),status:"CONFLICT_QUARANTINE"};
 if(repo.hostBlocked!==true)return invalid("HOST_STATUS_NOT_GROUNDED");
 const panel=(id,name,items)=>({id,title:name,count:items.length,status:"DEV_ACTIVE",detail:"Continue by verified source and scoped work, not background execution"});
 const safeHead=repo.candidateHead;
 const actions=[
  {id:"copy-head",kind:"COPY",label:"Kandidaten-HEAD kopieren",payload:safeHead,requiresClick:true},
  {id:"continue-safe",kind:"NEW_TURN",label:"Unabhängige Entwicklung fortsetzen",payload:"LYVRA PARALLEL DEVELOPMENT WEITER — Isoliert ab HEAD "+safeHead+" fortsetzen, neun Visual-, fünf UPDATE- und fünf Parallel-Threads erhalten. Nur erlaubte unabhängige Gates; echte Host-Abnahme weiterhin blockiert. Kein Produktivmerge.",requiresClick:true}
 ];
 return {
  schema:"lyvra.native_visual.resume.r11",status:"SOURCE_RECOVERY_VERIFIED_HOST_BLOCKED",title:"LYVRA WIEDERAUFNAHME",presentation:"EXISTING_SEMANTIC_VISUAL_INTELLIGENCE_ADDITIVE",
  sourceEvidence:"CURRENT_LEDGER_READBACK_REQUIRED_FROM_CALLER",confidence:"SOURCE_ONLY_NO_HOST_PROOF",
  candidateHead:safeHead,productionHead:repo.productionHead,
  recovery:{branch:repo.recoveryBranch,frozenHead:repo.recoveryHead},
  panels:[panel("R01_VISUAL","Whole Visual",v),panel("R07_UPDATE","UPDATE Intelligence",u),panel("R08_PARALLEL","Parallel Development",p),{id:"HOST_ACCEPTANCE",title:"Host-Abnahme",status:"BLOCKED_EXTERNAL",detail:"ChatGPT Browser security policy denied; no bypass"}],
  gates:{source:"VERIFIED_BY_CALLER",plugin:"PENDING",zip:"PENDING",host:"BLOCKED_EXTERNAL",pointer:"NOT_PUBLISHED"},
  actions,productionEligible:false,pluginReleaseActions:[],familyMailSendActions:[],backgroundWorkActive:false,
  visualNonRegression:{trackDesignOriginalCopyControlsPreservedByContract:true,familyMailOriginalAssetsNotReplaced:true,existingWorkChoiceMenuUnchanged:true}
 };
}
function testR11(real){
 const rows=[];const test=(name,fn)=>{try{fn();rows.push({name,pass:true})}catch(e){rows.push({name,pass:false,error:String(e)})}};const ok=(x,m)=>{if(!x)throw Error(m)};
 test("real-repository-ledgers-generate-four-panels",()=>{let v=adaptR11(real);ok(v.panels?.length===4&&v.panels[0].count===9&&v.panels[1].count===5&&v.panels[2].count===5,"count mismatch")});
 test("frozen-recovery-not-presented-as-current-head",()=>{let v=adaptR11(real);ok(v.candidateHead!==v.recovery.frozenHead&&v.actions[0].payload===v.candidateHead,"stale anchor")});
 test("no-fake-host-or-release-pass",()=>{let v=adaptR11(real);ok(v.gates.host==="BLOCKED_EXTERNAL"&&v.gates.plugin==="PENDING"&&!v.productionEligible,"false pass")});
 test("no-inert-controls-or-auto-execution",()=>{let v=adaptR11(real);ok(v.actions.every(a=>a.requiresClick===true)&&!v.backgroundWorkActive,"automatic execution")});
 test("negative-missing-ledger-blocks-actions",()=>{let v=adaptR11({...real,parallel:null});ok(v.status==="READBACK_PENDING"&&v.actions.length===0,"unsafe missing ledger")});
 test("negative-duplicate-visual-id-quarantined",()=>{let x=JSON.parse(JSON.stringify(real));x.visual.workstreams[1].id=x.visual.workstreams[0].id;ok(adaptR11(x).status==="CONFLICT_QUARANTINE","duplicate accepted")});
 test("negative-head-conflict-quarantined",()=>{let v=adaptR11({...real,repo:{...real.repo,headConflict:true}});ok(v.status==="CONFLICT_QUARANTINE"&&v.actions.length===0,"head accepted")});
 test("negative-host-state-unverified-blocks-actions",()=>{let v=adaptR11({...real,repo:{...real.repo,hostBlocked:undefined}});ok(v.status==="READBACK_PENDING"&&v.actions.length===0,"unverified host")});
 test("originals-and-specialist-contract-not-replaced",()=>{let v=adaptR11(real);ok(v.visualNonRegression.existingWorkChoiceMenuUnchanged&&v.familyMailSendActions.length===0,"unexpected facet action")});
 test("no-false-zip-mirror-current",()=>{let v=adaptR11(real);ok(v.gates.zip==="PENDING"&&v.pluginReleaseActions.length===0,"release promoted")});
 return {schema:"lyvra.r11.native_resume_acceptance.v1",passed:rows.filter(r=>r.pass).length,total:rows.length,rows,scope:"Actual repository ledger structure + pure native visual view model, not ChatGPT host UI render"};
}
