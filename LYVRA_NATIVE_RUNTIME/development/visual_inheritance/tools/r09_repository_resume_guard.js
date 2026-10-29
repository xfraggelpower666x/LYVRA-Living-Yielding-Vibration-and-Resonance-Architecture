"use strict";
/* LYVRA R09: pure guarded resumption evaluator; no GitHub mutations.
   Inputs MUST be fresh repository reads performed by the caller.
   Do not equate matching blobs to host runtime acceptance. */
function assert(x,m){if(!x)throw Error(m)}
function guard(e){
 if(!e||!e.targetHead||!e.currentHead||!e.recoveryHead||!e.productionHead||!e.ledgers) return {status:"READBACK_PENDING",reason:"REQUIRED_GITHUB_EVIDENCE_MISSING"};
 if(e.targetHead!==e.recoveryHead) return {status:"CONFLICT_QUARANTINE",reason:"RECOVERY_ANCHOR_MISMATCH"};
 if(e.currentHead!==e.targetHead) return {status:"CONFLICT_QUARANTINE",reason:"UNEXPECTED_DEVELOPMENT_HEAD_MOVEMENT"};
 if(e.productionHead!==e.expectedProductionHead) return {status:"CONFLICT_QUARANTINE",reason:"PRODUCTIVE_HEAD_MOVED"};
 if(e.ledgers.length!==3||e.ledgers.some(l=>!l.anchorBlob||!l.recoveryBlob||!l.currentBlob)) return {status:"READBACK_PENDING",reason:"LEDGER_READBACK_MISSING"};
 for(const l of e.ledgers){
  if(l.anchorBlob!==l.recoveryBlob) return {status:"CONFLICT_QUARANTINE",reason:"RECOVERY_LEDGER_MISMATCH",ledger:l.name};
  if(l.currentBlob!==l.expectedCurrentBlob) return {status:"CONFLICT_QUARANTINE",reason:"EXPECTED_BLOB_STALE",ledger:l.name};
 }
 if(JSON.stringify(e.visualIds)!==JSON.stringify(e.expectedVisualIds)||e.visualIds.length!==9) return {status:"CONFLICT_QUARANTINE",reason:"VISUAL_THREADS_CHANGED"};
 if(JSON.stringify(e.updateIds)!==JSON.stringify(e.expectedUpdateIds)||e.updateIds.length!==5) return {status:"CONFLICT_QUARANTINE",reason:"UPDATE_THREADS_CHANGED"};
 if(JSON.stringify(e.parallelIds)!==JSON.stringify(e.expectedParallelIds)||e.parallelIds.length!==5) return {status:"CONFLICT_QUARANTINE",reason:"PARALLEL_THREADS_CHANGED"};
 if(e.hostAccess==="DENIED") return {status:"SOURCE_RECOVERY_VERIFIED_HOST_BLOCKED",reason:"SECURITY_POLICY_NO_BYPASS",resumeSafe:true,productivePromotion:false};
 return {status:"SOURCE_RECOVERY_VERIFIED_HOST_UNTESTED",resumeSafe:true,productivePromotion:false};
}
function runTests(e){
 const tests=[];
 function check(name,modified,reason){const r=guard(modified);tests.push({name,pass:r.reason===reason,actual:r.reason,status:r.status})}
 check("real_current_and_recovery_head",e,"SECURITY_POLICY_NO_BYPASS");
 check("wrong_return_anchor",{...e,recoveryHead:"0000000000000000000000000000000000000000"},"RECOVERY_ANCHOR_MISMATCH");
 check("development_head_conflict",{...e,currentHead:"ffffffffffffffffffffffffffffffffffffffff"},"UNEXPECTED_DEVELOPMENT_HEAD_MOVEMENT");
 check("productive_head_conflict",{...e,productionHead:"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"},"PRODUCTIVE_HEAD_MOVED");
 check("recovery_file_tampering",{...e,ledgers:e.ledgers.map((x,i)=>i===1?{...x,recoveryBlob:"bad"}:x)},"RECOVERY_LEDGER_MISMATCH");
 check("stale_expected_blob",{...e,ledgers:e.ledgers.map((x,i)=>i===2?{...x,expectedCurrentBlob:"outdated"}:x)},"EXPECTED_BLOB_STALE");
 check("missing_ledger_evidence",{...e,ledgers:e.ledgers.slice(0,2)},"LEDGER_READBACK_MISSING");
 check("visual_thread_omitted",{...e,visualIds:e.visualIds.slice(1)},"VISUAL_THREADS_CHANGED");
 check("update_thread_renamed",{...e,updateIds:e.updateIds.map((x,i)=>i===0?"WRONG":x)},"UPDATE_THREADS_CHANGED");
 check("parallel_thread_omitted",{...e,parallelIds:e.parallelIds.slice(0,4)},"PARALLEL_THREADS_CHANGED");
 return {schema:"lyvra.r09.live_repo_evidence_guard_tests.v1",pass:tests.filter(t=>t.pass).length,total:tests.length,tests,scope:"Actual GitHub evidence + synthetic adverse mutations (no writes); not host or plugin runtime"};
}
