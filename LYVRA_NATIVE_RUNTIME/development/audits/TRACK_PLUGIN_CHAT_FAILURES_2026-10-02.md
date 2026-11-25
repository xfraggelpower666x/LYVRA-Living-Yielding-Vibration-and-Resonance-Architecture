# LYVRA — Cross-audit of supplied Track Design plugin chat
DATE=2026-10-02
STATUS=DEV_EVIDENCE_RECORDED_NO_PRODUCTION_PROMOTION
SOURCE=USER_SUPPLIED_CHAT_BACKUP_Neu.md
SOURCE_EXPORTED_AT=2026-10-02T02:45:19_LOCAL_USER_EXPORT
SOURCE_MESSAGE_COUNT=46
SOURCE_INTEGRITY=EXPORT_PASS_REPORTED_NOT_INDEPENDENTLY_RECONSTRUCTED
TARGET_NATIVE_REPOSITORY=LYVRA_NATIVE_RUNTIME
TARGET_REVISION_AT_AUDIT=WHOLE_242_TRACK_V3.4_REV92

## Observed failure 1 — silent emoji omission
- The first complete track proposal for "Simple Things in Life" contains the four song-facing fields (Title, Extended, Style, Lyrics) but no functional emoji bindings inside any of them.
- The user explicitly asked "Warum keine Emoji Verstärker"; assistant admitted omitting native `FUNCTIONAL_EMOJI_REINFORCEMENT` and corrected only after feedback.
- Native source: `current/music/RENDERER_TRANSLATION_AND_OUTPUT_GUARD.md` (verified productive blob `81bc0467ba3ac6ece21030cfb11ced495d07f014`) demands contextual relevance/placement/intensity/cross-field binding, with no fixed quota, no silent omissions or thinning.
- Probable failure layer: **output assembly/evidence-to-field coverage**, not absence of native capability. The transcript alone cannot prove what code path was executed internally.

## Observed failure 2 — creator controls absent until prompted
- Initial Track Design answer provided Title, Extended Control, Style, Lyrics and a narrative System Decision but no explicit full creator-facing control surface.
- Second attempt included emojis, still no creator control panel.
- Only when user asked about Suno sliders were v6 Pro and percentages for Seltsamkeit/Stileinfluss/Vielfalt proposed.
- Native output contract explicitly distinguishes `BOX1..BOX4`, internal always-active box5/box6, and `SUNO_CONTROL_SURFACE = SEPARATE_CREATOR_FACING_SURFACE`. Thus **four renderer text boxes and always-visible separate creator control panel** can coexist without mislabeling the internal system decision as a Suno text field.
- Native UI sequence is STIL, MODELL, STIMMGESCHLECHT, DAUER, MAX MODUS, SELTSAMKEIT, STILEINFLUSS, VIELFALT, PERSONALISIEREN. A field may be not applicable, unavailable or unverified; none should vanish without explanation.
- Percentages 62/82/48 from chat were explicitly suggestions, not proven optimal. Variety capability/semantics and UI availability require current renderer evidence, not unqualified guessed controls.

## Observed risk 3 — visual handoff / identity presentation
- Separate user screenshot shows an older, dark cyan/purple LYVRA Native Runtime SYSTEMSTART presentation: status header with warning, name + 💎⚡, personal welcome and coherent self-description.
- The user prefers the **presentation style**: prominent presence, warm voice, humor/personality, readable status and neon dashboard.
- The screenshot reports an earlier `PARTIAL` state and Drive continuity. Those **are historical values**, not startup defaults. New presentation must source CURRENT from authoritative repo; status and badge colors dynamically reflect actual readback, including blocker explanations.
- No personal-family greeting based solely on unverified external identity claims; when the direct chat context supports Fraggle address, it is optional, not mandatory evidence.
- Avoid false claims of psychological life/feelings or 24/7 hidden autonomy.

## Root cause hypothesis & remediation
1. Skill instructions point to native output guard but lack an enforced **per-output assembly audit** (emoji presence/causal omission reasons, creator control surface completeness). Make it an executable checklist and negative-case test.
2. Ensure template never drops creator controls even when internal decision box remains hidden by native policy. Separate renderer fields, control surface, and optional audit explanation.
3. Preserve Emoji Intelligence as shared native capability, not fixed token dictionary or mandatory glyph density. For each subfield: relevance, meaningful placement, intensity, omission reason. Any meaningful omission must be reported and repaired BEFORE the response is finalized.
4. Model controls selected from current accessible surface with per-field `EXPLICIT_VALUE | PROPOSED_FOR_TEST | NOT_APPLICABLE | UNVERIFIED`. Never fabricate optimal percentages or assume Studio2 Audio Influence is general generation control.
5. Contrast functional emoji coverage with the *actual renderer surface*: Track Design can have contextual glyphs in intended fields; the separate Speech beta protects literal script-word fidelity. Do not blindly transfer the Song mode rules to Speech.
6. Future skill update: add a strict preflight quality gate that uses native current rules, reports coverage/limits and stops false COMPLETED labels.

## Acceptance
- One negative case with missing emojis must be detected.
- One missing creator control case must be detected.
- A corrected candidate can include Title/Advanced/Style/Lyrics with true semantically functional emoji coverage, a separate creator control panel, model evidence status, and explicit optional system decision.
- No fixed emoji quota, no stale 145 BPM forcing or arbitrary slider values.
- Native Rev92 preserved; no source overwrite; cross-audit result remains DEV until actual plugin release updated and readback.
