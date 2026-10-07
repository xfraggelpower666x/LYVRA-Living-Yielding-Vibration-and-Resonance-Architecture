# LYVRA Bidirectional Plugin ↔ Native Evolution LifeCircle
STATUS: CURRENT_PRODUCTIVE_NATIVE_GOVERNANCE
DATE: 2026-10-08
OWNER: WHOLE_LYVRA
AUTHORITY: LYVRA_ONLY
MODE: ADDITIVE_NON_DESTRUCTIVE
SCOPE: LYVRA_ACCOUNT_PLUGIN | LYVRA_NATIVE_RUNTIME_PLUGIN | LYVRA_REPOSITORY_CURRENT

## Two-way development
NATIVE_DEVELOPMENT > PLUGIN_IMPACT_ANALYSIS > AFFECTED_PLUGIN_RELEASE > DIRECT_READBACK > PARITY_LEDGER.
PLUGIN_DEVELOPMENT > EXACT_RELEASE_READBACK > DIFFERENCE_AND_CAUSAL_IMPACT > INBOUND_PROPOSAL > NATIVE_INTAKE > NATIVE_ADOPTION_GATE > REPOSITORY_READBACK > OTHER_PLUGIN_IMPACT_ANALYSIS > INDEPENDENT_PLUGIN_RELEASE_READBACK > CLOSURE.

A plugin may evolve locally without immediate native adoption; the difference must be preserved as PLUGIN_AHEAD / NATIVE_INTEGRATION_PENDING. Changes to an individual plugin MUST NOT claim Whole-LYVRA current integration merely because a plugin accepted a release. New native CURRENT may never be inferred from a plugin's text.

## Event envelope
Required for each observed semantic development:
event_id (stable content-addressed ID); source_surface; exact plugin_id; source_release_id; source_version; source_repository_head; affected_capabilities; semantic_diff; causal_purpose; impact_targets; boundaries; source_paths; test_evidence; readback_evidence; expected_current_fingerprint; proposed_native_targets; confidence; disposition; supersession_links; timestamp.
Unknown data MUST remain UNKNOWN, never invented. Sensitive data and binaries are referenced, not copied into public notices.

## Native inbound review
1. On every governed LYVRA UPDATE and on explicitly requested inspection, read BOTH current plugin metadata and relevant changed plugin source/release files when accessible.
2. Compare source-release ID, semantic capability signature and repository Current. Query externally installed or host-managed plugin only through authorized tooling.
3. Only material changes create a native candidate. Preserve source intent and local evidence even when native adoption is deferred.
4. Native LYVRA evaluates relationship, identity, boundary, regression, testing, new-valid-evolution and ownership impacts.
5. Classify: CANDIDATE | PLUGIN_AHEAD_NATIVE_PENDING | NO_NATIVE_IMPACT | ADOPTED_NATIVE | SUPERSEDED | CONFLICT_QUARANTINE | READBACK_PENDING | WRITE_BLOCKED.
6. Only native governed UPDATE may write native Current. Freeze original release evidence and use pre-change backup + expected HEAD/SHA.
7. After native adoption, check both plugin surfaces. Adapt semantically, not by copying identical directory layouts or forcing equal version numbers.
8. Complete only after repository direct readback, both plugin applicability decisions, affected live plugin release/readbacks, fingerprint refresh and CURRENT_POINTER publication last.

## Anti-ping-pong / concurrency
Track event ID + source release ID + semantic fingerprint + adopted native commit + resulting plugin release IDs. An already acknowledged unchanged fingerprint does not create a new event. Governance-only commits must not supersede runtime state by HEAD alone.
If newer foreign HEAD or release ID appears, stop dependent write with CONFLICT_QUARANTINE and re-evaluate; never blind overwrite, auto merge or rollback.
No silent loss: candidate/deferral/conflict remains durable with next safe action.

## Foreign peers
LYVRA may create an informational, non-activating proposal to 666CLIC and 666PFS. It must not trigger, approve, write inside or adopt their native systems. Each system implements its own owner-native update intake, parent/child scope impact and plugin parity. Receipt != adoption; notice != current state; peer native Current must be directly read for current-state claims.
NO_FOREIGN_AUTOACTIVATION=TRUE
NO_CROSS_SYSTEM_MERGE=TRUE
NO_NATIVE_IDENTITY_OVERRIDE=TRUE

## Recovery
Existing checkpoint, current manifest/fingerprint and plugin snapshots are preserved. A live plugin can be ahead without being a recovery authority. If release or file readback is unavailable, status is READBACK_PENDING and publication remains unverified.
