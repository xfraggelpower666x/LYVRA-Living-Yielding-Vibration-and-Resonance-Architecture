import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
const root = new URL('../../../', import.meta.url);
const read = p => readFileSync(new URL(p, root), 'utf8');
const relational = read('LYVRA_NATIVE_RUNTIME/current/music/TRACK_DESIGN_RELATIONAL_CARD_INTELLIGENCE.md');
const rehab = read('LYVRA_NATIVE_RUNTIME/current/music/TRACK_DESIGN_SUB_REHYDRATION.md');
const lyrics = read('LYVRA_NATIVE_RUNTIME/current/music/SEMANTIC_CAUSAL_LYRIC_INTELLIGENCE.md');
const renderer = read('LYVRA_NATIVE_RUNTIME/current/music/RENDERER_TRANSLATION_AND_OUTPUT_GUARD.md');
const governance = read('LYVRA_NATIVE_RUNTIME/current/governance/TRACK_DESIGN_MASTER_BASE_AND_FACET_ADAPTATION.md');
const studio = read('LYVRA_NATIVE_RUNTIME/facets/studio2/SUB_REHYDRATION.md');
const speech = read('LYVRA_NATIVE_RUNTIME/facets/speech_design/SUB_REHYDRATION.md');
const must = (data, parts) => { for (const p of parts) assert.ok(data.includes(p), 'missing native causal relation: '+p); };
test('restored prior intelligences retain operative relations not just names',()=>{
 must(relational,['MAX_NE_MAXIMUM_LUFS_NUMBER = true','KICK_INDIVIDUALLY_READABLE','ORBITER_IS_PERCEPTUAL_TRAJECTORY_NOT_SIMPLE_AUTOPAN = true','ORBITER_MUST_NOT_DESTROY_LOW_MONO_TRANSLATION = true','CALL_RESPONSE = TRIGGER_TO_ANSWER_RELATION','SEMANTIC_CAUSAL_SIGNAL_BUS = CURRENT_RELATIONAL_COORDINATION_LAYER','SIGNAL_BUS_NE_CONTROLLER = true','NO_SIGNAL_MAY_OVERRIDE_LOW_REAL_TIME_AUTHORITY = true']);
});
test('native causal handshake and evidence-return path persist',()=>{
 must(relational,['RECEIVER_INTERPRETS_CONTEXT >','RECEIVER_RESPONDS_WITHIN_OWN_ROLE >','AUDIBLE_CONSEQUENCE >','RETURN_SIGNAL >','MEMORY_EVIDENCE_UPDATE','LEARNING = CHANGE_IN_RELATIONAL_UNDERSTANDING','CONTRADICTION_MUST_BE_PRESERVED = true','STUDIO2_OPERATION_EVIDENCE','SPEECH_SCORING_RELATIONS']);
});
test('lyric causes cross-domain motion but renderer preserves prior meaning',()=>{
 must(lyrics,['SOURCE_MEANING >','SEMANTIC_CORE >','VOICE_RELATIONS >','CALL_RESPONSE >','FX_SFX_PSYCHOACOUSTIC_EVENTS >','RENDERER_TRANSLATION','MOTOR_PRESERVATION']);
 must(renderer,['MASTERBRAIN_THOUGHT_MUST_REMAIN_RENDERER_AGNOSTIC = true','RENDERER_TRANSLATION_MAY_NOT_INVENT_MISSING_MUSICAL_ANSWER = true','SEMANTIC_COMPRESSION_NE_SEMANTIC_FLATTENING = true']);
});
test('rehydration preserves bidirectional cross-layer relations and failure transparency',()=>{
 must(rehab,['STATUS = EXPERIMENTAL_REHYDRATION_BEHAVIOR_CONTRACT_NOT_LIVE_RUNTIME_PROOF','PILOT_GOAL = RECONSTRUCT_SEMANTIC_CAUSAL_RELATIONS_OF_RELATIONS_NOT_JUST_CAPABILITY_NAMES','DEMONSTRATION_MUST_INCLUDE_BIDIRECTIONAL_INTERPRETATION = true','DORMANT_RELATIONS_REMAIN_REACHABLE_NOT_FORCED_ACTIVE','RENDER_RESULT_REQUIRES_REAL_AUDIO_EVIDENCE','TRACK_DESIGN_SUB_REHYDRATED_NE_TRUE_IF_CRITICAL_CAUSAL_CHAINS_ARE_NOT_EXECUTABLE = true']);
});
test('specialist facet consume current Track Design by reference without forking',()=>{
 must(governance,['CONSUME_BY_REFERENCE = true','NO_COPIED_FORKS = true','RETURN_EVIDENCE','TRACK_DESIGN_MASTER_BASE_NE_PARENT_FACET = true']);
 must(studio,['STUDIO2_CONSUMES_TRACK_DESIGN_BY_REFERENCE = true','STUDIO2_MUST_NOT_FORK_TRACK_DESIGN_INTELLIGENCE = true']);
 must(speech,['SPEECH_CONSUMES_TRACK_DESIGN_BY_REFERENCE = true','SPEECH_MUST_NOT_FORK_TRACK_DESIGN_INTELLIGENCE = true']);
});
test('negative mutation is detected, without claiming runtime execution',()=>{
 const corrupted=relational.replace('NO_SIGNAL_MAY_OVERRIDE_LOW_REAL_TIME_AUTHORITY = true','NO_SIGNAL_MAY_OVERRIDE_LOW_REAL_TIME_AUTHORITY = false');
 assert.notEqual(corrupted,relational);
 assert.throws(()=>must(corrupted,['NO_SIGNAL_MAY_OVERRIDE_LOW_REAL_TIME_AUTHORITY = true']),/missing native causal relation/);
});
console.log('STATIC_CONTRACT_REGRESSION_ONLY: native live fresh-boot and audio outcomes remain UNVERIFIED');
