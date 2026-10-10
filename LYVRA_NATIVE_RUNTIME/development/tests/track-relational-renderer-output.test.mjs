import { test } from 'node:test';
import assert from 'node:assert/strict';

// Checks a bounded creator-output Markdown surface; not live Suno or plugin runtime.
const C = String.fromCharCode(96).repeat(3);
const LIM = { Title:80, Extended:1000, 'My Taste':2000, Style:1000, Lyrics:5000 };
function box(name,value,limit) { return '### '+name+' — '+[...value].length+'/'+limit+'\n'+C+'text\n'+value+'\n'+C+'\n'; }
function sample(taste='OFF') {
 return box('Title','TEST TRACK',80)+box('Extended','Dry kick 🌀',1000)+
  'My Taste: '+taste+'\n'+(taste==='ON'?box('My Taste','Psytrance profile',2000):'')+
  '### Suno Controls\nStile ausschließen: Pop\nDauer: 5:00\nSeltsamkeit: 42\nStileinfluss: 70\n'+
  '### Drift Forecast\nMotor stable; upper-mid motion.\n'+
  box('Style','Dark rolling psytrance 🌀',1000)+box('Lyrics','[Intro]\nVoice answers 🌀',5000);
}
function audit(src) {
 const names=['Title','Extended','My Taste','Suno Controls','Drift Forecast','Style','Lyrics','Interne Box 5','Interne Box 6'];
 const h=[...src.matchAll(/^### ([^\n]+)$/gm)];
 const sections=h.map((v,i)=>{const title=v[1];const historic=title.match(/^Box ([1-4]) — /);const byNumber={'1':'Title','2':'Extended','3':'Style','4':'Lyrics'};const name=(historic?byNumber[historic[1]]:null)||names.find(n=>title===n||title.startsWith(n+' — '));return {name,title,body:src.slice(v.index+v[0].length, i+1<h.length?h[i+1].index:src.length)};});
 const err=[];const found=sections.map(s=>s.name);
 const decisions=[...src.matchAll(/\bMy Taste:\s*(ON|OFF|UNKNOWN)\b/g)];
 if(decisions.length!==1)err.push('TASTE_DECISION');
 const taste=decisions[0]?.[1];
 const want=['Title','Extended',...(taste==='ON'?['My Taste']:[]),'Suno Controls','Drift Forecast','Style','Lyrics'];
 if(JSON.stringify(found)!==JSON.stringify(want))err.push('CREATOR_ORDER_OR_MISSING_SURFACE');
 if(found.some(n=>n?.startsWith('Interne Box')))err.push('INTERNAL_GUARD_EXPOSED');
 if(taste!=='ON'&&found.includes('My Taste'))err.push('MY_TASTE_UNEXPECTED_COPYBOX');
 for(const [name,limit] of Object.entries(LIM)) {
  const s=sections.find(x=>x.name===name);if(!s)continue;
  const blocks=[...s.body.matchAll(/```(?:text|plaintext)?\n([\s\S]*?)\n```/g)];
  if(blocks.length!==1){err.push('INVALID_COPYBOX_'+name);continue;}
  const size=[...blocks[0][1]].length;
  if(size>limit||!s.title.includes('— '+size+'/'+limit))err.push('INVALID_COUNT_'+name);
 }
 return err;
}
test('My Taste OFF valid',()=>assert.deepEqual(audit(sample('OFF')),[]));
test('My Taste ON with fifth copybox valid',()=>assert.deepEqual(audit(sample('ON')),[]));
test('My Taste UNKNOWN without fifth copybox valid',()=>assert.deepEqual(audit(sample('UNKNOWN')),[]));
test('redacted fresh-chat export STRUCTURE is rejected for observed failures',()=>{
 // Faithful heading/box structure only; original user chat and lyrics are not committed.
 const output=[
   '### Box 1 — Title\n'+C+'text\nECHO\n'+C,
   '### Box 2 — Advanced Extended\n'+C+'text\nDry motor\n'+C,
   '### Box 3 — Style\n'+C+'text\nPsytrance\n'+C,
   '### Box 4 — Lyrics / Structure\n'+C+'text\n[Intro]\n'+C,
   '### Interne Box 5 — Kausaler Guard\nAudit text',
   '### Interne Box 6 — Evidenz- und Drift-Guard\nAudit text'
 ].join('\n')+'\n';
 const issues=audit(output);
 assert.ok(issues.includes('CREATOR_ORDER_OR_MISSING_SURFACE'));
 assert.ok(issues.includes('TASTE_DECISION'));
 assert.ok(issues.includes('INTERNAL_GUARD_EXPOSED'));
 for(const field of ['Title','Extended','Style','Lyrics'])assert.ok(issues.includes('INVALID_COUNT_'+field));
});
test('valid surface with neutral control narrative is not accidental historic heading fixture',()=>{
 assert.deepEqual(audit(sample('UNKNOWN')),[]);
});

test('missing controls rejected',()=>assert.ok(audit(sample().replace(/### Suno Controls[\s\S]*?(?=### Drift Forecast)/,'' )).length));
test('missing drift rejected',()=>assert.ok(audit(sample().replace(/### Drift Forecast[\s\S]*?(?=### Style)/,'' )).length));
test('wrong order rejected',()=>assert.ok(audit(sample().replace('### Suno Controls','### TEMP').replace('### Drift Forecast','### Suno Controls').replace('### TEMP','### Drift Forecast')).length));
test('false displayed count rejected',()=>assert.ok(audit(sample().replace('TEST TRACK','TEST TRACK!')).includes('INVALID_COUNT_Title')));
test('ON without fifth copybox rejected',()=>assert.ok(audit(sample('OFF').replace('My Taste: OFF','My Taste: ON')).length));
test('OFF with fifth copybox rejected',()=>assert.ok(audit(sample('ON').replace('My Taste: ON','My Taste: OFF')).length));
console.log('STATIC_CREATOR_OUTPUT_CONTRACT_REGRESSION_ONLY: native fresh boot and Suno audio unverified');
