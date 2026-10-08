// LYVRA PET / FREE_ONLY — centralized rolling-window GitHub REST budget.
// A SINGLE Cloudflare SQLite-backed Durable Object instance is used for the entire PET.
// Not a memory, personality or event source. Production migration/binding not yet applied.
export class PetGithubBudget {
 constructor(ctx,env) {
  this.ctx=ctx;
  this.ctx.storage.sql.exec('CREATE TABLE IF NOT EXISTS github_calls (id INTEGER PRIMARY KEY AUTOINCREMENT, at_ms INTEGER NOT NULL)');
 }
 async fetch(request) {
  if(new URL(request.url).pathname!=='/reserve' || request.method!=='POST')return new Response('not found',{status:404});
  try {
   const now=Date.now(),sql=this.ctx.storage.sql;
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
  const isGithubRest=typeof url==='string'&&url.startsWith('https://api.github.com/');
  if(isGithubRest) {
   if(!env?.LYVRA_PET_GITHUB_BUDGET)throw Error('PET_GLOBAL_BUDGET_NOT_CONFIGURED');
   const namespace=env.LYVRA_PET_GITHUB_BUDGET;
   const stub=namespace.get(namespace.idFromName('whole-lyvra-pet-github-v1'));
   const reserved=await stub.fetch('https://budget.internal/reserve',{method:'POST'});
   if(!reserved.ok || (await reserved.json()).allowed!==true)throw Error('PET_GLOBAL_BUDGET_DENIED');
  }
  return underlyingFetch(url,init);
 };
}
