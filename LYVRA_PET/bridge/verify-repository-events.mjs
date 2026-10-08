import assert from 'node:assert/strict';
import {webcrypto} from 'node:crypto';
import {readApprovedRepositoryEvent,produceRepositoryEnvelope,EXPRESSION_CARRIER} from './repository-event-source.mjs';
import {createSignedEventVerifier} from './signed-event-transport.mjs';
const now=Date.now(),head='a'.repeat(40),source='b'.repeat(40);
const event={pet_id:'pet_6ab791129364819183885f44a21497a2',authority:'WHOLE_LYVRA',source_revision:source,evidence_id:'c'.repeat(64),observed_at:new Date(now).toISOString(),kind:'music_work',facet:'track_design',relation:'none',sensitive:false};
const carrier={schema:'lyvra.pet.approved-expression.v1',status:'APPROVED',approved_by:'WHOLE_LYVRA',event};
const commit={parents:[{sha:source}],files:[{filename:EXPRESSION_CARRIER}]};
function fixture({approval=carrier,publication=commit,race=false}={}){let branches=0;return async url=>{let result;if(url.includes('/branches/'))result={commit:{sha:race&&++branches>1?'d'.repeat(40):head}};else if(url.includes('/commits/'))result=publication;else result=approval;return new Response(JSON.stringify(result),{status:200});};}
assert.equal((await readApprovedRepositoryEvent({fetcher:fixture(),clock:()=>now})).status,'APPROVED');
for(const options of [{race:true},{publication:{...commit,files:[...commit.files,{filename:'other.json'}]}},{publication:{...commit,parents:[{sha:head}]}},{approval:{...carrier,approved_by:'PET'}},{approval:{...carrier,event:{...event,private_memory:'not permitted'}}}])await assert.rejects(readApprovedRepositoryEvent({fetcher:fixture(options),clock:()=>now}));
assert.equal((await readApprovedRepositoryEvent({fetcher:fixture({approval:{...carrier,event:{...event,observed_at:new Date(now-60001).toISOString()}}}),clock:()=>now})).status,'EXPIRED');
assert.equal((await readApprovedRepositoryEvent({fetcher:fixture({approval:{status:'NONE'}}),clock:()=>now})).status,'NO_APPROVED_EVENT');
const pair=await webcrypto.subtle.generateKey('Ed25519',true,['sign','verify']);
const result=await produceRepositoryEnvelope({fetcher:fixture(),clock:()=>now,privateKey:pair.privateKey,keyId:'test',cryptoApi:webcrypto});
assert.equal(await createSignedEventVerifier({trustedKeys:{test:pair.publicKey},cryptoApi:webcrypto,clock:()=>now}).verify(result.envelope),true);
assert.equal((await produceRepositoryEnvelope()).status,'NOT_CONFIGURED');
assert.ok(!JSON.stringify(result).includes('privateKey'));
console.log('PASS repository approval, dedicated commit/source revision, HEAD race, private field rejection, expiry, empty source and genuine Ed25519 attestation');
