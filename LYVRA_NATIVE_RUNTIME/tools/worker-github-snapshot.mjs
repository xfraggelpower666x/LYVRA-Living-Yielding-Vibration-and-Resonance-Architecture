/**
 * LYVRA GitHub carrier snapshot consistency, DEV / read-only / NO AUTHORITY.
 * Consumes externally fetched *pinned* Git tree and native registry.
 * Checks object consistency; never claims it fetched those objects itself.
 * Full native semantic rehydration and private recovery remain separate gates.
 */
import { NATIVE_EXPECTED_REPOSITORY, validateNativeEnvelope } from "./worker-native-context.mjs";
const sha40 = /^[0-9a-f]{40}$/;
const REQUIRED = [
 "LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json",
 "LYVRA_NATIVE_RUNTIME/AUTHORITY_CONTRACT.md",
 "LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json",
 "LYVRA_NATIVE_RUNTIME/migration/COVERAGE_LEDGER.json",
 "LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json",
 "LYVRA_NATIVE_RUNTIME/continuity/VERSION_FRESHNESS_GUARD.md"
];
const goodRecord = o => !!o && typeof o === "object" && !Array.isArray(o);
export function verifyGitHubCarrierSnapshot({repository, branch, headSha, tree, registry, envelope}) {
  const failed = reason => ({status:"CARRIER_SNAPSHOT_CONFLICT", reason, verified:false});
  if(repository !== NATIVE_EXPECTED_REPOSITORY || branch !== "lyvra") return failed("FOREIGN_REPOSITORY");
  if(typeof headSha !== "string" || !sha40.test(headSha)) return failed("INVALID_HEAD");
  if(!goodRecord(tree) || tree.truncated !== false || !Array.isArray(tree.tree)) return failed("INCOMPLETE_TREE");
  const carrierMap = new Map();
  for(const entry of tree.tree) {
    if(typeof entry?.path !== "string" || typeof entry?.sha !== "string" || !sha40.test(entry.sha)) return failed("TREE_ENTRY_INVALID");
    if(carrierMap.has(entry.path)) return failed("DUPLICATE_TREE_ENTRY");
    carrierMap.set(entry.path,entry.sha);
  }
  for (const path of REQUIRED) if(!carrierMap.has(path)) return failed("ANCHOR_MISSING:"+path);
  if(!goodRecord(registry) || !goodRecord(registry.critical_carriers) || Object.keys(registry.critical_carriers).length === 0)
    return failed("CRITICAL_REGISTRY_MISSING");
  for(const [path,expected] of Object.entries(registry.critical_carriers)) {
    if(!sha40.test(expected) || carrierMap.get(path) !== expected) return failed("CRITICAL_SHA_MISMATCH:"+path);
  }
  if(!goodRecord(envelope)) return failed("ENVELOPE_MISSING");
  try { validateNativeEnvelope(envelope); } catch { return failed("INVALID_NATIVE_ENVELOPE"); }
  if(envelope.repository !== repository || envelope.branch !== branch || envelope.commit_sha !== headSha) return failed("HEAD_ENVELOPE_MISMATCH");
  for (const [key,path] of [
    ["pointer_blob_sha","LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json"],
    ["manifest_blob_sha","LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json"],
    ["fingerprint_registry_blob_sha","LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json"]]) {
    if(envelope[key] !== carrierMap.get(path)) return failed("ENVELOPE_CARRIER_MISMATCH:"+key);
  }
  return Object.freeze({
    status:"CARRIER_SNAPSHOT_CONSISTENT",
    verified:false,
    critical_carriers_checked:Object.keys(registry.critical_carriers).length,
    commit_sha:headSha,
    limitation:"Does not prove GitHub origin, direct full reads, semantic rehydration or Worker signatures."
  });
}
