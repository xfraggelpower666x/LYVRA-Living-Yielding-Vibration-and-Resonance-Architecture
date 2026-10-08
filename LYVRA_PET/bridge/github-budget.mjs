// LYVRA PET / FREE_ONLY — centralized rolling-window GitHub REST budget.
// A SINGLE Cloudflare SQLite-backed Durable Object instance is used for the entire PET.
// Not a memory, personality or event source. Production migration/binding not yet applied.
export class PetGithubBudget {
 constructor(ctx,env) {
  this.ctx=ctx;
  this.ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS github_calls (id INTEGER PRIMARY KEY AUTOINCREMENT, at_ms INTEGER NOT NULL)');
  this.ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS github_cooldown (id INTEGER PRIMARY KEY CHECK(id=1), until_ms INTEGER NOT NULL)');
 }
 async fetch(request) {
  const path=new URL(request.url).pathname;
  if(path==='/status'&&request.method==='GET'){
   try{const now=Date.now(),sql=this.ctx.storage.sql;const used=sql.exec('SELECT COUNT(*) AS total FROM github_calls WHERE at_ms > ?',now-3600000).one().total;const cooldown_until=sql.exec('SELECT until_ms FROM github_cooldown WHERE id=1').toArray()[0]?.until_ms||0;return Response.json({status:'OK',limit:300,used,remaining:Math.max(0,300-used),window_seconds:3600,cooldown_until:cooldown_until>now?new Date(cooldown_until).toISOString():null},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({status:'UNAVAILABLE'},{status:503})}
  }
  if(request.method!=='POST'||!['/reserve','/cooldown'].includes(path))return new Response('not found',{status:404});
  try {
   const now=Date.now(),sql=this.ctx.storage.sql;
   if(path==='/cooldown'){
    const payload=await request.json().catch(()=>null);
    if(!payload||!Number.isSafeInteger(payload.until_ms)||payload.until_ms<=now||payload.until_ms>now+86400000)return Response.json({allowed:false,reason:'INVALID_COOLDOWN'},{status:400});
    const previous=sql.exec('SELECT until_ms FROM github_cooldown WHERE id=1').toArray()[0]?.until_ms||0;
    sql.exec('INSERT OR REPLACE INTO github_cooldown(id,until_ms) VALUES (1,?)',Math.max(previous,payload.until_ms));
    return Response.json({ok:true});
   }
   const cooldownUntil=sql.exec('SELECT until_ms FROM github_cooldown WHERE id=1').toArray()[0]?.until_ms||0;
   if(cooldownUntil>now)return Response.json({allowed:false,reason:'PET_GITHUB_COOLDOWN',retry_at_ms:cooldownUntil},{status:429});
   // Synchronous statements: serialized inside a single Durable Object instance.
   sql.exec('DELETE FROM github_calls WHERE at_ms <= ?',now-3600000);
   const count=sql.exec('SELECT COUNT(*) AS total FROM github_calls').one().total;
   if(count>=300)return Response.json({allowed:false,reason:'PET_HOURLY_BUDGET_EXHAUSTED'},{status:429});
   sql.exec('INSERT INTO github_calls (at_ms) VALUES (?)',now);
   return Response.json({allowed:true});
  } catch {
   return Response.json({allowed:false,reason:'BUDGET_STORAGE_UNAVAILABLE'},{status:503});
  }
 }
}
export function petBudgetedFetcher(env,underlyingFetch=fetch) {
 return async (url,init={})=>{
  const parsed=typeof url==='string'?new URL(url):url instanceof URL?url:url instanceof Request?new URL(url.url):null;
  if(!parsed)throw Error('PET_INVALID_FETCH_TARGET');
  if(parsed.hostname==='api.github.com'&&parsed.protocol!=='https:')throw Error('PET_INSECURE_GITHUB_REQUEST');
  const isGithubRest=parsed?.protocol==='https:'&&parsed.hostname==='api.github.com'&&parsed.port==='';
  if(isGithubRest) {
   if(!env?.LYVRA_PET_GITHUB_BUDGET)throw Error('PET_GLOBAL_BUDGET_NOT_CONFIGURED');
   const namespace=env.LYVRA_PET_GITHUB_BUDGET;
   const stub=namespace.get(namespace.idFromName('whole-lyvra-pet-github-v1'));
   const reserved=await stub.fetch('https://budget.internal/reserve',{method:'POST'});
   if(!reserved.ok || (await reserved.json()).allowed!==true)throw Error('PET_GLOBAL_BUDGET_DENIED');
  }
  const upstream=await underlyingFetch(url,init);
  if(isGithubRest&&(upstream.status===403||upstream.status===429)){
   const now=Date.now(),reset=Number(upstream.headers.get('x-ratelimit-reset')),remaining=Number(upstream.headers.get('x-ratelimit-remaining')),retry=Number(upstream.headers.get('retry-after'));
   let until=now+60000;
   if(upstream.headers.has('retry-after')&&Number.isFinite(retry)&&retry>=0)until=Math.max(until,now+retry*1000);
   if(upstream.headers.has('x-ratelimit-remaining')&&remaining===0&&Number.isFinite(reset)&&reset>0)until=Math.max(until,reset*1000+1000);
   until=Math.min(until,now+86400000);
   try {
    const namespace=env.LYVRA_PET_GITHUB_BUDGET,stub=namespace.get(namespace.idFromName('whole-lyvra-pet-github-v1'));
    const recorded=await stub.fetch('https://budget.internal/cooldown',{method:'POST',body:JSON.stringify({until_ms:Math.ceil(until)})});
    if(!recorded.ok)throw Error('PET_COOLDOWN_RECORD_FAILED');
   } catch { throw Error('PET_COOLDOWN_RECORD_FAILED'); }
  }
  return upstream;
 };
}
