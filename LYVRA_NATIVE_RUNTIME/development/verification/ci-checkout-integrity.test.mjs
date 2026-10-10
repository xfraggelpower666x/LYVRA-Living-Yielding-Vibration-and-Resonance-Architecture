import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {runTrustedCheckout} from './ci-checkout-readback.mjs';

const fixture='LYVRA_NATIVE_RUNTIME/development/verification/fixtures/track-causal-smoke.json';
const output='LYVRA_NATIVE_RUNTIME/development/verification/examples/TRACK_CAUSAL_VERIFICATION_REPORT.json';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();

test('actual checkout rejects whitespace-only tampering without altering production repository',()=>{
 const original=process.cwd(),temp=mkdtempSync(join(tmpdir(),'lyvra-checkout-integrity-'));
 try{
  process.chdir(temp);
  git('init');
  mkdirSync(dirname(fixture),{recursive:true});
  writeFileSync(fixture,'{}\n');
  git('add','--',fixture);
  execFileSync('git',['-c','user.name=LYVRA-Test','-c','user.email=lyvra-test@example.invalid','commit','-m','local baseline']);
  const head=git('rev-parse','HEAD');
  // A valid committed trailing newline must pass before testing tampering.
  assert.equal(runTrustedCheckout({fixturePath:fixture,outputPath:output,expectedHead:head}).fixture_worktree_matches_commit,true);
  writeFileSync(fixture,'{}\n\n');
  assert.throws(()=>runTrustedCheckout({fixturePath:fixture,outputPath:output,expectedHead:head}),/WORKTREE_DIFFERS_FROM_COMMITTED_FIXTURE/);
  writeFileSync(fixture,'{}\n');
  assert.equal(runTrustedCheckout({fixturePath:fixture,outputPath:output,expectedHead:head}).host_runtime_verified,false);
 }finally{process.chdir(original);rmSync(temp,{recursive:true,force:true})}
});
