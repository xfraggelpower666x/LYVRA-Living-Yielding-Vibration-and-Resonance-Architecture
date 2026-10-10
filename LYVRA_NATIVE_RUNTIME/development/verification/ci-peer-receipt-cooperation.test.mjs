import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {inspectCheckoutPeerReceipt} from './ci-peer-receipt-cooperation.mjs';
const head=()=>execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();
test('real CLIC R02 local receipt is content-addressed to current checkout',()=>{
 const r=inspectCheckoutPeerReceipt({expectedHead:head()});
 assert.equal(r.contract,'LYVRA_CI_PEER_RECEIPT_COOPERATION_V1');
 assert.equal(r.local_receipt_worktree_matches_commit,true);
 assert.equal(r.local_receipt_blob,execFileSync('git',['rev-parse','HEAD:'+r.local_receipt_path],{encoding:'utf8'}).trim());
});
test('local receipt is not remote authentication or automatic delivery',()=>{
 const r=inspectCheckoutPeerReceipt({expectedHead:head()});
 assert.equal(r.foreign_source_independently_read_back,false);
 assert.equal(r.reciprocal_readback_this_execution,false);
 assert.equal(r.automatic_delivery_verified,false);
 assert.equal(r.host_runtime_verified,false);
});
test('CLIC proposal is not LYVRA adoption or transferred authority',()=>{
 const r=inspectCheckoutPeerReceipt({expectedHead:head()});
 assert.equal(r.semantic_adoption_verified,false);
 assert.equal(r.cooperation.exchanges[0].authority_transfer,false);
 assert.equal(r.cooperation.coverage.authenticated_exchanges,0);
});
test('preserves open channel and no forced facet',()=>{
 const r=inspectCheckoutPeerReceipt({expectedHead:head()});
 assert.equal(r.communication_blocked,false);
 assert.equal(r.facet_activated,false);
 assert.equal(r.cooperation.network_effect.communication_pass_through,true);
});
test('claimed checkout head cannot authenticate receipt',()=>{
 assert.throws(()=>inspectCheckoutPeerReceipt({expectedHead:'0'.repeat(40)}),/CHECKOUT_HEAD_MISMATCH/);
});
