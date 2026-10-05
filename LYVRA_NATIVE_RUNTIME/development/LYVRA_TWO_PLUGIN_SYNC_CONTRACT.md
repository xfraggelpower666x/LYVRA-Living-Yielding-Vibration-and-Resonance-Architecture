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
