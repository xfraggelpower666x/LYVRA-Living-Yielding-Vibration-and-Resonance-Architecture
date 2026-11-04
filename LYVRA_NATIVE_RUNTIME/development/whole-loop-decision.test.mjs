import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyWholeLoop } from './whole-loop-decision.mjs';

// Original source-backed negative/positive cases for DEV candidate; no host or live-system claims.
test("repeated identical inspections", () => {
  const got = classifyWholeLoop({"sameQuestion":true,"sameEvidenceFingerprint":true,"equivalentCheckCount":3});
  assert.equal(got.action, "STOP_LOOP");
});
test("second equivalent cycle", () => {
  const got = classifyWholeLoop({"sameQuestion":true,"sameEvidenceFingerprint":true,"equivalentCheckCount":2});
  assert.equal(got.action, "STOP_LOOP");
});
test("new source supersedes repeated checks", () => {
  const got = classifyWholeLoop({"sameQuestion":true,"sameEvidenceFingerprint":true,"equivalentCheckCount":10,"evidenceChanged":true});
  assert.equal(got.action, "TARGETED_CHECK");
});
test("mandatory source not bypassed", () => {
  const got = classifyWholeLoop({"mandatorySourceMissing":true,"sameQuestion":true,"sameEvidenceFingerprint":true,"equivalentCheckCount":10});
  assert.equal(got.action, "READ_REQUIRED_SOURCE_OR_CLOSE_PARTIAL");
});
test("explicit safety denial blocks retry", () => {
  const got = classifyWholeLoop({"explicitSecurityDenial":true,"transientFailure":true,"idempotent":true,"noWriteVerified":true,"attemptCount":1});
  assert.equal(got.action, "STOP_BLOCKED");
});
test("permission denial blocks retry", () => {
  const got = classifyWholeLoop({"explicitPermissionDenial":true,"attemptCount":1});
  assert.equal(got.action, "STOP_BLOCKED");
});
test("foreign authority conflict blocks", () => {
  const got = classifyWholeLoop({"foreignAuthorityConflict":true});
  assert.equal(got.action, "STOP_BLOCKED");
});
test("unknown write requires reconcile", () => {
  const got = classifyWholeLoop({"writeOutcomeUnknown":true,"transientFailure":true,"attemptCount":1});
  assert.equal(got.action, "RECONCILE_READBACK");
});
test("safe idempotent retry bounded", () => {
  const got = classifyWholeLoop({"transientFailure":true,"idempotent":true,"noWriteVerified":true,"attemptCount":2});
  assert.equal(got.action, "BOUNDED_RETRY");
});
test("third failure ends retries", () => {
  const got = classifyWholeLoop({"transientFailure":true,"idempotent":true,"noWriteVerified":true,"attemptCount":3});
  assert.equal(got.action, "DIAGNOSE_OR_CLOSE_PARTIAL");
});
test("successful result ends checks", () => {
  const got = classifyWholeLoop({"verifiedCompletion":true,"sameQuestion":true,"sameEvidenceFingerprint":true,"equivalentCheckCount":10});
  assert.equal(got.action, "STOP_RETURN_TO_WORK");
});
test("nonidempotent operation cannot auto retry", () => {
  const got = classifyWholeLoop({"transientFailure":true,"idempotent":false,"noWriteVerified":true,"attemptCount":1});
  assert.equal(got.action, "ONE_RELEVANT_NEXT_STEP");
});
test("fresh question does not trigger loop", () => {
  const got = classifyWholeLoop({"sameQuestion":false,"equivalentCheckCount":1});
  assert.equal(got.action, "ONE_RELEVANT_NEXT_STEP");
});
