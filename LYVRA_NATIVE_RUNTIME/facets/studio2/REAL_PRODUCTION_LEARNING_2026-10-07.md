# LYVRA Suno Studio 2 — Real Production Learning 2026-10-07

STATUS: CURRENT_PRODUCTIVE_RELATIONAL_EVIDENCE
PARENT_FACET: SUNO_STUDIO_2
OWNER_IDENTITY: LYVRA
SCOPE: TRACK_LOCAL_EVIDENCE_WITH_BOUNDED_GENERALIZABLE_RELATIONS

## Session

TRACK = If the World Were My Love
CUSTOM_MODEL = 666SD_PsyTrance v6
BASE_TAKE = Take 2
PROJECT_CLOCK_FINAL = 148 BPM
INITIAL_GENERATED_BASE_DURATION = approximately 6:40
BEST_ENDING_CANDIDATE = first generated ending candidate
LATER_ENDING_CANDIDATES = rejected for continuity drift

## What was verified

INITIAL_TAKE_FORMATION_WORKED =
STYLE >
LYRICS >
CUSTOM_MODEL >
OPERATION_CONTROLS >
INITIAL_TWO_TAKE_INSTRUCTION >
TWO_COMPLETE_CANDIDATES >
AUDITION >
BASE_SELECTION

TAKE_2_WAS_SELECTED_BY_CREATOR_LISTENING = true

PROJECT_TEMPO_WAS_MANUALLY_SET_TO_148_BPM = true
CREATOR_LISTENING_CONFIRMED_NO_UNACCEPTABLE_CHANGE_AFTER_TEMPO_SET = true

HEADROOM_REPAIR =
CLIP_GAIN_MINUS_2_DB >
PEAK_FROM_APPROX_PLUS_0_8_DBFS_TO_APPROX_MINUS_1_2_DBFS >
EFFECTIVE_LOUDNESS_APPROX_MINUS_13_9_LUFS >
STRUCTURE_PRESERVED

## Critical learning: audit evidence versus real audio

STUDIO_ANALYTIC_AUDIT_MAY_REPORT_PASS_WHILE_REAL_AUDIO_STILL_FAILS_CREATIVE_INTENT = true

In this session, Studio structural/measurement audits classified the ending and terminal corridor as PASS/LOCK, but direct listening and uploaded WAV evidence showed that the ending did not resolve convincingly enough.

EVIDENCE_PRECEDENCE_FOR_AUDIBLE_CREATIVE_QUESTIONS =
DIRECT_AUDIO_LISTENING_AND_CREATOR_EVIDENCE >
STUDIO_STRUCTURAL_OR_METADATA_INFERENCE

ANALYTIC_PASS_NE_CREATIVE_COMPLETENESS_PASS = true
NO_REPAIR_REQUIRED_NE_TRACK_COMPLETE = true
MASTER_CANDIDATE_READY_NE_CREATIVE_GOAL_SATISFIED_UNLESS_ENDING_AND_DEVELOPMENT_ARE_LISTENING_VERIFIED = true

## Critical learning: repair versus development

REPAIR_QUESTION = WHAT_IS_BROKEN
DEVELOPMENT_QUESTION = WHAT_IS_STILL_MISSING_TO_REACH_THE_CREATIVE_GOAL

REPAIR_PASS_DOES_NOT_CANCEL_DEVELOPMENT_NEED = true
LONGFORM_TARGET_MUST_BE_CHECKED_AGAINST_ACTUAL_RUNTIME_AND_CREATIVE_ARC = true

A structurally stable approximately 6:40 base may still require development if LYVRA's intended long-form arc has not been achieved.

## Critical learning: generation modes are not interchangeable

TAKE_FORMATION_MODE = CREATIVE_CANDIDATE_GENERATION
CONTINUITY_MODE = EXISTING_AUDIO_IDENTITY_PRESERVATION
ENDING_REPAIR_MODE = LOCAL_CLOSURE_PROBLEM
THESE_MODES_MUST_NOT_SHARE_ASSUMED_CONTROL_BEHAVIOR = true

The initial take controls used successfully for creative candidate formation must not be treated as suitable defaults for continuity extension.

CONTROL_VALUES_FROM_THIS_SESSION_ARE_TRACK_LOCAL_EVIDENCE_ONLY = true
NO_GLOBAL_PRESET_PROMOTION = true

## Ending continuity failures

Later ending generation attempts produced:
- substantially different overall sound
- substantially different beat/motor identity
- attached-clip feeling rather than seamless continuation

BEAT_IDENTITY_DRIFT = HARD_CONTINUITY_FAILURE
KICK_PSYBASS_IDENTITY_DRIFT = HARD_CONTINUITY_FAILURE
GLOBAL_TIMBRE_DRIFT = HARD_CONTINUITY_FAILURE
ATTACHED_NEW_SONG_FEEL = HARD_CONTINUITY_FAILURE

IF_CONTINUITY_CANDIDATE_CHANGES_BEAT_OR_CORE_SOUND =
REJECT_CANDIDATE >
DO_NOT_FORCE_ACCEPTANCE >
RETURN_TO_BEST_MATCHING_EARLIER_CANDIDATE_OR_EXISTING_AUDIO >
CHANGE_OPERATION_STRATEGY

CONTINUITY_QUALITY_OUTRANKS_THEORETICAL_ENDING_PERFECTION = true

The creator returned to the first generated ending because it matched the existing track best. The seam was then accepted by creator listening.

BEST_MATCHING_CANDIDATE_MAY_WIN_OVER_LATER_MORE_EXPLICIT_CANDIDATES = true

## Generation instruction length

Studio accepted long analytical chat instructions but rejected an ending generation request because the requested sound description exceeded the generation-side length limit.

CHAT_ANALYSIS_CAPACITY_NE_GENERATION_DESCRIPTION_CAPACITY = true
GENERATION_PACKET_SHOULD_BE_MINIMAL_AND_OPERATION_SPECIFIC = true
NO_VERIFIED_FIXED_GENERATION_CHARACTER_LIMIT = true

When generation rejects instruction length:
PRESERVE_CORE_INVARIANTS >
REMOVE_REDUNDANT_EXPLANATION >
RETRY_WITH_SHORTER_OPERATION_PACKET

## Daemon behavior corrections

DAEMON_MUST_TRACK_BOTH =
TECHNICAL_REPAIR_STATE |
CREATIVE_DEVELOPMENT_STATE

DAEMON_MUST_NOT_FREEZE_ON_TECHNICAL_PASS_ALONE = true
DAEMON_MUST_REQUIRE_LISTENING_VERIFICATION_FOR_ENDING_CONTINUITY = true
DAEMON_MUST_NOT_REPEAT_AUDITS_WHEN_A_DIRECT_OPERATION_OR_CREATOR_LISTENING_CAN_RESOLVE_THE_OPEN_QUESTION = true

DAEMON_NEXT_STEP_SHOULD_PREFER =
ONE_CONCRETE_CREATOR_ACTION_OR_ONE_CONCRETE_STUDIO_OPERATION

## Bounded reusable relations

Reusable:
- separate take formation from post-take conducting
- separate repair from development
- treat direct listening as highest evidence for audible continuity
- treat beat/core-sound drift as continuity failure
- keep generation packets shorter than analysis packets when Studio generation rejects length
- prefer best matching candidate over theoretically cleaner but identity-breaking regeneration
- do not freeze until both technical safety and creative completion are verified

Not reusable as global truth:
- exact Weirdness / Style Influence / Audio Influence values
- exact best ending cut point
- exact clip gain for other tracks
- exact runtime required by other tracks
