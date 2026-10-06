# L.Y.V.R.A. migrated plugin v0.13.14 — Restore Note

Current release ID: `pluginrel_6ac4ecbc35208191ba1b76832930184b`
Previous verified release: v0.13.13 / `pluginrel_6ac4e6d5bb088191bd012ac0ad65e8e0`.

Purpose of this patch release:
- close the remaining stale “FÜNF FACH-SKILLS” textual metadata,
- name Speech Design explicitly as the sixth specialist skill,
- preserve all existing plugin files through overlay update semantics.

Verified readback:
- `skills/instructions/SKILL.md` contains `SECHS FACH-SKILLS`,
- the Speech Design skill link is present,
- the standalone Speech Design skill remains present,
- no new facet, router, controller or music logic was introduced.

This release changes textual parity only. Native Runtime 0.1.14 remains current and does not require a companion release for this text-only migrated-surface correction.

Do not restore v0.13.13 as Current solely because it is the prior release; it remains recovery provenance.
