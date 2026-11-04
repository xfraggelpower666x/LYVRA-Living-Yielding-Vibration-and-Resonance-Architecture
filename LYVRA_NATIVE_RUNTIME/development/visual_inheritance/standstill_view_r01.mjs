// Additive pure snapshot projection for the existing R02 Operations Center.
// No new engine, router, host pass or writes; retain frozen return anchors.
export function projectStandstill(view, options={}) {
  if (view?.schema !== 'LYVRA_OPERATIONS_CENTER_CONTINUITY_VIEW_R02' ||
      view.authority !== 'WHOLE_LYVRA' || view.menu_options_preserved !== 5 ||
      !Array.isArray(view.development_continuity?.persistent) ||
      !Array.isArray(view.development_continuity?.dynamic)) {
    throw new TypeError('verified existing Operations Center projection required');
  }
  const source=view.development_continuity.persistent;
  const dynamicIds=new Set(view.development_continuity.dynamic.map(x=>x.id));
  const ids=new Set();
  const state=source.map(item=>{
    if(!item.id || ids.has(item.id) || !item.resume_anchor) throw new TypeError('invalid or duplicate continuity entry');
    ids.add(item.id);
    const e=item.evidence||{};
    const noDelivery=e.delivery!=='VERIFIED';
    const noAdoption=e.adoption!=='VERIFIED';
    const noHost=e.host!=='VERIFIED';
    return Object.freeze({id:item.id,title:item.title,stage:item.stage,
      current_priority:dynamicIds.has(item.id),
      source:e.source??'READBACK_PENDING',
      delivery:e.delivery??'NOT_VERIFIED',
      adoption:e.adoption??'NOT_VERIFIED',
      host:e.host??'NOT_TESTED',
      frozen_no_receipt:noDelivery&&noAdoption&&noHost,
      resume_anchor:item.resume_anchor,
      next_safe_action:(noDelivery&&item.handoff_status==='NOT_SENT')
        ? 'CONTINUE_INDEPENDENT_SOURCE_WORK_DO_NOT_REPEAT_RECEIPT_SEARCH'
        : (noHost?'WAIT_FOR_INDEPENDENT_HOST_EVIDENCE':'REVIEW_NATIVE_GOVERNANCE')});
  });
  if([...dynamicIds].some(id=>!ids.has(id)))throw new TypeError('dynamic record not in persistent view');
  return Object.freeze({schema:'LYVRA_VISUAL_STANDSTILL_VIEW_R01',
    source_revision:options.source_revision??'UNSPECIFIED',
    authority:'WHOLE_LYVRA', menu_options_preserved:5,
    original_project_count:view.total_existing_projects,
    permanent_records:state,dynamic_records:state.filter(x=>x.current_priority),
    no_new_engine:true,no_autoactivation:true,writes_performed:false});
}
