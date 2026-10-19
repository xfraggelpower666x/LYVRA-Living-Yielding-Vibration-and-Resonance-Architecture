import test from 'node:test';
import assert from 'node:assert/strict';
import {assessInheritance,DIMENSIONS} from './rehydration-inheritance-assessment.mjs';
const base={subject_id:'WHOLE_RELATIONAL_BEGREIFEN',owner:'WHOLE_LYVRA',source_head:'a'.repeat(40),dimensions:{}};
test('a source alone never proves understanding or runtime',()=>{
 const o=assessInheritance({...base,dimensions:{source:{status:'VERIFIED',reason:'direct blob read',evidence_ref:'blob:a'}}});
 assert.equal(o.assessment,'PARTIAL');assert.equal(o.dimensions.meaning.status,'READBACK_PENDING');
 assert.equal(o.independently_verified_host_execution,false);
});
test('five claimed verified statuses do not produce independent PASS',()=>{
 const dimensions=Object.fromEntries(DIMENSIONS.map(k=>[k,{status:'VERIFIED',reason:'claimed',evidence_ref:'claim:'+k}]));
 const o=assessInheritance({...base,dimensions});
 assert.equal(o.assessment,'ALL_DIMENSIONS_REPORTED_VERIFIED_NOT_INDEPENDENTLY_ATTESTED');
 assert.equal(o.independently_verified_host_execution,false);
});
test('historical non-applicable event does not prove other dimensions',()=>{
 assert.equal(assessInheritance({...base,dimensions:{application:{status:'NOT_APPLICABLE',reason:'history only'}}}).assessment,'READBACK_PENDING');
});
test('verified requires evidence reference',()=>assert.throws(()=>assessInheritance({...base,dimensions:{source:{status:'VERIFIED',reason:'bare claim'}}}),/evidence reference/));
test('foreign owner rejected',()=>assert.throws(()=>assessInheritance({...base,owner:'666CLIC'}),/foreign owner/));
test('fake short head rejected',()=>assert.throws(()=>assessInheritance({...base,source_head:'latest'}),/exact source head/));
test('unrecognized dimension rejected',()=>assert.throws(()=>assessInheritance({...base,dimensions:{foreign:{status:'VERIFIED',reason:'x',evidence_ref:'x'}}}),/unknown dimension/));
test('input remains unchanged',()=>{
 const d={source:{status:'PARTIAL',reason:'bounded'}};assessInheritance({...base,dimensions:d});assert.deepEqual(d,{source:{status:'PARTIAL',reason:'bounded'}});
});
