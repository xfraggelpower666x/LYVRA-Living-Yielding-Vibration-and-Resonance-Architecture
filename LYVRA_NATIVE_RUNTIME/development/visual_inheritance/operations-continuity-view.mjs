// LYVRA Operations Center R02: opt-in display adapter, not an engine, router or authority.
import {projectDevelopmentContinuity} from './development-continuity.mjs';
const VERIFIED = 'VERIFIED';
const RECEIPT_STATES = new Set(['DELIVERED','ACKNOWLEDGED','ADOPTED']);
const safe = value => typeof value === 'string' && value.length > 0;

// Evidence is an explicit, externally read-back receipt bundle. Never fabricate it from a status string.
export function assessContinuityEvidence(ledger, evidence = {}) {
  if (!ledger || ledger.schema !== 'LYVRA_DEVELOPMENT_CONTINUITY_V1' || !Array.isArray(ledger.records)) throw new TypeError('invalid ledger');
  const result = Object.create(null);
  for (const rec of ledger.records) {
    const e = evidence[rec.id] || {};
    const source = e.source?.status === VERIFIED && e.source?.evidence_id === rec.origin?.evidence_id && safe(e.source?.readback_id)
      ? VERIFIED : 'READBACK_PENDING';
    const delivery = RECEIPT_STATES.has(rec.handoff?.status)
      && safe(rec.handoff.receipt) && e.delivery?.status === VERIFIED && e.delivery?.receipt_id === rec.handoff.receipt && safe(e.delivery?.readback_id)
      ? VERIFIED : (rec.handoff?.status === 'NOT_SENT' ? 'NOT_SENT' : 'READBACK_PENDING');
    const adoption = rec.handoff?.status === 'ADOPTED' && delivery === VERIFIED
      && e.adoption?.status === VERIFIED && e.adoption?.receipt_id === rec.handoff.receipt && safe(e.adoption?.readback_id)
      ? VERIFIED : 'NOT_VERIFIED';
    const host = e.host?.status === VERIFIED && safe(e.host?.test_receipt) && safe(e.host?.readback_id)
      ? VERIFIED : 'NOT_TESTED';
    result[rec.id] = {source, delivery, adoption, host};
  }
  return result;
}

export function projectOperationsCenterContinuity(registry, ledger, evidence = {}, opts = {}) {
  const base = projectDevelopmentContinuity(registry, ledger, opts);
  const statuses = assessContinuityEvidence(ledger, evidence);
  const toCard = r => ({id:r.id, title:r.title, stage:r.stage, blocked:r.blocked,
    evidence:statuses[r.id], resume_anchor:r.resume_anchor, handoff_status:r.handoff_status});
  return {
    schema:'LYVRA_OPERATIONS_CENTER_CONTINUITY_VIEW_R02',
    status:'ISOLATED_DEVELOPMENT_PROJECTION',
    authority:'WHOLE_LYVRA',
    decision_authority:'LYVRA_ONLY',
    menu_options_preserved:5,
    existing_project_views:base.projects,
    development_continuity:{dynamic:base.continuity.dynamic.map(toCard),persistent:base.continuity.persistent.map(toCard)},
    total_existing_projects:base.source_project_count,
    total_continuity_records:base.source_continuity_count,
    no_autoactivation:true, no_private_content:true, writes_performed:false,
    note:'View-only: no automatic handoff sending, delivery, adoption, host claim or pointer mutation.'
  };
}
