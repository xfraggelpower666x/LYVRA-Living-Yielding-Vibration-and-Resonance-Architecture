// LYVRA Visual Intelligence: read-only action board over existing Standstill R02.
// No second engine, routing, external execution, fabricated receipts, or state mutation.
const KNOWN = Object.freeze({
  COMPARE_SAME_TIMESTAMP_SUNO_PLAYBACK_VS_ORIGINAL_DOWNLOAD_NO_NEW_GENERATION: Object.freeze({
    label: 'Vorhandenes Suno-Playback mit Originaldownload am selben Zeitcode vergleichen',
    prerequisite: 'EXISTING_ORIGINAL_AUDIO_AND_PLAYBACK', category: 'AUDIO_SOURCE_COMPARISON', cost: 'ZERO_NEW_GENERATIONS'
  }),
  AUTHORIZED_FREE_CHROMIUM_HOST_ACCEPTANCE_WITH_REAL_CHECKOUT: Object.freeze({
    label: 'Echte Browserabnahme nur bei neuem autorisiertem kostenlosen Host',
    prerequisite: 'NEW_AUTHORIZED_FREE_HOST_AND_REAL_CHECKOUT', category: 'HOST_ACCEPTANCE', cost: 'ZERO_ADDITIONAL_COST'
  })
});
const allowedEvidence = new Set(['VERIFIED','READBACK_PENDING','NOT_VERIFIED','NOT_SENT','NOT_TESTED']);
const eqIds = (a,b) => a.length===b.length && a.every((x,i)=>x===b[i]);

export function projectActionBoard(standstill, options={}) {
  if(standstill?.schema!=='LYVRA_VISUAL_CONTINUITY_STANDSTILL_R02' || standstill.authority!=='WHOLE_LYVRA'
    || standstill.menu_options_preserved!==5 || !standstill.no_new_engine || !standstill.no_autoactivation
    || standstill.writes_performed!==false || !Array.isArray(standstill.frozen_return_anchors)
    || !Array.isArray(standstill.standstill?.permanent_records) || !Array.isArray(standstill.projects?.persistent)
    || !Array.isArray(standstill.continuity?.persistent)) throw new TypeError('trusted R02 snapshot required');
  const permanent=standstill.standstill.permanent_records;
  const ids=permanent.map(x=>x.id);
  const anchors=standstill.frozen_return_anchors;
  if(new Set(ids).size!==ids.length || !eqIds(ids,anchors.map(x=>x.id)) ||
     !eqIds(ids,standstill.continuity.persistent.map(x=>x.id)) ||
     standstill.totals?.projects!==standstill.projects.persistent.length ||
     standstill.totals?.continuity!==ids.length) throw new TypeError('source coverage or identity mismatch');
  // A caller-supplied boolean is not provider readback. Fail closed until a separately
  // authenticated, scope-bound evidence channel is designed and approved.
  const unverifiedReadinessRequested = options.existingOriginalAudioAndPlayback===true ||
    options.newAuthorizedFreeHostAndRealCheckout===true;
  const cards=permanent.map((r,i)=>{
    if(r.resume_anchor!==anchors[i].resume_anchor || !r.resume_anchor)throw new TypeError('return-anchor drift');
    for(const field of ['source','delivery','adoption','host'])if(!allowedEvidence.has(r[field]))throw new TypeError('invalid evidence state');
    const known=KNOWN[r.resume_anchor];
    const state=known?.category==='AUDIO_SOURCE_COMPARISON'
       ? 'WAITING_FOR_EXISTING_AUDIO'
       : known?.category==='HOST_ACCEPTANCE'
       ? 'FROZEN_HOST_BLOCK'
       : 'MANUAL_SCOPE_REVIEW';
    return Object.freeze({id:r.id,title:r.title,stage:r.stage,anchor:r.resume_anchor,
      evidence:Object.freeze({source:r.source,delivery:r.delivery,adoption:r.adoption,host:r.host}),
      action_label:known?.label??'Unbekannten Return Anchor zunächst manuell prüfen',
      prerequisite:known?.prerequisite??'NATIVE_SCOPE_REVIEW_REQUIRED',
      category:known?.category??'UNKNOWN', state, cost:known?.cost??'NOT_AUTHORIZED',
      auto_execution:false, promotion:false});
  });
  return Object.freeze({schema:'LYVRA_VISUAL_ACTION_BOARD_R01',authority:'WHOLE_LYVRA',
    menu_options_preserved:5, project_ids:standstill.projects.persistent.map(x=>x.id),
    cards, frozen_return_anchors:anchors.map(x=>Object.freeze({...x})),
    source_revision:options.sourceRevision??'UNVERIFIED',
    no_new_engine:true,no_autoactivation:true,no_host_claim:true,no_receipt_search:true,
    prerequisite_readback:'PENDING_INDEPENDENT_VERIFICATION', unverified_readiness_requested:unverifiedReadinessRequested,
    writes_performed:false});
}
