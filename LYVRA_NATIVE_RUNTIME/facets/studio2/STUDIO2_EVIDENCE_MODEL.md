# LYVRA Suno Studio 2 — Evidence Source Model

STATUS: CURRENT_PRODUCTIVE_NATIVE_FACET_RELATION
TRACK_LOGICAL_REVISION: 89

Studio 2 is LYVRA's Suno execution, observation and evidence surface. It does not decide durable truth by itself; it captures clean evidence for Analytics and Music Memory & Evolution.

## Evidence lanes

### 1. SUNO_OFFICIAL
SOURCES = official Suno product pages|official help/docs|official release notes|official UI behavior|official announcements
ROLE = highest external authority for documented current product capability
LIMIT = documented capability does not guarantee exact render obedience

### 2. GENERAL_STUDIO_AUDIO_DOMAIN
SOURCES = audio engineering|music production|psychoacoustics|mixing|arrangement|general studio research
ROLE = domain knowledge for interpreting sound and production behavior
LIMIT = not Suno-specific authority

### 3. SUNO_STUDIO_COMMUNITY
SOURCES = Suno community|current Reddit discussions|creator reports|forums|tutorials|current community experiments
ROLE = recurring behavior signals, edge cases and test candidates
LIMIT = community claim is never automatic truth
REPEATED_INDEPENDENT_REPORTS_GT_SINGLE_REPORT = true

### 4. OWN_LYVRA_EVIDENCE
SOURCES = creator-verified renders|our controlled tests|our prompt/result comparisons|our model/slider comparisons|our Studio 2 observations
ROLE = highest practical evidence for our own workflow when conditions are recorded
USER_VERIFIED_RENDER = HIGHEST_PRACTICAL_OBSERVED_RESULT
SINGLE_OWN_RENDER_NE_GLOBAL_RULE = true

### 5. SPECIAL_EXTERNAL_DOMAIN_EVIDENCE
EXAMPLE = MuseLift
ROLE = specialized external musical/prompt/domain evidence
LIMIT = not Suno authority; must be compared against official/current community/own render evidence

## Search routing
PURE_SUNO_QUESTION = SEARCH_SUNO_OFFICIAL_FIRST > SEARCH_CURRENT_SUNO_COMMUNITY > CHECK_OWN_STUDIO2_EVIDENCE > USE_GENERAL_DOMAIN_ONLY_FOR_INTERPRETATION
GENERAL_STUDIO_QUESTION = SEARCH_AUDIO_STUDIO_DOMAIN > CHECK_SUNO_APPLICABILITY > CHECK_OWN_RENDER_EVIDENCE
PROMPT_BEHAVIOR_QUESTION = OFFICIAL_CAPABILITY > CURRENT_COMMUNITY_BEHAVIOR > OWN_CONTROLLED_RENDER > ANALYTICS_CAUSAL_SYNTHESIS
MODEL_OR_SLIDER_QUESTION = CURRENT_UI_OR_OFFICIAL > CURRENT_COMMUNITY > OWN_CONTROLLED_COMPARISON > ANALYTICS_GENERALIZATION

## Required provenance
Every material Studio 2 evidence item must retain SOURCE_CLASS, SOURCE, DATE_OR_VERSION_CONTEXT, QUESTION, OBSERVATION, INTERPRETATION, CONFIDENCE, CONTRADICTIONS, GENERALIZATION_LIMIT and TEST_STATUS.

## Hand-off
STUDIO2_TO_ANALYTICS = RAW_OR_CLASSIFIED_EVIDENCE
ANALYTICS_TO_MUSIC_MEMORY = REVIEWED_CAUSAL_LEARNING_WITH_SCOPE
STUDIO2_TO_MUSIC_MEMORY_DIRECT = ONLY_TRACK_SPECIFIC_OBSERVATION_UNTIL_ANALYTICS_GENERALIZES
