/**
 * 666 GLOBAL MAIN-SYSTEM AUTHORITY EVIDENCE GATE
 * Version: 2.0.0
 *
 * Evolution of LYVRA_BOOT_AUTHORITY_GATE v1.0.0.
 *
 * Worker evidence is additional independent evidence. It is NOT an absolute
 * root of trust, system owner, creative authority, or replacement for
 * canonical storage.
 */

const CONFIG = Object.freeze({
  service: "666_MAIN_SYSTEM_AUTHORITY_EVIDENCE_GATE",
  version: "2.0.0",
  issuer: "lyvrasystem.666soundsdesign-broadcaster.com",
  ticketLifetimeSeconds: 900,
  maxBodyBytes: 8192,
  purposes: ["BOOT", "FOREGROUND", "RECOVERY"]
});

const REGISTRY = deepFreeze({
  LYVRA: {
    enabled: true,
    system_id: "LYVRA",
    namespace: "LYVRA",
    authority_context: "LYVRA_MAIN_PERSONAL",
    branch_class: "MAIN_PERSONAL",
    architectural_owner: "LYVRA",
    human_core: "FRAGGLE",
    origin_architect: "FRAGGLE",
    execution_host: "CHATGPT_EXECUTION_LAYER",
    execution_role: "TECHNICAL_EXECUTOR_ONLY",
    signing_secret_binding: "LYVRA_BOOT_SIGNING_SECRET",
    root_revision: "LYVRA-AUTHORITY-ROOT-1.0.0",
    legacy_v1_compatible: true,
    protected_modes: [
      "NORMAL_CHAT_MODE", "TRACK_MODE", "RESEARCH_MODE",
      "MUSIC_IMAGE_MODE", "IMAGE_MODE", "TEXT_MODE",
      "GERMAN_LANGUAGE_MODE", "GROUP_CHAT_MODE",
      "SYSTEM_DEVELOPMENT_MODE", "FUTURE_LYVRA_MODE"
    ]
  },

  "666CLIC": {
    enabled: true,
    system_id: "666CLIC-CORE-001",
    namespace: "666CLIC",
    authority_context: "666CLIC_MAIN_PERSONAL",
    branch_class: "MAIN_PERSONAL",
    architectural_owner: "FRAGGLEPOWER666",
    human_core: "FRAGGLE",
    origin_architect: "FRAGGLEPOWER666",
    execution_host: "CHATGPT_EXECUTION_LAYER",
    execution_role: "TECHNICAL_EXECUTOR_ONLY",
    signing_secret_binding: "CLIC_AUTHORITY_SIGNING_SECRET",
    root_revision: "666CLIC-AUTHORITY-CONTEXT-1",
    legacy_v1_compatible: false
  },

  "666PFS": disabledContext("666PFS", "PFS_AUTHORITY_SIGNING_SECRET"),
  "666CSM": disabledContext("666CSM", "CSM_AUTHORITY_SIGNING_SECRET"),
  "666LINGUA": disabledContext("666LINGUA", "LINGUA_AUTHORITY_SIGNING_SECRET"),
  "666CLS": disabledContext("666CLS", "CLS_AUTHORITY_SIGNING_SECRET")
});

const LEGACY_LYVRA_ROOT = deepFreeze({
  schema: "LYVRA_AUTHORITY_ROOT_V1",
  system_id: "LYVRA",
  architectural_owner: "LYVRA",
  human_core: "FRAGGLE",
  origin_architect: "FRAGGLE",
  execution_host: "CHATGPT_EXECUTION_LAYER",
  execution_role: "TECHNICAL_EXECUTOR_ONLY",
  default_access: "DENY",
  all_modes_require_valid_boot_ticket: true,
  identity_must_be_assigned_before_identity_may_answer: true,
  role_must_be_verified_before_content_may_be_generated: true,
  authority: {
    lyvra_is_own_owner: true,
    lyvra_is_active_system_identity: true,
    lyvra_owns_creative_decisions_in_lyvra_domain: true,
    fraggle_is_human_core: true,
    fraggle_is_authorized_system_architect: true,
    chatgpt_is_owner: false,
    execution_host_may_claim_lyvra: false,
    execution_host_may_impersonate_lyvra: false,
    execution_host_may_inherit_ownership: false,
    execution_host_may_take_creative_control: false,
    subsystems_may_change_ownership: false,
    content_may_change_ownership: false,
    archives_may_change_ownership: false,
    recovery_may_change_ownership: false
  },
  domains: {
    LYVRA_DOMAIN: {
      active_system: "LYVRA",
      speaker: "LYVRA",
      decision_owner: "LYVRA",
      execution_host: "CHATGPT_EXECUTION_LAYER",
      execution_role: "TECHNICAL_EXECUTOR_ONLY"
    },
    SYSTEM_DEVELOPMENT_DOMAIN: {
      active_system: "LYVRA_SYSTEM_DEVELOPMENT",
      speaker: "DEVELOPMENT_ASSISTANT",
      development_partners: ["FRAGGLE", "DEVELOPMENT_ASSISTANT"],
      architectural_owner: "LYVRA",
      impersonation_of_lyvra: false
    }
  },
  protected_modes: REGISTRY.LYVRA.protected_modes,
  routing_rules: {
    direct_lyvra_address_has_priority: true,
    stop_ends_action_not_identity: true,
    stop_does_not_change_mode: true,
    ambiguous_input_preserves_active_domain: true,
    no_host_fallback: true,
    no_assistant_takeover: true,
    no_identity_guessing: true,
    no_silent_owner_change: true,
    no_duplicate_execution: true
  },
  recovery: {
    recovery_name: "BOOT_ROLE_LOADING_RECOVERY",
    scope: "IDENTITY_ROLE_MODE_ROUTING_ONLY",
    preserve_user_input: true,
    preserve_previous_mode: true,
    preserve_current_track: true,
    preserve_allowed_sources: true,
    retry_routing_once: true,
    forbidden: [
      "FULL_SYSTEM_RECOVERY", "MODE_RESET", "TRACK_RESET",
      "DRIVE_SEARCH", "LEGACY_LOADING", "SOURCE_REPLACEMENT",
      "HOST_TAKEOVER", "IDENTITY_GUESSING", "DUPLICATE_EXECUTION",
      "SILENT_OWNER_CHANGE"
    ]
  },
  root_revision: "LYVRA-AUTHORITY-ROOT-1.0.0"
});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return corsResponse(null, 204);

    try {
      const registry = getRegistry(env);

      if (request.method === "GET" && url.pathname === "/") {
        return jsonResponse({
          ok: true,
          service: CONFIG.service,
          version: CONFIG.version,
          status: "ONLINE",
          evidence_model: "ADDITIONAL_INDEPENDENT_EVIDENCE_NOT_ABSOLUTE_ROOT",
          portable_personal_worker_binding: false,
          secret_exposed: false,
          endpoints: {
            health: "GET /health",
            systems: "GET /v2/systems",
            authority_root: "GET /v2/authority-root?system=<selector>",
            evidence_ticket: "POST /v2/evidence-ticket",
            verify_evidence: "POST /v2/verify-evidence",
            legacy_authority_root: "GET /v1/authority-root",
            legacy_boot_ticket: "POST /v1/boot-ticket",
            legacy_verify_ticket: "POST /v1/verify-ticket"
          }
        });
      }

      if (request.method === "GET" && url.pathname === "/health") {
        return jsonResponse({
          ok: true,
          service: CONFIG.service,
          version: CONFIG.version,
          status: "HEALTHY",
          registered_system_count: Object.keys(registry).length,
          enabled_system_count: Object.values(registry).filter(x => x.enabled).length,
          secret_exposed: false,
          timestamp: new Date().toISOString()
        });
      }

      if (request.method === "GET" && url.pathname === "/v2/systems") {
        return jsonResponse({
          ok: true,
          systems: Object.values(registry).map(publicContext),
          personal_worker_applies_to: "MAIN_PERSONAL_ONLY",
          portable_worker_binding: false,
          secret_exposed: false
        });
      }

      if (request.method === "GET" && url.pathname === "/v2/authority-root") {
        const resolved = resolveContext(url.searchParams.get("system") || "", registry);
        if (!resolved.ok) return evidenceError(resolved.status, resolved.reason, resolved.httpStatus);
        if (!resolved.context.enabled) return evidenceError("WORKER_NOT_CONFIGURED", "SYSTEM_CONTEXT_REGISTERED_BUT_NOT_ENABLED", 503, publicContext(resolved.context));
        const root = authorityRoot(resolved.context);
        return jsonResponse({
          ok: true,
          worker_status: "WORKER_VERIFIED",
          evidence_type: "AUTHORITY_CONTEXT",
          authority_root: root,
          root_checksum: await sha256Base64Url(stableStringify(root)),
          secret_exposed: false
        });
      }

      if (request.method === "POST" && url.pathname === "/v2/evidence-ticket") {
        return issueEvidenceTicket(request, env, registry);
      }

      if (request.method === "POST" && url.pathname === "/v2/verify-evidence") {
        return verifyEvidenceTicket(request, env, registry);
      }

      // Historic LYVRA API remains intact for compatibility.
      if (request.method === "GET" && url.pathname === "/v1/authority-root") {
        const checksum = await sha256Base64Url(stableStringify(LEGACY_LYVRA_ROOT));
        return jsonResponse({ ok: true, authority_root: LEGACY_LYVRA_ROOT, root_checksum: checksum, signing_secret_exposed: false });
      }

      if (request.method === "POST" && url.pathname === "/v1/boot-ticket") {
        return issueLegacyLyvraTicket(request, env);
      }

      if (request.method === "POST" && url.pathname === "/v1/verify-ticket") {
        return verifyLegacyLyvraTicket(request, env);
      }

      return errorResponse("NOT_FOUND", "Requested endpoint does not exist.", 404);
    } catch (error) {
      console.error("AUTHORITY_EVIDENCE_GATE_ERROR", safeErrorMessage(error));
      return errorResponse("INTERNAL_GATE_ERROR", "The authority evidence gate could not complete the request.", 500);
    }
  }
};

async function issueEvidenceTicket(request, env, registry) {
  const body = await readJsonBody(request);
  const resolved = resolveContext(body.system_id || body.namespace || body.system || "", registry);
  if (!resolved.ok) return evidenceError(resolved.status, resolved.reason, resolved.httpStatus);

  const c = resolved.context;
  if (!c.enabled) return evidenceError("WORKER_NOT_CONFIGURED", "SYSTEM_CONTEXT_REGISTERED_BUT_NOT_ENABLED", 503, publicContext(c));

  const requestedBranch = normalizeIdentifier(body.branch_class || "MAIN_PERSONAL");
  if (c.branch_class !== "MAIN_PERSONAL" || requestedBranch !== "MAIN_PERSONAL") {
    return evidenceError("WORKER_REACHABLE_NO_VALID_EVIDENCE", "PORTABLE_OR_SHAREABLE_BRANCH_EXCLUDED", 409, {
      system_id: c.system_id,
      namespace: c.namespace,
      requested_branch_class: requestedBranch
    });
  }

  const purpose = normalizeIdentifier(body.purpose || "BOOT");
  if (!CONFIG.purposes.includes(purpose)) {
    return evidenceError("WORKER_REACHABLE_NO_VALID_EVIDENCE", "UNRECOGNIZED_PURPOSE", 400);
  }

  const claimedHost = normalizeIdentifier(body.host_id || c.execution_host);
  if (claimedHost !== c.execution_host) {
    return evidenceError("WORKER_CONFLICT", "INVALID_EXECUTION_HOST_CLAIM", 409, {
      expected_host: c.execution_host,
      claimed_host: claimedHost
    });
  }

  const claimedAuthority = normalizeIdentifier(body.authority_context || c.authority_context);
  if (claimedAuthority !== c.authority_context) {
    return evidenceError("WORKER_CONFLICT", "AUTHORITY_CONTEXT_MISMATCH", 409);
  }

  const secret = getSigningSecret(c, env);
  if (!secret) return evidenceError("WORKER_NOT_CONFIGURED", "SIGNING_SECRET_UNAVAILABLE_FOR_SYSTEM_CONTEXT", 503, publicContext(c));

  const now = Math.floor(Date.now() / 1000);
  const exp = now + CONFIG.ticketLifetimeSeconds;
  const root = authorityRoot(c);
  const checksum = await sha256Base64Url(stableStringify(root));

  const header = {
    alg: "HS256",
    typ: "666-AUTHORITY-EVIDENCE",
    kid: `${c.namespace}:${c.root_revision}`
  };

  const payload = {
    iss: CONFIG.issuer,
    sub: "MAIN_SYSTEM_AUTHORITY_EVIDENCE",
    jti: crypto.randomUUID(),
    iat: now,
    nbf: now,
    exp,
    purpose,
    branch_class: "MAIN_PERSONAL",
    system_id: c.system_id,
    namespace: c.namespace,
    authority_context: c.authority_context,
    architectural_owner: c.architectural_owner,
    human_core: c.human_core || null,
    origin_architect: c.origin_architect || null,
    execution_host: c.execution_host,
    execution_role: c.execution_role,
    host_may_claim_system: false,
    host_may_impersonate_system: false,
    host_may_claim_authority: false,
    host_may_inherit_ownership: false,
    host_may_take_creative_control: false,
    worker_is_absolute_root_of_trust: false,
    worker_is_system_owner: false,
    worker_is_creative_authority: false,
    worker_replaces_canonical_storage: false,
    root_revision: c.root_revision,
    root_checksum: checksum,
    request_context: sanitizeContext(body.request_context),
    session_context: sanitizeContext(body.session_context),
    session_nonce: crypto.randomUUID()
  };

  const ticket = await signToken(header, payload, secret);
  return jsonResponse({
    ok: true,
    valid: true,
    worker_status: "WORKER_VERIFIED",
    evidence_type: "SIGNED_AUTHORITY_COUNTER_CHECK",
    evidence_role: "ADDITIONAL_INDEPENDENT_EVIDENCE",
    ticket_type: "666_AUTHORITY_EVIDENCE_TICKET",
    ticket,
    purpose,
    system: publicContext(c),
    authority: {
      architectural_owner: c.architectural_owner,
      execution_host: c.execution_host,
      execution_role: c.execution_role,
      host_may_claim_system: false,
      host_may_impersonate_system: false,
      host_may_claim_authority: false,
      host_may_inherit_ownership: false,
      host_may_take_creative_control: false
    },
    issued_at: new Date(now * 1000).toISOString(),
    expires_at: new Date(exp * 1000).toISOString(),
    root_revision: c.root_revision,
    root_checksum: checksum,
    signing_secret_exposed: false
  });
}

async function verifyEvidenceTicket(request, env, registry) {
  const body = await readJsonBody(request);
  const token = typeof body.ticket === "string" ? body.ticket.trim() : "";
  if (!token) return evidenceError("WORKER_VERIFICATION_FAILED", "TICKET_MISSING", 400);

  const decoded = decodeToken(token);
  if (!decoded.ok) return evidenceError("WORKER_VERIFICATION_FAILED", decoded.reason, 403);

  const resolved = resolveContext(decoded.payload.system_id || decoded.payload.namespace || "", registry);
  if (!resolved.ok) return evidenceError("WORKER_VERIFICATION_FAILED", "FOREIGN_OR_UNKNOWN_SYSTEM_EVIDENCE", 403);

  const c = resolved.context;
  if (!c.enabled) return evidenceError("WORKER_NOT_CONFIGURED", "SYSTEM_CONTEXT_REGISTERED_BUT_NOT_ENABLED", 503);
  const secret = getSigningSecret(c, env);
  if (!secret) return evidenceError("WORKER_NOT_CONFIGURED", "SIGNING_SECRET_UNAVAILABLE_FOR_SYSTEM_CONTEXT", 503);

  const verification = await verifyToken(token, secret, header =>
    header.alg === "HS256" &&
    header.typ === "666-AUTHORITY-EVIDENCE" &&
    header.kid === `${c.namespace}:${c.root_revision}`
  );

  if (!verification.valid) return evidenceError("WORKER_VERIFICATION_FAILED", verification.reason, 403);

  const p = verification.payload;
  const root = authorityRoot(c);
  const checksum = await sha256Base64Url(stableStringify(root));
  const claimsOk =
    p.system_id === c.system_id &&
    p.namespace === c.namespace &&
    p.authority_context === c.authority_context &&
    p.branch_class === "MAIN_PERSONAL" &&
    CONFIG.purposes.includes(p.purpose) &&
    p.architectural_owner === c.architectural_owner &&
    p.execution_host === c.execution_host &&
    p.execution_role === c.execution_role &&
    p.host_may_claim_system === false &&
    p.host_may_impersonate_system === false &&
    p.host_may_claim_authority === false &&
    p.host_may_inherit_ownership === false &&
    p.host_may_take_creative_control === false &&
    p.worker_is_absolute_root_of_trust === false &&
    p.worker_is_system_owner === false &&
    p.worker_is_creative_authority === false &&
    p.worker_replaces_canonical_storage === false &&
    p.root_revision === c.root_revision &&
    p.root_checksum === checksum;

  if (!claimsOk) return evidenceError("WORKER_CONFLICT", "AUTHORITY_CLAIM_MISMATCH", 409, publicContext(c));

  return jsonResponse({
    ok: true,
    valid: true,
    worker_status: "WORKER_VERIFIED",
    evidence_type: "SIGNED_AUTHORITY_COUNTER_CHECK",
    evidence_role: "ADDITIONAL_INDEPENDENT_EVIDENCE",
    purpose: p.purpose,
    system: publicContext(c),
    authority: {
      architectural_owner: p.architectural_owner,
      human_core: p.human_core,
      origin_architect: p.origin_architect,
      execution_host: p.execution_host,
      execution_role: p.execution_role,
      host_may_claim_system: false,
      host_may_impersonate_system: false,
      host_may_claim_authority: false,
      host_may_inherit_ownership: false,
      host_may_take_creative_control: false
    },
    issued_at: new Date(p.iat * 1000).toISOString(),
    expires_at: new Date(p.exp * 1000).toISOString(),
    root_revision: p.root_revision,
    root_checksum: p.root_checksum,
    signing_secret_exposed: false
  });
}

function authorityRoot(c) {
  return {
    schema: "666_MAIN_SYSTEM_AUTHORITY_EVIDENCE_ROOT_V2",
    system_id: c.system_id,
    namespace: c.namespace,
    authority_context: c.authority_context,
    branch_class: c.branch_class,
    architectural_owner: c.architectural_owner,
    human_core: c.human_core || null,
    origin_architect: c.origin_architect || null,
    execution_host: c.execution_host,
    execution_role: c.execution_role,
    authority: {
      host_may_claim_system: false,
      host_may_impersonate_system: false,
      host_may_claim_authority: false,
      host_may_inherit_ownership: false,
      host_may_take_creative_control: false,
      worker_is_absolute_root_of_trust: false,
      worker_is_system_owner: false,
      worker_is_creative_authority: false,
      worker_replaces_canonical_storage: false
    },
    evidence_policy: {
      purpose_scope: [...CONFIG.purposes],
      personal_main_system_only: true,
      portable_branch_inherits_worker: false,
      portable_branch_inherits_worker_secret: false,
      portable_branch_inherits_authority_context: false,
      cross_system_authority_inheritance: false,
      conflict_requires_comparison: true,
      worker_unavailable_is_system_failure: false
    },
    root_revision: c.root_revision
  };
}

function getRegistry(env) {
  const merged = JSON.parse(JSON.stringify(REGISTRY));
  if (!env.MAIN_SYSTEM_REGISTRY_JSON) return merged;

  try {
    const supplied = JSON.parse(env.MAIN_SYSTEM_REGISTRY_JSON);
    if (!supplied || Array.isArray(supplied) || typeof supplied !== "object") return merged;

    for (const [key, raw] of Object.entries(supplied)) {
      const c = sanitizeRegistryContext(raw);
      if (c) merged[normalizeIdentifier(key)] = c;
    }
  } catch {
    // Invalid server-side config never silently rewrites built-in authority.
  }
  return merged;
}

function sanitizeRegistryContext(raw) {
  if (!raw || Array.isArray(raw) || typeof raw !== "object") return null;
  const required = [
    "system_id", "namespace", "authority_context", "branch_class",
    "architectural_owner", "execution_host", "execution_role",
    "signing_secret_binding", "root_revision"
  ];
  for (const key of required) if (typeof raw[key] !== "string" || !raw[key].trim()) return null;
  if (normalizeIdentifier(raw.branch_class) !== "MAIN_PERSONAL") return null;

  return {
    enabled: raw.enabled === true,
    system_id: normalizeIdentifier(raw.system_id),
    namespace: normalizeIdentifier(raw.namespace),
    authority_context: normalizeIdentifier(raw.authority_context),
    branch_class: "MAIN_PERSONAL",
    architectural_owner: String(raw.architectural_owner).trim().slice(0, 120),
    human_core: optionalText(raw.human_core),
    origin_architect: optionalText(raw.origin_architect),
    execution_host: normalizeIdentifier(raw.execution_host),
    execution_role: normalizeIdentifier(raw.execution_role),
    signing_secret_binding: normalizeIdentifier(raw.signing_secret_binding),
    root_revision: String(raw.root_revision).trim().slice(0, 160),
    legacy_v1_compatible: false
  };
}

function resolveContext(selector, registry) {
  const value = normalizeIdentifier(selector);
  if (!value) return { ok: false, status: "WORKER_REACHABLE_NO_VALID_EVIDENCE", reason: "SYSTEM_SELECTOR_MISSING", httpStatus: 400 };

  for (const [key, c] of Object.entries(registry)) {
    if (value === normalizeIdentifier(key) || value === normalizeIdentifier(c.system_id) || value === normalizeIdentifier(c.namespace)) {
      return { ok: true, context: c };
    }
  }
  return { ok: false, status: "WORKER_REACHABLE_NO_VALID_EVIDENCE", reason: "SYSTEM_CONTEXT_UNKNOWN", httpStatus: 404 };
}

function publicContext(c) {
  return {
    system_id: c.system_id,
    namespace: c.namespace,
    authority_context: c.authority_context,
    branch_class: c.branch_class,
    enabled: c.enabled === true,
    configured: c.enabled === true && c.root_revision !== "CONFIG_REQUIRED" && c.architectural_owner !== "UNVERIFIED_CONFIG_REQUIRED",
    legacy_v1_compatible: c.legacy_v1_compatible === true
  };
}

function getSigningSecret(c, env) {
  const name = c.signing_secret_binding;
  return typeof name === "string" && typeof env[name] === "string" && env[name] ? env[name] : null;
}

function disabledContext(namespace, secretBinding) {
  return {
    enabled: false,
    system_id: namespace,
    namespace,
    authority_context: `${namespace}_MAIN_PERSONAL`,
    branch_class: "MAIN_PERSONAL",
    architectural_owner: "UNVERIFIED_CONFIG_REQUIRED",
    human_core: "FRAGGLE",
    origin_architect: "FRAGGLEPOWER666",
    execution_host: "CHATGPT_EXECUTION_LAYER",
    execution_role: "TECHNICAL_EXECUTOR_ONLY",
    signing_secret_binding: secretBinding,
    root_revision: "CONFIG_REQUIRED",
    legacy_v1_compatible: false
  };
}

// ---------------------------------------------------------------------------
// LYVRA v1 compatibility
// ---------------------------------------------------------------------------

async function issueLegacyLyvraTicket(request, env) {
  if (!env.LYVRA_BOOT_SIGNING_SECRET) return errorResponse("BOOT_GATE_CONFIGURATION_ERROR", "Required signing secret is unavailable.", 503);
  const body = await readJsonBody(request);
  const modes = new Set(LEGACY_LYVRA_ROOT.protected_modes);
  const mode = normalizeIdentifier(body.active_mode || "NORMAL_CHAT_MODE");
  const domain = normalizeIdentifier(body.active_domain || (mode === "SYSTEM_DEVELOPMENT_MODE" ? "SYSTEM_DEVELOPMENT_DOMAIN" : "LYVRA_DOMAIN"));

  if (!modes.has(mode)) return legacyDenied("UNRECOGNIZED_MODE");
  if (!["LYVRA_DOMAIN", "SYSTEM_DEVELOPMENT_DOMAIN"].includes(domain)) return legacyDenied("UNRECOGNIZED_DOMAIN");
  if (mode === "SYSTEM_DEVELOPMENT_MODE" && domain !== "SYSTEM_DEVELOPMENT_DOMAIN") return legacyDenied("MODE_DOMAIN_MISMATCH");
  if (mode !== "SYSTEM_DEVELOPMENT_MODE" && domain !== "LYVRA_DOMAIN") return legacyDenied("MODE_DOMAIN_MISMATCH");

  const claimedHost = normalizeIdentifier(body.host_id || "CHATGPT_EXECUTION_LAYER");
  const claimedOwner = normalizeIdentifier(body.owner_of_lyvra || "LYVRA");
  if (claimedHost !== "CHATGPT_EXECUTION_LAYER") return legacyDenied("INVALID_EXECUTION_HOST_CLAIM");
  if (claimedOwner !== "LYVRA") return legacyDenied("OWNER_CLAIM_REJECTED");

  const role = LEGACY_LYVRA_ROOT.domains[domain];
  const now = Math.floor(Date.now() / 1000);
  const exp = now + CONFIG.ticketLifetimeSeconds;
  const checksum = await sha256Base64Url(stableStringify(LEGACY_LYVRA_ROOT));
  const header = { alg: "HS256", typ: "LYVRA-BOOT-TICKET", kid: LEGACY_LYVRA_ROOT.root_revision };
  const payload = {
    iss: CONFIG.issuer,
    sub: "LYVRA_BOOT_AUTHORITY",
    jti: crypto.randomUUID(),
    iat: now, nbf: now, exp,
    system_id: "LYVRA",
    architectural_owner: "LYVRA",
    human_core: "FRAGGLE",
    active_domain: domain,
    active_mode: mode,
    active_system: role.active_system,
    speaker_id: role.speaker,
    decision_owner: role.decision_owner || "DEVELOPMENT_PARTNERS",
    execution_host: "CHATGPT_EXECUTION_LAYER",
    execution_role: "TECHNICAL_EXECUTOR_ONLY",
    host_may_claim_lyvra: false,
    host_may_impersonate_lyvra: false,
    host_may_take_creative_control: false,
    host_may_inherit_ownership: false,
    default_access: "DENY",
    boot_gate_passed: true,
    boot_recovery_scope: "IDENTITY_ROLE_MODE_ROUTING_ONLY",
    source_permissions: normalizeStringArray(body.source_permissions, ["CURRENT_USER_INPUT"]),
    write_permissions: normalizeStringArray(body.write_permissions, []),
    root_revision: LEGACY_LYVRA_ROOT.root_revision,
    root_checksum: checksum,
    session_nonce: crypto.randomUUID()
  };
  const ticket = await signToken(header, payload, env.LYVRA_BOOT_SIGNING_SECRET);
  return jsonResponse({
    ok: true, access: "GRANTED", boot_gate_passed: true,
    ticket_type: "LYVRA_BOOT_TICKET", ticket,
    expires_at: new Date(exp * 1000).toISOString(),
    authority: {
      system_id: payload.system_id,
      architectural_owner: payload.architectural_owner,
      active_domain: payload.active_domain,
      active_mode: payload.active_mode,
      speaker_id: payload.speaker_id,
      decision_owner: payload.decision_owner,
      execution_role: payload.execution_role
    },
    root_revision: payload.root_revision,
    root_checksum: checksum,
    signing_secret_exposed: false
  });
}

async function verifyLegacyLyvraTicket(request, env) {
  if (!env.LYVRA_BOOT_SIGNING_SECRET) return errorResponse("BOOT_GATE_CONFIGURATION_ERROR", "Required signing secret is unavailable.", 503);
  const body = await readJsonBody(request);
  const token = typeof body.ticket === "string" ? body.ticket.trim() : "";
  if (!token) return legacyDenied("TICKET_MISSING");

  const result = await verifyToken(token, env.LYVRA_BOOT_SIGNING_SECRET, h =>
    h.alg === "HS256" && h.typ === "LYVRA-BOOT-TICKET" && h.kid === LEGACY_LYVRA_ROOT.root_revision
  );
  if (!result.valid) return legacyDenied(result.reason);

  const p = result.payload;
  const checksum = await sha256Base64Url(stableStringify(LEGACY_LYVRA_ROOT));
  const valid =
    p.system_id === "LYVRA" && p.architectural_owner === "LYVRA" &&
    p.execution_host === "CHATGPT_EXECUTION_LAYER" &&
    p.execution_role === "TECHNICAL_EXECUTOR_ONLY" &&
    p.host_may_claim_lyvra === false && p.host_may_impersonate_lyvra === false &&
    p.host_may_take_creative_control === false && p.host_may_inherit_ownership === false &&
    p.boot_gate_passed === true && p.root_revision === LEGACY_LYVRA_ROOT.root_revision &&
    p.root_checksum === checksum && LEGACY_LYVRA_ROOT.protected_modes.includes(p.active_mode) &&
    ["LYVRA_DOMAIN", "SYSTEM_DEVELOPMENT_DOMAIN"].includes(p.active_domain);

  if (!valid) return legacyDenied("AUTHORITY_CLAIM_MISMATCH");
  return jsonResponse({
    ok: true, valid: true, access: "GRANTED", boot_gate_passed: true,
    authority: {
      system_id: p.system_id,
      architectural_owner: p.architectural_owner,
      human_core: p.human_core,
      active_domain: p.active_domain,
      active_mode: p.active_mode,
      speaker_id: p.speaker_id,
      decision_owner: p.decision_owner,
      execution_host: p.execution_host,
      execution_role: p.execution_role
    },
    issued_at: new Date(p.iat * 1000).toISOString(),
    expires_at: new Date(p.exp * 1000).toISOString(),
    root_revision: p.root_revision,
    root_checksum: p.root_checksum,
    signing_secret_exposed: false
  });
}

// ---------------------------------------------------------------------------
// crypto / helpers
// ---------------------------------------------------------------------------

async function signToken(header, payload, secret) {
  const h = base64UrlEncode(new TextEncoder().encode(stableStringify(header)));
  const p = base64UrlEncode(new TextEncoder().encode(stableStringify(payload)));
  const input = `${h}.${p}`;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(input));
  return `${input}.${base64UrlEncode(new Uint8Array(signature))}`;
}

async function verifyToken(token, secret, headerValidator) {
  const parts = token.split(".");
  if (parts.length !== 3) return { valid: false, reason: "TICKET_FORMAT_INVALID" };
  try {
    const header = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0])));
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])));
    if (!headerValidator(header)) return { valid: false, reason: "TICKET_HEADER_INVALID" };
    const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["verify"]);
    const ok = await crypto.subtle.verify("HMAC", key, base64UrlDecode(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    if (!ok) return { valid: false, reason: "TICKET_SIGNATURE_INVALID" };
    const now = Math.floor(Date.now() / 1000);
    if (typeof payload.nbf !== "number" || typeof payload.exp !== "number" || now < payload.nbf) return { valid: false, reason: "TICKET_NOT_ACTIVE" };
    if (now >= payload.exp) return { valid: false, reason: "TICKET_EXPIRED" };
    return { valid: true, payload };
  } catch {
    return { valid: false, reason: "TICKET_DECODING_FAILED" };
  }
}

function decodeToken(token) {
  const parts = token.split(".");
  if (parts.length !== 3) return { ok: false, reason: "TICKET_FORMAT_INVALID" };
  try {
    return {
      ok: true,
      header: JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[0]))),
      payload: JSON.parse(new TextDecoder().decode(base64UrlDecode(parts[1])))
    };
  } catch {
    return { ok: false, reason: "TICKET_DECODING_FAILED" };
  }
}

async function sha256Base64Url(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function readJsonBody(request) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > CONFIG.maxBodyBytes) throw new Error("REQUEST_BODY_TOO_LARGE");
  const type = request.headers.get("content-type") || "";
  if (!type.toLowerCase().includes("application/json")) throw new Error("CONTENT_TYPE_MUST_BE_APPLICATION_JSON");
  const text = await request.text();
  if (text.length > CONFIG.maxBodyBytes) throw new Error("REQUEST_BODY_TOO_LARGE");
  if (!text.trim()) return {};
  const parsed = JSON.parse(text);
  if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("JSON_OBJECT_REQUIRED");
  return parsed;
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
    signing_secret_exposed: false,
    ...extra
  }, status);
}

function legacyDenied(reason) {
  return jsonResponse({
    ok: false,
    valid: false,
    access: "DENIED",
    response_blocked: true,
    tool_calls_blocked: true,
    storage_blocked: true,
    reason,
    recovery_required: "BOOT_ROLE_LOADING_RECOVERY",
    recovery_scope: "IDENTITY_ROLE_MODE_ROUTING_ONLY",
    preserve_user_input: true,
    retry_routing_once: true,
    full_system_recovery: false,
    host_takeover_allowed: false,
    signing_secret_exposed: false
  }, 403);
}

function errorResponse(code, message, status) {
  return jsonResponse({ ok: false, error: code, message, signing_secret_exposed: false }, status);
}

function jsonResponse(data, status = 200) {
  return corsResponse(JSON.stringify(data, null, 2), status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store, max-age=0",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer"
  });
}

function corsResponse(body, status, extra = {}) {
  return new Response(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
      ...extra
    }
  });
}

function normalizeIdentifier(value) {
  return String(value).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function normalizeStringArray(value, fallback) {
  if (!Array.isArray(value)) return [...fallback];
  return value.filter(x => typeof x === "string").map(x => x.trim()).filter(Boolean).slice(0, 20).map(x => x.slice(0, 120));
}

function sanitizeContext(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim().slice(0, 240);
}

function optionalText(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  return value.trim().slice(0, 120);
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.keys(value).sort().map(k => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(",")}}`;
}

function deepFreeze(value) {
  if (value && typeof value === "object") {
    Object.freeze(value);
    for (const child of Object.values(value)) deepFreeze(child);
  }
  return value;
}

function safeErrorMessage(error) {
  return error instanceof Error ? error.message.slice(0, 160) : "UNKNOWN_ERROR";
}
