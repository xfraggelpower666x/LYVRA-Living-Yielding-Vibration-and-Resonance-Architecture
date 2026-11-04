// Whole-LYVRA shared daemon decision-support candidate R01.
// No IO, no timers, no global state, no foreign authority. Pure incident-local classifier.
// ISOLATED DEV ONLY — not a production runtime or security policy override.
export function classifyWholeLoop(x){
  const a=x||{};
  if(a.explicitSecurityDenial||a.explicitPermissionDenial||a.foreignAuthorityConflict) return {action:"STOP_BLOCKED",reason:"EXPLICIT_DENIAL",retry:false};
  if(a.writeOutcomeUnknown) return {action:"RECONCILE_READBACK",reason:"UNKNOWN_WRITE_RESULT",retry:false};
  if(a.mandatorySourceMissing) return {action:"READ_REQUIRED_SOURCE_OR_CLOSE_PARTIAL",reason:"MANDATORY_GATE",retry:false,fullPass:false};
  if(a.verifiedCompletion) return {action:"STOP_RETURN_TO_WORK",reason:"COMPLETED",retry:false};
  if(a.evidenceChanged||a.materiallyNewQuestion) return {action:"TARGETED_CHECK",reason:"NEW_CAUSAL_EVIDENCE",retry:false};
  if(a.sameQuestion&&a.sameEvidenceFingerprint&&a.equivalentCheckCount>=2) return {action:"STOP_LOOP",reason:"NO_DECISION_DELTA",retry:false,fullPass:false};
  if(a.transientFailure&&a.idempotent&&a.noWriteVerified&&a.attemptCount<3) return {action:"BOUNDED_RETRY",reason:"SAFE_TRANSIENT_NO_WRITE",retry:true,delaySuggestionSeconds:5};
  if(a.transientFailure&&a.attemptCount>=3) return {action:"DIAGNOSE_OR_CLOSE_PARTIAL",reason:"RETRY_LIMIT",retry:false,fullPass:false};
  return {action:"ONE_RELEVANT_NEXT_STEP",reason:"NO_LOOP_PROVEN",retry:false};
}
