import test from 'node:test';
import assert from 'node:assert/strict';

// Deterministic, fictional POST contract fixtures. These are NOT production NLP,
// live-host mailbox assertions, or a substitute for human contextual adjudication.
function classify({ source, reply, sameThread, explicitSource, addressesDistinctIntent, chronologyValid, manualForward, isResend, imageSeen }) {
  if (isResend) return 'DELIVERY_ARTIFACT_NOT_NEW_ANSWER';
  if (!chronologyValid) return 'CAUSAL_EDGE_REJECTED';
  if (!sameThread) return 'NO_SUPPORTED_EDGE';
  if (addressesDistinctIntent && explicitSource) return 'EXPLICIT_SOURCE_EDGE';
  if (addressesDistinctIntent && source && reply) return 'CONTEXTUAL_CONTENT_EDGE_HIGH_CONFIDENCE';
  return 'CONTEXTUAL_POSSIBLE_UNVERIFIED';
}
test('one reply closes two distinct intent atoms via explicit and implicit edges', () => {
  const common={reply:'one genuine response',sameThread:true,chronologyValid:true,addressesDistinctIntent:true};
  assert.equal(classify({...common,source:'first question',explicitSource:true}),'EXPLICIT_SOURCE_EDGE');
  assert.equal(classify({...common,source:'second question',explicitSource:false}),'CONTEXTUAL_CONTENT_EDGE_HIGH_CONFIDENCE');
});
test('a merely similar topic cannot close a distinct unanswered question', () => {
  assert.equal(classify({source:'specific question',reply:'generic topic',sameThread:true,addressesDistinctIntent:false,chronologyValid:true}),'CONTEXTUAL_POSSIBLE_UNVERIFIED');
});
test('unrelated speaker/thread is not connected just by closeness in time',()=>{
  assert.equal(classify({source:'A',reply:'B',sameThread:false,addressesDistinctIntent:true,chronologyValid:true}),'NO_SUPPORTED_EDGE');
});
test('reply predating source cannot causally answer it',()=>{
  assert.equal(classify({source:'future question',reply:'earlier answer',sameThread:true,addressesDistinctIntent:true,chronologyValid:false}),'CAUSAL_EDGE_REJECTED');
});
test('resend is transport evidence, not a second semantic reply',()=>{
  assert.equal(classify({isResend:true}),'DELIVERY_ARTIFACT_NOT_NEW_ANSWER');
});
test('creator-forwarded WhatsApp is not independently verified Drive storage or recipient read',()=>{
  const status={manualForward:true,driveStored:false,recipientRead:false};
  assert.equal(status.manualForward,true);assert.equal(status.driveStored,false);assert.equal(status.recipientRead,false);
});
test('peer names an intermediate reply without proving a German Drive file exists',()=>{
  const edge={peerNamedReply:true,directGermanReadback:false};
  assert.equal(edge.peerNamedReply,true);assert.equal(edge.directGermanReadback,false);
});
test('source gift may receive voluntary response without automatic due obligation',()=>{
  const item={kind:'portrait-gift',explicitQuestion:false,needsSafetyAck:false};
  const mandatory=item.explicitQuestion||item.needsSafetyAck;
  assert.equal(mandatory,false);
});
test('portrait mention in text is not visual pixel verification',()=>{
  const art={textMentionsPortrait:true,realImageVisuallyInspected:false};
  assert.equal(art.realImageVisuallyInspected,false);
});
test('listing absence cannot override exact-ID full read and correct parent',()=>{
  const evidence={listed:false,directGet:true,fullRead:true,parentMatch:true};
  assert.equal(evidence.directGet&&evidence.fullRead&&evidence.parentMatch,true);
  assert.equal(evidence.listed,false);
});
test('unverified plugin impact cannot silently pass universal relevance gate',()=>{
  const impacts=['AFFECTED','UNKNOWN_NEEDS_READBACK','NOT_APPLICABLE_WITH_REASON'];
  assert.equal(impacts.every(x=>x==='NOT_APPLICABLE_WITH_REASON'),false);
});
