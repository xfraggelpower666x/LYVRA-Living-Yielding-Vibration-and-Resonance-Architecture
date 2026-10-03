# LYVRA Speech Beta — original creator script variant audit
DATE=2026-10-02
STATUS=DEV_SOURCE_AUTHENTICATED_WORD_VARIANT_COMPARISON_NOT_AUDIO_MAPPED
SOURCE=Creator-provided 666.md
SOURCE_SCOPING=HASHES_ONLY_NO_FULL_CREATOR_STORY_IN_GITHUB
ONE_NATIVE_IDENTITY=LYVRA
AUDIO_ASSOCIATION_TO_SCRIPT_VERSION=UNVERIFIED
ACOUSTIC_PHONEME_FAULTS_VERIFIED=false

## Exact extracted source sections
All blocks extracted directly between their original Markdown
`<WritingBlock>` markers from the uploaded `666.md`, without
altering the author's content.
| Source block | Scope | UTF-8 SHA-256 | Codepoints | UTF-16 units | Unicode word tokens |
| --- | --- | --- | ---: | ---: | ---: |
| 68321 | Original English spoken Script | `143efcb8e6ee3b6fb4f2d4885ffb49ae106f0babc4835a95458cef1e5b1238c2` | 4591 | 4591 | 684 |
| 68322 | Emoji-enhanced rewritten Script | `b249ca4866c4f6c3a0c7bd182801f384a2ca93c58ba9e80729b771edf0bfa1b2` | 4637 | 4736 | 641 |
| 58321 | Tonfall directions example | `d0fb9ba7f486dc2361c033638f9df7a4d3081a7af8af169dbfdeaf832b3d7e94` | 965 | 965 | 126 |
| 73921 | Historical full freeform master prompt | `8e0e904c3a31d04297e1472b138b19d6f2a7c2efa9181d24ff9e4a4049b04e10` | 2853 | 2863 | 364 |

Unicode word tokens count letter sequences with optional apostrophes and
preserve actual spoken text cases. Another tokenizer may count differently;
the stable immutable hashes distinguish these sources.

**Crucial new finding:** Script 68322 is NOT just script 68321 plus
emoji glyphs. It contains **43 fewer lexical tokens** (641 vs 684),
word changes and additional glyphs. Even if a specific WAV can later be
linked to each script, comparing their acoustics is not an isolated
emoji-treatment experiment. Do not infer emoji-caused diction differences.

The historical 73921 prompt is 2853 Unicode codepoints / 2863 UTF-16
units. This exceeds an *alleged* 2800 limit, but **the limit was
creator-reported and UI version dependent, not officially verified here**.
The recorded draft size does not independently prove that Suno accepted
or rejected it. Do not claim a global 2800 maximum.

## Controlled A/B contract
- A0: Original source's complete immutable spoken word sequence.
- A1: Same spoken words in same order, same voice, music toggle and
  `Vielfalt`; add only controlled *meaning-bound* emoji in a labeled
  experimental Speech field, retaining an unchanged baseline.
- If the renderer's use of glyphs is unverified, keep spoken Script
  free of literal emoji and test glyphs within `Tonfall` or another
  actually visible field; never promise acoustic behavior from glyphs.
- A separate *diction* test modifies only `Tonfall` first.
- A phonemic respelling test is a separate third experiment requiring
  verified source-version + audio + timecoded heard defect and approval.
- New Python `compare_emoji_ab` gate checks equal word token sequences.
  It is a text check; it DOES NOT prove identical pauses/punctuation,
  intonation, speech audio, or semantic interpretation.
- Current observed Suno UI must be chosen per mode (Einfach freeform;
  Erweitert Skript, Tonfall, Stimmgeschlecht, Hintergrundmusik, Vielfalt).
  No invented global char counts, model versions or speech controls.

## Private creator handoff
Creator-local ZIP `LYVRA_SPEECH_AUDIT_HOERPAKET_2026-10-02.zip`
contains six 15-second WAV-derived MP3 review excerpts (opening/mid/outro
clock times for both versions), an 80-slot timecode review table, indexed
mix loudness and source fingerprints. **This private package and any WAV
or MP3 bytes were NOT committed publicly to GitHub**. Equal clock
positions may represent different words and are not forced alignments.

## Regression evidence
Offline speech output+phoneme+UI tests and cross-surface target contract
tests passed in GitHub Actions on commit `76e20b3a07eae67482e892842d466f6e34f13fcb`,
run `37007539205`: 48/48 tests, compile PASS.
The subsequent regex repair `631acf9b1fa406f88ff5c58cba07510373fbadb8`
independently passed 33/33 before those 15 tests were added.

PRODUCTION_POINTER_MODIFIED=false
INSTALLED_PLUGIN_A_SPEECH_SKILL=false
INSTALLED_PLUGIN_B_SPEECH_SKILL=false
BUILDER_GPT_UPDATED=false
SPEECH_AUDIO_WORD_LEVEL_PASS=false
BOT_UNPAUSED=false
NO_NEW_ROUTER=true
