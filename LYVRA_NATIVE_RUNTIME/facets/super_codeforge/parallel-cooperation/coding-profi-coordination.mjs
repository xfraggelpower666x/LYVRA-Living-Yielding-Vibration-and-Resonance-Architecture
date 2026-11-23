/**
 * LYVRA SuperCodeForge R03 — read-only coordination over existing R02 interfaces.
 * Engineering lead: LYVRA Coding Profi. No provider invocation, no peer writes.
 */
const SHA40=/^[a-f0-9]{40}$/i;
const CAPABILITY_ID=/^[A-Za-z0-9][A-Za-z0-9._:-]{2,127}$/;
const PEERS=new Set(['LYVRA','666CLIC','666DEV','666MAIN_BRAIN','666PFS','666STREAM','CODER']);
const SOURCE_STATES=new Set(['CURRENT_PRODUCTIVE_SOURCE_READBACK','HUB_SOURCE_READBACK_PROJECT_BINDING_OPEN','MIGRATION_IN_PROGRESS_VERIFIED','CURRENT_POINTER_NOT_FOUND_ON_DEFAULT_BRANCH','READBACK_PENDING_POINTER_STATE_BLOB_MISMATCH','CURRENT_PROJECT_SCOPED_SOURCE_READBACK_OPEN_GATES','SOURCE_READBACK_ONLY']);
const text=x=>typeof x==='string'&&x.trim().length>0;
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const freeze=Object.freeze;
const blocked=(code,fields={})=>freeze({status:'BLOCKED',code,...fields,dispatch_performed:false,foreign_writes:false});
const clean=x=>JSON.parse(JSON.stringify(x));
function pureSource(s){return Boolean(s&&['SOURCE_READBACK_VERIFIED','VERIFIED'].includes(s.status)&&text(s.repository)&&text(s.branch)&&SHA40.test(s.commit||'')&&SHA40.test(s.blob_sha||'')&&text(s.path)&&!s.path.includes('..')&&!s.path.startsWith('/')&&text(s.readback_ref));}
export function buildCodingProfiCoordinationReview({snapshots,catalog,workstreams=[],wavePlanner,expectedHeads={}}={}){
 if(!Array.isArray(snapshots)||!snapshots.length)return blocked('SNAPSHOTS_REQUIRED');
 if(!catalog||typeof catalog.list!=='function')return blocked('EXISTING_R02_CATALOG_REQUIRED');
 if(!Array.isArray(workstreams))return blocked('INVALID_WORKSTREAMS');
 if(workstreams.length&&typeof wavePlanner!=='function')return blocked('EXISTING_R02_WAVE_PLANNER_REQUIRED');
 if(!expectedHeads||typeof expectedHeads!=='object'||Array.isArray(expectedHeads))return blocked('INVALID_HEAD_MAP');
 const seen=new Set(),sources=[];
 for(const p of snapshots){
  if(!p||typeof p!=='object'||Array.isArray(p)||!PEERS.has(p.system)||p.system==='CODER')return blocked('INVALID_PEER_SOURCE');
  if(seen.has(p.system))return blocked('DUPLICATE_PEER_SOURCE',{system:p.system});seen.add(p.system);
  if(!text(p.native_authority)||!text(p.repository)||!text(p.branch)||!SHA40.test(p.head||'')||!SOURCE_STATES.has(p.status))return blocked('INVALID_PEER_PROVENANCE',{system:p.system});
  if(own(expectedHeads,p.system)&&!SHA40.test(expectedHeads[p.system]))return blocked('INVALID_EXPECTED_HEAD',{system:p.system});
  const stale=own(expectedHeads,p.system)&&p.head!==expectedHeads[p.system];
  const quarantine=p.pointer_state_mismatch===true||p.status==='READBACK_PENDING_POINTER_STATE_BLOB_MISMATCH';
  const ready=!stale&&!quarantine&&p.status==='CURRENT_PRODUCTIVE_SOURCE_READBACK'&&p.pointer_readback_present===true;
  sources.push(freeze({system:p.system,native_authority:p.native_authority,repository:p.repository,branch:p.branch,head:p.head,source_claim:p.status,freshness:stale?'STALE_HEAD':quarantine?'CONFLICT_QUARANTINE':ready?'SOURCE_SNAPSHOT_REVIEWABLE':'SOURCE_GATES_OPEN',source_verified_by_adapter:false,host_verified:false,write_authority:false,reasons:freeze([...(stale?['EXPECTED_HEAD_MISMATCH']:[]),...(quarantine?['POINTER_STATE_CONFLICT']:[]),...(!ready&&!stale&&!quarantine?['NATIVE_SOURCE_OR_POINTER_GATE_OPEN']:[])])}));
 }
 let descriptors;try{descriptors=catalog.list();}catch{return blocked('CATALOG_READ_FAILED');}
 if(!Array.isArray(descriptors))return blocked('CATALOG_RETURN_INVALID');
 const identifiers=new Set(),entries=[];
 for(const d of descriptors){
  if(!d||!CAPABILITY_ID.test(d.capability_id||'')||!PEERS.has(d.origin_system)||!text(d.native_authority))return blocked('INVALID_CATALOG_DESCRIPTOR');
  if(identifiers.has(d.capability_id))return blocked('DUPLICATE_CATALOG_CAPABILITY',{capability_id:d.capability_id});identifiers.add(d.capability_id);
  const peer=sources.find(x=>x.system===d.origin_system);
  const authorityMismatch=Boolean(peer&&peer.native_authority!==d.native_authority);
  const permissionMismatch=d.permission?.owner!==d.native_authority;
  const source=pureSource(d.source);
  const sourceMatches=Boolean(peer&&source&&d.source.repository===peer.repository&&d.source.branch===peer.branch&&d.source.commit===peer.head);
  const gate=!peer?'PEER_SOURCE_NOT_BOUND':authorityMismatch?'NATIVE_AUTHORITY_MISMATCH':permissionMismatch?'PERMISSION_OWNER_MISMATCH':peer.freshness!=='SOURCE_SNAPSHOT_REVIEWABLE'?'PEER_CURRENTNESS_OPEN':!source?'CAPABILITY_SOURCE_PROVENANCE_OPEN':!sourceMatches?'CAPABILITY_SOURCE_STALE_OR_FOREIGN':'REVIEWABLE_SOURCE_CLAIM_ONLY';
  entries.push(freeze({capability_id:d.capability_id,origin_system:d.origin_system,native_authority:d.native_authority,version:typeof d.version==='string'?d.version:null,source_gate:gate,source_verified:false,host_verified:false,adoption_verified:false,eligible_for_review:gate==='REVIEWABLE_SOURCE_CLAIM_ONLY',permission_owner:d.permission?.owner||null,can_dispatch:false,foreign_write_authority:false}));
 }
 let waves=null;
 if(workstreams.length){
  try{waves=wavePlanner({workstreams:clean(workstreams)});}catch{return blocked('EXISTING_R02_WAVE_PLANNER_ERROR')}
  if(!waves||typeof waves!=='object'||waves.dispatch_performed!==false||waves.foreign_mutation===true||waves.deployment_performed===true)return blocked('WAVE_PLANNER_BOUNDARY_VIOLATION');
 }
 return freeze({schema:'LYVRA_SUPERCODEFORGE_CODING_PROFI_COORDINATION_R03',coordinator:'LYVRA_CODING_PROFI',coordinator_role:'ENGINEERING_REVIEW_ONLY',authority:'NATIVE_OWNER_PER_SYSTEM',owner:'WHOLE_LYVRA',status:'REVIEW_READY_NOT_DISPATCHED',source_snapshots:freeze(sources),capability_gates:freeze(entries),native_peer_count:sources.length,capability_count:entries.length,capabilities_reviewable_by_claim:entries.filter(x=>x.eligible_for_review).length,capabilities_independently_verified:0,wave_plan:waves,dispatch_performed:false,deployment_performed:false,plugin_host_verified:false,foreign_activation:false,foreign_writes:false,next_gate:'INDEPENDENT_NATIVE_SOURCE_REVALIDATION_AND_OWNER_APPROVAL',note:'Coding Profi coordinates evidence and proposals, never overrides native systems or executes peer capabilities.'});
}
export const CODING_PROFI_R03_BOUNDARY=freeze({author:'LYVRA_CODING_PROFI',system:'LYVRA',under_existing_supercodeforge:true,native_authority_override:false,shared_pointer:false,new_router:false,new_controller:false,provider_calls:false,live_peer_invocation:false,plugin_updates:false,foreign_writes:false});
