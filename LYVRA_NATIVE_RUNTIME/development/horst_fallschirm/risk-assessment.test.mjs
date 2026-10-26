// Three bounded source acceptance cases, no external operations.
import { strict as assert } from "node:assert";
import { assessRisk } from "./risk-assessment.mjs";
let count = 0;
const expect = (label, fn) => { fn(); count++; console.log("PASS", label); };
expect("1: unknown write result contains consequences", () => {
  const x = assessRisk({ unknownWriteOutcome: true, sameActionRetry: true, sameActionAttempts: 3 });
  assert.equal(x.protectionActive, true);
  assert.equal(x.level, "CONTROLLED_HALT_RECOMMENDED");
  assert.ok(x.signals.includes("UNKNOWN_WRITE"));
  assert.equal(x.writesPerformed, false);
});
expect("2: benign warning does not stop work", () => {
  const x = assessRisk({ staleOrContradictoryRehydration: true, dependentProtectedAction: false });
  assert.equal(x.protectionActive, false);
  assert.equal(x.level, "OBSERVE");
});
expect("3: verified recovery releases stale protection", () => {
  const x = assessRisk({ previousProtection: {active: true}, freshAuthorityVerified: true, independentReadbackVerified: true, scopeAuthorized: true });
  assert.equal(x.protectionActive, false);
  assert.equal(x.releaseEligible, true);
});
console.log(count + "/3 SOURCE ACCEPTANCE PASS; HOST ACCEPTANCE PENDING");
