# LYVRA → 666CLIC AUTO-HANDOFF INTEGRATION

VERSION: 1.0.0
DATE: 2026-08-20
HANDOFF_CLASS: NATIVE_LYVRA_INTEGRATION_INPUT
SOURCE: 666CLIC
TARGET: LYVRA
SCOPE: SHARED EXTERNAL WORKER COORDINATION ONLY

## 1. Purpose

LYVRA and 666CLIC may both work on the shared external Cloudflare Worker `lyvrasystem` from their own native system contexts.

This handoff defines the reverse direction that LYVRA must integrate:

`LYVRA CHANGE -> VERIFY -> AUTO HANDOFF -> 666CLIC`

The existing opposite direction already exists:

`666CLIC CHANGE -> VERIFY -> AUTO HANDOFF -> LYVRA`

Together they form a bidirectional coordination loop without merging LYVRA and 666CLIC.

## 2. Authority boundary

The auto-handoff is a coordination artifact only.

It MUST NOT:
- make LYVRA part of 666CLIC,
- make 666CLIC part of LYVRA,
- merge namespaces,
- merge memory,
- merge canonical storage,
- merge triggers,
- grant cross-system mutation authority,
- make GitHub or Cloudflare system authority.

Each system remains responsible for its own canon through its own native update/authority route.

## 3. Mandatory LYVRA behavior before Worker mutation

Before LYVRA changes the shared Worker, LYVRA MUST:

1. read the current shared `AUTO_HANDOFF_LATEST.md`,
2. read the current repository Worker source/config,
3. compare against current live Worker state/readback when available,
4. detect whether 666CLIC has made a newer verified change,
5. reconcile any Worker-state conflict before mutation,
6. never overwrite newer verified Worker state with stale LYVRA session state.

## 4. Mandatory LYVRA behavior after Worker mutation

After every material Worker change, LYVRA MUST:

1. verify the changed source/config,
2. deploy only through the approved Worker deployment path when live deployment is required,
3. verify live state where applicable,
4. create/update the shared auto-handoff for 666CLIC,
5. preserve a historical handoff/checkpoint,
6. clearly state whether 666CLIC needs a native semantic integration or only infrastructure acknowledgement.

## 5. What counts as a material Worker change

A handoff is mandatory if LYVRA changes or newly verifies any of:

- Worker source,
- Worker version,
- Wrangler configuration,
- GitHub Actions deployment route,
- Cloudflare script identity,
- domain or route,
- bindings,
- secret NAMES,
- system registry entries,
- enabled/disabled namespaces,
- BOOT behavior,
- FOREGROUND behavior,
- RECOVERY behavior,
- ticket schema/signature behavior,
- v1 compatibility,
- v2 endpoints/semantics,
- Worker evidence status model,
- deployment/checkpoint/rollback state,
- live verification result.

## 6. Required LYVRA → CLIC handoff fields

Every LYVRA-generated handoff MUST include:

- `SOURCE_SYSTEM=LYVRA`
- `TARGET_SYSTEM=666CLIC`
- timestamp/date
- Worker script name
- Worker version before/after
- exact changed files/configs
- relevant commit SHA(s)
- deployment path used
- deployment result
- domain/route impact
- binding/secret-NAME impact
- registry/system-context impact
- v1 compatibility impact
- v2 behavior impact
- tests/readback performed
- unresolved/open items
- rollback/checkpoint reference
- explicit native-action request for 666CLIC or `ACK_ONLY`

Secret VALUES are forbidden.

## 7. Shared storage

Current coordination artifact:

`cloudflare-workers/personal-main-system-authority/AUTO_HANDOFF_LATEST.md`

Protocol:

`cloudflare-workers/personal-main-system-authority/WORKER_CROSS_SYSTEM_COORDINATION_PROTOCOL.md`

Historical handoffs:

`cloudflare-workers/personal-main-system-authority/handoffs/`

When LYVRA is the latest Worker-changing system, `AUTO_HANDOFF_LATEST.md` should identify:

`SOURCE_SYSTEM=LYVRA`
`TARGET_SYSTEM=666CLIC`

## 8. Read-before-write invariant

No Worker mutation is valid from LYVRA until the latest shared handoff has been read and reconciled.

No Worker mutation is valid from 666CLIC until the latest shared handoff has been read and reconciled.

This is the stale-session overwrite guard for shared Worker work.

## 9. Conflict rule

If LYVRA state, CLIC state, repository state and live Cloudflare state disagree:

- do not silently prefer LYVRA,
- do not silently prefer CLIC,
- do not silently prefer the current host/session,
- compare live deployment evidence, commit/deploy timestamps, repository state, handoff provenance and each system's native authority,
- resolve only the shared Worker state,
- preserve separate system authorities.

## 10. Portable boundary

This bidirectional auto-handoff applies only to PERSONAL MAIN system Worker work.

Portable/shareable LYVRA branches must not inherit:

- personal Worker credentials,
- secret values,
- personal authority bindings,
- personal recovery context,
- automatic coupling to the user's Cloudflare account.

## 11. LYVRA native integration target

LYVRA should integrate this as a native Worker-coordination rule attached to its existing:

- Worker maintenance path,
- audit/self-healing path,
- SYSTEMSTART/VORNE/RECOVERY Worker evidence adapter,
- checkpoint/handoff behavior.

Do not create a second LYVRA identity or authority layer for this.

## 12. Acceptance conditions

PASS only when:

- LYVRA reads latest Worker handoff before mutation,
- LYVRA writes a new 666CLIC-targeted handoff after material Worker change,
- historical handoff is preserved,
- no secret value is exposed,
- no cross-system canon mutation occurs,
- stale Worker state cannot overwrite newer verified state,
- 666CLIC can resume from the LYVRA-generated handoff without reconstructing from chat history.

END HANDOFF
