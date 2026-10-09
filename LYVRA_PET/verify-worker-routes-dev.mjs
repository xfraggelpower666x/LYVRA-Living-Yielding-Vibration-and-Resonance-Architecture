import assert from 'node:assert/strict';
import worker from './worker/build/worker-bundle.mjs';
const request=(pathname,method='GET')=>new Request('https://lyvra-pet-read-staging.digital-underground-connected.workers.dev'+pathname,{method});
const fakeBudget={fetch:async()=>Response.json({status:'OK',used:7,remaining:293,limit:300,window_seconds:3600,cooldown_until:null})};
const fakeNamespace={idFromName:name=>{assert.equal(name,'whole-lyvra-pet-github-v1');return name},get:()=>fakeBudget};
let res=await worker.fetch(request('/budget-status'),{LYVRA_PET_GITHUB_BUDGET:fakeNamespace});
assert.equal(res.status,200);
assert.deepEqual((({status,used,remaining,limit,window_seconds})=>({status,used,remaining,limit,window_seconds}))(await res.json()),{status:'OK',used:7,remaining:293,limit:300,window_seconds:3600});
res=await worker.fetch(request('/budget-status'),{});
assert.equal(res.status,503);
assert.equal((await res.json()).status,'UNAVAILABLE');
res=await worker.fetch(request('/budget-status','POST'),{LYVRA_PET_GITHUB_BUDGET:fakeNamespace});
assert.equal(res.status,405);
res=await worker.fetch(request('/pet'),{});
assert.equal(res.status,200);
const ui=await res.text();
assert.match(ui,/fetch\("\/native-expression"/);
assert.match(ui,/fetch\("\/budget-status"/);
assert.doesNotMatch(ui,/fetch\("https:\/\/lyvra-pet-plugin-ui\.digital-underground-connected\.workers\.dev\/native-expression"/);
res=await worker.fetch(request('/native-expression'),{});
assert.equal(res.status,200);
assert.notEqual((await res.json()).status,'APPROVED');
for(const hostname of ['lyvra-pet-read-staging.digital-underground-connected.workers.dev','lyvra.pet.alive.666soundsdesign-broadcaster.com','lyvra-pet-plugin-ui.digital-underground-connected.workers.dev']){
 const response=await worker.fetch(new Request('https://'+hostname+'/pet'),{});
 assert.equal(response.status,200);
 const html=await response.text();
 assert.ok(html.includes('https://'+hostname+'/asset/pet-logo.png'));
 assert.ok(html.includes('https://'+hostname+'/asset/spritesheet-extended.png'));
 assert.ok(!html.includes('__LYVRA_PET_ORIGIN__'));
}
for(const [host,service] of [['lyvra-pet-read-staging.digital-underground-connected.workers.dev','lyvra-pet-read-staging'],['lyvra.pet.alive.666soundsdesign-broadcaster.com','lyvra-pet-public'],['lyvra-pet-plugin-ui.digital-underground-connected.workers.dev','lyvra-pet-plugin-ui']]){
 const health=await worker.fetch(new Request('https://'+host+'/health'),{});
 assert.equal(health.status,200);
 assert.equal((await health.json()).service,service);
}
const foreign=await worker.fetch(new Request('https://untrusted.example.invalid/pet'),{});
assert.equal(foreign.status,421);
assert.equal((await foreign.json()).status,'UNRECOGNIZED_PET_HOST');
console.log('PASS isolated routes, budget status 7/300, missing binding fail closed, method guard, same-origin browser, unsigned native fails closed');
