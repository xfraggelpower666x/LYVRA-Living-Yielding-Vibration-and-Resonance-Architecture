import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {readApprovedRepositoryEvent,produceRepositoryEnvelope,EXPRESSION_CARRIER,publicNativeSourceFailure} from './repository-event-source.mjs';
import {createSignedEventVerifier} from './signed-event-transport.mjs';
const now=Date.now(),head='a'.repeat(40),source='b'.repeat(40);
const event={pet_id:'pet_6ab791129364819183885f44a21497a2',authority:'WHOLE_LYVRA',source_revision:source,evidence_id:'c'.repeat(64),observed_at:new Date(now).toISOString(),kind:'music_work',facet:'track_design',relation:'none',sensitive:false};
const carrier={schema:'lyvra.pet.approved-expression.v1',status:'APPROVED',approved_by:'WHOLE_LYVRA',event};
const commit={parents:[{sha:source}],files:[{filename:EXPRESSION_CARRIER}]};
function fixture({approval=carrier,publication=commit,race=false}={}){let branches=0;return async url=>{let result;if(url.includes('/branches/'))result={commit:{sha:race&&++branches>1?'d'.repeat(40):head}};else if(url.includes('/commits/'))result=publication;else result=approval;return new Response(JSON.stringify(result),{status:200});};}
assert.equal((await readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:fixture(),clock:()=>now})).status,'APPROVED');
for(const options of [{race:true},{publication:{...commit,files:[...commit.files,{filename:'other.json'}]}},{publication:{...commit,parents:[{sha:head}]}},{approval:{...carrier,approved_by:'PET'}},{approval:{...carrier,event:{...event,private_memory:'not permitted'}}}])await assert.rejects(readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:fixture(options),clock:()=>now}));
assert.equal((await readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:fixture({approval:{...carrier,event:{...event,observed_at:new Date(now-60001).toISOString()}}}),clock:()=>now})).status,'EXPIRED');
assert.equal((await readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:fixture({approval:{status:'NONE'}}),clock:()=>now})).status,'NO_APPROVED_EVENT');
const pair=await webcrypto.subtle.generateKey('Ed25519',true,['sign','verify']);
const result=await produceRepositoryEnvelope({githubToken:'CI_FIXTURE_ONLY',fetcher:fixture(),clock:()=>now,privateKey:pair.privateKey,keyId:'test',cryptoApi:webcrypto});
assert.equal(await createSignedEventVerifier({trustedKeys:{test:pair.publicKey},cryptoApi:webcrypto,clock:()=>now}).verify(result.envelope),true);
assert.equal((await produceRepositoryEnvelope()).status,'NOT_CONFIGURED');
assert.ok(!JSON.stringify(result).includes('privateKey'));
console.log('PASS repository approval, dedicated commit/source revision, HEAD race, private field rejection, expiry, empty source and genuine Ed25519 attestation');

let requests=0,time=now;
const reset=Math.floor(now/1000)+120;
const limited=async()=>{requests++;return new Response(JSON.stringify({message:'API rate limit exceeded; private text must stay private'}),{status:403,headers:{'x-ratelimit-remaining':'0','x-ratelimit-reset':String(reset),'x-secret':'NEVER_EXPOSE'}});};
let failure;try{await readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:limited,clock:()=>time});}catch(e){failure=publicNativeSourceFailure(e);}
assert.equal(failure.diagnostic.category,'GITHUB_PRIMARY_RATE_LIMIT');
assert.equal(failure.diagnostic.rate_limit_remaining,0);
assert.equal(Date.parse(failure.retry_at),reset*1000+1000);
assert.ok(!JSON.stringify(failure).includes('private text')&&!JSON.stringify(failure).includes('NEVER_EXPOSE'));
await assert.rejects(readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:limited,clock:()=>time}));assert.equal(requests,1,'cooldown must not issue an upstream retry');
time=Date.parse(failure.retry_at);await assert.rejects(readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:limited,clock:()=>time}));assert.equal(requests,2,'a request is permitted after the deadline');
const secondary=async()=>new Response(JSON.stringify({message:'You have exceeded a secondary rate limit.'}),{status:403,headers:{'retry-after':'90','x-ratelimit-remaining':'52'}});
try{await readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:secondary,clock:()=>now});}catch(e){failure=publicNativeSourceFailure(e);}
assert.equal(failure.diagnostic.category,'GITHUB_SECONDARY_RATE_LIMIT');assert.equal(Date.parse(failure.retry_at),now+90000);
const forbidden=async()=>new Response('Forbidden',{status:403});
try{await readApprovedRepositoryEvent({githubToken:'CI_FIXTURE_ONLY',fetcher:forbidden,clock:()=>now});}catch(e){failure=publicNativeSourceFailure(e);}
assert.equal(failure.diagnostic.category,'GITHUB_FORBIDDEN');assert.ok(!('rate_limit_remaining' in failure.diagnostic));
console.log('PASS primary/secondary/unknown 403 diagnosis, numeric-only public evidence, cooldown without retries and recovery after deadline');
