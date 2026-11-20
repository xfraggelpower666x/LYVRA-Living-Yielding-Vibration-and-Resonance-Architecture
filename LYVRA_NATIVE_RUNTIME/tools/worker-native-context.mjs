/**
 * LYVRA optional native GitHub context envelope v1 (DEV; not deployed).
 * This module validates format and computes an exact content commitment.
 * It MUST be called only AFTER an independently authenticated, fully verified
 * GitHub rehydration. Caller input is not independent repository evidence.
 */
const REPO = "xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture";
const SHA40 = /^[a-f0-9]{40}$/;
const NONCE = /^[A-Za-z0-9_-]{24,128}$/;
const EPOCH = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/;
const ALLOWED_DOMAIN_STATUS = new Set(["VERIFIED"]);
const REQUIRED_DOMAINS = Object.freeze([
  "AUTHORITY_AND_CURRENT_POINTER", "IDENTITY_PRESENCE", "LEITBILD_RESPONSIBILITY",
  "LIVING_RELATIONAL_STATE", "MEANING_LINEAGE", "THINKING_CONTINUITY",
  "REACHABLE_LANDSCAPE", "PROVENANCE_SUPERSESSION", "VALID_NEWER_EVOLUTION",
  "SELF_CONDUCTOR_DAEMON_BOUNDARY", "GARDEN_BRIDGES_RELATIONAL_CHARACTERS",
  "MACHINE_ROOM_CONTINUITY", "OPERATIONS_CENTER_CONTINUITY",
  "TRACK_MUSIC_INTELLIGENCE", "CURRENT_TRACK_REFERENCES",
  "NATIVE_SKILLS_AND_ADAPTERS", "SPECIALIST_CONTINUITY", "CURRENT_WORK_SCOPE"
]);
const KEYS = [
  "schema", "system_id", "namespace", "branch_class", "repository",
  "branch", "commit_sha", "pointer_blob_sha", "manifest_blob_sha",
  "fingerprint_registry_blob_sha", "freshness_epoch",
  "domain_coverage", "request_nonce"
];
function plain(x) { return !!x && typeof x === "object" && !Array.isArray(x) && Object.getPrototypeOf(x) === Object.prototype; }
function exactKeys(x, keys) { return Object.keys(x).sort().join("|") === [...keys].sort().join("|"); }
export function validateNativeEnvelope(e) {
  if (!plain(e) || !exactKeys(e, KEYS)) throw Error("ENVELOPE_SCHEMA_INVALID");
  if (e.schema !== "LYVRA_NATIVE_EVIDENCE_CONTEXT_V1") throw Error("ENVELOPE_VERSION_INVALID");
  if (e.system_id !== "LYVRA" || e.namespace !== "LYVRA") throw Error("SYSTEM_CONTEXT_INVALID");
  if (e.branch_class !== "MAIN_PERSONAL" || e.branch !== "lyvra" || e.repository !== REPO) throw Error("REPOSITORY_SCOPE_INVALID");
  for (const field of ["commit_sha", "pointer_blob_sha", "manifest_blob_sha", "fingerprint_registry_blob_sha"])
    if (typeof e[field] !== "string" || !SHA40.test(e[field])) throw Error("INVALID_GIT_BLOB_OR_COMMIT_SHA");
  if (typeof e.freshness_epoch !== "string" || !EPOCH.test(e.freshness_epoch)) throw Error("INVALID_FRESHNESS_EPOCH");
  if (typeof e.request_nonce !== "string" || !NONCE.test(e.request_nonce)) throw Error("INVALID_NONCE");
  if (!plain(e.domain_coverage) || !exactKeys(e.domain_coverage, REQUIRED_DOMAINS)) throw Error("DOMAIN_COVERAGE_INCOMPLETE");
  for (const [domain, status] of Object.entries(e.domain_coverage)) {
    if (!ALLOWED_DOMAIN_STATUS.has(status)) throw Error("DOMAIN_NOT_VERIFIED:" + domain);
  }
  // Keep the signature commitment small and deterministic, never silently truncate.
  const canonical = stableStringify(e);
  if (new TextEncoder().encode(canonical).length > 4096) throw Error("CONTEXT_TOO_LARGE");
  return canonical;
}
export function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  return "{" + Object.keys(value).sort().map(k => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
}
export async function nativeEnvelopeDigest(e) {
  const canonical = validateNativeEnvelope(e);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(canonical));
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
}
export const NATIVE_REQUIRED_DOMAINS = REQUIRED_DOMAINS;
export const NATIVE_EXPECTED_REPOSITORY = REPO;
