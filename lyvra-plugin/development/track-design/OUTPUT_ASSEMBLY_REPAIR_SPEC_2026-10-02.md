# LYVRA Plugin Track Design — Skill patch specification (not a live plugin release)
STATUS=DEV_CANDIDATE_UNAPPLIED
DATE=2026-10-02

## Apply in real plugin skill only after native review and guarded Plugin Creator release update
After loading Whole LYVRA and `LYVRA_NATIVE_RUNTIME/current/music/RENDERER_TRANSLATION_AND_OUTPUT_GUARD.md` at live same currentness tuple, assemble:

**A. Suno renderer text fields** 
1. TITLE (80-character source budget)
2. ADVANCED / EXTENDED (1,000)
3. STYLE (1,000)
4. LYRICS & STRUCTURE (5,000)

**B. Creator control surface — visible by default** (not a fifth Suno text input)
- STIL (track-specific)
- MODELL and whether native/custom, version and provenance.
- STIMMGESCHLECHT (if relevant; do not force gender)
- DAUER (creator UI and timing evidence)
- MAX MODUS (ON/OFF/unknown; never infer function)
- SELTSAMKEIT (track-specific value, evidence status)
- STILEINFLUSS (track-specific value, evidence status)
- VIELFALT (available interface semantics and reason)
- PERSONALISIEREN (available interface/context)
Any item without evidence must be shown as `UNVERIFIED`, `NOT_APPLICABLE` or `NOT_AVAILABLE` with explanation, not silently omitted.
An initial percentage is a hypothesis `PROPOSED_FOR_A_B_TEST`, never an audio PASS.
Different Suno Studio 2 surfaces are not blindly mixed with track generation.

**C. Internal system decision**: always reasoned, displayed only according to current native output visibility. Can be concise explanatory text but not misrepresented as an official Suno field.

## Emoji assembly audit — FORCE meaning, not density
For each relevant field and critical local event, inspect:
`EMOJI_RELEVANCE`, `SEMANTIC_MEANING`, `PLACEMENT`, `INTENSITY`, `DENSITY`, `DISTRIBUTION`, `CROSS_FIELD_BINDING`, `OMISSION_REASON`.
Emoji amplification is meaning-bound. If a relevant field/event has no functional marker, record and resolve reason; silence or thinning is an assembly error. Do not create a fixed quota; never add emojis to fields where they would damage renderer reliability, privacy or meaning just to hit counts.
Compare final output with source intent; ensure no emoji lost in formatting/transmission.
Check character limits before sending. Do not add internal processing logs to renderer fields.
If source changed, reevaluate whole current revisions instead of carrying dated values.

## Regression cases
- Original backup first answer: detect `MISSING_FUNCTIONAL_EMOJI` and `MISSING_CREATOR_CONTROL_SURFACE`.
- Second answer: detects `MISSING_CREATOR_CONTROL_SURFACE`.
- Slider addendum only: detects `INCOMPLETE_TRACK_PACKAGE_WHEN_SEPARATE`.
- Corrected complete package: four renderer fields, separate full creator controls, bounded internal decision display, emotion/psychoacoustic/voice fidelity preserved, no unsupported controls asserted.
- Systemstart screenshot test: formatting and warmth may be reused, historical Drive or PARTIAL fields never promoted to CURRENT.

NO_SKILL_RELEASE_UPDATED=true
NO_NATIVE_CURRENT_POINTER_CHANGED=true
