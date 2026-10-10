import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {runTrustedCheckout} from './ci-checkout-readback.mjs';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8'}).trim();
const fixture='LYVRA_NATIVE_RUNTIME/development/verification/fixtures/track-causal-smoke.json';
const output='LYVRA_NATIVE_RUNTIME/development/verification/examples/TRACK_CAUSAL_VERIFICATION_REPORT.json';
test('real checkout HEAD and committed fixture produce bounded evidence',()=>{
 const r=runTrustedCheckout({fixturePath:fixture,outputPath:output,expectedHead:git('rev-parse','HEAD')});
 assert.equal(r.contract,'LYVRA_CHECKOUT_SOURCE_READBACK_V1');
 assert.equal(r.fixture_blob,git('rev-parse','HEAD:'+fixture));
 assert.equal(r.advisory.host_runtime_verified,false);
 assert.equal(r.advisory.results.provenance.status,'UNVERIFIED');
 assert.equal(r.plugin_parity_verified,false);
});
test('false HEAD cannot self-attest',()=>assert.throws(()=>runTrustedCheckout({fixturePath:fixture,outputPath:output,expectedHead:'a'.repeat(40)}),/CHECKOUT_HEAD_MISMATCH/));
test('bad path and path traversal rejected',()=>{
 for(const p of ['../../etc/passwd','LYVRA_NATIVE_RUNTIME/../README.md','README.md','/tmp/foo']){
  assert.throws(()=>runTrustedCheckout({fixturePath:p,outputPath:output,expectedHead:git('rev-parse','HEAD')}),/INVALID_CHECKOUT_PATH/);
 }
});
test('no self-declared host flags gain runtime proof',()=>{
 const r=runTrustedCheckout({fixturePath:fixture,outputPath:output,expectedHead:git('rev-parse','HEAD')});
 assert.equal(r.host_runtime_verified,false);
 assert.equal(r.advisory.results.communication.classification,'UNVERIFIED_CALLER_CLAIM');
 assert.equal(r.advisory.cooperation.authorized_channels_untouched,true);
});
test('untracked fake provider file rejected',()=>assert.throws(()=>runTrustedCheckout({fixturePath:'LYVRA_NATIVE_RUNTIME/development/verification/fixtures/NOT_EXISTENT.json',outputPath:output,expectedHead:git('rev-parse','HEAD')}) ));
