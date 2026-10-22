import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const source=readFileSync(new URL('../WEBLyvra/live/dist/audio-neon.js',import.meta.url),'utf8');
test('Only the authorised MiniPlayer iframe and origin can drive the receiver',()=>{
 assert.match(source,/f\.contentWindow === event\.source/);
 assert.match(source,/event\.origin !== origin \|\| !frame/);
 assert.match(source,/frame\.src === `\$\{origin\}\/embed\/miniplayer\.html`/);
});
test('Synthetic data uses an independent labelled message contract',()=>{
 assert.match(source,/data\.type === 'lyvra:audio:visual-fallback'/);
 assert.match(source,/data\.mode === 'synthetic'/);
 assert.match(source,/data\.type === 'lyvra:audio:levels'/);
 assert.match(source,/Number\.isSafeInteger\(data\.sequence\)/);
});
test('Only finite normalized band values can be rendered',()=>{
 assert.match(source,/\['bass', 'mid', 'high', 'energy'\]\.every/);
 assert.match(source,/Number\.isFinite\(data\[k\]\)/);
 assert.match(source,/data\[k\] >= 0 && data\[k\] <= 1/);
});
test('Genuine nonzero samples always take priority over synthetic values',()=>{
 assert.match(source,/realCandidates\.length \? realCandidates : fallbackCandidates/);
 assert.match(source,/s\.playing && s\.energy > 0\.005/);
});
test('Zero-sample real frames do not erase unexpired synthetic input',()=>{
 assert.doesNotMatch(source,/if \(!data\.playing\) fallbackStates\.delete\(frame\)/);
 assert.match(source,/else states\.set\(frame, \{ \.\.\.data, received: lastLevelsAt \}\);/);
});
test('Fallback times out faster than normal real frame expiry',()=>{
 assert.match(source,/now - s\.received < 850/);
 assert.match(source,/now - s\.received < 1500/);
});
test('Synthetic status is visibly disclosed in both languages',()=>{
 assert.match(source,/Visueller Fallback/);
 assert.match(source,/Visual fallback/);
 assert.match(source,/synthetic \? 'synthetic' : 'active'/);
});
test('Accessibility, lifecycle reset and reduced-motion safety survive',()=>{
 assert.match(source,/!enabled \|\| motion\.matches \|\| document\.hidden/);
 assert.match(source,/states\.clear\(\); fallbackStates\.clear\(\); reset\(\)/);
 assert.match(source,/fallbackStates\.delete\(frame\)/);
 assert.match(source,/window\.addEventListener\('pagehide'/);
});
test('No second audio source, oscillator or new stream in receiver',()=>{
 assert.doesNotMatch(source,/createMediaElementSource|createOscillator|new Audio\(/);
});
