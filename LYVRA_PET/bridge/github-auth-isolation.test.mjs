// node --test LYVRA_PET/bridge/github-auth-isolation.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readApprovedRepositoryEvent} from './repository-event-source.mjs';

test('missing credential causes zero outbound requests',async()=>{
 let calls=0;
 const result=await readApprovedRepositoryEvent({fetcher:async()=>{calls++;throw Error('must not fetch');}});
 assert.equal(result.status,'AUTH_NOT_CONFIGURED');
 assert.equal(calls,0);
});

test('token only reaches GitHub REST host, never raw asset host',async()=>{
 const head='a'.repeat(40),requests=[];
 const fetcher=async(url,options)=>{
  requests.push({url,headers:options.headers});
  if(url.includes('/branches/lyvra'))return Response.json({commit:{sha:head}});
  if(url.startsWith('https://raw.githubusercontent.com/'))return Response.json({status:'NONE'});
  throw Error('unexpected network request');
 };
 const result=await readApprovedRepositoryEvent({fetcher,githubToken:'fixture-not-real'});
 assert.equal(result.status,'NO_APPROVED_EVENT');
 assert.equal(requests.length,2);
 assert.equal(requests[0].headers.Authorization,'Bearer fixture-not-real');
 assert.equal(requests[1].headers.Authorization,undefined);
 assert.equal(requests[1].url.startsWith('https://raw.githubusercontent.com/'),true);
});
