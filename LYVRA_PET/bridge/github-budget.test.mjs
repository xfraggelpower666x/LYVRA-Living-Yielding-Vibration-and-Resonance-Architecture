// node --test LYVRA_PET/bridge/github-budget.test.mjs
// Tests use a deterministic in-memory emulation of the SQLite calls. Not a Cloudflare live test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {PetGithubBudget,petBudgetedFetcher} from './github-budget.mjs';

function harness(){
 const rows=[];let cooldownUntil=0;
 const sql={exec(statement,...values){
  if(statement.startsWith('CREATE TABLE'))return {};
  if(statement.startsWith('DELETE FROM')){for(let i=rows.length-1;i>=0;i--)if(rows[i]<=values[0])rows.splice(i,1);return {};}
  if(statement.startsWith('SELECT COUNT'))return {one:()=>({total:rows.length})};
  if(statement.startsWith('SELECT until_ms'))return {toArray:()=>cooldownUntil?[{until_ms:cooldownUntil}]:[]};
  if(statement.startsWith('INSERT OR REPLACE INTO github_cooldown')){cooldownUntil=values[0];return {};}
  if(statement.startsWith('INSERT INTO')){rows.push(values[0]);return {};}
  throw Error('unexpected query');
 }};
 const instance=new PetGithubBudget({storage:{sql}},{});
 return {instance,rows};
}

test('rolling window reserves at most 300 REST calls',async()=>{
 const {instance,rows}=harness();
 for(let n=0;n<300;n++)assert.equal((await instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}))).status,200);
 assert.equal(rows.length,300);
 const denied=await instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}));
 assert.equal(denied.status,429);
 assert.equal(rows.length,300);
});
test('global budget missing: deny before upstream fetch',async()=>{
 let calls=0;
 const fetcher=petBudgetedFetcher({},async()=>{calls++;return new Response('upstream');});
 await assert.rejects(()=>fetcher('https://api.github.com/repos/example/repo'),/NOT_CONFIGURED/);
 assert.equal(calls,0);
});
test('budget denial: deny before upstream fetch',async()=>{
 let calls=0;
 const ns={idFromName:n=>n,get:()=>({fetch:async()=>Response.json({allowed:false},{status:429})})};
 const fetcher=petBudgetedFetcher({LYVRA_PET_GITHUB_BUDGET:ns},async()=>{calls++;return new Response('upstream');});
 await assert.rejects(()=>fetcher('https://api.github.com/repos/example/repo'),/BUDGET_DENIED/);
 assert.equal(calls,0);
});
test('successful reservation permits exactly one upstream request',async()=>{
 let calls=0,reservations=0;
 const ns={idFromName:n=>n,get:()=>({fetch:async()=>{reservations++;return Response.json({allowed:true});}})};
 const fetcher=petBudgetedFetcher({LYVRA_PET_GITHUB_BUDGET:ns},async()=>{calls++;return new Response('ok');});
 assert.equal((await fetcher('https://api.github.com/repos/example/repo')).status,200);
 assert.equal(reservations,1);assert.equal(calls,1);
});
test('non-REST raw assets do not consume the REST budget',async()=>{
 let calls=0;
 const fetcher=petBudgetedFetcher({},async()=>{calls++;return new Response('asset');});
 await fetcher('https://raw.githubusercontent.com/owner/repo/ref/asset.png');
 assert.equal(calls,1);
});

test('301 concurrent reservations never exceed 300',async()=>{const {instance,rows}=harness();const responses=await Promise.all(Array.from({length:301},()=>instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}))));assert.equal(responses.filter(x=>x.status===200).length,300);assert.equal(responses.filter(x=>x.status===429).length,1);assert.equal(rows.length,300);});
test('invalid method cannot reserve budget',async()=>{const {instance,rows}=harness();assert.equal((await instance.fetch(new Request('https://budget.internal/reserve'))).status,404);assert.equal(rows.length,0);});

test('expired reservations are released after the rolling hour',async()=>{
 const {instance,rows}=harness(),actualNow=Date.now;
 try {
  Date.now=()=>10000000;
  for(let i=0;i<300;i++)assert.equal((await instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}))).status,200);
  Date.now=()=>13600001;
  assert.equal((await instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}))).status,200);
  assert.equal(rows.length,1);
 } finally {Date.now=actualNow;}
});
test('broken SQLite storage fails closed with no reservation',async()=>{
 const {instance}=harness();
 instance.ctx.storage.sql.exec=()=>{throw Error('storage down')};
 const response=await instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}));
 assert.equal(response.status,503);
 assert.equal((await response.json()).allowed,false);
});

test('Request objects cannot bypass the GitHub REST budget',async()=>{
 let calls=0;const fetcher=petBudgetedFetcher({},async()=>{calls++;return new Response('unexpected')});
 await assert.rejects(()=>fetcher(new Request('https://api.github.com/repos/example/repo')),/NOT_CONFIGURED/);
 assert.equal(calls,0);
});
test('URL objects cannot bypass the GitHub REST budget',async()=>{
 let calls=0;const fetcher=petBudgetedFetcher({},async()=>{calls++;return new Response('unexpected')});
 await assert.rejects(()=>fetcher(new URL('https://api.github.com/repos/example/repo')),/NOT_CONFIGURED/);
 assert.equal(calls,0);
});
test('other hosts do not masquerade as GitHub',async()=>{
 let calls=0;const fetcher=petBudgetedFetcher({},async()=>{calls++;return new Response('ok')});
 const response=await fetcher('https://api.github.com.evil.example/repos/example/repo');
 assert.equal(response.status,200);assert.equal(calls,1);
});

test('persistent cooldown denies reservations across calls',async()=>{
 const {instance,rows}=harness(),now=Date.now();
 const saved=await instance.fetch(new Request('https://budget.internal/cooldown',{method:'POST',body:JSON.stringify({until_ms:now+120000})}));
 assert.equal(saved.status,200);
 const blocked=await instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}));
 assert.equal(blocked.status,429);assert.equal(rows.length,0);
 assert.equal((await blocked.json()).reason,'PET_GITHUB_COOLDOWN');
});
test('invalid cooldown cannot modify shared quota',async()=>{
 const {instance,rows}=harness();
 const res=await instance.fetch(new Request('https://budget.internal/cooldown',{method:'POST',body:JSON.stringify({until_ms:Date.now()+172800000})}));
 assert.equal(res.status,400);
 assert.equal((await instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}))).status,200);
 assert.equal(rows.length,1);
});

test('all GitHub REST endpoints require a budget reservation',async()=>{
 let upstream=0;const fetcher=petBudgetedFetcher({},async()=>{upstream++;return new Response('unexpected')});
 await assert.rejects(()=>fetcher('https://api.github.com/rate_limit'),/NOT_CONFIGURED/);
 assert.equal(upstream,0);
});
test('insecure GitHub API URL cannot be used',async()=>{
 let upstream=0;const fetcher=petBudgetedFetcher({},async()=>{upstream++;return new Response('unexpected')});
 await assert.rejects(()=>fetcher('http://api.github.com/repos/example/repo'),/INSECURE_GITHUB_REQUEST/);
 assert.equal(upstream,0);
});
test('unsupported fetch targets fail closed',async()=>{
 let upstream=0;const fetcher=petBudgetedFetcher({},async()=>{upstream++;return new Response('unexpected')});
 await assert.rejects(()=>fetcher({url:'https://api.github.com/repos/example/repo'}),/INVALID_FETCH_TARGET/);
 assert.equal(upstream,0);
});

test('budget UI status is read-only and cannot consume quota',async()=>{
 const {instance,rows}=harness();
 const request=new Request('https://budget.internal/status');
 for(let n=0;n<5;n++){const response=await instance.fetch(request);assert.equal(response.status,200);const result=await response.json();assert.equal(result.status,'OK');assert.equal(result.used,0);assert.equal(result.remaining,300);}
 assert.equal(rows.length,0);
});

test('status reports actual usage without reserving an API call',async()=>{
 const {instance,rows}=harness();
 await instance.fetch(new Request('https://budget.internal/reserve',{method:'POST'}));
 const before=rows.length;
 const response=await instance.fetch(new Request('https://budget.internal/status'));
 assert.equal(response.status,200);
 const state=await response.json();
 assert.equal(state.status,'OK');assert.equal(state.limit,300);assert.equal(state.used,1);assert.equal(state.remaining,299);
 assert.equal(state.window_seconds,3600);assert.equal(rows.length,before);
});
test('status reveals cooldown deadline but not secret contents',async()=>{
 const {instance}=harness(),until=Date.now()+90000;
 const saved=await instance.fetch(new Request('https://budget.internal/cooldown',{method:'POST',body:JSON.stringify({until_ms:until})}));
 assert.equal(saved.status,200);
 const response=await instance.fetch(new Request('https://budget.internal/status'));
 const state=await response.json();assert.equal(state.status,'OK');
 assert.equal(state.cooldown_until,new Date(until).toISOString());
 assert.deepEqual(Object.keys(state).sort(),['cooldown_until','limit','remaining','status','used','window_seconds'].sort());
});
