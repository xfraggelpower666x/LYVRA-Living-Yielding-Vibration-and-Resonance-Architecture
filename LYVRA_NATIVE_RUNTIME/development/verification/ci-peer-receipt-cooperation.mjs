// Whole LYVRA: local Git source-evidence bound CLIC receipt -> existing cooperation verifier.
// No claims of remote provider authentication or automatic delivery. No communication interception.
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {inspectCooperation} from './cooperation-continuity-verifier.mjs';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',stdio:['ignore','pipe','pipe']});
const receiptPath='LYVRA_NATIVE_RUNTIME/handoffs/666CLIC/CLIC-LYVRA-VISUAL-DEVELOPMENT-REPORT-20261010-R02-RECEIPT.json';
export function inspectCheckoutPeerReceipt({expectedHead}={}){
 const head=git('rev-parse','HEAD').trim();
 if(!expectedHead||head!==expectedHead)throw Error('CHECKOUT_HEAD_MISMATCH');
 git('ls-files','--error-unmatch','--',receiptPath);
 const committed=git('show','HEAD:'+receiptPath),disk=readFileSync(receiptPath,'utf8');
 if(committed!==disk)throw Error('PEER_RECEIPT_WORKTREE_MISMATCH');
 const data=JSON.parse(committed),blob=git('rev-parse','HEAD:'+receiptPath).trim();
 if(!data.handoff_id||!data.source_blob_sha||data.source_repository!=='xfraggelpower666x/666CLICPRO')throw Error('PEER_RECEIPT_SCHEMA_INCOMPLETE');
 const cooperation=inspectCooperation({exchanges:[{id:data.handoff_id,sender:data.source_system,recipient:data.target_system,channel:'REPOSITORY_SOURCE_REFERENCE',intent:'PROPOSAL',scope_owner:'FOREIGN_SYSTEM',source_ref:data.source_path,claims:{received:data.source_readback_verified,peer_readback:data.clic_reciprocal_readback==='VERIFIED',applied:data.visual_adoption},relation:{cause:'Native visual proposal referred by local receipt',proposed_effect:'Review contextual LYVRA visual intelligence',counterrelation:'LYVRA preserves independent decisions and visual identity'}}]});
 return {contract:'LYVRA_CI_PEER_RECEIPT_COOPERATION_V1',owner:'WHOLE_LYVRA',observed_checkout_head:head,local_receipt_path:receiptPath,local_receipt_blob:blob,local_receipt_worktree_matches_commit:true,
  receipt_readback_scope:'LOCAL_GIT_ONLY',foreign_source_blob_claimed_by_receipt:data.source_blob_sha,
  foreign_source_independently_read_back:false,reciprocal_readback_this_execution:false,
  automatic_delivery_verified:false,semantic_adoption_verified:false,host_runtime_verified:false,
  cooperation,communication_blocked:false,facet_activated:false,mutation:false};
}
if(process.argv[1]&&import.meta.url.endsWith(process.argv[1].replaceAll('\\','/'))){
 try{process.stdout.write(JSON.stringify(inspectCheckoutPeerReceipt({expectedHead:process.env.GITHUB_SHA}),null,2)+'\n')}
 catch(e){console.error('LYVRA_PEER_RECEIPT_UNVERIFIED',String(e.message||e));process.exitCode=2}
}
