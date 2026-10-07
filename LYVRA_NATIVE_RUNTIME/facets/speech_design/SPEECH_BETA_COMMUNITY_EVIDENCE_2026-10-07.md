# LYVRA Speech Design — Suno Speech Beta Community Evidence 2026-10-07

STATUS=COMMUNITY_EVIDENCE_TEST_CANDIDATE
SOURCE_CLASS=USER_SUPPLIED_CHAT_EXPORT
SOURCE_DATE_RANGE=2026-10-03_TO_2026-10-07
NATIVE_RULE=false
PRODUCTION_RULE=false
OFFICIAL_FIX_CONFIRMED=false
REPRODUCIBLE_AB_CONFIRMED=false

## Reported community signals

- speech quality may degrade on longer outputs, with a reported risk increase around or beyond approximately two minutes
- voice body/level may thin over longer passages
- pauses may appear inside sentences
- background music may appear despite contrary intent
- male or female voices may drift toward melodic/singing delivery
- final words, letters, syllables or paragraph endings may be cut or swallowed

These are community-reported signals, not official renderer guarantees and not yet LYVRA-verified causal rules.

## Test candidates

SPEECH_LONGFORM_DEGRADATION_AB = 0_TO_1_MIN | 1_TO_2_MIN | OVER_2_MIN
PARAGRAPH_END_ARTICULATION_AB = SAME_CRITICAL_WORD_MID_SENTENCE_VS_PARAGRAPH_END

MEASURE =
- WORD_END_COMPLETENESS
- SYLLABLE_END_COMPLETENESS
- FINAL_CONSONANT_PRESENCE
- PARAGRAPH_END_COMPLETENESS
- TEXT_END_COMPLETENESS
- PAUSE_PLACEMENT
- VOICE_BODY_AND_LEVEL
- SEMANTIC_STABILITY
- UNWANTED_BACKGROUND_MUSIC
- MELODIC_SINGING_DRIFT
- ACCENT_DRIFT

## Evidence gate

COMMUNITY_SIGNAL_NE_RENDERER_RULE=true
LONGFORM_RISK_NE_HARD_TWO_MINUTE_LIMIT=true
PARAGRAPH_END_RISK_NE_ALWAYS_FAIL=true
AUTOMATIC_PHONETIC_REWRITE=FORBIDDEN
LITERAL_EMOJI_EFFECT=OPEN
CHARACTER_LIMITS=OPEN
BROWSER_VS_MOBILE_LIMIT_DIFFERENCE=OPEN
OFFICIAL_FIX_OR_ROADMAP=UNVERIFIED

A candidate may become a native Speech Design rule only after controlled or direct production evidence with provenance.
