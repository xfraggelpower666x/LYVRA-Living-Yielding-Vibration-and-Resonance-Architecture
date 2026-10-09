import {readFileSync} from 'node:fs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
const root=new URL('../../../',import.meta.url);
const get=(name)=>readFileSync(new URL(name,root),'utf8');
const core=get('LYVRA_NATIVE_RUNTIME/current/music/TRACK_MUSIC_INTELLIGENCE.md');
const graph=get('LYVRA_NATIVE_RUNTIME/current/music/TRACK_DESIGN_RELATIONAL_CARD_INTELLIGENCE.md');
const rehab=get('LYVRA_NATIVE_RUNTIME/current/music/TRACK_DESIGN_SUB_REHYDRATION.md');
const renderer=get('LYVRA_NATIVE_RUNTIME/current/music/RENDERER_TRANSLATION_AND_OUTPUT_GUARD.md');
const lyric=get('LYVRA_NATIVE_RUNTIME/current/music/SEMANTIC_CAUSAL_LYRIC_INTELLIGENCE.md');
const assertRules=(source,rules)=>rules.forEach(r=>assert.ok(source.includes(r),'Native prerequisite missing: '+r));
// This is a deterministic, explicit hypothetical application trace, NOT a runtime LYVRA cognition or actual renderer.
function trace(context){
  const meanings={
    A:{cause:'SERPENT_IMAGE',voice:'WHISPER_TO_ACID',movement:'ACID_SPIRAL',space:'ORBITAL_PROXIMITY',return:'MUTATED_MANTRA'},
    B:{cause:'HUMAN_REUNION',voice:'DRY_CENTER_TO_SHADOW_RESPONSE',movement:'MID_HIGH_TENSION_RELEASE',space:'DISTANCE_COLLAPSE',return:'RECOGNITION_WITH_HISTORY'}
  };
  const v=meanings[context];if(!v)throw Error('Unknown context');
  return {...v,motor:'DRY_4_4_KICK_ROLLING_PSYBASS',guard:'LOW_TIME_AUTHORITY',translation:'MEANING_TO_RENDERER_FIELD_WITH_CAUSAL_EMOJI_WHEN_RELEVANT',learning:'EVIDENCE_PENDING_NOT_MEMORY_PROMOTED'};
}
test('prerequisite native causal chains are reconstructible by reference',()=>{
 assertRules(core,['PSY_LOW_ROOT','MOTOR_HAS_STRONGEST_TRACK_FACET_INFLUENCE = true','LYRIC_INFLUENCES_TRACK_WIDE_ATMOSPHERE = true']);
 assertRules(graph,['RETURN_WITH_HISTORY','ORBITER_IS_PERCEPTUAL_TRAJECTORY_NOT_SIMPLE_AUTOPAN = true','CONTRADICTION_MUST_BE_PRESERVED = true']);
 assertRules(lyric,['SERPENT_TO_ACID_MOTION','SEMANTIC_CORE >','VOICE_RELATIONS >','FX_SFX_PSYCHOACOUSTIC_EVENTS >','MOTOR_PRESERVATION']);
 assertRules(renderer,['EMOJI_NE_DECORATION = true','RENDERER_TRANSLATION_MAY_NOT_INVENT_MISSING_MUSICAL_ANSWER = true']);
 assertRules(rehab,['DEMONSTRATION_MUST_INCLUDE_BIDIRECTIONAL_INTERPRETATION = true','RENDER_RESULT_REQUIRES_REAL_AUDIO_EVIDENCE']);
});
test('identical recovered repertoire supports two meaning-dependent hypothetical paths',()=>{
 const a=trace('A'),b=trace('B');
 assert.notEqual(a.cause,b.cause);assert.notEqual(a.voice,b.voice);
 assert.notEqual(a.movement,b.movement);assert.notEqual(a.space,b.space);
 assert.equal(a.motor,b.motor);assert.equal(a.guard,b.guard);
 assert.equal(a.learning,'EVIDENCE_PENDING_NOT_MEMORY_PROMOTED');
 assert.equal(b.learning,'EVIDENCE_PENDING_NOT_MEMORY_PROMOTED');
});
test('does not infer audio proof, provider compliance or live fresh boot from traces',()=>{
 assert.equal(trace('A').learning,'EVIDENCE_PENDING_NOT_MEMORY_PROMOTED');
 assert.equal(trace('B').translation,'MEANING_TO_RENDERER_FIELD_WITH_CAUSAL_EMOJI_WHEN_RELEVANT');
 assert.throws(()=>trace('UNRELATED_CONTEXT'),/Unknown context/);
});
console.log('HYPOTHETICAL_CONTEXT_TRACE_ONLY: no live LYVRA reasoning, independent fresh boot, web freshness or Suno render proven');
