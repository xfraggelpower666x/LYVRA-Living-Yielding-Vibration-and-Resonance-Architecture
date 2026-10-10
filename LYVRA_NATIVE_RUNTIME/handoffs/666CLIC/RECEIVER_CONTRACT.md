# LYVRA native CLIC peer intake — receiver contract
STATUS: LYVRA_NATIVE_REPOSITORY_RECEIVER_CONTRACT
DATE: 2026-10-10
OWNER: WHOLE_LYVRA
AUTHORITY: LYVRA_ONLY
MODE: ADDITIVE | NON_BLOCKING | REPO_REFERENCE | EVIDENCE_FIRST
SOURCE: xfraggelpower666x/666CLICPRO @ clic-migration-rev79-staging
SOURCE_PROTOCOL: 666CLIC_NATIVE_RUNTIME/continuity/REPO_TO_REPO_HANDOFF_PROTOCOL.md
SOURCE_HELPER: 666CLIC_NATIVE_RUNTIME/continuity/repo-peer-channel.mjs
NATIVE_INBOX: LYVRA_NATIVE_RUNTIME/handoffs/666CLIC/
CURRENT_RECEIPT: LYVRA_NATIVE_RUNTIME/handoffs/666CLIC/CURRENT.json
LYVRA_RETURN_OUTBOX: LYVRA_NATIVE_RUNTIME/continuity/development_exchange/
CLIC_INBOX: 666CLIC_NATIVE_RUNTIME/inbox/LYVRA/
NO_FOREIGN_MUTATION: true
NO_AUTO_ADOPTION: true
NO_NEW_ROUTER_OR_CONTROLLER: true
NO_COMMUNICATION_GATEWAY: true
NO_MESSAGE_BLOCKING: true
NO_AUTOMATIC_FACET_ACTIVATION: true

## Native intake
1. On a relevant LYVRA UPDATE or explicitly requested peer review, verify fresh LYVRA production HEAD and CURRENT pointer first.
2. Read the exact CLIC source repository native Current, source branch HEAD, source protocol and candidate source handoff by repository path. A link, snippet or historical card alone is never complete current evidence.
3. Record source handoff ID, source branch/path, source content blob SHA, source HEAD at observation and recipient observation HEAD. Keep the exact source payload in CLIC's native outbox; do not copy private history.
4. Duplicate IDs with identical content are idempotent. Conflicting same IDs, wrong author/target, missing provenance or invalid supersession become REVIEW/CONFLICT_QUARANTINE; never silently overwrite.
5. A source handoff can be READBACK_VERIFIED even if neither automatic transport nor sender receipt is proven. PREPARED != DELIVERED; RECEIVED_SOURCE_READBACK != SEMANTICALLY_ADOPTED; ACKNOWLEDGED != HOST_VERIFIED.
6. Whole LYVRA alone evaluates relevance and native adoption. A peer visual suggestion does not mutate LYVRA's Visual Intelligence or Pet automatically.
7. Write a LYVRA-owned receipt referencing the verified source (not a foreign delivery claim), with native content readback, source and recipient HEAD, evidence grade and decision state. A separate return handoff may be published from the existing LYVRA development-exchange outbox.
8. CLIC may inspect the LYVRA-owned receipt independently. Actual round-trip is VERIFIED only after source/recipient native readbacks and CLIC-side receipt reconciliation. A read of this contract is not automatic channel polling.
9. Resume preexisting Whole/Facet LifeCircle after intake. Channel absence or worker failure may not block authorized external communication or override existing security/privacy governance.

## Visual proposal scope
CLIC-LYVRA-VISUAL-INTELLIGENCE-20261010-R01 is a proposal only. Preserve LYVRA's own Semantic Cyber Field V01.2/V01.3, visual Facet Sub-LifeCircles, Semantic FORCE and own creative color language. CLIC's PET exclusion applies to CLIC's development scope only; no LYVRA Pet mutation is authorized.

## Unverified boundaries
Native source files and receipt can be read back; automatic discovery/polling, GitHub event transport, CLIC's reciprocal consumption, plugin parity, fresh host acceptance and browser visual runtime remain independently unverified unless separately tested. No background worker is started by this contract.
