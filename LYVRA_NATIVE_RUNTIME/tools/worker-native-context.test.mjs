import test from "node:test";
import assert from "node:assert/strict";
import { nativeEnvelopeDigest, validateNativeEnvelope, NATIVE_REQUIRED_DOMAINS, NATIVE_EXPECTED_REPOSITORY } from "./worker-native-context.mjs";
const hex = "abcdef0123456789abcdef0123456789abcdef01";
const envelope = () => ({
 schema: "LYVRA_NATIVE_EVIDENCE_CONTEXT_V1",system_id:"LYVRA",namespace:"LYVRA",
 branch_class:"MAIN_PERSONAL",repository:NATIVE_EXPECTED_REPOSITORY,branch:"lyvra",
 commit_sha:hex,pointer_blob_sha:hex,manifest_blob_sha:hex,fingerprint_registry_blob_sha:hex,
 freshness_epoch:"2026-10-01-REV92-U4-NEWCHAT",
 domain_coverage:Object.fromEntries(NATIVE_REQUIRED_DOMAINS.map(x=>[x,"VERIFIED"])),
 request_nonce:"nonce-0123456789abcdefghijk"
});
test("canonical digest is deterministic without involving a network",async()=>{
 const a=envelope(), b={...a,domain_coverage:Object.fromEntries(Object.entries(a.domain_coverage).reverse())};
 assert.equal(await nativeEnvelopeDigest(a),await nativeEnvelopeDigest(b));
 assert.match(await nativeEnvelopeDigest(a),/^[a-f0-9]{64}$/);
});
test("tampered current HEAD changes commitment",async()=>{
 const a=envelope(),b={...a,commit_sha:"1".repeat(40)};
 assert.notEqual(await nativeEnvelopeDigest(a),await nativeEnvelopeDigest(b));
});
test("unknown or missing domain fails closed",()=>{
 const a=envelope();delete a.domain_coverage.MEANING_LINEAGE;
 assert.throws(()=>validateNativeEnvelope(a),/DOMAIN_COVERAGE_INCOMPLETE/);
});
test("partial domain fails closed",()=>{
 const a=envelope();a.domain_coverage.MEANING_LINEAGE="READBACK_PENDING";
 assert.throws(()=>validateNativeEnvelope(a),/DOMAIN_NOT_VERIFIED/);
});
test("foreign or portable identity is rejected",()=>{
 for(const [key,value] of [["namespace","666CLIC"],["branch_class","PORTABLE"],["branch","main"],["repository","other/repo"]]) {
  const a=envelope();a[key]=value;assert.throws(()=>validateNativeEnvelope(a));
 }
});
test("invalid hash, missing nonce and unexpected fields rejected",()=>{
 for(const [key,value] of [["commit_sha","not-a-sha"],["request_nonce","short"],["freshness_epoch",""]]) {
  const a=envelope();a[key]=value;assert.throws(()=>validateNativeEnvelope(a));
 }
 const x=envelope();x.extra="a";assert.throws(()=>validateNativeEnvelope(x),/ENVELOPE_SCHEMA_INVALID/);
});
test("unjustified NOT_APPLICABLE is rejected",()=>{
 const a=envelope();a.domain_coverage.CURRENT_TRACK_REFERENCES="NOT_APPLICABLE";
 assert.throws(()=>validateNativeEnvelope(a),/DOMAIN_NOT_VERIFIED/);
});
