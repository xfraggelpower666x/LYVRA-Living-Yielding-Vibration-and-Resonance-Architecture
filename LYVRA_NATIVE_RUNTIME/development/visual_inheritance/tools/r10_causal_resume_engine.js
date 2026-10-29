"use strict";
/* R10 read-only causal dependency intelligence: no controller, host API, IO or writes. */
const G={
 nodes:["VISUAL_SOURCE","VISUAL_HOST","TRACK_SPECIALIST","NATIVE_RELEASE","ALIVE_RELEASE","FAMILY_MAIL_RELEASE","ORIGINAL_ASSET_BINDING","ZIP_MIRROR","RELEASE_PARITY","GOVERNED_PROMOTION","UPDATE_INTELLIGENCE","PARALLEL_CONTINUITY"],
 edges:[
 ["VISUAL_SOURCE","VISUAL_HOST","requires_host_execution"],
 ["VISUAL_SOURCE","TRACK_SPECIALIST","needs_specialist_nonregression"],
 ["NATIVE_RELEASE","RELEASE_PARITY","requires_release_readback"],
 ["ALIVE_RELEASE","RELEASE_PARITY","requires_release_readback"],
 ["FAMILY_MAIL_RELEASE","ORIGINAL_ASSET_BINDING","requires_owner_and_originals"],
 ["NATIVE_RELEASE","ZIP_MIRROR","requires_exact_release_bytes"],
 ["ALIVE_RELEASE","ZIP_MIRROR","requires_exact_release_bytes"],
 ["RELEASE_PARITY","GOVERNED_PROMOTION","requires_all_surface_parity"],
 ["VISUAL_HOST","GOVERNED_PROMOTION","requires_host_pass"],
 ["ORIGINAL_ASSET_BINDING","GOVERNED_PROMOTION","requires_original_asset_proof"],
 ["ZIP_MIRROR","GOVERNED_PROMOTION","requires_mirror_readback"],
 ["PARALLEL_CONTINUITY","UPDATE_INTELLIGENCE","shares_work_ledger_not_authority"]
 ]};
const originalVisual=["WHOLE_VISUAL_INHERITANCE","AUTOMATIC_VISUAL_GUIDANCE","INTELLIGENT_ACTIVE_CHAT_FALLBACK","TRACK_DESIGN_VISUAL_NONREGRESSION","NATIVE_PLUGIN","ALIVE_PLUGIN","FAMILY_MAIL_PLUGIN","HOST_VISUAL_ACCEPTANCE","GOVERNED_PROMOTION"];
const originalUpdate=["UPDATE_IMPACT_GRAPH","PLUGIN_TO_ZIP_COHERENCE","RECOVERY_AND_POINTER_LAST","PARALLEL_CONTINUITY","VISUAL_HOST_BEHAVIOR"];
const originalParallel=["INTAKE_SEMANTIC_CLASSIFIER","INTERRUPTION_TACTICS","PARALLEL_DEPENDENCY_GRAPH","EVIDENCE_RETURN_ANCHORS","ADAPTIVE_VISUAL_CONTINUITY"];
function evaluate(changes,gates,options={}){
 if(!Array.isArray(changes)||changes.some(x=>!G.nodes.includes(x)))throw Error("UNKNOWN_CHANGE_SCOPE");
 const touched=new Set(changes), reasons={};const queue=[...touched];
 for(const ch of changes)reasons[ch]=["CHANGED_DIRECTLY"];
 while(queue.length){const node=queue.shift();for(const [from,to,why] of G.edges){if(from!==node)continue;
 if(!touched.has(to)){touched.add(to);queue.push(to)}(reasons[to]??=[]).push(from+":"+why)}}
 const status=Object.fromEntries([...touched].map(n=>[n,{classification:changes.includes(n)?"REVALIDATE_DIRECT":"REVALIDATE_DEPENDENCY",reasons:[...new Set(reasons[n])],lastGate:gates[n]||"PENDING"}]));
 let ready=G.nodes.filter(n=>touched.has(n)&&!["HOST_BLOCKED","BYTES_UNAVAILABLE","RELEASE_PENDING","AUTHORITY_PENDING"].includes(gates[n])).filter(n=>n!=="GOVERNED_PROMOTION"||options.hostPass===true);
 let blocked=G.nodes.filter(n=>touched.has(n)&&!ready.includes(n));
 return {touched:[...touched],status,ready,blocked,productiveAllowed:false,otherThreadsPreserved:true};
}
function resumeVisual(state){
 const valid=state.visualIds?.length===9&&state.updateIds?.length===5&&state.parallelIds?.length===5
 &&JSON.stringify(state.visualIds)===JSON.stringify(originalVisual)
 &&JSON.stringify(state.updateIds)===JSON.stringify(originalUpdate)
 &&JSON.stringify(state.parallelIds)===JSON.stringify(originalParallel);
 if(!valid)return {status:"CONFLICT_QUARANTINE",reason:"CONTINUITY_THREAD_DRIFT",actions:[]};
 if(!state.head||!state.recovery||!state.anchor)return {status:"READBACK_PENDING",reason:"MISSING_VERIFIED_RETURN_ANCHOR",actions:[]};
 const items=[
 {id:"R01_VISUAL",status:"DEV_ACTIVE",detail:"Nine visual workstreams preserved",anchor:state.head},
 {id:"R07_UPDATE",status:"DEV_ACTIVE",detail:"Five update threads, targeted plugin ZIP mirror gated",anchor:state.head},
 {id:"R08_PARALLEL",status:"DEV_ACTIVE",detail:"Five intake/interrupt threads, recovery preserved",anchor:state.head},
 {id:"VISUAL_HOST",status:state.hostBlocked?"BLOCKED_EXTERNAL":"READBACK_PENDING",detail:state.hostBlocked?"Chat host security denied — no bypass":"Real chat host proof pending",anchor:state.anchor}
 ];
 return {status:"ISOLATED_CONTINUITY_READY_HOST_NOT_PROVED",items,actions:[{id:"resume-unblocked",label:"Continue permitted independent evidence",allowed:true},{id:"promote",label:"Promote productive pointer",allowed:false}],archiveFrozen:state.recovery,productionUntouched:true};
}
function runTests(real){
 const a=[];
 const test=(name,fn)=>{try{fn();a.push({name,pass:true})}catch(e){a.push({name,pass:false,error:String(e)})}};
 const check=(x,m)=>{if(!x)throw Error(m)};
 test("real-ledgers-visual-resume-preserves-9-5-5",()=>{let v=resumeVisual(real);check(v.items?.length===4&&v.actions[1].allowed===false,"bad resume")});
 test("negative-thread-omission-quarantine",()=>{check(resumeVisual({...real,visualIds:real.visualIds.slice(1)}).status==="CONFLICT_QUARANTINE","missing not caught")});
 test("negative-missing-return-anchor",()=>{check(resumeVisual({...real,anchor:null}).status==="READBACK_PENDING","anchor not caught")});
 test("negative-host-blockage-never-promotion",()=>{let v=resumeVisual(real);check(v.items[3].status==="BLOCKED_EXTERNAL"&&!v.actions[1].allowed,"security bypass")});
 test("native-release-invalidation-scoped",()=>{let o=evaluate(["NATIVE_RELEASE"],{ZIP_MIRROR:"BYTES_UNAVAILABLE",VISUAL_HOST:"HOST_BLOCKED"});check(o.touched.includes("ZIP_MIRROR")&&o.touched.includes("GOVERNED_PROMOTION")&&!o.touched.includes("FAMILY_MAIL_RELEASE"),"scope bleed")});
 test("family-mail-change-preserves-native-and-alive",()=>{let o=evaluate(["FAMILY_MAIL_RELEASE"],{ORIGINAL_ASSET_BINDING:"AUTHORITY_PENDING"});check(!o.touched.includes("NATIVE_RELEASE")&&!o.touched.includes("ALIVE_RELEASE")&&o.blocked.includes("ORIGINAL_ASSET_BINDING"),"ownership bleed")});
 test("host-denied-does-not-retry-or-unblock",()=>{let o=evaluate(["VISUAL_SOURCE"],{VISUAL_HOST:"HOST_BLOCKED"});check(o.blocked.includes("VISUAL_HOST")&&!o.productiveAllowed,"bad host gate")});
 test("unknown-scope-rejected",()=>{let blocked=false;try{evaluate(["FOREIGN_SYSTEM_WRITES"],{})}catch{blocked=true}check(blocked,"foreign scope accepted")});
 test("only-affected-edges-invalidated",()=>{let o=evaluate(["PARALLEL_CONTINUITY"],{});check(o.touched.length===2&&!o.touched.includes("ZIP_MIRROR")&&!o.touched.includes("TRACK_SPECIALIST"),"whole rerun")});
 test("no-autonomous-production",()=>{let o=evaluate(["RELEASE_PARITY"],{"RELEASE_PARITY":"PASS"},{hostPass:true});check(o.productiveAllowed===false,"promoted unexpectedly")});
 return {status:a.every(x=>x.pass)?"PASS":"FAIL",passed:a.filter(x=>x.pass).length,total:a.length,tests:a,scope:"REAL_LEDGER_IDS_PLUS_PURE_CAUSAL_SIMULATIONS_NOT_HOST_OR_PLUGIN_EXECUTION"};
}
