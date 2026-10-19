// LYVRA: read-only evidence projection of the existing contextual Rehydration Monitor.
// Supplied evidence claims are not independently authenticated by this function.
export const DIMENSIONS = Object.freeze(['source','meaning','relations','evolution','application']);
export const EVIDENCE = Object.freeze(['VERIFIED','PARTIAL','READBACK_PENDING','NOT_APPLICABLE']);
const check = (v,m) => { if (!v) throw new TypeError(m); };
function record(value) {
  check(value && typeof value==='object' && !Array.isArray(value),'invalid evidence');
  check(EVIDENCE.includes(value.status),'invalid status');
  check(typeof value.reason==='string' && value.reason.trim(),'reason required');
  if (value.status==='VERIFIED') check(typeof value.evidence_ref==='string' && value.evidence_ref.trim(),'evidence reference required');
  return {status:value.status,reason:value.reason,evidence_ref:value.evidence_ref||null};
}
export function assessInheritance(input) {
  check(input && typeof input==='object' && !Array.isArray(input),'invalid input');
  check(typeof input.subject_id==='string' && input.subject_id.trim(),'subject required');
  check(input.owner==='WHOLE_LYVRA','no foreign owner adoption');
  check(typeof input.source_head==='string' && /^[a-f0-9]{40}$/i.test(input.source_head),'exact source head required');
  check(input.dimensions && typeof input.dimensions==='object' && !Array.isArray(input.dimensions),'dimensions required');
  check(Object.keys(input.dimensions).every(k=>DIMENSIONS.includes(k)),'unknown dimension');
  const dimensions=Object.fromEntries(DIMENSIONS.map(k=>[k,record(input.dimensions[k] || {status:'READBACK_PENDING',reason:'Evidence not independently supplied'})]));
  const applicable=DIMENSIONS.filter(k=>dimensions[k].status!=='NOT_APPLICABLE');
  check(applicable.length>0,'all dimensions not applicable');
  const complete=applicable.every(k=>dimensions[k].status==='VERIFIED');
  const partial=applicable.some(k=>['VERIFIED','PARTIAL'].includes(dimensions[k].status));
  return {schema:'LYVRA_REHYDRATION_INHERITANCE_VIEW_V1',owner:'WHOLE_LYVRA',
    subject_id:input.subject_id,source_head:input.source_head,dimensions,
    assessment:complete?'ALL_DIMENSIONS_REPORTED_VERIFIED_NOT_INDEPENDENTLY_ATTESTED':partial?'PARTIAL':'READBACK_PENDING',
    independently_verified_host_execution:false,
    interpretation:'PRESENTATION_ONLY_SOURCE_CLAIMS_NOT_NATIVE_ADOPTION_OR_HOST_PASS',
    no_autoactivation:true,no_foreign_mutation:true};
}
