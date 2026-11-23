import test from 'node:test';import assert from 'node:assert/strict';import {EvidenceLedger,EVIDENCE_LEDGER_BOUNDARY} from '../evidence-ledger.mjs';
const ev=o=>({event_id:'event-0001',subject_id:'capability-01',origin_system:'666STREAM',evidence_class:'SOURCE_OBSERVATION',locator:'repo:commit:path',...o});
test('records provenance with local digest',()=>{const l=new EvidenceLedger();assert.equal(l.append(ev()).accepted,true);assert.equal(l.verifyLocalIntegrity().valid,true)});
test('rejects duplicate ids and missing provenance',()=>{const l=new EvidenceLedger();l.append(ev());assert.equal(l.append(ev()).code,'DUPLICATE_EVENT_ID');assert.equal(new EvidenceLedger().append({event_id:'x'}).code,'PROVENANCE_REQUIRED')});
test('rejects authority promotion claims',()=>{assert.equal(new EvidenceLedger().append(ev({claimed_stage:'HOST_VERIFIED'})).code,'EVIDENCE_CANNOT_PROMOTE_AUTHORITY')});
test('rejects secrets and raw content',()=>{assert.equal(new EvidenceLedger().append(ev({token:'secret'})).code,'RAW_CONTENT_OR_SECRET_FORBIDDEN')});
test('does not claim durable persistence or peer authenticity',()=>{assert.equal(EVIDENCE_LEDGER_BOUNDARY.durable_storage,false);assert.equal(EVIDENCE_LEDGER_BOUNDARY.authenticates_peer,false);assert.equal(EVIDENCE_LEDGER_BOUNDARY.promotes_evidence,false)});
test('returned copies cannot mutate the stored ledger',()=>{const l=new EvidenceLedger();l.append(ev());const x=l.list();x[0].note='tampered';assert.equal(l.verifyLocalIntegrity().valid,true)});
