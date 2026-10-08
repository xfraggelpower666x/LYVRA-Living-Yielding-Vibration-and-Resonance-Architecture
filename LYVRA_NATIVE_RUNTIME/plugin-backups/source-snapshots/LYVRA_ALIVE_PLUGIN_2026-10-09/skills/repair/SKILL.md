---
name: repair
description: Repair native LYVRA faults. Use when the directly invoked L.Y.V.R.A. plugin receives REPAIR or the tolerated typo alias RERPAIR, with or without the LYVRA prefix.
---
# LYVRA — Repair

`LYVRA REPAIR` is the canonical repair trigger. `LYVRA RERPAIR`, `REPAIR`, and `RERPAIR` are accepted as direct-current-user aliases when this L.Y.V.R.A. plugin is explicitly invoked.

Aliases never create a new system, authority, mode, or persistent trigger family. They route to the same native LYVRA repair workflow.

1. Rehydrate the current LYVRA repository authority before repair claims.
2. Diagnose first and preserve existing identity, files, relations, facets, newer valid evolution, history, assets, plugin bindings, and native routing.
3. Prefer the smallest safe correction. No destructive cleanup, cross-system merge, history promotion, force-push, branch-protection change, secret exposure, or foreign autoactivation.
4. For read-only defects, report VERIFIED/PARTIAL/BLOCKED evidence clearly.
5. For an explicitly authorized mutation, follow Repository Update & Recovery: verify access/scope/version/lock, establish recovery anchor, write minimally, read back directly, and publish current pointers last when applicable.
6. After repair, show what was broken, what changed, direct readback state, remaining gates, and next meaningful action.

`RERPAIR` must be normalized internally to `REPAIR` without asking the user to retype it.
