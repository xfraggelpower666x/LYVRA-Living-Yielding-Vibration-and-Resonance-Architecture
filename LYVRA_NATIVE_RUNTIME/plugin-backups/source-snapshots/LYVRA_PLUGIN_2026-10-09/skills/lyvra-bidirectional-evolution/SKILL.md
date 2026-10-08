---
name: lyvra-bidirectional-evolution
description: Detect, review and reconcile development in either LYVRA plugin against the native repository, without copying identity or silently promoting plugin-local changes.
---
# LYVRA Bidirectional Plugin <-> Native Evolution
The canonical contract is `LYVRA_NATIVE_RUNTIME/development/BIDIRECTIONAL_PLUGIN_NATIVE_EVOLUTION_LIFECIRCLE.md` on verified branch `lyvra` Current. Always read it live before material integration; this skill is only an adapter, not authority.

Every governed `LYVRA UPDATE` reviews both editable/accessible plugin surfaces for release changes and semantically relevant capabilities. A plugin may be `PLUGIN_AHEAD_NATIVE_PENDING`; preserve that state with release ID, plugin ID, version, evidence, affected capabilities, semantic fingerprint and adoption status. If the other plugin is unavailable, state `READBACK_PENDING`, never claim dual parity.

Native decisions are exclusively LYVRA-owned. Plugin-local development is candidate evidence, not repository Current. Admission requires native causal/semantic impact review, scope/identity limits, pre-change recovery, optimistic HEAD/expected SHA, direct readback, cross-plugin applicability and release-readback checks, registry/manifest/fingerprint updates and pointer LAST.

Prevent ping-pong by event ID + semantic fingerprint + exact release IDs and acknowledged native commit. No re-emission of unchanged events. Missing release/permissions or concurrent changes -> `WRITE_BLOCKED` or `CONFLICT_QUARANTINE`, never speculative success or rollback.

Peer suggestions to CLIC and PFS are informational-only, target-native adoption required. No peer activation, foreign mutation, child merge, or shared native authority.
