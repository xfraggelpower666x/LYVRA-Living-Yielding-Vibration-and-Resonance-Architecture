// R40: bounded evidence gate; respects current Analytics central native authority.
const HEX40=/^[a-f0-9]{40}$/;
export const MIGRATION_TARGET='TRACK_DESIGN_SUBFACET';
export const REQUIRED_CARRIERS=Object.freeze(['ANALYTICS_FACET_CONTRACT','ANALYTICS_CURRENT_STATE','ANALYTICS_CAPABILITY_REGISTRY','TRACK_DESIGN_SUBREHYDRATION','CROSS_FACET_CALLERS','WHOLE_REHYDRATION_MANIFEST','CURRENT_POINTER']);
export function assessAnalyticsMigration({currentHead,pointerBlob,contractText,state,sourceBlobs={},carrierReadbacks=[],creatorDecision='CREATOR_AUTHORIZED_NOT_DEPLOYED',r23Plan,trackDnaGuard=false}={}){
 if(!HEX40.test(currentHead||'')||!HEX40.test(pointerBlob||''))throw Error('FRESH_CURRENT_REQUIRED');
 if(typeof contractText!=='string'||!contractText.includes('ROOT_AUTHORITY=WHOLE_LYVRA'))throw Error('NATIVE_CONTRACT_REQUIRED');
 if(!state||state.facet_id!=='LYVRA_ANALYTICS'||state.root_authority!=='WHOLE_LYVRA')throw Error('NATIVE_ANALYTICS_STATE_REQUIRED');
 const central=contractText.includes('CURRENT_PLACEMENT=CENTRAL_SHARED_NATIVE_LYVRA_FACET')&&contractText.includes('ANALYTICS_NE_TRACK_DESIGN_CHILD_FACET=true');
 // R41: A 40-digit SHA-shaped claim is not a source readback.
 // Require path-/blob-bound, independently fetched current-carrier receipts.
 // These are provenance candidates, not a grant to mutate an actual facet.
 const exactPaths={
   ANALYTICS_FACET_CONTRACT:'LYVRA_NATIVE_RUNTIME/facets/analytics/FACET_CONTRACT.md',
   ANALYTICS_CURRENT_STATE:'LYVRA_NATIVE_RUNTIME/facets/analytics/CURRENT_STATE.json',
   WHOLE_REHYDRATION_MANIFEST:'LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json',
   CURRENT_POINTER:'LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json'
 };
 const verified=REQUIRED_CARRIERS.filter(k=>{
   if(!HEX40.test(sourceBlobs[k]||''))return false;
   const rec=Array.isArray(carrierReadbacks)?carrierReadbacks.find(r=>r?.carrier===k):null;
   return !!rec&&rec.blob_sha===sourceBlobs[k]&&
     rec.readback_type==='GITHUB_FETCH_FILE'&&rec.complete===true&&
     rec.current_head===currentHead&&
     typeof rec.path==='string'&&rec.path.startsWith('LYVRA_NATIVE_RUNTIME/')&&
     (!exactPaths[k]||rec.path===exactPaths[k])&&!!rec.fetch_ref;
 });
 const missing=REQUIRED_CARRIERS.filter(k=>!verified.includes(k));
 const decision=creatorDecision==='CREATOR_AUTHORIZED_NOT_DEPLOYED';
 const r23Compatible=r23Plan?.schema==='LYVRA_PARALLEL_R23_NATIVE_IMPACT_PLAN'&&r23Plan.head===currentHead&&r23Plan.pointerSha===pointerBlob&&r23Plan.dependencyPlans?.parentage?.state==='CREATOR_DECISION_PENDING_DEPLOYMENT';
 const ready=decision&&central&&r23Compatible&&missing.length===0&&trackDnaGuard===true;
 return {schema:'LYVRA_R40_ANALYTICS_MIGRATION_GATE',currentHead,pointerBlob,currentPlacement:central?'CENTRAL_SHARED_NATIVE_LYVRA_FACET':'UNKNOWN_OR_EVOLVED',requestedPlacement:MIGRATION_TARGET,creatorDecision,reviewedCarrierCount:verified.length,unverifiedShaClaims:REQUIRED_CARRIERS.filter(k=>HEX40.test(sourceBlobs[k]||'')&&!verified.includes(k)),requiredCarrierCount:REQUIRED_CARRIERS.length,missing,trackDnaGuard,r23Compatible,candidateReadyForGovernedWriteReview:ready,productiveMigrationApplied:false,rootAuthority:'WHOLE_LYVRA',analyticsIndependentUntilGovernedPromotion:true,status:ready?'GOVERNED_UPDATE_REVIEW_REQUIRED':'MIGRATION_BLOCKED_CURRENT_SOURCE_OR_COVERAGE',openHostGates:18,priority:'KEEP_EXISTING_FACET_ACTIVE'};
}
