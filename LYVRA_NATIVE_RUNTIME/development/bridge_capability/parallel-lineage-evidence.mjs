// LYVRA Whole: original Git-backed workspace handoff topology only.
// No cross-chat runtime, no workspace activation, no scheduler or authority mutation.
import {spawnSync} from "node:child_process";
import {readFileSync} from "node:fs";
const PREFIX="LYVRA_NATIVE_RUNTIME/continuity/workspaces/";
function git(args) {
  const run=spawnSync("git",args,{encoding:"utf8",maxBuffer:4*1024*1024});
  if(run.status!==0||run.error)throw new Error("Git original read failed: "+args[0]);
  return run.stdout.trimEnd();
}
function eligiblePath(p){return p.startsWith(PREFIX)&&p.endsWith(".json")&&!p.includes("..")&&!p.includes("\\");}
export function inspectWorkspaceHandoffs(head,provider={git,readFileSync}){
  if(!/^[0-9a-f]{40}$/.test(head))throw new TypeError("Current full commit required");
  if(provider.git(["rev-parse","HEAD"])!==head)throw new Error("Checkout HEAD mismatch");
  const paths=provider.git(["ls-tree","-r","--name-only","HEAD","--",PREFIX]).split("\n").filter(eligiblePath);
  const groups=new Map(),invalid=[],related_source_artifacts=[];
  for(const path of paths){
    const sections=path.slice(PREFIX.length).split("/");
    if(sections.length!==3){invalid.push({path,reason:"UNEXPECTED_LINEAGE_LAYOUT"});continue}
    const [workspace,lineage]=sections;
    const blob=provider.git(["rev-parse","HEAD:"+path]);
    const original=provider.git(["show","HEAD:"+path]);
    if(provider.readFileSync(path,"utf8").trimEnd()!==original)throw new Error("Git/worktree handoff mismatch: "+path);
    let item;
    try{item=JSON.parse(original)}catch(e){invalid.push({path,reason:"INVALID_JSON"});continue}
    // A creative session delta is native continuity, but must NEVER masquerade as a handoff.
    if(item?.schema==="LYVRA_TRACK_DESIGN_CHAT_SESSION_DELTA_V1"){
      if(item.native_owner==="WHOLE_LYVRA"&&item.workspace===workspace&&item.lineage===lineage
         &&item.scope==="TRACK_DESIGN_ONLY"&&item.supersedes_handoff===false){
        related_source_artifacts.push({path,blob,workspace_id:workspace,lineage_id:lineage,
          schema:item.schema,status:item.status||"UNSPECIFIED",preceding_handoff:item.preceding_handoff||null,
          source_class:"CREATIVE_SESSION_DELTA_NOT_HANDOFF",host_verified:false,
          music_audio_verified:false,autoactivate:false,authority_transfer:false});
      } else invalid.push({path,reason:"CREATIVE_DELTA_SCOPE_OR_AUTHORITY_MISMATCH"});
      continue;
    }
    if(!item||!item.handoff_id||item.lineage_id!==lineage||item.workspace_id!==workspace){
      invalid.push({path,reason:"IDENTITY_OR_LINEAGE_MISMATCH"});continue;
    }
    const key=workspace+"/"+lineage;
    const arr=groups.get(key)||[];
    arr.push({handoff_id:item.handoff_id,supersedes_handoff_id:item.supersedes_handoff_id||null,
      source_head:item.source_head||null,path,blob,workspace_id:workspace,lineage_id:lineage,
      state:item.status||"UNSPECIFIED",autoactivate:false});
    groups.set(key,arr);
  }
  const lineages=[...groups.entries()].map(([key,rows])=>{
    const ids=new Set(rows.map(r=>r.handoff_id));
    if(ids.size!==rows.length)return {key,workspace_id:rows[0].workspace_id,status:"DUPLICATE_HANDOFF_ID",candidates:rows};
    const superseded=new Set(rows.filter(r=>r.supersedes_handoff_id&&ids.has(r.supersedes_handoff_id)).map(r=>r.supersedes_handoff_id));
    const heads=rows.filter(r=>!superseded.has(r.handoff_id));
    return {key,workspace_id:rows[0].workspace_id,status:heads.length===1?"ONE_LINEAGE_HEAD":"LINEAGE_AMBIGUOUS",
      heads,candidates:rows,history_count:rows.length};
  }).sort((a,b)=>a.key.localeCompare(b.key));
  const byWorkspace=new Map();
  for(const l of lineages)byWorkspace.set(l.workspace_id,[...(byWorkspace.get(l.workspace_id)||[]),l]);
  const workspace_summary=[...byWorkspace.entries()].map(([workspace_id,ls])=>({workspace_id,
    lineage_count:ls.length,status:ls.length>1?"MULTIPLE_INDEPENDENT_LINEAGES":ls[0].status,
    workspace_activation:"FORBIDDEN_UNLESS_EXPLICITLY_SELECTED"})).sort((a,b)=>a.workspace_id.localeCompare(b.workspace_id));
  return {schema:"LYVRA_PARALLEL_LINEAGE_SOURCE_R16",source_head:head,paths_examined:paths.length,
    verified_handoffs:lineages.reduce((n,l)=>n+l.candidates.length,0),lineages,workspace_summary,
    invalid,related_source_artifacts,related_source_artifact_count:related_source_artifacts.length,
    authority:"WHOLE_LYVRA_ONLY",readback:"GIT_OBJECT_AND_CHECKOUT",
    autoactivate:false,no_global_last_writer:true,no_foreign_activation:true};
}
if(import.meta.url===`file://${process.argv[1]}`){
  console.log(JSON.stringify(inspectWorkspaceHandoffs(git(["rev-parse","HEAD"]))));
}
