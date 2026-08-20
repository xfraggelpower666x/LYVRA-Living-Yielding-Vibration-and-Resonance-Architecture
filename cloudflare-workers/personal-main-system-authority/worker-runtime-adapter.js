import baseWorker from "./worker.js";

const CAPABILITY_REVISION = "FOREGROUND_RECOVERY_CONTEXT_V1";
const MAX_CONTEXT_VALUE = 160;

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/v2/foreground-evidence") {
      return issuePurposeEvidence(request, env, ctx, "FOREGROUND");
    }

    if (request.method === "POST" && url.pathname === "/v2/recovery-evidence") {
      return issuePurposeEvidence(request, env, ctx, "RECOVERY");
    }

    const response = await baseWorker.fetch(request, env, ctx);
    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return decorateCapabilityResponse(response);
    }
    return response;
  }
};

async function issuePurposeEvidence(request, env, ctx, purpose) {
  let body;
  try {
    body = await request.json();
  } catch {
    return evidenceError("WORKER_REACHABLE_NO_VALID_EVIDENCE", "JSON_OBJECT_REQUIRED", 400);
  }

  if (!body || Array.isArray(body) || typeof body !== "object") {
    return evidenceError("WORKER_REACHABLE_NO_VALID_EVIDENCE", "JSON_OBJECT_REQUIRED", 400);
  }

  const selector = clean(body.system_id || body.namespace || body.system);
  if (!selector) return evidenceError("WORKER_REACHABLE_NO_VALID_EVIDENCE", "SYSTEM_SELECTOR_MISSING", 400);

  const rootUrl = new URL(request.url);
  rootUrl.pathname = "/v2/authority-root";
  rootUrl.search = "";
  rootUrl.searchParams.set("system", selector);

  const rootResponse = await baseWorker.fetch(new Request(rootUrl.toString(), { method: "GET", headers: request.headers }), env, ctx);
  const rootData = await readJson(rootResponse);
  if (!rootResponse.ok || !rootData?.authority_root) return passThroughJson(rootResponse, rootData);

  const root = rootData.authority_root;
  const mismatch = compareExpectedContext(body, root);
  if (mismatch) {
    return evidenceError("WORKER_CONFLICT", mismatch, 409, {
      expected_system_id: clean(body.expected_system_id) || null,
      expected_namespace: clean(body.expected_namespace) || null,
      expected_authority_context: clean(body.expected_authority_context) || null,
      expected_root_revision: text(body.expected_root_revision) || null,
      observed_system_id: root.system_id,
      observed_namespace: root.namespace,
      observed_authority_context: root.authority_context,
      observed_root_revision: root.root_revision
    });
  }

  const requestContext = compactContext({
    native_operation: purpose === "FOREGROUND" ? "SYSTEM_VORNE" : "FUCK_HORST",
    current_pointer_revision: body.current_pointer_revision,
    current_root_revision: body.current_root_revision,
    requested_target_state: body.requested_target_state,
    continuity_pointer_id: body.continuity_pointer_id
  });

  const sessionContext = compactContext({
    session_state_id: body.session_state_id,
    session_revision: body.session_revision,
    session_freshness_marker: body.session_freshness_marker,
    active_namespace: body.active_namespace,
    active_system_id: body.active_system_id
  });

  const evidenceBody = {
    system: selector,
    purpose,
    branch_class: "MAIN_PERSONAL",
    host_id: body.host_id || root.execution_host,
    authority_context: root.authority_context,
    request_context: requestContext,
    session_context: sessionContext
  };

  const evidenceUrl = new URL(request.url);
  evidenceUrl.pathname = "/v2/evidence-ticket";
  evidenceUrl.search = "";

  const evidenceResponse = await baseWorker.fetch(new Request(evidenceUrl.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(evidenceBody)
  }), env, ctx);

  const evidenceData = await readJson(evidenceResponse);
  if (!evidenceResponse.ok || !evidenceData) return passThroughJson(evidenceResponse, evidenceData);

  return jsonResponse({
    ...evidenceData,
    capability_revision: CAPABILITY_REVISION,
    native_operation: purpose === "FOREGROUND" ? "SYSTEM_VORNE" : "FUCK_HORST",
    execution_semantics: "EVIDENCE_ONLY_NON_MUTATING",
    worker_executes_native_command: false,
    canonical_authority_replaced: false,
    comparison_context: {
      expected_context_checked: true,
      current_pointer_revision: text(body.current_pointer_revision),
      current_root_revision: text(body.current_root_revision),
      session_state_id: text(body.session_state_id),
      session_revision: text(body.session_revision),
      active_namespace: clean(body.active_namespace) || null,
      active_system_id: clean(body.active_system_id) || null
    },
    signed_context_note: "request_context and session_context are embedded inside the signed evidence ticket",
    signing_secret_exposed: false
  }, evidenceResponse.status);
}

function compareExpectedContext(body, root) {
  const checks = [
    [clean(body.expected_system_id), clean(root.system_id), "EXPECTED_SYSTEM_ID_MISMATCH"],
    [clean(body.expected_namespace), clean(root.namespace), "EXPECTED_NAMESPACE_MISMATCH"],
    [clean(body.expected_authority_context), clean(root.authority_context), "EXPECTED_AUTHORITY_CONTEXT_MISMATCH"],
    [text(body.expected_root_revision), text(root.root_revision), "EXPECTED_ROOT_REVISION_MISMATCH"]
  ];
  for (const [expected, actual, reason] of checks) {
    if (expected && expected !== actual) return reason;
  }
  return null;
}

async function decorateCapabilityResponse(response) {
  const data = await readJson(response);
  if (!data) return response;
  return jsonResponse({
    ...data,
    capability_revision: CAPABILITY_REVISION,
    native_evidence_adapters: {
      foreground: "POST /v2/foreground-evidence",
      recovery: "POST /v2/recovery-evidence"
    },
    worker_executes_native_command: false,
    secret_exposed: false
  }, response.status, response.headers);
}

function compactContext(input) {
  const compact = {};
  for (const [key, value] of Object.entries(input)) {
    const v = text(value);
    if (v) compact[key] = v.slice(0, MAX_CONTEXT_VALUE);
  }
  return Object.keys(compact).length ? JSON.stringify(compact) : null;
}

function clean(value) {
  return String(value || "").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function text(value) {
  if (value === undefined || value === null) return null;
  const v = String(value).trim();
  return v ? v.slice(0, MAX_CONTEXT_VALUE) : null;
}

async function readJson(response) {
  try { return await response.clone().json(); } catch { return null; }
}

function passThroughJson(response, data) {
  return data ? jsonResponse(data, response.status, response.headers) : response;
}

function evidenceError(workerStatus, reason, status = 200, extra = {}) {
  return jsonResponse({
    ok: false,
    valid: false,
    worker_status: workerStatus,
    evidence_available: false,
    reason,
    system_failure_claimed: false,
    canonical_authority_replaced: false,
    host_authority_granted: false,
    cross_system_mutation_allowed: false,
    worker_executes_native_command: false,
    signing_secret_exposed: false,
    ...extra
  }, status);
}

function jsonResponse(data, status = 200, sourceHeaders = null) {
  const headers = new Headers(sourceHeaders || {});
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");
  headers.set("Access-Control-Allow-Origin", "*");
  return new Response(JSON.stringify(data, null, 2), { status, headers });
}
