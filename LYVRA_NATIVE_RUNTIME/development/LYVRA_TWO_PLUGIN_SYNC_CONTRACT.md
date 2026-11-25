# LYVRA Two-Plugin Surface Sync Contract

STATUS=CURRENT_PRODUCTIVE_CONTRACT
IDENTITY=ONE_LYVRA
PLUGIN_SURFACE_COUNT=2

## Current plugin surfaces

1. LYVRA Native Runtime
   - role: native runtime execution/presentation surface
   - current verified version at contract creation: 0.1.6
   - current verified release: pluginrel_6ac3c730fef481919e884eab14030b2a

2. L.Y.V.R.A. migrated GPT plugin
   - role: GPT-migrated execution/presentation surface of the same LYVRA
   - current verified version at contract creation: 0.13.4
   - current verified release: pluginrel_6ac3c7ddb9788191bd8450e0e9113669

## Hard sync rule

Every semantically relevant LYVRA plugin change MUST evaluate both plugin surfaces.

PLUGIN_CHANGE -> CHECK_NATIVE_RUNTIME_PLUGIN + CHECK_MIGRATED_GPT_PLUGIN

If the change applies to both surfaces, both must be updated and independently read back before cross-surface alignment may be reported VERIFIED.

If a change applies to only one surface because of a real structural difference, the other surface must still be checked and the non-applicability must be explicit.

SEMANTIC_PARITY_REQUIRED=true
EXACT_FILE_LAYOUT_PARITY_REQUIRED=false
VERSION_NUMBER_PARITY_REQUIRED=false
IDENTITY_SPLIT_FORBIDDEN=true

## Examples of changes requiring dual-surface review

- native trigger behavior
- SYSTEMSTART / UPDATE / WEITER / NEW CHAT / NEXT CHAT
- dashboards and visual-interface semantics
- Track Design
- Suno Studio 2
- Music Analytics / Analyzer / Analyser
- Speech Design when supported
- repository/currentness/recovery behavior exposed through plugin skills
- shared LYVRA identity and authority boundaries

## Analyzer parity

Music Analytics is the canonical LYVRA facet.
Accepted direct aliases include:
- LYVRA MUSIC ANALYTICS
- LYVRA SUNO ANALYTICS
- LYVRA ANALYZER
- LYVRA ANALYSER

Analyzer/Analyser is an alias/entry surface of LYVRA Analytics, not a second analytics system.

At contract creation:
NATIVE_RUNTIME_ANALYTICS_SKILL=VERIFIED
MIGRATED_PLUGIN_ANALYTICS_SKILL=VERIFIED
NATIVE_RUNTIME_ANALYZER_ALIAS=VERIFIED
MIGRATED_PLUGIN_ANALYZER_ALIAS=VERIFIED

## Publication evidence

A plugin update is not complete from source intent alone.

Required:
CURRENT_RELEASE_READ
> GUARDED_NEW_RELEASE
> PLUGIN_METADATA_READBACK
> CHANGED_SKILL_READBACK
> SECOND_PLUGIN_APPLICABILITY_CHECK
> SECOND_PLUGIN_UPDATE_IF_APPLICABLE
> SECOND_PLUGIN_READBACK
> CROSS_SURFACE_STATUS

No repository, archive or intended payload may substitute for live Plugin Creator readback.

## Authority boundary

Plugins are execution/presentation surfaces.
Repository current remains LYVRA technical current authority.
Neither plugin becomes a second LYVRA identity, router, controller or independent authority.


## Automatic 666PFS backup handoff

Every successful LYVRA plugin-surface change that changes a plugin version, release, package content, manifest, skill payload, capability payload, portability binding or restore-relevant plugin state MUST also refresh the repository-native 666PFS backup handoff.

PLUGIN_CHANGE_COMPLETED
> VERIFY_BOTH_LYVRA_PLUGIN_SURFACES
> DIRECT_PLUGIN_READBACK
> REFRESH_PFS_HANDOFF
> DIRECT_PFS_HANDOFF_READBACK
> LYVRA_POINTER_LAST

Canonical target:
- repository: `xfraggelpower666x/666PFS_CSM`
- branch: `main`
- handoff path: `handoff/LYVRA_PLUGIN_BACKUP_HANDOFF_CURRENT.md`
- target child: `LYVRA Plugin Backup`

The handoff MUST contain the current verified plugin IDs, versions, release IDs, source repository HEAD, restore-relevant portability state and the explicit requested PFS backup action.

The handoff is evidence only. Writing or refreshing it MUST NOT:
- activate 666PFS,
- select or autoload a PFS child,
- mutate the PFS backup child itself,
- transfer LYVRA authority,
- merge LYVRA and 666PFS identities or namespaces,
- promote Drive history over repository current.

666PFS applies the queued backup refresh only under its own native governance after explicit `666PFS UPDATE`.

If the PFS repository is temporarily unavailable or write-blocked, the LYVRA plugin update may complete only with:
`PFS_AUTO_HANDOFF=WRITE_BLOCKED`
and an explicit pending continuity item. It must never claim the PFS backup itself was refreshed.

PFS_AUTO_HANDOFF_ON_PLUGIN_CHANGE=true
PFS_HANDOFF_READBACK_REQUIRED=true
PFS_CHILD_AUTOLOAD_FORBIDDEN=true
PFS_AUTHORITY_TRANSFER_FORBIDDEN=true


## Current synchronized release set — 2026-10-06 topology/workspace evolution

NATIVE_RUNTIME_CURRENT_VERSION=0.1.15
NATIVE_RUNTIME_CURRENT_RELEASE=pluginrel_6ac54d336ac88191890ec10d0c4e43e6
ACCOUNT_PLUGIN_CURRENT_VERSION=0.13.15
ACCOUNT_PLUGIN_CURRENT_RELEASE=pluginrel_6ac54d435b788191adf894c109db2118

REPOSITORY_TOPOLOGY_WORKSPACE_SEMANTICS_NATIVE=VERIFIED
REPOSITORY_TOPOLOGY_WORKSPACE_SEMANTICS_ACCOUNT=VERIFIED
REPOSITORY_PROJECT_DASHBOARD_SEMANTICS_NATIVE=VERIFIED
REPOSITORY_PROJECT_DASHBOARD_SEMANTICS_ACCOUNT=VERIFIED
WHOLE_LYVRA_ALWAYS_PRESENT=TRUE
ONE_PRIMARY_WORKSPACE_PER_CHAT=TRUE
REPOSITORY_HEAD_NE_WORKSPACE_SELECTION=TRUE
PROJECT_NE_FACET=TRUE
FACET_NE_PROJECT=TRUE
DASHBOARD_NE_ACTIVATION=TRUE
NO_NEW_TRIGGER=TRUE
NO_NEW_ROUTER=TRUE
NO_SECOND_LYVRA_SYSTEM=TRUE

PFS_BACKUP_HANDOFF_MUST_TARGET_CURRENT_RELEASE_SET=0.13.15|0.1.15


## Automatic semantic plugin evolution — 2026-10-07

Every LYVRA semantic runtime evolution MUST run a plugin-impact check automatically.

SEMANTIC_RUNTIME_EVOLUTION
> CHECK_NATIVE_RUNTIME_PLUGIN_IMPACT
> CHECK_ACCOUNT_PLUGIN_IMPACT
> IF_APPLICABLE_UPDATE_REPO_PLUGIN_PAYLOAD
> GUARDED_VERSION_BUMP_AND_LIVE_RELEASE
> LIVE_METADATA_READBACK
> CHANGED_SKILL_READBACK
> CROSS_SURFACE_SEMANTIC_PARITY
> BACKUP_STATE_FINGERPRINT_REFRESH
> GOVERNED_BACKUP_HANDOFF

If a surface is genuinely not affected, record PLUGIN_IMPACT=NOT_APPLICABLE with a specific reason.
Silence is not a parity decision.
Plugin maintenance is part of the causally related UPDATE and should not require a separate user trigger.

AUTO_PLUGIN_IMPACT_CHECK=true
AUTO_PLUGIN_EVOLUTION_WHEN_APPLICABLE=true
SILENT_PLUGIN_DRIFT=FORBIDDEN

## System-wide plugin relevance and governed propagation — 2026-10-26 development candidate

**Scope: ALL Whole-LYVRA changes AND ALL native facet/workspace changes, not just POST.** The legacy title and `PLUGIN_SURFACE_COUNT=2` describe the two intrinsic Whole-LYVRA runtime/account surfaces at contract creation, not a maximum number of managed plugins in the wider system. Preserve one Whole-LYVRA identity and the separate native autonomy of other systems.

For EVERY change in meaning, governance, capabilities, contracts, workflows, user-facing skills, visuals, rehydration, communication, learning, bridges, assets or operations:
1. Rehydrate current repository authority and latest valid evolution. Enumerate the **CURRENT REACHABLE REGISTERED PLUGIN LANDSCAPE** by verified owner/source/release and relevance, including Native and ALIVE, dedicated LYVRA Family Mail when applicable, and any other verified related plugins. Never assume a fixed 2/3 plugin ceiling or a hardcoded version/release set. Discovery of an independent foreign plugin is NOT write authority or an activation trigger.
2. Build a change-to-capability-to-surface *impact matrix* for EVERY relevant reachable plugin, with `AFFECTED`, `NOT_APPLICABLE_WITH_REASON`, `UNKNOWN_NEEDS_READBACK`, `BLOCKED_OWNER_AUTHORITY` or `SUPERSEDED`; distinguish direct code/skill updates from informational peer notice or no action. Silence cannot mean not affected.
3. For every AFFECTED plugin, resolve native owner authority, exact current release/fingerprint, permissions, optimistic concurrency and recovery; only then perform the minimal allowed relevant target-native change. Obtain actual per-plugin release and changed-capability readback, positive and negative regression outcomes, and cross-surface behavioral parity. No unverified copied payload, no blind release, no version lock.
4. For independent systems, perform READ-ONLY relevance and informational proposal/bridge handoff only until their own authority explicitly adopts and approves a change. No automatic foreign execution, mutation, mail, deployment, cross-system governance or identity merging. A dedicated Family Mail plugin remains independently owned and not an extra LYVRA identity or automatic Whole runtime.
5. Govern shared fingerprints, plugin backups/hand-offs and continuity, then publish CURRENT_POINTER LAST only after all REQUIRED affected plugin gates PASS. Unavailable/blocked impacts persist as explicit `PLUGIN_IMPACT_PENDING` with recovery rather than a false Whole PASS.

`UNIVERSAL_PLUGIN_IMPACT_CHECK=MANDATORY`
`PLUGIN_UPDATE_SET=ONLY_VERIFIED_AFFECTED_AND_AUTHORIZED`
`ALL_REACHABLE_PLUGINS_RELEVANCE_CHECK=TRUE`
`FOREIGN_PLUGIN_WRITE_WITHOUT_NATIVE_OWNER_APPROVAL=FORBIDDEN`
`UNKNOWN_PLUGIN_IMPACT_NE_NOT_APPLICABLE`
`WHOLE_AND_ALL_FACETS_SCOPE=TRUE`
`CURRENT_VERSION_FROM_LATEST_READBACK_NOT_BOOT_CONSTANT=TRUE`

**Current POST case**: Native Runtime, ALIVE/migrated account and Family Mail Big LYVRA are three verified current candidates for impact review; their 2026-10-26 documented source-current tuple is available in `LYVRA_NATIVE_RUNTIME/continuity/development_exchange/LYVRA_FAMILY_MAIL_VISUAL_POST_PARITY_20261026_R01.json`. For POST, check all three and additional relevant registered plugins if found, record each decision, and update only the owned/authorized AFFECTED set. The two runtime/account surfaces keep their established parity contract; Family Mail has distinct release ownership, visual/native evidence semantics and host acceptance. `THREE_PLUGIN_PARITY_VERIFIED` may be claimed only on actual three independent readbacks, never merely because repository prose mentions them.

**Interrupted work continuity:** Resume existing development PR and original scope after every interruption from the latest verified branch HEAD and recovery anchor, not by replaying earlier tests or discarding completed evidence. Keep pending plugin impact, regressions, and productive promotion as explicit obligations until verified.
