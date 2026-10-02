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

## Creator production 001 — Articulation repair experiment

SOURCE_CLASS: FIRST_HAND_CREATOR_LISTENING_REPORT
SOURCE_DATE: 2026-10-02
OBSERVATION: Some English syllables or word-final consonants are dropped, blended or unclear in rendered speech.
AUDIO_FILE_AVAILABLE_TO_CODEFORGE: NO
TIMESTAMPS: NOT_YET_PROVIDED
KNOWN_ACTUAL_GENERATION: CREATOR_IS_LISTENING
QUALITY_STATUS: AUDIBLE_ISSUE_REPORTED_NOT_YET_DIRECTLY_AUDITED

Speech editing strategy (single-variable A/B):
- Keep exactly the same *Script* and *main freeform prompt*, identical music toggle, same voice/music intent.
- Change **only Tone**, asking for complete word endings and consonants, careful syllable separation, relaxed pacing, natural pauses and no swallowing or merging of words. Don't over-enunciate or make it robotic.
- For repeatedly mispronounced names/numerals, test a second controlled Script variant adjusting punctuation and splitting sentences/phonetic spellings *only where the producer approves a changed spoken form*.
- Measure exact failures by quoted word/phrase and timestamp, compare the original rendering and rerender, note naturalness and emotional warmth.
- If the voice is masked by backing score, test voice-priority mix instructions and optionally a separate background-music-OFF reference; don't assume Tone prompt directly controls levels.
- Keep emoji meaning in internal plan; literal glyph-heavy Script may be a separate potential confound, not a proven cause of swallowed words.

Suggested English Tone variant:
"Deep, warm, emotionally expressive English narrator with clear, natural diction. Preserve every word, full consonants, complete syllables and word endings. Never swallow, blur, merge or skip words. Use relaxed measured pacing, short meaningful pauses and natural breath. Sound human, intimate and emotionally alive, not robotic or overacted. Give names and repeated 'Six' phrases distinct enunciation. Maintain centered intelligible narration above the backing music. Build intensity with emotion rather than speed or shouting."

ARTICULATION_FIX_CONFIRMED = false
REAL_WORLD_AUDIO_AB_PASS = false

## Pronunciation and phoneme repair — DEV policy from creator feedback (2026-10-02)

LYVRA_SPEECH_PHONEMIC_CORRECTION = CONTEXTUAL_ADAPTATION_OF_NATIVE_LYRIC_PHONETIC_INTELLIGENCE
SOURCE_PRIORITY = CREATOR_ACTUAL_LISTENING > REPEATED_CONTROLLED_SPEECH_RENDER > FRESH_OFFICIAL_SPEECH_DOCS > CURRENT_SPEECH_COMMUNITY > LEGACY_SUNO_LYRICS_TECHNIQUE
RENDERER_DIFFICULTY_IS_HYPOTHESIS_UNTIL_REPLICATED = true
ARTIFACT_AND_TIMESTAMPS = PENDING_CREATOR_SUBMISSION
NO_AUDIO_AVAILABLE_NE_IMPLY_AUDITED_AUDIO = true
NEVER_REPLACE_USER_INTENDED_PRONUNCIATION_WITH_UNTESTED_RESPelling = true

### Phoneme-aware, speech-specific adaptation
Preserve original written Script as immutable semantic reference while testing candidate pronunciations. LYVRA may consider orthographic clusters, word-boundary coarticulation, elision, final consonants, stressed vowels, names, initialisms, numerals and unusual brand spellings. Only selectively choose one variable for each A/B: **Tone articulation and pace first**; if insufficient, **punctuation/shorter clauses**; if a specific name still mispronounced, **explicit phonetic or respelled local variant** with intended pronunciation confirmed by creator. Put pronunciation experiments in the actual `Skript` only in separately labeled variants, as ordinary spoken text rather than untested phonetic meta-tags.

For challenging proper names such as Fraggle, Veluna, Cyber LYVRA, or 666SOUNDsDESIGn, no automatic universal phonetic string is authoritative; producer hearing and correct pronunciation govern. Preserve stable exact words when fidelity outranks accent adaptation. Emoji-bearing scripts should have a plain-script control to isolate effects; do not simultaneously change tempo, narrator, word spelling, music and Emojis.

### Phonemic failure ledger
`RENDER_ID | CREATOR_TIMESTAMP | EXPECTED_EXACT_WORD | HEARD_OUTPUT_DESCRIPTION | ERROR_CLASS | SCRIPT_CONTEXT | LANGUAGE_ACCENT | TONE_VERSION | MAIN_PROMPT_VERSION | MUSIC_TOGGLE | CANDIDATE_VARIANT | OWN_AUDIO_COMPARISON_RESULT | COMMUNITY_OFFICIAL_CORROBORATION | CONFIDENCE | NEXT_TEST`.

ERROR_CLASS = `ONSET_DROPPED | FINAL_CONSONANT_DROPPED | SYLLABLE_COLLAPSE | WORD_JOINING | MISSING_WORD | MISSTRESS | PROPER_NAME | NUMBER_OR_ABBREVIATION | MUSIC_MASKING | UNCERTAIN`.

No permanent Speech phoneme rule is promoted without controlled hearing tests. Creator can provide audio later; until then record candidate risks and test plan without asking them to stop producing.

## Real-render test plan
A. Same exact 10–30-second narrative, background music OFF vs ON, tone otherwise constant. Verify word fidelity, clarity, overall background balance.
B. Same script/music toggle, change one tone element (dry delivery vs intimate breath/pace). Measure observed qualitative compliance.
C. One short LYVRA-pressure version vs neutral soundtrack, keep exact script; identify speech intelligibility and score adherence.
D. German multisyllabic names, numerals, abbreviations and punctuation; check pronunciation and unexpected sung phrases.
E. Natural humor + emotional turn: does timing/voice/music preserve meaning or overwrite?
Record: source model if visible, UI date, script, tone, music toggle, actual output ID, creator hearing, context, deviations, repeatability. Never claim pass without actual generated audio and user verdict.
