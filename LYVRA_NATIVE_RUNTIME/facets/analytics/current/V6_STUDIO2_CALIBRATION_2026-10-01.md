# LYVRA Analytics — v6 / Studio 2 Current Calibration Snapshot

STATUS: CURRENT_EVIDENCE_SNAPSHOT
DATE_LOCAL: 2026-10-01
TRACK_DESIGN_REVISION: 92
FRESHNESS_CLASS: SAME_SESSION_WEB_RESEARCH
SCOPE: CURRENT_SUNO_v6_AND_STUDIO2_RENDERER_CALIBRATION
ACCEPTANCE_CLASS: PRE_RENDER_EVIDENCE_CALIBRATION_NOT_REAL_RENDER_PASS

## Official current findings

### v6 family
SOURCE_CLASS: SUNO_OFFICIAL
SOURCE: https://suno.com/release-notes
SOURCE_DATE: 2026-09-09
OBSERVATION:
- v6 = flagship / control-oriented current model
- v6-wild = exploration / less predictable variation
- v6-mini = faster efficient prototype-oriented variant

SOURCE: https://help.suno.com/en/articles/13924801
OBSERVATION:
- v6, v6-wild and v6-mini support up to 8 minutes per generation
- v6 powers current creation/editing surfaces including Custom Models, Remix and Edit

### Variety / Max Mode
SOURCE_CLASS: SUNO_OFFICIAL
SOURCE: https://help.suno.com/en/articles/13924481
OBSERVATION:
- Variety adjusts/updates style prompts
- Variety 0 is documented for retaining direct control of style tags
- Max Mode is not a universal quality toggle
- Max Mode is positioned for longer-than-two-minute songs, covers with higher source adherence, style transfer, and stronger vocal/style consistency
- Max Mode costs more credits

### Studio 2.0
SOURCE_CLASS: SUNO_OFFICIAL
SOURCE: https://suno.com/release-notes/studio-2
SOURCE_DATE: 2026-08-13
OBSERVATION:
- Studio 2.0 is a browser-based generative DAW
- MIDI import/record/edit, chat bar, audio effects, wavetable synth, musical typing and automation are native Studio surfaces
- Studio project operations must not be modeled as the same control surface as a single generation request

SOURCE: https://suno.com/release-notes/studio-updates-sept26
SOURCE_DATE: 2026-09-02
OBSERVATION:
- chat bar became BPM-aware and can process tempo changes
- prompt edits can be undone
- plugin movement/duplication and wavetable fidelity improved

SOURCE: https://suno.com/release-notes/studio-improved-midi
SOURCE_DATE: 2026-09-17
OBSERVATION:
- MIDI-to-audio transcription became faster and more context-aware
- chat-created audio stems from MIDI became more accurate
- prompting MIDI from scratch through chat improved

## Current community signals

SOURCE_CLASS: SUNO_STUDIO_COMMUNITY
SOURCES:
- Reddit r/SunoAI thread "V6 prompt help" (2026-09-14)
- Reddit r/SunoAI thread "Some ideas and suggestions for working with v6" (2026-09-17)
- Reddit r/SunoAI thread "SUNO, please acknowledge what is happening with V6." (2026-09-28)

SIGNALS:
- multiple users report that older v5.5 prompting habits do not transfer cleanly to v6
- some users report better results from prioritized musical relationships / production / arrangement descriptions instead of keyword clouds
- other users report quality, arrangement or compression deterioration on longer generations
- these reports conflict and therefore remain TEST_CANDIDATES, not current truth

COMMUNITY_NE_AUTOMATIC_TRUTH = true
CONFLICT_REQUIRES_OWN_RENDER_TEST = true

## Current LYVRA interpretation

1. NORMAL_GENERATION_CONTROL and STUDIO2_OPERATION_CONTROL remain separate control families.
2. CURRENT_MODEL_SELECTION remains contextual:
   - v6 for control / production work
   - v6-wild for deliberate exploration
   - v6-mini for fast prototype learning
3. Variety and Max Mode must be represented by current documented functions, not historical slider assumptions.
4. v6 prompt migration from older models remains CONTEXT_DEPENDENT and requires LYVRA-specific renderer translation rather than copying community converter formulas.
5. Studio 2 chat/MIDI/automation behaviors are evolving rapidly; same-session official check remains justified for material Studio operations.
6. Community prompt findings may inform A/B candidates but cannot become global LYVRA rules without creator-validated render evidence.
7. REAL_SUNO_ANALYTICS_ACCEPTANCE remains OPEN_EVENT_GATED.
8. v6_MODEL_CALIBRATION advances to PRE_RENDER_EVIDENCE_CALIBRATED; real-render calibration remains open.

## Next test boundary

NEXT_REAL_EVIDENCE_NEEDED:
- same musical core
- recorded model/control context
- creator hearing
- expected-vs-actual comparison
- no syntax or slider rule promotion from web evidence alone

NO_FAKE_RENDER_PASS = true
NO_GLOBAL_RULE_PROMOTION = true
