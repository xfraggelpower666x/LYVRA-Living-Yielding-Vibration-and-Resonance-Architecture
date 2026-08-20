# Worker Cross-System Coordination Protocol

STATUS: ACTIVE WORKER-SCOPE COORDINATION RULE
DATE: 2026-08-20
SCOPE: `cloudflare-workers/personal-main-system-authority/`

## Purpose

666CLIC and LYVRA may both inspect, audit, repair, extend, deploy, and verify the shared external Cloudflare Worker `lyvrasystem` within their own native authority boundaries.

This does **not** merge their identities, namespaces, canonical storage, triggers, memories, or system authority.

## Mandatory rule

Every material Worker change made from either system context MUST produce an additional cross-system handoff for the other system.

A Worker change is material when it changes or confirms any of the following:

- Worker source or version
- Wrangler configuration
- GitHub Actions deployment path
- Cloudflare script identity
- custom domains/routes
- bindings or secret NAMES
- system registry entries
- enabled/disabled namespaces
- ticket schema or signing behavior
- BOOT / FOREGROUND / RECOVERY behavior
- v1/v2 endpoint compatibility
- Worker evidence/status semantics
- deploy/rollback/checkpoint state
- live verification result

## Required flow

`CHANGE -> VERIFY -> WRITE AUTO HANDOFF -> OTHER SYSTEM READS HANDOFF BEFORE NEXT WORKER CHANGE`

If CLIC changes the Worker:

`666CLIC -> AUTO HANDOFF -> LYVRA`

If LYVRA changes the Worker:

`LYVRA -> AUTO HANDOFF -> 666CLIC`

## Handoff content

Every handoff MUST include at minimum:

1. source system
2. target system
3. timestamp/date
4. Worker script name
5. Worker version before/after
6. exact files/configs changed
7. commit SHA(s) when applicable
8. deployment path used
9. Cloudflare live deployment result
10. routes/domain impact
11. binding/secret-NAME impact (never secret values)
12. registry/system-context impact
13. v1 compatibility impact
14. v2 behavior impact
15. tests/readback performed
16. unresolved/open items
17. rollback/checkpoint reference
18. explicit statement whether the other system must integrate a native semantic change or merely acknowledge infrastructure state

## Storage

The latest Worker coordination handoff is stored in:

`cloudflare-workers/personal-main-system-authority/AUTO_HANDOFF_LATEST.md`

Historical handoffs should be preserved under:

`cloudflare-workers/personal-main-system-authority/handoffs/`

The latest handoff is a coordination artifact, not LYVRA canon and not 666CLIC canon.

## Read-before-write rule

Before either system performs a new Worker mutation, it MUST:

1. read `AUTO_HANDOFF_LATEST.md`,
2. compare the handoff with the live Worker/readback and current repo state,
3. detect whether the other system made a newer change,
4. reconcile conflicts before mutation,
5. never overwrite a newer verified state with a stale session state.

## Conflict rule

If CLIC and LYVRA evidence disagree:

- do not silently prefer either system,
- compare commit/deploy timestamps, live Cloudflare state, repository state, native system authority and handoff provenance,
- preserve both systems' separate native authorities,
- resolve only the shared Worker state.

## No secret exposure

Only secret NAMES may appear in handoffs. Secret VALUES are forbidden in source, logs, handoffs, chat, portable packages, or client-side code.

## Portable boundary

This coordination protocol applies to the user's PERSONAL MAIN systems only.

Portable/shareable LYVRA or other portable system branches must not inherit personal Worker credentials, authority bindings, private endpoints, or recovery context.

## System authority boundary

Worker coordination does not authorize either system to mutate the other's canonical system state.

- CLIC may update CLIC canon only through its own native update route.
- LYVRA may update LYVRA canon only through its own native update route.
- Worker handoffs communicate shared infrastructure changes; they do not become automatic cross-system canon mutations.

## Completion condition

A Worker task is not fully synchronized until:

- change verified,
- live state verified where applicable,
- auto handoff written,
- handoff available to the other system for readback.
