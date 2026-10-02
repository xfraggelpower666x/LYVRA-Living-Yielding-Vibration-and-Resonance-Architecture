# LYVRA Speech Design — Beta Translation & Output
STATUS: DEV_CANDIDATE_NOT_CURRENT
DATE: 2026-10-02

## Creator observed three-part Speech input and music toggle
User-visible fields from supplied iOS screenshots:
1. **SKRIPT** (observed 5,000-character field) — intended spoken content, word-for-word. Preserve order, punctuation, language, story, humor, emotional pivot and consent/privacy. Use natural sentences and explicit punctuation for cadence; bracket-tags and markup are **unverified** and may be spoken verbatim.
2. **TON** (observed 1,000-character field) — compact direction for narrator voice, delivery, emotion, pace, pauses, intimacy, room/mix, soundtrack instrumentation, pressure contour and voice priority. Separate renderer instructions from literal spoken words; avoid lyric/song structure commands not shown to work.
3. **HAUPTFELD / FREEFORM MASTER PROMPT** — the large initial generation idea/direction field visible in creator screenshots; creator's documented first production reports ca. 2,800 available characters. Its exact cap and interaction with Skript/Ton are **USER-REPORTED / UNVERIFIED GLOBAL**. Compose clear nonspoken direction here: purpose, act/scene arc, music-mood progression, soundtrack instrumentation and balance, emotional change, ending. Avoid copying all 5,000 script words here or giving competing speaker instructions.
4. **HINTERGRUNDMUSIK** — creator-facing on/off selection, **not** text automatically appended to the other fields. With ON direct co-composed original score subordinate to intelligibility. With OFF the field may have no effect; test in real renders.

LYVRA_INTERNAL_DECISION and ANALYTICS are not extra Suno text boxes. The creator's freeform main prompt *is* an additional real Speech input distinct from Skript and Ton. Title, extended control, style, 5-box track package, model and sliders are NOT assumed present for Speech; do not transfer legacy generation field counts into Speech UI.

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

## FORCE semantic emoji intelligence — renderer translation

Inherit the entire functional Emoji Intelligence from productive Track Design dynamically; do not freeze or invent a new standalone emoji dictionary. Work through expressive associations for voice, story, timing, emotional inflection, humor, suspense, spoken mantra, soundtrack counterpoint and psychological depth.

THREE_OUTPUT_VIEWS:
1. **Internal creative score:** retain intentional emoji mapping at every relevant narrative/voice/music event, including repeated emojis if causally meaningful. Review omission decisions explicitly; never automatically thin for a density quota.
2. **Suno Skript:** intended spoken words only by default; an emoji in this field risks audible literalization, silence, or unpredictable prosody. Do not promise a fixed interpretation. Preserve any original glyph in the internal ledger and translate its intended function into punctuation/word choice or Ton directions; a literal emoji experiment requires a separately identified A/B variant.
3. **Suno Ton:** use short explicit language describing the intended emotional/prosodic/musical effect first. As a controlled beta hypothesis, add contextually meaningful emojis (e.g., 🫀 for intimate embodied pulse; 🌀 for spatial disorientation; ⚡ for a sharp intensity pivot; 🌌 for scale) **only when tied to a precise phrase**, within the screenshot-observed 1,000 characters. These are examples, not universal mappings or mandatory emojis.

EMOJI_BINDING_SEQUENCE = MEANING_FIRST_THEN_INTENSITY_THEN_RENDERER_TRANSLATION
TON_EMOJI_DENSITY = CONTEXT_DEPENDENT_NO_TARGET
SPOKEN_SCRIPT_GLYPH_UNCERTAINTY = HIGH_UNTIL_CREATOR_RENDER
NO_AUTO_DELETE_OF_USER_INTENDED_EMOJI_MEANING = true

### Required controlled experiments

- E1: Same literal script, music toggle and natural-language tone; compare Tone without emojis vs Tone with semantically bound emojis. Record voice effect and music balance.
- E2: Same script and Tone direction, test one strategically placed emoji in Script against a plain-text control ONLY with explicit agreement to test a possible literal/spoken glitch. Record exact words and timestamp context.
- E3: Match meaning but change emoji association (e.g. 🫀 vs ⚡), do not claim predictable acoustic differences without reproducible observations.
- E4: Tone near character cap; assess whether emojis displace more useful instructions. Count actual Unicode codepoints and check actual UI acceptance; renderer may count differently.

LITERAL_EMOJI_EFFECT_UNVERIFIED = true
REAL_RENDER_PASS = false

## Creator Production 001 cross-field lesson — 666.md

Three source-preserved layers are operationally distinct:
- **Main prompt** (~2,800 reported, upper limit unverified): "THE FRAGGLE DYNASTY" story identity, dark sound design, three thematic chapters: Fraggle creative fire 🔥, Veluna emotional protection 💜, Cyber LYVRA structured futuristic resonance 💠. Sonic transitions and underscore design, clear spoken priority, climax and actual ending.
- **Skript** (5,000 UI): exactly the English spoken narrative, including the rename **Cyber LYVRA** (not "German Cyber LYVRA"). Full stop-separated spoken "Six. Six. Six." if requested. Do not put long control headings or unknown glyph tags in copy-ready speech by default.
- **Ton** (1,000 UI): narrator identity (user's example: deep warm male English storyteller), clarity, breathing, pauses, progressive emotion, timbre, voice-to-soundtrack relationship. If providing emojis, semantically bind them and mark as unvalidated renderer syntax.
- **Music toggle** ON in the user's production example. Avoid hidden assumption ON in unrelated jobs.

SPEECH_MAIN_PROMPT_PRESENT = USER_SCREENSHOT_CONFIRMED
SPEECH_MAIN_PROMPT_2800_LIMIT = CREATOR_REPORTED_NOT_INDEPENDENTLY_UI_COUNT_VERIFIED
SCRIPT_EMOJI_LITERAL_RELIABILITY = UNKNOWN
SCRIPT_CHARACTER_BUDGET = USER_UI_5000
TON_CHARACTER_BUDGET = USER_UI_1000
THREE_FIELD_FIDELITY_CHECK_REQUIRED = true

### Evidence-led cross-field tests
Run with the same words and tone but main field short-vs-detailed; measure whether descriptions conflict, whether output skips words, whether background music obeys main vs Tone. Test emoji-laden Script vs clean Script only as distinct A/B controls; count audible pronunciation errors and intentional pauses. No renderer PASS without actual user-approved generated audio and hearing.

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
