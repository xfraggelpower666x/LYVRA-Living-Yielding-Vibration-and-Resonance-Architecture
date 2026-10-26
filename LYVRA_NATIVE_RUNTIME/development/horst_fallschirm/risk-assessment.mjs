// HORST-FALLSCHIRM R01 — pure, inert source candidate. No host hooks or writes.
export function assessRisk(input = {}) {
  const isTrue = x => x === true;
  const attempts = Number.isInteger(input.sameActionAttempts) && input.sameActionAttempts >= 0 ? input.sameActionAttempts : 0;
  const signals = [];
  if (isTrue(input.unexpectedHeadMovement)) signals.push("UNEXPECTED_HEAD");
  if (isTrue(input.unknownWriteOutcome)) signals.push("UNKNOWN_WRITE");
  if (isTrue(input.permissionBoundaryViolation)) signals.push("AUTHORITY_BOUNDARY");
  if (isTrue(input.criticalObservedMismatch)) signals.push("CRITICAL_MISMATCH");
  if (isTrue(input.staleOrContradictoryRehydration) && isTrue(input.dependentProtectedAction)) signals.push("STALE_PROTECTED_DEPENDENCY");
  if (attempts >= 3 && isTrue(input.sameActionRetry)) signals.push("RETRY_LIMIT");
  const verifiedClosure = isTrue(input.freshAuthorityVerified) && isTrue(input.independentReadbackVerified) && isTrue(input.scopeAuthorized) && !isTrue(input.unknownWriteOutcome) && !isTrue(input.unexpectedHeadMovement) && !isTrue(input.permissionBoundaryViolation) && !isTrue(input.criticalObservedMismatch) && !isTrue(input.staleOrContradictoryRehydration);
  const previous = input.previousProtection && typeof input.previousProtection === "object" ? input.previousProtection : null;
  const clearable = previous?.active === true && signals.length === 0 && verifiedClosure;
  const protectionActive = signals.length > 0 || (previous?.active === true && !clearable);
  const level = protectionActive ? (signals.some(s => ["AUTHORITY_BOUNDARY","UNKNOWN_WRITE","UNEXPECTED_HEAD","CRITICAL_MISMATCH"].includes(s)) ? "CONTROLLED_HALT_RECOMMENDED" : "HOLD_AFFECTED_ACTION_RECOMMENDED") : "OBSERVE";
  return Object.freeze({
    schema: "LYVRA_HORST_FALLSCHIRM_R01_RESULT",
    active: false,
    proposalOnly: true,
    signals: Object.freeze(signals),
    level,
    protectionActive,
    releaseEligible: clearable,
    action: protectionActive ? "RECOMMEND_READ_ONLY_AND_NO_UNVERIFIED_RETRY_FOR_AFFECTED_OPERATION" : "NO_ADDITIONAL_RESTRICTION",
    authority: "WHOLE_LYVRA_ONLY",
    hostHookInstalled: false,
    writesPerformed: false
  });
}
