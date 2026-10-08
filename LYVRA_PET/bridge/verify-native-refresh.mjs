import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const worker=await readFile(new URL('../worker/src/index.js',import.meta.url),'utf8');
const block=worker.slice(worker.indexOf('let nativeClosed=false'),worker.indexOf('</script></body></html>'));
const configured=block.replace('__LYVRA_NATIVE_TRUST__',JSON.stringify({key_id:'test',spki:'AQ=='}));
let resolveResponse,accepts=0,resets=0;
const handlers={},status={textContent:''},selector={value:'whole'};
const scope={document:{getElementById(id){return id==='native-status'?status:id==='facet'?selector:{addEventListener(type,fn){handlers[type]=fn;}};}},crypto:{subtle:{importKey:async()=>({})}},atob:()=>String.fromCharCode(1),fetch:()=>new Promise(resolve=>{resolveResponse=resolve;}),window:{lyvraPetExpression:{connectSignedEvidence(){return {accept:async()=>{accepts++;return true;},reset(){resets++;}};}},addEventListener(type,fn){handlers[type]=fn;}},evidenceController:null,effects:{dispose(){}}};
vm.createContext(scope);vm.runInContext(configured,scope);await new Promise(r=>setImmediate(r));
// A real pending HTTP response must not override a subsequent manual context.
vm.runInContext('nativeTicket++',scope);
resolveResponse({ok:true,json:async()=>({status:'APPROVED',envelope:{event:{source_revision:'a'.repeat(40),facet:'track_design'}}})});
await new Promise(r=>setImmediate(r));assert.equal(accepts,0);
handlers.click();await new Promise(r=>setImmediate(r));handlers.pagehide();
resolveResponse({ok:true,json:async()=>({status:'APPROVED',envelope:{event:{source_revision:'a'.repeat(40),facet:'track_design'}}})});await new Promise(r=>setImmediate(r));assert.equal(accepts,0);
console.log('PASS pending native fetch cannot override a manual context or a closed page');

// The actual browser refresh block must respect the server's retry deadline.
let httpCalls=0;
const cooldownHandlers={},cooldownStatus={textContent:''};
const cooldownScope={...scope,document:{getElementById(id){return id==='native-status'?cooldownStatus:{value:'whole',addEventListener(type,fn){cooldownHandlers[type]=fn;}};}},fetch:async()=>{httpCalls++;return {ok:false,json:async()=>({status:'SOURCE_UNAVAILABLE',diagnostic:{category:'GITHUB_PRIMARY_RATE_LIMIT'},retry_at:new Date(Date.now()+120000).toISOString()})};},window:{...scope.window,addEventListener(type,fn){cooldownHandlers[type]=fn;}}};
vm.createContext(cooldownScope);vm.runInContext(configured,cooldownScope);await new Promise(r=>setImmediate(r));
assert.equal(httpCalls,1);cooldownHandlers.click();await new Promise(r=>setImmediate(r));assert.equal(httpCalls,1,'browser must not fetch before the upstream deadline');
vm.runInContext('nativeRetryAt=0',cooldownScope);cooldownHandlers.click();await new Promise(r=>setImmediate(r));assert.equal(httpCalls,2);
console.log('PASS actual browser cooldown prevents repeated HTTP calls and allows refresh after deadline');
