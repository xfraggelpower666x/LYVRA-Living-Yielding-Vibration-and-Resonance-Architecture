// Standstill R02: compositional read-only adapter of the existing LYVRA visual chain.
// No new engine, menu, router, current mutation, synthetic receipt or host claim.
import {projectOperationsCenterContinuity} from './operations-continuity-view.mjs';
import {projectOperationsCenterFromOriginals} from './receipt-source-bridge-r04.mjs';
import {projectStandstill} from './standstill_view_r01.mjs';

const SHASHA=/^[a-f0-9]{40}$/;
const safeSubset=(xs,ys)=>{
 const ids=new Set(ys.map(x=>x.id));
 return xs.every(x=>ids.has(x.id));
};

export function projectStandstillR02(registry,ledger,options={}) {
 const receipts=options.originalReceipts??[];
 if(!Array.isArray(receipts))throw new TypeError('receipts must be array');
 if(receipts.length&&!SHASHA.test(options.verifiedHead??''))throw new TypeError('real source head required for original receipt reads');
 if(options.evidence && receipts.length)throw new TypeError('cannot mix independent readbacks and unbound evidence');
 const view=receipts.length
   ? projectOperationsCenterFromOriginals(registry,ledger,receipts,options.verifiedHead)
   : projectOperationsCenterContinuity(registry,ledger,options.evidence??{},options.projectorOptions??{});
 const result=projectStandstill(view,{source_revision:options.verifiedHead??'READBACK_PENDING'});
 const projects=view.existing_project_views;
 if(!Array.isArray(projects?.dynamic)||!Array.isArray(projects?.persistent)||
    !safeSubset(projects.dynamic,projects.persistent)||
    !safeSubset(result.dynamic_records,result.permanent_records)||
    view.total_existing_projects!==registry.items.length||
    view.total_continuity_records!==ledger.records.length||
    result.original_project_count!==view.total_existing_projects)throw new TypeError('visual or continuity coverage mismatch');
 const frozen=Object.freeze({
   schema:'LYVRA_VISUAL_CONTINUITY_STANDSTILL_R02',
   authority:view.authority,decision_authority:'LYVRA_ONLY',
   menu_options_preserved:view.menu_options_preserved,
   projects:Object.freeze({dynamic:projects.dynamic,persistent:projects.persistent}),
   continuity:Object.freeze({dynamic:view.development_continuity.dynamic,persistent:view.development_continuity.persistent}),
   standstill:result,
   historical_context:view.historical_context??[],
   source_receipts_accepted:view.source_receipts_accepted??0,
   totals:{projects:view.total_existing_projects,continuity:view.total_continuity_records},
   frozen_return_anchors:result.permanent_records.map(x=>({id:x.id,resume_anchor:x.resume_anchor})),
   no_new_engine:true,no_autoactivation:true,writes_performed:false,
   host_acceptance:'NOT_CLAIMED',production_adoption:'NOT_CLAIMED'
 });
 return frozen;
}
