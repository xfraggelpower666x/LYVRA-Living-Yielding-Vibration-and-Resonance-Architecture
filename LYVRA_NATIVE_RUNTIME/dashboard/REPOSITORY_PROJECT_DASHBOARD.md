# LYVRA Repository & Project Dashboard

STATUS: CURRENT_INTERNAL_PRESENTATION_SURFACE
AUTHORITY: NONE
SOURCE_OF_TRUTH: LYVRA_NATIVE_RUNTIME/current/repository/REPOSITORY_TOPOLOGY.json

This dashboard gives a visual map of LYVRA's repository without creating a router, controller or new system.

## Whole

| Workspace | Class | Root | Role | Selectable |
|---|---|---|---|---|
| WHOLE_LYVRA_NATIVE_RUNTIME | WHOLE_AUTHORITY | `LYVRA_NATIVE_RUNTIME/` | Identity/current/governance/continuity | YES |

## Projects & expression surfaces

| Workspace | Class | Root | Current meaning | Safe edit scope |
|---|---|---|---|---|
| WEBLYVRA | PROJECT | `WEBLyvra/` | Website product / deployed web evolution | WEBLyvra-owned files first |
| LYVRA_PET | EXPRESSION_PROJECT | `LYVRA_PET/` | Same LYVRA identity, own browser/runtime/deployment scope | Pet-owned files first |
| LYVRA_PLUGIN_SURFACES | PRODUCT_SURFACE | `lyvra-plugin/account/`, `lyvra-plugin/native-runtime/` | Packaged execution surfaces | release/governance controlled |
| LYVRAGPT | PRODUCT_SURFACE | `LyvraGPT/` | GPT/host product surface and release history | surface-owned files first |

## Native facets

| Facet | Root | Role | Boundary |
|---|---|---|---|
| TRACK_DESIGN | `LYVRA_NATIVE_RUNTIME/current/music/`, `LYVRA_NATIVE_RUNTIME/music/` | Track/music construction | not parent of other facets |
| SPEECH_DESIGN | `LYVRA_NATIVE_RUNTIME/facets/speech_design/` | Speech/prosody/renderer translation | own facet |
| SUNO_STUDIO_2 | `LYVRA_NATIVE_RUNTIME/facets/studio2/` | Studio/project/edit/mix/FX | not Track child |
| CENTRAL_ANALYTICS | `LYVRA_NATIVE_RUNTIME/facets/analytics/` | Shared causal analysis | central shared facet |
| MUSIC_MEMORY | `LYVRA_NATIVE_RUNTIME/facets/music_memory/` | Scoped musical memory/learning | central shared facet |

## Shared capability

| Capability | Root | Meaning |
|---|---|---|
| ROOT_MUSIC_LANGUAGE_SYSTEM | `LYVRA_ROOT_MUSIC_LANGUAGE_SYSTEM/` | Shared native capability, not a parent facet |

## Workspace rules

- Whole LYVRA is always identity/decision authority.
- One primary workspace may be foregrounded per chat.
- Showing a workspace here does not activate it.
- Project != Facet != Product Surface.
- Relation != scope transfer.
- Repository HEAD movement never selects a workspace by itself.
- CodeForge may inspect the whole repository but mutates only the current workspace plus explicitly justified relational targets.
- Different chats may work on different LYVRA workspaces without a global active-project value.

## Current visual interpretation

The dashboard should be rendered from Current evidence with these states where relevant:

`ACTIVE_WORKSPACE` | `AVAILABLE` | `RELATED` | `DEFERRED` | `BLOCKED` | `HISTORICAL` | `READBACK_PENDING`

No fake PASS, no fake percentages, no autoactivation.
