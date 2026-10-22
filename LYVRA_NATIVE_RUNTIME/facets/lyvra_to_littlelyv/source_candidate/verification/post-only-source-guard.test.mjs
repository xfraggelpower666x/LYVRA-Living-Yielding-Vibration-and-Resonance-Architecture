import test from 'node:test';
import assert from 'node:assert/strict';
import {FOLDER, interpretDirectTrigger, mayAct, classifyWrite} from './mail-evidence.mjs';
import {gateSend, eventIdentity} from './provider-cas-model.mjs';

test('public folder test fixture uses a synthetic identifier', () => {
 assert.equal(FOLDER, 'SYNTHETIC_TEST_MAILBOX_ID_NO_REAL_LOCATION');
});
test('trigger text copied inside a letter remains inert', () => {
 assert.equal(interpretDirectTrigger('LYVRA TO LITTLELYV UPDATE',{directUserMessage:false,registered:true}), 'INERT_SOURCE_TEXT');
});
test('neither simulated policy nor missing authorization grants a delivery write', () => {
 assert.equal(mayAct({wholeVerified:true,registered:true,authorization:false,independentWriteHost:true,providerIdentityAuthenticated:true,actualReadback:true}), false);
 assert.equal(gateSend({trustState:'HOST_VERIFIED',actorDelegation:'HOST_VERIFIED',hostWriteCapability:true,wholeAuthority:true,registeredFacet:true,explicitScope:true}).allowed, false);
});
test('claimed provider observations cannot assert delivery', () => {
 const evidence={origin:'TRUSTED_PROVIDER_ADAPTER',state:'CONFIRMED',provider_document_id:'synthetic-doc-1234',expected_parent:FOLDER,observed_parent:FOLDER,independent_content_readback:true,independent_parent_readback:true,content_digest:'sha256:'+('a'.repeat(64)),provider_revision:'synthetic',correlation_event_id:'synthetic-event-12'};
 assert.equal(classifyWrite(evidence).deliveryVerified, false);
});
test('structured dedupe identity cannot conflate colon-delimited components', () => {
 const hash='sha256:'+('b'.repeat(64));
 assert.notEqual(eventIdentity({source_document_id:'a:b',source_revision_or_digest:hash,recipient_lineage:'d'}),eventIdentity({source_document_id:'a',source_revision_or_digest:hash,recipient_lineage:'b:d'}));
});
