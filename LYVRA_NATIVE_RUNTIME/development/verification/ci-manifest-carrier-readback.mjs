// LYVRA verified CI checkout carrier coverage. Source evidence only.
// No plugin/network access, runtime claims, facet activation or repository writes.
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const gitRaw=(...args)=>execFileSync('git',args,{encoding:'utf8',stdio:['ignore','pipe','pipe']});
const git=(...args)=>gitRaw(...args).trim();
const valid=x=>typeof x==='string'&&['LYVRA_NATIVE_RUNTIME/','LYVRA_PET/','WEBLyvra/'].some(root=>x.startsWith(root))&&!x.includes('..')&&!x.includes('\\')&&!x.includes('\0');
export function inspectCheckoutManifest({manifestPath='LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json',expectedHead}={}){
 if(!valid(manifestPath))throw Error('INVALID_MANIFEST_PATH');
 const head=git('rev-parse','HEAD');
 if(!expectedHead||head!==expectedHead)throw Error('HEAD_MISMATCH');
 git('ls-files','--error-unmatch','--',manifestPath);
 const committed=gitRaw('show','HEAD:'+manifestPath),disk=readFileSync(manifestPath,'utf8');
 if(committed!==disk)throw Error('MANIFEST_WORKTREE_MISMATCH');
 const manifest=JSON.parse(committed);
 const order=manifest.required_order,map=manifest.domain_path_map;
 if(!Array.isArray(order)||!map||typeof map!=='object'||order[0]!=='PRE_REHYDRATION_OVERSTEER_GUARD'||order.at(-1)!=='CURRENT_WORK_SCOPE')throw Error('MANIFEST_STRUCTURE_INVALID');
 const stageResults=order.map((stage,index)=>{
  const carrierPaths=Array.isArray(map[stage])?map[stage]:[];
  const results=carrierPaths.map(path=>{
   if(!valid(path))return {path,source:'INVALID_PATH'};
   try{
    git('ls-files','--error-unmatch','--',path);
    const blob=git('rev-parse','HEAD:'+path);
    const committedFile=gitRaw('show','HEAD:'+path),actual=readFileSync(path,'utf8');
    return {path,blob,source:committedFile===actual?'COMMITTED_BLOB_MATCHED':'WORKTREE_MISMATCH'};
   }catch{return {path,source:'CARRIER_NOT_READ_BACK'}}
  });
  return {index,stage,coverage:carrierPaths.length===0?'UNMAPPED':results.every(x=>x.source==='COMMITTED_BLOB_MATCHED')?'SOURCE_READBACK':'PARTIAL',carrier_results:results,semantic_understanding:'NOT_TESTED',runtime_verified:false};
 });
 const counts={mapped:stageResults.filter(x=>x.coverage!=='UNMAPPED').length,unmapped:stageResults.filter(x=>x.coverage==='UNMAPPED').length,readback:stageResults.filter(x=>x.coverage==='SOURCE_READBACK').length,partial:stageResults.filter(x=>x.coverage==='PARTIAL').length};
 return {contract:'LYVRA_CI_MANIFEST_READBACK_V1',owner:'WHOLE_LYVRA',head,manifest_path:manifestPath,manifest_blob:git('rev-parse','HEAD:'+manifestPath),stages:stageResults,coverage:counts,source_readback_only:true,semantic_rehydration_verified:false,host_runtime_verified:false,plugin_parity_verified:false,facet_activation:false,communications_blocked:false,mutation:false};
}
if(process.argv[1]&&import.meta.url.endsWith(process.argv[1].replaceAll('\\','/'))){
 try{process.stdout.write(JSON.stringify(inspectCheckoutManifest({expectedHead:process.env.GITHUB_SHA}),null,2)+'\n')}
 catch(e){console.error('LYVRA_MANIFEST_READBACK_OPEN',String(e.message||e));process.exitCode=2}
}
