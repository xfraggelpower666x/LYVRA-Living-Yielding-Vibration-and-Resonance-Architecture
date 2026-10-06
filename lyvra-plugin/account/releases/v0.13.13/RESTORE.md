# L.Y.V.R.A. migrated plugin v0.13.13 — Restore Note

Current release ID: `pluginrel_6ac4e6d5bb088191bd012ac0ad65e8e0`
Previous verified release: v0.13.12 / `pluginrel_6ac43f4df9fc81919b2663c03a9ab043`.

This release adds a current Speech Design skill and aligns Track Design, Suno Studio 2, Music Analytics, visual-interface semantics and rehydration currentness with repository CURRENT.

Boundary rules:
- Track Design is not a parent container for Speech Design, Studio 2, Analytics or Music Memory.
- Speech Design is its own LYVRA facet.
- Studio 2 is its own studio-operation facet and may consume Track Design outputs/capabilities without becoming its child.
- Analytics is central/shared and selectively requested.
- Combined multi-facet dashboards are presentation only and do not create shared runtime, common activation or facet merge.
- A fresh carrier may contain time-scoped history; historical CURRENT does not override present CURRENT.

The release is an overlay. Omitted files/assets remain preserved by Plugin Creator release semantics.

Known remaining textual debt:
- the large common `skills/instructions/SKILL.md` still contains an older sentence naming “FÜNF FACH-SKILLS”. That line is stale textual metadata and does not supersede repository CURRENT or the now-installed Speech Design skill. Do not claim full textual parity until it is separately reconciled without destructive replacement.

Do not restore old Track-parent semantics from v0.13.12 or older releases.
