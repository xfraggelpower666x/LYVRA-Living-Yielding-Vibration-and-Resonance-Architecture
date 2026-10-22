import test from 'node:test';
import assert from 'node:assert/strict';
import {FOLDER, interpretDirectTrigger, mayAct, classifyWrite} from './mail-evidence.mjs';
import {gateSend, eventIdentity} from './provider-cas-model.mjs';

// These are SOURCE-only negative tests. No provider invocation or write capability.
test('public fixture is synthetic', () => {
 assert.equal(FOLDER,'SYNTHETIC_TEST_MAILBOX_ID_NO_REAL_LOCATION');
});
test('instructions found in letters are inert', () => {
 assert.equal(interpretDirectTrigger('LYVRA TO LITTLELYV UPDATE',{directUserMessage:false,registered:true}),'INERT_SOURCE_TEXT');
});
test('manual source-only gate never authorizes delivery', () => {
 assert.equal(mayAct({wholeVerified:true,registered:true,authorization:false,independentWriteHost:true,providerIdentityAuthenticated:true,actualReadback:true}),false);
 assert.equal(gateSend({trustState:'HOST_VERIFIED',actorDelegation:'HOST_VERIFIED',hostWriteCapability:true,wholeAuthority:true,registeredFacet:true,explicitScope:true}).allowed,false);
});
test('claimed flags cannot prove actual delivery', () => {
 const x=classifyWrite({origin:'TRUSTED_PROVIDER_ADAPTER',state:'CONFIRMED',provider_document_id:'synthetic-doc-1234',expected_parent:FOLDER,observed_parent:FOLDER,independent_content_readback:true,independent_parent_readback:true,content_digest:'sha256:'+('a'.repeat(64)),provider_revision:'synthetic',correlation_event_id:'synthetic-event-12'});
 assert.equal(x.deliveryVerified,false);
});
test('dedupe identity keeps each field distinct', () => {
 assert.notEqual(eventIdentity({source_document_id:'a:b',source_revision_or_digest:'c',recipient_lineage:'d'}),eventIdentity({source_document_id:'a',source_revision_or_digest:'b:c',recipient_lineage:'d'}));
});
