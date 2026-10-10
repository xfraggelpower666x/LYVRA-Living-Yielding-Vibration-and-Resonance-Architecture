// Existing CI only: derive provenance from the actual checked-out Git tree.
// Never accept a caller-provided ledger, host booleans, or network identity claims.
// Read-only process; GitHub Actions must independently supply run/job conclusion.
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {runVerification} from './lyvra-verification-runner.mjs';

const git=(...args)=>execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:4*1024*1024}).trim();
const validPath=p=>typeof p==='string'&&p.startsWith('LYVRA_NATIVE_RUNTIME/')&&!p.includes('..')&&!p.includes('\\')&&!p.includes('\0')&&!p.startsWith('/');
export function runTrustedCheckout({fixturePath,outputPath,expectedHead}={}){
 if(!validPath(fixturePath)||!validPath(outputPath))throw Error('INVALID_CHECKOUT_PATH');
 const head=git('rev-parse','HEAD');
 if(!/^[a-f0-9]{40}$/.test(head))throw Error('INVALID_HEAD');
 // Bind to the actual CI checkout, never an arbitrary claimed observation SHA.
 if(!expectedHead||expectedHead!==head)throw Error('CHECKOUT_HEAD_MISMATCH');
 git('ls-files','--error-unmatch','--',fixturePath);
 const blob=git('rev-parse','HEAD:'+fixturePath);
 const committed=git('show','HEAD:'+fixturePath);
 const onDisk=readFileSync(fixturePath,'utf8').trimEnd();
 if(committed.trimEnd()!==onDisk)throw Error('WORKTREE_DIFFERS_FROM_COMMITTED_FIXTURE');
 const report=runVerification(JSON.parse(onDisk));
 return {contract:'LYVRA_CHECKOUT_SOURCE_READBACK_V1',source:'LOCAL_GIT_CHECKOUT',observed_head:head,fixture_path:fixturePath,
  fixture_blob:blob,fixture_worktree_matches_commit:true,
  provider_scope:'CI_CHECKOUT_ONLY_NOT_REMOTE_GITHUB_PROVIDER',host_runtime_verified:false,
  plugin_parity_verified:false,semantic_application_verified:false,
  advisory:report,mutation:false};
}
if(process.argv[1]&&import.meta.url.endsWith(process.argv[1].replaceAll('\\','/'))){
 try{
  const fixturePath=process.argv[2],outputPath=process.argv[3],expectedHead=process.env.GITHUB_SHA;
  if(!outputPath||!expectedHead)throw Error('CI_CHECKOUT_ENVIRONMENT_REQUIRED');
  const report=runTrustedCheckout({fixturePath,outputPath,expectedHead});
  // stdout redirected by CI; no write or communications dependency.
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
 }catch(e){console.error('LYVRA_CI_CHECKOUT_UNVERIFIED',String(e.message||e));process.exitCode=2}
}
