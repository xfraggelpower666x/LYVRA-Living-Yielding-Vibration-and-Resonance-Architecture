// LYVRA read-only practical scenario: native musical decisions are explicit inputs.
// This compiler translates a resolved track idea into the existing creator output surface.
// No Suno invocation, no composition authority, no new daemon, no repository or plugin I/O.
export const PRACTICAL_BOUNDARY=Object.freeze({whole_authority:'LYVRA',workspace:'TRACK_DESIGN',execution:'LOCAL_CREATOR_OUTPUT',suno_render:false,foreign_writes:false,auto_learning:false});
export const CASE=Object.freeze({
 name:'THE SIGNAL THAT LEARNED TO BREATHE',bpm:150,mode:'D Phrygian',
 cause:'An archival machine signal is revealed to be a human breath trapped in repetition.',
 irrelevant:'The Studio 2 UI changes the displayed name of an effect channel.',
 motor:'Dry hard kick, relentless short rolling 16th psybass, constant 150 BPM; mono-locked low end.',
 before:'A precise metallic signal repeats in the MID register as cold information.',
 after:'The same MID motif acquires breathing envelopes and a whispered call answered by a clipped acid stab.',
 high:'Sparse spectral orbit and phase-moving forest microtextures, above a stable dry motor.',
 exception:'No euphoric lift, no tempo alteration and no extra bass tail.'
});
const count=t=>t.length;
const box=(title,value,limit)=>{if(count(value)>limit)throw Error('BOX_LIMIT_'+title);return '### '+title+' — '+count(value)+'/'+limit+'\n\x60\x60\x60text\n'+value+'\n\x60\x60\x60\n';};
export function resolveScenario(kind='contradiction'){
 if(!['baseline','contradiction','irrelevant'].includes(kind))throw Error('UNKNOWN_SCENARIO');
 const mid=kind==='baseline'?CASE.before:CASE.after;
 return {kind,motor:CASE.motor,mid,high:CASE.high,bpm:CASE.bpm,mode:CASE.mode,
  change_reason:kind==='contradiction'?'Human-breath reveal replaces only the MID spectral expression':kind==='irrelevant'?'Irrelevant Studio UI rename does not affect any music decision':'Baseline musical conception',
  source_kind:kind==='baseline'?'BASELINE':kind==='contradiction'?'MATERIAL_CONTRADICTION':'IRRELEVANT_CONTROL',
  causal_hypothesis:kind==='contradiction',audio_verified:false};
}
export function renderCreator(s){
 const title=CASE.name;
 const extended='150 BPM D Phrygian. 0:00 dry motor and cold metallic pulse; 1:20 forest microtexture spiral 🌀; 2:10 '+(s.kind==='baseline'?'metallic motif sharpens':'breath-shaped MID pulse takes over 🫁')+'; 3:20 whispered call, short acid answer ⚡; 4:30 full-bar silence above the rhythmic clock; immediate dry re-entry; hard finish. No sentimental release.';
 const style='Dark forest psytrance, 150 BPM, D Phrygian, brutal dry kick and short relentlessly rolling psybass, mono-compatible low end. '+(s.kind==='baseline'?'Cold metallic repeating MID signal.':'Breath-enveloped repeating MID motif, brief human whisper ↔ clipped acid response ⚡.')+' Organic tribal ticks; rotating spectral forest textures 🌀 above the locked motor; strong low/mid/high separation, no pop chorus, no euphoric uplift, no fade-out.';
 const lyrics='[Intro — instrumental, dry mono kick and rolling psybass]\n[Machine signal — metallic pulse 🌀]\n[Build — upper forest dust circles, motor unchanged]\n[Spoken, low male voice — close, restrained]\nI thought the signal was a machine.\n[Response — single dry acid stab ⚡]\n[Whisper — human breath 🫁]\nIt was someone still breathing.\n[Instrumental hook — MID breath pulse returns, clipped and altered]\n[Break — brief full silence, re-enter exactly at 150 BPM]\n[Outro — hard stop, no fade]';
 const controls='Stile ausschließen: pop, happy trance, euphoric supersaws, melodic EDM\nDauer: ca. 5:10\nSeltsamkeit: 44 (suggested, not tested)\nStileinfluss: 74 (suggested, not tested)';
 const drift='Expected: stable 150 BPM dry low motor; expressive variation in MID/HIGH only. Risks: half-time drift, bass tail wash, overlong vocal, missing acid response. No audio generated; prediction only.';
 const taste='OFF';
 return box('Title',title,80)+box('Extended',extended,1000)+'My Taste: '+taste+'\n'+'### Suno Controls\n'+controls+'\n'+'### Drift Forecast\n'+drift+'\n'+box('Style',style,1000)+box('Lyrics',lyrics,5000);
}
export function exercise(options={}){
 const base=resolveScenario('baseline'),changed=resolveScenario('contradiction'),irrelevant=resolveScenario('irrelevant');
 if(base.motor!==changed.motor||base.motor!==irrelevant.motor)throw Error('LOW_MOTOR_BLEED');
 if(base.mid===changed.mid||changed.mid!==irrelevant.mid)throw Error('CAUSAL_DELTA_INCORRECT');
 if(base.bpm!==changed.bpm||changed.bpm!==irrelevant.bpm)throw Error('TEMPO_DRIFT');
 const creator=renderCreator(changed);
 if(options.currentContext){
  const bound=requireCurrentOutputContext(options.currentContext);
  const realized=[
   /dry (?:mono )?kick|dry motor/i.test(creator)&&/psybass/i.test(creator)?'LOW_MOTOR':null,
   /breath-shaped MID|breath-enveloped repeating MID/i.test(creator)?'MID_BREATH':null,
   /spectral forest textures|forest microtexture spiral/i.test(creator)?'SPECTRAL_ORBIT':null,
   /acid response|acid answer|acid stab/i.test(creator)&&/Whisper|whisper/i.test(creator)?'VOICE_ACID_RESPONSE':null,
   /hard stop|hard finish/i.test(creator)?'ENDING':null
  ].filter(Boolean);
  checkTrackOutputSurvival({source:bound,output:creator,requiredSignals:['LOW_MOTOR','MID_BREATH','SPECTRAL_ORBIT','VOICE_ACID_RESPONSE','ENDING'],realizedSignals:realized,deviceRoute:options.deviceRoute??'PC_BROWSER',requestedFields:options.requestedFields??[]});
 }
 const headings=[...creator.matchAll(/^### ([^\n]+)$/gm)].map(x=>x[1].split(' — ')[0]);
 const expected=['Title','Extended','Suno Controls','Drift Forecast','Style','Lyrics'];
 if(JSON.stringify(headings)!==JSON.stringify(expected))throw Error('CREATOR_OUTPUT_ORDER');
 return {track:CASE.name,cause:CASE.cause,unrelated:CASE.irrelevant,baseline:base,contradiction:changed,control:irrelevant,creator_output:creator,evidence:{source:'REPO_BUNDLED_SCENARIO',test:'EXECUTABLE_SOURCE_SCENARIO',semantic:'CAUSAL_HYPOTHESIS',suno_audio:'NOT_RENDERED',plugin_runtime:'NOT_OBSERVED'}};
}
if(process.argv[1]&&import.meta.url.endsWith(process.argv[1].replaceAll('\\','/')))process.stdout.write(exercise().creator_output);


// Existing practical compiler — bounded provenance and semantic survival checks.
// Does not decide musical content or perform network, plugin, or Suno operations.
export function requireCurrentOutputContext({pointer,registry,tree,componentPath,template=null}){
 if(!pointer||!registry||!tree||typeof componentPath!=='string')throw Error('CURRENTNESS_CONTEXT_REQUIRED');
 const whole=pointer.current_known_whole_state?.drive_internal_reference_whole_revision;
 const track=pointer.current_known_whole_state?.track_design_logical_revision;
 if(whole!==registry.whole_revision||track!==registry.track_design_revision)throw Error('TRACK_REGISTRY_REVISION_MISMATCH');
 if(!Object.hasOwn(tree,componentPath))throw Error('COMPONENT_SOURCE_ABSENT');
 const actual=tree[componentPath],expected=registry.critical_carriers?.[componentPath];
 if(!expected)throw Error('COMPONENT_NOT_REGISTERED');
 if(actual!==expected)throw Error('REGISTRY_COMPONENT_SHA_MISMATCH');
 if(typeof registry.freshness_epoch!=='string'||!registry.freshness_epoch)throw Error('REGISTRY_EPOCH_REQUIRED');
 if(!/^[0-9a-f]{40}$/i.test(actual))throw Error('INVALID_COMPONENT_SHA');
 const identity={whole_revision:whole,track_revision:track,registry_epoch:registry.freshness_epoch,component_path:componentPath,component_sha:actual};
 if(template){
  const bound=template.source;
  if(!bound||Object.keys(identity).some(k=>bound[k]!==identity[k]))throw Error('TEMPLATE_INVALIDATED_BY_NATIVE_SOURCE_CHANGE');
 }
 return Object.freeze(identity);
}
export function checkTrackOutputSurvival({source,output,requiredSignals=[],realizedSignals=[],forbiddenSignals=[],deviceRoute='PC_BROWSER',requestedFields=[]}){
 if(!source||!source.component_sha||typeof output!=='string')throw Error('UNBOUND_OUTPUT');
 if(!Array.isArray(requiredSignals)||!Array.isArray(realizedSignals)||!Array.isArray(forbiddenSignals))throw Error('SURVIVAL_SCOPE_REQUIRED');
 const actual=new Set(realizedSignals);
 // Cross-check declared practical-case signals against ACTUAL assembled copy text.
 const observed={
  LOW_MOTOR:/dry (?:mono )?kick|dry motor/i.test(output)&&/psybass/i.test(output),
  MID_BREATH:/breath-shaped MID|breath-enveloped repeating MID/i.test(output),
  SPECTRAL_ORBIT:/spectral forest textures|forest microtexture spiral/i.test(output),
  VOICE_ACID_RESPONSE:/acid response|acid answer|acid stab/i.test(output)&&/Whisper|whisper/i.test(output),
  ENDING:/hard stop|hard finish/i.test(output)
 };
 for(const sig of requiredSignals){if(Object.hasOwn(observed,sig)&&!observed[sig])throw Error('UNDERSTEER_UNREALIZED_'+sig);}
 for(const sig of requiredSignals){if(typeof sig!=='string'||!sig.trim())throw Error('INVALID_SIGNAL');if(!actual.has(sig))throw Error('UNDERSTEER_MISSING_'+sig);}
 for(const sig of forbiddenSignals){if(actual.has(sig))throw Error('OVERSTEER_INJECTED_'+sig);}
 if(deviceRoute==='IPHONE_APP_PRO6_CUSTOM_NO_MAIN'){
  for(const x of ['MAIN_INPUT','MY_TASTE','EXCLUDE_STYLES_FIELD','DURATION_SLIDER']){
   if(requestedFields.includes(x))throw Error('OVERSTEER_DEVICE_FIELD_'+x);
  }
 }
 if(/### Interne Box [56]/.test(output))throw Error('OVERSTEER_INTERNAL_AUDIT_LEAK');
 for(const [field,limit] of [['Title',80],['Extended',1000],['Style',1000],['Lyrics',5000]]){
  const heading=new RegExp('^### '+field+' — (\\d+)\\/'+limit+'$','m').exec(output);
  if(!heading)throw Error('UNDERSTEER_MISSING_COPY_'+field);
  const begin=output.indexOf(heading[0]);const body=output.slice(begin+heading[0].length);
  const copy=/\`\`\`(?:text|plaintext)?\n([\s\S]*?)\n\`\`\`/.exec(body);
  if(!copy||copy[1].length!==Number(heading[1])||copy[1].length>limit)throw Error('OUTPUT_UTF16_PAYLOAD_'+field);
 }
 return Object.freeze({status:'STATIC_ASSEMBLY_SURVIVAL_PASS',source,renderer_audio:'NOT_VERIFIED',host_runtime:'NOT_VERIFIED'});
}
