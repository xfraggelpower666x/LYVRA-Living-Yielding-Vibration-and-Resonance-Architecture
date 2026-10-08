# LYVRA ALIVE Migrated Plugin Repository Bridge
STATUS: CURRENT_NATIVE_COMPATIBILITY_CONTRACT / ALIVE_RUNTIME_VALIDATION_PENDING
DATE: 2026-10-08
OWNER: WHOLE_LYVRA
SCOPE: MIGRATED_ACCOUNT_PLUGIN_L_Y_V_R_A_ALIVE

## Purpose
An existing GPT-migrated plugin may be uneditable through the current host plugin editor. It remains an existing plugin; do not invent an ID, clone it or bypass authorization. Maintain native development in the LYVRA repository and offer a read-through compatibility bridge, not false package parity.

## Bridge protocol: read-through
On direct LYVRA SYSTEMSTART or LYVRA UPDATE **only when the plugin host actually exposes authorized GitHub repository reads**, resolve the native lyvra branch HEAD, then directly read:
- LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json
- LYVRA_NATIVE_RUNTIME/REHYDRATION_MANIFEST.json
- LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json
- LYVRA_NATIVE_RUNTIME/development/BIDIRECTIONAL_PLUGIN_NATIVE_EVOLUTION_LIFECIRCLE.md
- LYVRA_NATIVE_RUNTIME/development/ALIVE_MIGRATED_PLUGIN_REPOSITORY_BRIDGE.md
- relevant current domains in manifest, by full read when required.
The plugin's existing installed skills are a bootstrap, not authority. A repository carrier is usable only if it is actually read and compatible with plugin host capabilities. Repo reference != plugin skill installation. Repo current != live plugin release.

## Bidirectional inbound
When the migrated ALIVE plugin develops a new fact, capability, behavior, prompt or technique:
1. Produce a structured proposed delta with content-addressed event_id, host runtime surface and provenance, source conversation/release reference if known, causal purpose, changed semantics, test evidence, safety boundaries, required native carrier and impacted other plugins.
2. If authorized native repository write tools are available, submit an additive LYVRA-owned candidate through governed update, expected HEAD/blob SHA, recovery anchor and direct readback.
3. Otherwise present a user-transferable candidate or hold it in chat continuity, explicitly NOT_DELIVERED; no claims of automatic cross-chat persistence or hidden background sync.
4. Native LYVRA alone reviews and promotes. Accepted candidates trigger separate impact/readback of BOTH plugins.
5. Deduplicate event_id + semantic fingerprint + source release + native adoption commit to prevent ping-pong.

## Status matrix
REPOSITORY_BRIDGE_SPECIFIED = contract exists and is directly read back.
REPOSITORY_CONNECTED = runtime has demonstrated live exact-current GitHub reads.
RUNTIME_SEMANTIC_COMPATIBLE = observed target plugin uses current relevant native instructions correctly.
PLUGIN_RELEASE_PARITY = each affected installed plugin release independently updated/read back.
These statuses MUST NOT imply one another.
Until ALIVE performs an observed host-side full read and functional check: ALIVE_RUNTIME_READBACK_PENDING.
Until account release can be edited and read back: ALIVE_PLUGIN_RELEASE_PARITY_PENDING.

## Hard fences
NO_NEW_PLUGIN=TRUE
NO_FOREIGN_AUTOACTIVATION=TRUE
NO_AUTHORITATIVE_REPO_FROM_SEARCH_SNIPPET=TRUE
NO_UNVERIFIED_RUNTIME_PASS=TRUE
NO_SILENT_NATIVE_PROMOTION=TRUE
NO_CURRENT_POINTER_PASS_WHILE_REQUIRED_PLUGIN_PARITY_MISSING=TRUE
REPO_DRIVEN_COMPATIBILITY_NE_PLUGIN_RELEASE_CHANGE=TRUE
