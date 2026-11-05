import test from 'node:test';
import assert from 'node:assert/strict';
import {R45_SOURCE,prepareR45Caller,verifyR45CallerReturn} from './r45-track-studio-analytics-profile.mjs';
const head='6337840188b0f2b15ef070f9872f65b0ae2bba53';
const currentBlobs=Object.fromEntries(Object.values(R45_SOURCE).map(x=>[x.path,x.sha]));
const readbacks=Object.values(R45_SOURCE).map(x=>({path:x.path,blob_sha:x.sha,current_head:head,readback_type:'GITHUB_FETCH_FILE',complete:true,fetch_ref:'R59_DIRECT_SOURCE_FETCH_NO_HOST'}));
const base={task:'R59 original-source selective Analytics check',capabilities:['SEMANTIC_PREANALYSIS','FRESHNESS_CHECK'],context:{scope:'source'},evidenceScope:'GITHUB_CURRENT_SOURCE_ONLY',expectedResult:'SOURCE_PREANALYSIS_REQUEST',head,readbacks,currentBlobs};
test('Track Design source-bound Analytics call preserves independent return authority',()=>{
 const result=prepareR45Caller({...base,caller:'TRACK_DESIGN',returnTarget:'TRACK_DESIGN'});
 assert.equal(result.target,'LYVRA_ANALYTICS');assert.equal(result.returnFacet,'TRACK_DESIGN');
 assert.equal(result.readbackCount,3);assert.equal(result.sourceProfileOnly,true);
 assert.equal(result.hostInvoked,false);assert.equal(result.noParentageMigration,true);
 assert.equal(result.hostGatesOpen,18);
});
test('Studio 2 source-bound Analytics request preserves peer return',()=>{
 const result=prepareR45Caller({...base,caller:'STUDIO2',returnTarget:'STUDIO2',capabilities:['STUDIO_OPERATION_PREANALYSIS']});
 assert.equal(result.returnFacet,'STUDIO2');assert.equal(result.readbackCount,3);
 assert.equal(result.hostInvoked,false);
});
test('original returned caller evidence cannot impersonate productive host',()=>{
 const prepared=prepareR45Caller({...base,caller:'TRACK_DESIGN',returnTarget:'TRACK_DESIGN'});
 const result=verifyR45CallerReturn(prepared,{caller:'TRACK_DESIGN',returnTarget:'TRACK_DESIGN',provenance:'R59_DIRECT_SOURCE',evidenceClass:'SOURCE_READBACK'});
 assert.equal(result.hostVerified,false);assert.equal(result.productivelyInstalled,false);
 assert.equal(result.decisionAuthority,'LYVRA_ONLY');
});
test('source revision mismatch blocks selective Analytics call',()=>{
 assert.throws(()=>prepareR45Caller({...base,caller:'TRACK_DESIGN',returnTarget:'TRACK_DESIGN',currentBlobs:{...currentBlobs,[R45_SOURCE.registry.path]:'0'.repeat(40)}}),/CURRENT_CARRIER_CHANGED_registry/);
});
test('duplicate or missing direct readback cannot claim current Analytics authority',()=>{
 assert.throws(()=>prepareR45Caller({...base,caller:'TRACK_DESIGN',returnTarget:'TRACK_DESIGN',readbacks:[...readbacks,readbacks[0]]}),/CURRENT_CARRIER_READBACK_MISSING_registry/);
});
test('cross-facet authority takeover is forbidden',()=>{
 const p=prepareR45Caller({...base,caller:'TRACK_DESIGN',returnTarget:'TRACK_DESIGN'});
 assert.throws(()=>verifyR45CallerReturn(p,{caller:'TRACK_DESIGN',returnTarget:'TRACK_DESIGN',provenance:'source',evidenceClass:'SOURCE_READBACK',compositionAuthority:true}),/PROVENANCE_OR_AUTHORITY_FENCE/);
});
