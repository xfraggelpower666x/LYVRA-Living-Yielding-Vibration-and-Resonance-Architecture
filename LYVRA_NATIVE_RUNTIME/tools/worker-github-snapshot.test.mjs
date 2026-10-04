import test from "node:test";import assert from "node:assert/strict";
import {verifyGitHubCarrierSnapshot} from "./worker-github-snapshot.mjs";
import {NATIVE_EXPECTED_REPOSITORY,NATIVE_REQUIRED_DOMAINS} from "./worker-native-context.mjs";
const h="a".repeat(40),p="b".repeat(40),m="c".repeat(40),f="d".repeat(40);
const anchors=["LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json","LYVRA_NATIVE_RUNTIME/AUTHORITY_CONTRACT.md","LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json","LYVRA_NATIVE_RUNTIME/migration/COVERAGE_LEDGER.json","LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json","LYVRA_NATIVE_RUNTIME/continuity/VERSION_FRESHNESS_GUARD.md"];
function fixture(){const tree={truncated:false,tree:anchors.map((path,i)=>({path,sha: [p,h,m,h,f,h][i]}))};
return {repository:NATIVE_EXPECTED_REPOSITORY,branch:"lyvra",headSha:h,tree,
registry:{critical_carriers:{"LYVRA_NATIVE_RUNTIME/AUTHORITY_CONTRACT.md":h}},
envelope:{schema:"LYVRA_NATIVE_EVIDENCE_CONTEXT_V1",system_id:"LYVRA",namespace:"LYVRA",branch_class:"MAIN_PERSONAL",repository:NATIVE_EXPECTED_REPOSITORY,branch:"lyvra",commit_sha:h,pointer_blob_sha:p,manifest_blob_sha:m,fingerprint_registry_blob_sha:f,freshness_epoch:"2026-10-01-REV92-U4-NEWCHAT",domain_coverage:Object.fromEntries(NATIVE_REQUIRED_DOMAINS.map(d=>[d,"VERIFIED"])),request_nonce:"nonce-0123456789abcdefghijk"}};}
test("carrier proof is a consistency observation, never a full rehydration claim",()=>{
 const x=verifyGitHubCarrierSnapshot(fixture());assert.equal(x.status,"CARRIER_SNAPSHOT_CONSISTENT");assert.equal(x.verified,false);assert.equal(x.critical_carriers_checked,1);
});
test("truncated tree is rejected",()=>{const x=fixture();x.tree.truncated=true;assert.equal(verifyGitHubCarrierSnapshot(x).reason,"INCOMPLETE_TREE");});
test("missing anchor rejected",()=>{const x=fixture();x.tree.tree.shift();assert.match(verifyGitHubCarrierSnapshot(x).reason,/ANCHOR_MISSING/);});
test("unmatched registry critical git blob rejected",()=>{const x=fixture();x.registry.critical_carriers["LYVRA_NATIVE_RUNTIME/AUTHORITY_CONTRACT.md"]=m;assert.match(verifyGitHubCarrierSnapshot(x).reason,/CRITICAL_SHA_MISMATCH/);});
test("forged envelope commit rejected",()=>{const x=fixture();x.envelope.commit_sha="e".repeat(40);assert.equal(verifyGitHubCarrierSnapshot(x).reason,"HEAD_ENVELOPE_MISMATCH");});
test("forged pointer SHA rejected",()=>{const x=fixture();x.envelope.pointer_blob_sha=h;assert.match(verifyGitHubCarrierSnapshot(x).reason,/ENVELOPE_CARRIER_MISMATCH/);});
test("foreign repo or branch rejected",()=>{const x=fixture();x.repository="other/repo";assert.equal(verifyGitHubCarrierSnapshot(x).reason,"FOREIGN_REPOSITORY");const y=fixture();y.branch="main";assert.equal(verifyGitHubCarrierSnapshot(y).reason,"FOREIGN_REPOSITORY");});
test("duplicate and malformed entries are rejected",()=>{const x=fixture();x.tree.tree.push(x.tree.tree[0]);assert.equal(verifyGitHubCarrierSnapshot(x).reason,"DUPLICATE_TREE_ENTRY");const y=fixture();y.tree.tree[0].sha="invalid";assert.equal(verifyGitHubCarrierSnapshot(y).reason,"TREE_ENTRY_INVALID");});
test("empty critical registry is not a pass",()=>{const x=fixture();x.registry.critical_carriers={};assert.equal(verifyGitHubCarrierSnapshot(x).reason,"CRITICAL_REGISTRY_MISSING");});

test("partial mandatory domain fails snapshot consistency",()=>{const x=fixture();x.envelope.domain_coverage.MEANING_LINEAGE="READBACK_PENDING";assert.equal(verifyGitHubCarrierSnapshot(x).reason,"INVALID_NATIVE_ENVELOPE");});
