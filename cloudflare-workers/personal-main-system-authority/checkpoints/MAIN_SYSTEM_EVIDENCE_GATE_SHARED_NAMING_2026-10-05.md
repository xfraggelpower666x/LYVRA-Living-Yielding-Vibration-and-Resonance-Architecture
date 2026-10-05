# 666 MAIN SYSTEM AUTHORITY EVIDENCE GATE — Shared Naming & Namespace Boundary

Date: 2026-10-05
Canonical service name: 666 MAIN SYSTEM AUTHORITY EVIDENCE GATE
Service identifier: 666_MAIN_SYSTEM_AUTHORITY_EVIDENCE_GATE
Current version: 2.1.0

## Technical Cloudflare identity

The existing Cloudflare script ID remains `lyvrasystem` as a legacy technical identifier.
It is not the canonical service name.
No new Cloudflare Worker is created solely to rename the script.

## Current enabled namespaces

### LYVRA
- namespace: LYVRA
- system_id: LYVRA
- authority_context: LYVRA_MAIN_PERSONAL
- signing secret binding: LYVRA_BOOT_SIGNING_SECRET

### 666CLIC
- namespace: 666CLIC
- system_id: 666CLIC-CORE-001
- authority_context: 666CLIC_MAIN_PERSONAL
- signing secret binding: CLIC_AUTHORITY_SIGNING_SECRET

## Hard boundaries

- LYVRA and 666CLIC never share signing secret values.
- Worker evidence is additional independent evidence only.
- Worker evidence does not replace LYVRA repository authority.
- Worker evidence does not replace 666CLIC Google Drive authority.
- Worker cannot promote GitHub staging into CLIC authority.
- Cross-system authority inheritance is forbidden.
- Portable/shareable branches do not inherit personal Worker secrets or authority contexts.
- No SQLite or Durable Object dependency is required.

## Live binding verification

Cloudflare script `lyvrasystem` exposes both secret bindings by name:
- LYVRA_BOOT_SIGNING_SECRET
- CLIC_AUTHORITY_SIGNING_SECRET

Secret values were not returned or persisted in this checkpoint.

STATUS=SHARED_EVIDENCE_GATE_ACTIVE_WITH_NAMESPACE_AND_SECRET_ISOLATION.
