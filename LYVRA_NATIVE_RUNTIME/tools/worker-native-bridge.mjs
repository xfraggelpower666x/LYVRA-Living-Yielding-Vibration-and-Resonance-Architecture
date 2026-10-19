/**
 * LYVRA native/Worker public evidence bridge (DEV, read-only).
 *
 * The native GitHub rehydrator owns trust in the pinned repository snapshot.
 * This bridge never treats a caller-supplied envelope as proof of that read.
 * This bridge does NOT issue evidence tickets, claim authentication, or
 * promote the Worker to decision/canonical authority.
 */
import { nativeEnvelopeDigest, validateNativeEnvelope } from "./worker-native-context.mjs";

export const WORKER_URL = "https://lyvrasystem.666soundsdesign-broadcaster.com";
const EXPECTED_SERVICE = "666_MAIN_SYSTEM_AUTHORITY_EVIDENCE_GATE";

function fail(reason, extra = {}) {
  return Object.freeze({ state: reason, worker_evidence_valid: false, ...extra });
}
function object(x) { return x && typeof x === "object" && !Array.isArray(x); }
function protectedResponse(root) {
  const a = root?.authority_root;
  if (!object(root) || root.ok !== true || root.worker_status !== "WORKER_VERIFIED" || !object(a)) return false;
  if (a.system_id !== "LYVRA" || a.namespace !== "LYVRA" || a.authority_context !== "LYVRA_MAIN_PERSONAL" ||
      a.branch_class !== "MAIN_PERSONAL" || a.execution_host !== "CHATGPT_EXECUTION_LAYER") return false;
  const p = a.authority, policy = a.evidence_policy;
  if (!object(p) || !object(policy)) return false;
  for (const key of ["worker_is_absolute_root_of_trust", "worker_is_system_owner",
    "worker_is_creative_authority", "worker_replaces_canonical_storage",
    "host_may_claim_authority", "host_may_impersonate_system"])
    if (p[key] !== false) return false;
  return policy.worker_unavailable_is_system_failure === false &&
    policy.personal_main_system_only === true &&
    policy.portable_branch_inherits_worker === false &&
    policy.cross_system_authority_inheritance === false;
}

/**
 * @param {object} args
 * @param {object} args.nativeEnvelope - schema-valid descriptor only, not proof
 * @param {boolean} args.nativeReadbackVerified - true only from external rehydrator
 * @param {Function} args.fetchImpl - caller injected fetch for network/mock
 * @returns Read-only observation with separate states.
 */
export async function observeWorkerAfterRehydration({
  nativeEnvelope, nativeReadbackVerified = false, fetchImpl, timeoutMs = 5000
}) {
  if (nativeReadbackVerified !== true) return fail("NATIVE_REHYDRATION_PENDING");
  try { validateNativeEnvelope(nativeEnvelope); }
  catch { return fail("NATIVE_CONTEXT_INVALID"); }
  if (typeof fetchImpl !== "function") return fail("WORKER_CLIENT_UNAVAILABLE");
  if (!Number.isInteger(timeoutMs) || timeoutMs < 100 || timeoutMs > 10000) return fail("BAD_TIMEOUT");
  const digest = await nativeEnvelopeDigest(nativeEnvelope);
  let response;
  try {
    response = await fetchImpl(WORKER_URL + "/v2/authority-root?system=LYVRA", {
      method: "GET", redirect: "error",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (!response || response.status !== 200) return fail("WORKER_UNAVAILABLE", { native_context_digest: digest });
    const contentType = response.headers?.get?.("content-type") || "";
    if (!contentType.toLowerCase().includes("application/json")) return fail("WORKER_INVALID_RESPONSE", { native_context_digest: digest });
    const advertisedSize = Number(response.headers?.get?.("content-length") || 0);
    if (advertisedSize > 65536) return fail("WORKER_INVALID_RESPONSE", { native_context_digest: digest });
    const raw = await response.text();
    if (new TextEncoder().encode(raw).length > 65536) return fail("WORKER_INVALID_RESPONSE", { native_context_digest: digest });
    const data = JSON.parse(raw);
    if (!protectedResponse(data)) return fail("WORKER_CONTEXT_CONFLICT", { native_context_digest: digest });
    return Object.freeze({
      state: "WORKER_PUBLIC_CONTEXT_OBSERVED",
      worker_evidence_valid: false,
      native_context_digest: digest,
      worker_root_checksum: typeof data.root_checksum === "string" ? data.root_checksum : null,
      note: "Public worker context matches; no authenticated ticket or independent GitHub verification."
    });
  } catch {
    return fail("WORKER_UNAVAILABLE", { native_context_digest: digest });
  }
}
