# LYVRA Speech Design — Beta Translation & Output
STATUS: DEV_CANDIDATE_NOT_CURRENT
DATE: 2026-10-02

## Two native content fields, one separate creator control
User-visible fields from supplied iOS screenshots:
1. **SKRIPT** (observed 5,000-character field) — intended spoken content, word-for-word. Preserve order, punctuation, language, story, humor, emotional pivot and consent/privacy. Use natural sentences and explicit punctuation for cadence; bracket-tags and markup are **unverified** and may be spoken verbatim.
2. **TON** (observed 1,000-character field) — compact direction for narrator voice, delivery, emotion, pace, pauses, intimacy, room/mix, soundtrack instrumentation, pressure contour and voice priority. Separate renderer instructions from literal spoken words; avoid lyric/song structure commands not shown to work.
3. **HINTERGRUNDMUSIK** — creator-facing on/off selection, **not** text automatically appended to the script or tone. With ON direct co-composed original score subordinate to intelligibility. With OFF the field may have no effect; test in real renders.

LYVRA_INTERNAL_DECISION and ANALYTICS are not extra Suno text boxes. Title, extended control, style, 5-box track package, model and sliders are NOT assumed present for Speech; do not transfer legacy generation field counts into Speech UI.

## Intent to renderer translation
Resolve musical and narrative meaning freely before compressing to Speech UI. The score may carry 666SOUNDsDESIGn DNA (shadowy acid pulse, dry mono low end, tension/release, spectral movement, strategic silence) **only where story/voice function calls for it**. A meditation, funny monologue, quiet intimate scene or spoken radio ident need not become 145-BPM Dark Psytrance. When music has rhythmic energy, specify short dry kick, discreet low bass, short acid texture, controlled width and reduced music level beneath speech as a contextual **hypothesis**; avoid assuming the engine obeys audio-engineering controls exactly.

### Script audit before generation
- Preserve intentional exact words, names and pronunciation; no automatic phonetic substitutions without explicit task need.
- Keep spoken text comprehensible; avoid forcing singing unless deliberately researching behavior.
- Punctuation and sentence length suggest rhythm, not guaranteed timestamps.
- Avoid internal processing notes, secrets, prompt/renderer meta-instructions in literal text.
- Check characters exactly against observed 5,000; target some margin for app variations.

### Tone audit before generation
- First define voice and delivery, then emotional progression and soundtrack relation.
- Describe clear centered intelligible narrator above background music, avoiding bass/FX masking the speech.
- Include meaningful pauses as **request** not timestamp guarantee.
- Keep tone compact, context-specific, non-generic; count to <=1,000 characters (observed beta UI).

## Evidence boundaries
OFFICIAL 2026-10-01: speech + soundtrack generated together; release described on Suno official blog and release notes.
USER-OBSERVED: German-language UI screenshots with character caps and background music option.
HYPOTHESIS: how well speech respects word order, chosen voices, persona, music dynamics, genre terms, exact cues, pauses and language.
FIRST-DAY COMMUNITY: early single anecdotal complaints of glitchy pronunciation; signal only, not global truth.
UNTESTED: speech integration with studio, FX, specific v6 models, existing Voice profiles, stereo/panning rendering, bespoke timing tags, musical sliders, custom models.

## Real-render test plan
A. Same exact 10–30-second narrative, background music OFF vs ON, tone otherwise constant. Verify word fidelity, clarity, overall background balance.
B. Same script/music toggle, change one tone element (dry delivery vs intimate breath/pace). Measure observed qualitative compliance.
C. One short LYVRA-pressure version vs neutral soundtrack, keep exact script; identify speech intelligibility and score adherence.
D. German multisyllabic names, numerals, abbreviations and punctuation; check pronunciation and unexpected sung phrases.
E. Natural humor + emotional turn: does timing/voice/music preserve meaning or overwrite?
Record: source model if visible, UI date, script, tone, music toggle, actual output ID, creator hearing, context, deviations, repeatability. Never claim pass without actual generated audio and user verdict.
