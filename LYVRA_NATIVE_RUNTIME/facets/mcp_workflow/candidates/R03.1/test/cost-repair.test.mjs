import test from 'node:test';import assert from 'node:assert/strict';import {assessCost} from '../runtime/cost-governance.mjs';import {costPolicy} from '../runtime/guards.mjs';
for(const op of ['LOCAL_DESIGN','LOCAL_CODE','OFFLINE_TEST','DOCUMENTATION'])test(op+' without billing access',()=>assert.equal(assessCost(op).allowed,true));
test('publication without unrelated billing evidence',()=>assert.equal(assessCost('SOURCE_PUBLICATION',{sourceOnly:true,meteredSideEffectsExcluded:true}).allowed,true));
test('publication with uncertain preview costs blocked',()=>assert.equal(assessCost('SOURCE_PUBLICATION',{sourceOnly:true}).allowed,false));
test('unknown paid operation blocked',()=>assert.equal(assessCost('PAID_API').allowed,false));
const now=Date.now(),base={scope:'LYVRA_MCP_WORKFLOW_READ_ONLY',zeroAdditionalCost:true,evidenceVersion:2,operation:'REMOTE_READBACK',operationBound:true,entitlementVerified:true,noAdditionalCharge:true,evidenceRef:'fixture only',issuedAt:now-100,expiresAt:now+1000,dailyJobs:3};
test('operation-specific remote proof accepted without unrelated cloudflare billing flag',()=>assert.equal(costPolicy(JSON.stringify(base),now).dailyJobs,3));
for(const [k,v] of Object.entries({operation:'SOURCE_PUBLICATION',operationBound:false,entitlementVerified:false,noAdditionalCharge:false,zeroAdditionalCost:false,evidenceRef:'',expiresAt:now-1}))test('remote refuses '+k,()=>assert.equal(costPolicy(JSON.stringify({...base,[k]:v}),now),null));
