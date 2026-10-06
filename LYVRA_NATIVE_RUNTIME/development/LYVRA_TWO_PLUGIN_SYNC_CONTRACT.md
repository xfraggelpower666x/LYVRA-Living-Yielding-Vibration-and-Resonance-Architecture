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
