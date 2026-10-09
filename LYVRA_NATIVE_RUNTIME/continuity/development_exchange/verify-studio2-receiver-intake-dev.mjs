import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base=new URL('./',import.meta.url);
const read=async p=>readFile(new URL(p,base));
const [outBytes,payloadBytes,currentBytes,contractBytes]=await Promise.all([
 read('OUTBOUND_TO_STUDIO2_SUNO_WATCH_CURRENT.json'),
 read('STUDIO2_SUNO_WATCH_HANDOFF_PROPOSAL_2026-10-09.json'),
 read('../TRACK_DESIGN_SUNO_STUDIO2_REPO_HANDOFF_CURRENT.json'),
 read('../TRACK_DESIGN_SUNO_STUDIO2_REPO_HANDOFF_CONTRACT.md')
]);
const out=JSON.parse(outBytes),payload=JSON.parse(payloadBytes),current=JSON.parse(currentBytes);
const digest=b=>createHash('sha256').update(b).digest('hex');
assert.equal(out.receiver,'EXISTING_LYVRA_STUDIO_2');
assert.equal(out.payload_path,'LYVRA_NATIVE_RUNTIME/continuity/development_exchange/STUDIO2_SUNO_WATCH_HANDOFF_PROPOSAL_2026-10-09.json');
assert.equal(out.status,'QUEUED_DEV_NOT_DELIVERED');
assert.equal(payload.status,'PREPARED_NOT_DELIVERED');
assert.equal(out.native_existing_handoff,current.channel.current_path);
assert.equal(current.channel.shared_active_work_unit,false);
assert.ok(contractBytes.toString().includes('GLOBAL_LAST_WORKSPACE_WINS = FORBIDDEN'));
assert.equal(out.receipt.receiver_current_sha,null);
assert.equal(out.receipt.verified_by_receiver,false);
assert.equal(out.receipt.adopted,false);
assert.equal(out.routing.foreign_mutation,false);
assert.equal(payload.findings.rule_promotion,false);
assert.equal(payload.rename.implemented,false);
const report=Object.freeze({
 status:'INTAKE_PREFLIGHT_PASS_NOT_RECEIVED',
 message_id:out.message_id,receiver:out.receiver,
 outbox_sha256:digest(outBytes),payload_sha256:digest(payloadBytes),
 reference_native_current_sha256:digest(currentBytes),
 receiver_acknowledged:false,adopted:false,
 next_gate:'NATIVE_STUDIO2_SCOPED_RECEIVER_READBACK_AND_ACK'
});
assert.match(report.outbox_sha256,/^[a-f0-9]{64}$/);
assert.match(report.payload_sha256,/^[a-f0-9]{64}$/);
const gate=JSON.parse(await read('STUDIO2_RECEIVER_DECISION_CONTRACT_2026-10-09.json'));
assert.equal(gate.message_id,out.message_id);
assert.equal(gate.actual_decision.state,'PREFLIGHT_VALIDATED');
assert.equal(gate.actual_decision.native_receiver_receipt,null);
assert.equal(gate.actual_decision.native_adoption_receipt,null);
assert.equal(gate.assertions.preflight_is_receipt,false);
assert.equal(gate.assertions.receipt_is_adoption,false);
assert.equal(gate.assertions.production_released,false);
for(const evidence of ['outbox_blob_sha','payload_blob_sha','receiving_current_sha','receiver_identity','explicit_receiver_action','readback_sha'])assert.ok(gate.mandatory_proof.includes(evidence));
const life=JSON.parse(await readFile(new URL('../../facets/studio2/development/SEMANTIC_INBOX_SUB_LIFECIRCLE_CANDIDATE.json',import.meta.url)));
assert.equal(life.status,'DEV_CANDIDATE_NOT_PRODUCTIVE');
assert.equal(life.facet_id,'SUNO_STUDIO_2');
assert.equal(life.root_authority,'LYVRA_ONLY');
assert.equal(life.implementation.runtime_wired,false);
assert.equal(life.implementation.receiver_acknowledged,false);
assert.equal(life.implementation.productive_pointer_changed,false);
assert.ok(life.stage_order.indexOf('EXPLICIT_NATIVE_RECEIPT_WRITE_READBACK')<life.stage_order.indexOf('OPTIONAL_APPROVED_NATIVE_ADOPTION'));
assert.ok(life.stage_order.indexOf('PARENT_WHOLE_CURRENT_VERIFIED')<life.stage_order.indexOf('INBOX_SOURCE_READ'));
assert.equal(life.gates.receipt_ne_adoption,true);
console.log(JSON.stringify(report));
