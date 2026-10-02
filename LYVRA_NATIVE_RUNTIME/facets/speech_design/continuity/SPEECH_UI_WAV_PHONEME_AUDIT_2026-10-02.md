# LYVRA Speech Design — UI, Two WAV Renders, Phoneme Triage
DATE: 2026-10-02
STATUS: DEV_EVIDENCE_PARTIAL_ARTICULATION_NOT_WORD_VERIFIED
PRODUCTION_TRIGGER_STATUS: NOT_PROMOTED
SOURCE: Creator 3 UI screenshots, creator 2 WAV files, archived 666.md script

## Direct screenshot observations
- BETA speech; `Einfach` / `Erweitert` toggle.
- Advanced view shows `Skript`, `Tonfall`, `Stimmgeschlecht`
  Männlich/Weiblich, separate `Hintergrundmusik` Aus/An (An selected
  in screenshot), `Vielfalt` slider (display word `Normal`).
- Interface cost `115k` displayed in top bar; do not extrapolate as fixed cost.
- **No freeform Hauptfeld visible in these new screenshots**. Older creator
  screenshot/prose reported a third master field and approximately 2800
  chars, so treat the fields as UI-mode-dependent, not contradictory
  authoritative global limits.
- Current screenshot crops do NOT independently show old 5000 Skript and
  1000 Tonfall character counters.

## Two actual PCM WAV assets reviewed as physical signals
`The Fraggle Dynasty [0m00s-6m31s].wav`
  duration 391.473 seconds, 48000 Hz stereo, signed 16-bit PCM, peak
  0.9799 (normalized digital full scale), whole-file RMS 0.1678.
`The Fraggle Dynasty [0m00s-6m34s].wav`
  duration 393.917 seconds, same WAV format, peak 0.9727, RMS 0.1476.
Difference in duration 2.444 seconds; version 2 quieter overall.
Whole-file loudness/RMS or musical density cannot identify missing
English words or consonants. Small audio excerpts were inspected for
playback capability, but **no confidence-checked lexical transcript, phoneme
labels or timecoded adjudication** is available from the analysis yet.
Therefore NO specific missing word/phoneme is claimed as a verified fault.

## Creator script source
`666.md` was located in user-provided prior conversation files.
Plain spoken original: `THE FRAGGLE DYNASTY — THE ORIGIN OF OUR DNA`,
with proper names Fraggle, Veluna and Cyber LYVRA, repeated
`Six. Six. Six.` and brand `666SOUNDsDESIGn`. A subsequent variant
introduced numerous visible emoji glyphs. Which exact text variant produced
each WAV is not yet independently verified, so do NOT assume version 2
used more emojis or that emojis caused skipped consonants.

## Before rewriting the spoken script
1. Fix current beta mode and exact audio-to-script variant mapping.
2. Change only `Tonfall` to demand natural but complete syllables and
   endings, appropriate pauses, centered dry intelligible voice over
   soundtrack; keep main/script/music/Vielfalt/sex settings fixed.
3. For actual repeated error, locate WAV id + timestamp + quote exact
   source word; manually compare expected versus heard. Record errors
   ONSET_DROPPED/FINAL_CONSONANT_DROPPED/SYLLABLE_COLLAPSE/WORD_JOINING/
   MISSTRESS/NAME_ACRONYM/MUSIC_MASKING/UNCERTAIN.
4. ONLY on a corroborated local problem, create one alternate
   spoken *test* spelling without mutating original canonical script.
   Existing official LYVRA pronunciation is `Lai-vra`; candidate spoken
   form `Cyber Lai-vra` is valid as an **unverified A/B option** if
   `Cyber LYVRA` is actually misread. Fraggle and Veluna must not get
   made-up phonetic roots. Separate spoken brand tests may expand
   `666SOUNDsDESIGn` to a clear English phrase ONLY with creator approval
   and only if audio actually mispronounces it.
5. No claiming phonemic fix SUCCESS without rerendering and audio
   comparison at same location; no universal hard-coded phonetics.

## Compact beta `Tonfall` A/B candidate
Deep, warm, emotionally expressive English narration. Speak each
written word distinctly with complete syllables, clear final consonants
and natural word boundaries. Never swallow, merge or skip short words.
Use relaxed pace, intentional pauses and natural breath. Never shout,
sing or over-enunciate mechanically. Keep one centered voice clearly
intelligible above the background music; maintain gradual emotional
intensity without increasing speaking speed.

## Trigger and release gate
`LYVRA SPEECH DESIGN` appears in DEV FACET_CONTRACT and DEV
EVIDENCE_AND_CONTINUITY. This **does not** mean live native Systemstart
or both installed plugins route the trigger; source material in
`lyvra-plugin/staging/speech-design/` is not an installed release.
Current plugin A v0.13.0 and plugin B v0.1.1 were freshly checked as
unchanged. Custom GPT activation unverified. No native productive
pointer changed, no Suno renderer connector has been executed.
NEXT: controlled word-level listening against source script, test
suite for mode-aware assembly, gated release propagation.
