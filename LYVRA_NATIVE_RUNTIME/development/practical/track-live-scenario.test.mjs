import {test} from 'node:test';
import assert from 'node:assert/strict';
import {CASE,resolveScenario,renderCreator,exercise,PRACTICAL_BOUNDARY,requireCurrentOutputContext,checkTrackOutputSurvival} from './track-live-scenario.mjs';
test('real end to end exercise yields creator material',()=>{const x=exercise();assert.ok(x.creator_output.includes('### Lyrics — '));assert.ok(x.creator_output.includes('### Suno Controls'));assert.ok(x.creator_output.includes('### Drift Forecast'));assert.equal(x.evidence.suno_audio,'NOT_RENDERED')});
test('material contradiction mutates MID but keeps low motor and BPM',()=>{const a=resolveScenario('baseline'),b=resolveScenario('contradiction');assert.notEqual(a.mid,b.mid);assert.equal(a.motor,b.motor);assert.equal(a.bpm,b.bpm)});
test('irrelevant Studio UI change cannot mutate track design',()=>{const b=resolveScenario('contradiction'),c=resolveScenario('irrelevant');assert.equal(b.mid,c.mid);assert.equal(b.motor,c.motor);assert.equal(b.high,c.high)});
test('all copyfields respect character limits',()=>{const rendered=exercise().creator_output;for(const [name,max] of [['Title',80],['Extended',1000],['Style',1000],['Lyrics',5000]]){const m=rendered.match(new RegExp('### '+name+' — (\\d+)\\/'+max));assert.ok(m,'missing '+name);assert.ok(Number(m[1])<=max)}});
test('functional emoji survive all relevant creator fields',()=>{const x=exercise().creator_output;assert.ok(x.includes('spiral 🌀'));assert.ok(x.includes('acid response ⚡'));assert.ok(x.includes('breath 🫁'))});
test('instrumental call response is square bracket scoped',()=>assert.ok(exercise().creator_output.includes('[Response — single dry acid stab ⚡]')));
test('internal verification dimensions do not leak into creator output',()=>{const x=exercise().creator_output;assert.ok(!x.includes('### Interne Box 5'));assert.ok(!x.includes('### Interne Box 6'))});
test('only LYVRA decides and no external Suno call occurs',()=>{assert.equal(PRACTICAL_BOUNDARY.whole_authority,'LYVRA');assert.equal(PRACTICAL_BOUNDARY.suno_render,false);assert.equal(PRACTICAL_BOUNDARY.foreign_writes,false)});
test('unexpected fixture variants are not silently composed',()=>assert.throws(()=>resolveScenario('studio2-render'),/UNKNOWN_SCENARIO/));
test('output is deterministic for the same resolved decisions',()=>assert.equal(renderCreator(resolveScenario('contradiction')),renderCreator(resolveScenario('contradiction'))));


// CLIC R01 bounded regression: synthetic source mutations, never host/audio PASS.
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const repoRoot=resolve(dirname(fileURLToPath(import.meta.url)),'..','..','..');
const componentPath='LYVRA_NATIVE_RUNTIME/current/music/RENDERER_TRANSLATION_AND_OUTPUT_GUARD.md';
const nativePointer=JSON.parse(readFileSync(resolve(repoRoot,'LYVRA_NATIVE_RUNTIME/CURRENT_POINTER.json'),'utf8'));
const nativeRegistry=JSON.parse(readFileSync(resolve(repoRoot,'LYVRA_NATIVE_RUNTIME/continuity/CURRENT_REVISION_FINGERPRINTS.json'),'utf8'));
const componentSha=execFileSync('git',['rev-parse','HEAD:'+componentPath],{cwd:repoRoot,encoding:'utf8'}).trim();
const makeContext=(overrides={})=>({pointer:nativePointer,registry:nativeRegistry,tree:{[componentPath]:componentSha},componentPath,...overrides});
const identity=()=>requireCurrentOutputContext(makeContext());
test('component SHA is anchored to git tree and native registry, not historic component revision label',()=>{
 assert.equal(nativeRegistry.critical_carriers[componentPath],componentSha);
 const result=identity();
 assert.equal(result.track_revision,96);
 assert.equal(result.whole_revision,242);
 assert.equal(result.registry_epoch,nativeRegistry.freshness_epoch);
 assert.equal(result.component_sha,componentSha);
});
test('unchanged approved source preserves reusable output identity',()=>{
 const source=identity();
 assert.deepEqual(requireCurrentOutputContext(makeContext({template:{source}})),source);
});
test('valid source change invalidates old output template even after registry is refreshed',()=>{
 const source=identity();
 const changed='a'.repeat(40)===source.component_sha?'b'.repeat(40):'a'.repeat(40);
 const updatedRegistry={...nativeRegistry,freshness_epoch:'bounded-ci-new-source-epoch',critical_carriers:{...nativeRegistry.critical_carriers,[componentPath]:changed}};
 const newer=makeContext({registry:updatedRegistry,tree:{[componentPath]:changed}});
 assert.throws(()=>requireCurrentOutputContext({...newer,template:{source}}),/TEMPLATE_INVALIDATED_BY_NATIVE_SOURCE_CHANGE/);
 assert.equal(requireCurrentOutputContext(newer).component_sha,changed);
});
test('stale tree vs registry and missing registration both fail closed',()=>{
 assert.throws(()=>requireCurrentOutputContext(makeContext({tree:{[componentPath]:'c'.repeat(40)}})),/REGISTRY_COMPONENT_SHA_MISMATCH/);
 const missing={...nativeRegistry,critical_carriers:{}};
 assert.throws(()=>requireCurrentOutputContext(makeContext({registry:missing})),/COMPONENT_NOT_REGISTERED/);
});
test('registry-track mismatch cannot hide behind valid component SHA',()=>{
 const wrong={...nativeRegistry,track_design_revision:95};
 assert.throws(()=>requireCurrentOutputContext(makeContext({registry:wrong})),/TRACK_REGISTRY_REVISION_MISMATCH/);
});
test('source-bound practical assembly survives five meaningful track signals',()=>{
 const result=exercise({currentContext:makeContext()});
 assert.match(result.creator_output,/### Drift Forecast/);
 assert.equal(result.evidence.suno_audio,'NOT_RENDERED');
});
test('understeer missing one causally required relation rejects output',()=>{
 const output=renderCreator(resolveScenario('contradiction'));
 assert.throws(()=>checkTrackOutputSurvival({source:identity(),output,requiredSignals:['LOW_MOTOR','MID_BREATH'],realizedSignals:['LOW_MOTOR']}),/UNDERSTEER_MISSING_MID_BREATH/);
});
test('oversteer unrequested device controls and invented semantic relation reject output',()=>{
 const output=renderCreator(resolveScenario('contradiction'));
 assert.throws(()=>checkTrackOutputSurvival({source:identity(),output,deviceRoute:'IPHONE_APP_PRO6_CUSTOM_NO_MAIN',requestedFields:['DURATION_SLIDER']}),/OVERSTEER_DEVICE_FIELD_DURATION_SLIDER/);
 assert.throws(()=>checkTrackOutputSurvival({source:identity(),output,forbiddenSignals:['EUPHORIC_POP'],realizedSignals:['EUPHORIC_POP']}),/OVERSTEER_INJECTED_EUPHORIC_POP/);
});
test('actual output copy payload counts UTF-16 emoji surrogate pairs',()=>{
 const output=renderCreator(resolveScenario('contradiction'));
 const bad=output.replace('### Style — ','### Style — 1/1000\nBAD\n### Style — ');
 assert.throws(()=>checkTrackOutputSurvival({source:identity(),output:bad}),/OUTPUT_UTF16_PAYLOAD_Style/);
});

test('fake declared semantic signal fails when missing from actual output',()=>{
 const output=renderCreator(resolveScenario('contradiction')).replace(/breath-shaped MID/gi,'muted MID').replace(/breath-enveloped repeating MID/gi,'muted MID');
 assert.throws(()=>checkTrackOutputSurvival({source:identity(),output,requiredSignals:['MID_BREATH'],realizedSignals:['MID_BREATH']}),/UNDERSTEER_UNREALIZED_MID_BREATH/);
});
test('actual emoji code-unit counts match displayed copy fields',()=>{
 const output=renderCreator(resolveScenario('contradiction'));
 const fence=String.fromCharCode(96).repeat(3);
 for(const [field,limit] of [['Title',80],['Extended',1000],['Style',1000],['Lyrics',5000]]){
  const re=new RegExp('^### '+field+' — (\\d+)\\/'+limit+'$\\n'+fence+'text\\n([\\s\\S]*?)\\n'+fence,'m');
  const segment=output.match(re);
  assert.ok(segment,'missing '+field);
  assert.equal(Number(segment[1]),segment[2].length);
 }
});
