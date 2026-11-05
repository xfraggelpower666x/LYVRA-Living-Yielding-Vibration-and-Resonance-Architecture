// R47 source-evidence regression; no provider calls, no writes, no host acceptance.
// node LYVRA_NATIVE_RUNTIME/development/r47-sourced-lifecycle-entry.test.mjs
import assert from 'node:assert/strict';
import {assembleR47SourceCoverage,executeR47SourcedLifecycle} from './r47-sourced-lifecycle-entry.mjs';
import fresh from './r47-six-carrier-original-source-evidence.json' with {type:'json'};
import previous from './r46-facet-lifecycle-source-coverage.json' with {type:'json'};
const HEAD=fresh.source_current_head, PTR=fresh.pointer_blob;
const blobs=Object.fromEntries([...fresh.gate_evidence,...previous.provided].map(x=>[x.path,x.blob_sha]));
const base={head:HEAD,pointerSha:PTR,productiveSourceBlobs:blobs};
let n=0;
const ck=(name,yes)=>{assert.ok(yes,name);n++};
const reject=(name,fn)=>{assert.throws(fn,undefined,name);n++};
const real=assembleR47SourceCoverage(base);
ck('ten unique source carriers',real.covered===10&&real.required===10);
ck('exact readbacks',real.sourceReadbackComplete===true);
ck('not whole runtime',real.semanticRehydrationVerified===false&&!real.wholeRehydrationVerified);
ck('not plugin host',real.currentNativeHostVerified===false&&real.hostGatesOpen===18);
ck('no source writes',real.productiveWrites===0);
reject('wrong head',()=>assembleR47SourceCoverage({...base,head:'0'.repeat(40)}));
reject('unbound blob',()=>assembleR47SourceCoverage({...base,productiveSourceBlobs:{}}));
reject('duplicated carrier',()=>assembleR47SourceCoverage({...base,newReceipt:{...fresh,gate_evidence:[...fresh.gate_evidence.slice(0,5),fresh.gate_evidence[0]]}}));
reject('reference authority fence',()=>assembleR47SourceCoverage({...base,newReceipt:{...fresh,boundaries:{...fresh.boundaries,reference_registry_ne_current_authority:false}}}));
reject('source is only search result',()=>assembleR47SourceCoverage({...base,newReceipt:{...fresh,gate_evidence:fresh.gate_evidence.map((r,i)=>i===0?{...r,readback_type:'SEARCH_RESULT'}:r)}}));
const injectedR46=async ()=>({results:['DICTATION','ANALYTICS','CHARACTER_RELATIONS','VISUAL','INTERRUPTION_CONTINUITY','RESEARCH'].map(id=>({id})),
hostGatesOpen:18,productiveWrites:0,sixStrands:['DICTATION','ANALYTICS','CHARACTER_RELATIONS','VISUAL','INTERRUPTION_CONTINUITY','RESEARCH'],
observedSunoResult:'NO_CHANGE_REPORT_READBACK',visualGuidanceAction:'LYVRA VISUELLE FÜHRUNG'});
const result=await executeR47SourcedLifecycle({...base,explicitIntent:true,execution:injectedR46});
ck('six preserved',result.results.length===6);
ck('Suno result preserved',result.sunoResult==='NO_CHANGE_REPORT_READBACK');
ck('no invented full rehydration',result.wholeRehydrated===false);
ck('all host gates open',result.hostGatesOpen===18&&!result.nativeHostAcceptance&&!result.aliveHostAcceptance);
ck('return anchors preserved',result.paused.length===3&&result.returnAnchor==='ANALYTICS');
ck('no productive writes',result.productiveWrites===0);
await assert.rejects(()=>executeR47SourcedLifecycle({...base,explicitIntent:false,execution:injectedR46}));n++;
console.log(JSON.stringify({result:'PASS',checks:n,scope:'SOURCE_AND_ISOLATED_DEPENDENCY_INJECTION_ONLY',hostAccepted:false,wholeRehydrated:false,cost:0}));
