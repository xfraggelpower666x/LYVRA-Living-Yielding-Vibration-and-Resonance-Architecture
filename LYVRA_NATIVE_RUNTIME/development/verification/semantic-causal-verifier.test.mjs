import assert from 'node:assert/strict';
import {test} from 'node:test';
import {verifyCommunication,verifyVisualStatus,verifyFacetRelations,verifyEvidence,VERIFICATION_BOUNDARIES} from './semantic-causal-verifier.mjs';
const source_blob='a9490b43dfb2ad38f576210c548c262bf49d821a';
test('CLIC R02 source plus local receipt is not peer-delivered',()=>{
 const x=verifyCommunication({handoff_id:'CLIC-LYVRA-VISUAL-DEVELOPMENT-REPORT-20261010-R02',source_blob,source_readback:true,local_receipt:true});
 assert.equal(x.stage,'RECEIPT_PUBLISHED');
 assert.equal(x.automatic_transport_verified,false);
});
test('reciprocal readback must be supplied as evidence',()=>{
 const x=verifyCommunication({handoff_id:'CLIC-LYVRA-VISUAL-DEVELOPMENT-REPORT-20261010-R02',source_blob,source_readback:true,local_receipt:true,peer_readback:true});
 assert.equal(x.stage,'PEER_READBACK');
 assert.equal(x.classification,'OPEN');
});
test('false global visual VERIFIED is rejected',()=>{
 const x=verifyVisualStatus({headline:'VERIFIED',parts:[{status:'VERIFIED'},{status:'PARTIAL'},{status:'NOT_TESTED'}],render_evidence:true});
 assert.equal(x.status,'FAIL');
 assert.ok(x.issues.includes('FALSE_GLOBAL_VERIFIED'));
});
test('source-only visual verification cannot claim host pass',()=>{
 assert.ok(verifyVisualStatus({headline:'VERIFIED',parts:[{status:'VERIFIED'}]}).issues.includes('HOST_RENDER_NOT_VERIFIED'));
});
test('correct verified rendered visual state passes',()=>{
 assert.equal(verifyVisualStatus({headline:'VERIFIED',parts:[{status:'VERIFIED'}],render_evidence:true}).status,'PASS');
});
test('proposed facet does not activate or acquire whole authority',()=>{
 const x=verifyFacetRelations({active_facets:['TRACK_DESIGN'],proposed_facets:['MUSIC_ANALYTICS']});
 assert.equal(x.activate_facets,false);
 assert.equal(x.status,'RELATION_ONLY');
 assert.equal(VERIFICATION_BOUNDARIES.controller,false);
});
test('foreign authority transfer rejected',()=>{
 assert.equal(verifyFacetRelations({transferred_authority:true}).status,'REVIEW');
});
test('source-read and runtime evidence remain distinct',()=>{
 assert.equal(verifyEvidence({source_current:true,source_read:true}).status,'OPEN');
 assert.equal(verifyEvidence({source_current:true,source_read:true,meaning_applied:true,runtime_observed:true}).status,'VERIFIED');
});
