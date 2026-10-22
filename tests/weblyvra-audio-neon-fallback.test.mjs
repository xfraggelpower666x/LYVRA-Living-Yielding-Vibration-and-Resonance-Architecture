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

import vm from 'node:vm';

function runReceiver() {
  let clock = 100;
  const events = new Map();
  const listen = key => ({ addEventListener(name, fn) { events.set(key + ':' + name, fn); } });
  const el = () => ({ style: { setProperty() {}, opacity: '', transform: '' }, dataset: {}, textContent: '', setAttribute() {}, ...listen('element') });
  const status = el(), toggle = el(), title = el(), note = el(), layer = el();
  const visualBands = { bass: el(), mid: el(), high: el() };
  const origin = 'https://webradio.666soundsdesign-broadcaster.com';
  const frame = { src: origin + '/embed/miniplayer.html', contentWindow: { postMessage() {} }, ...listen('frame') };
  const panel = { querySelector(selector) {
    if (selector === 'button') return toggle;
    if (selector === '[data-neon-status]') return status;
    if (selector === 'h3') return title;
    if (selector === '[data-neon-note]') return note;
    const key = /data-neon-band="(.*?)"/.exec(selector)?.[1];
    return key ? visualBands[key] : null;
  } };
  layer.querySelectorAll = () => [];
  layer.querySelector = () => null;
  const document = {
    hidden: false,
    querySelectorAll(selector) { return selector === 'iframe' ? [frame] : []; },
    querySelector(selector) { return selector === '#audio-neon-controls' ? panel : selector === '#audio-neon-layer' ? layer : null; },
    ...listen('document')
  };
  const motion = { matches: false, ...listen('motion') };
  let intervalTick = null;
  const runtime = {
    document, window: { ...listen('window') }, matchMedia: () => motion,
    performance: { now: () => clock },
    setInterval(fn) { intervalTick = fn; return 1; },
    clearInterval() { intervalTick = null; },
    console
  };
  vm.runInNewContext(source.replace(/^import \{ getLanguage \} from '\.\/i18n\.js';/, "const getLanguage = () => 'de';"), runtime, { filename: 'audio-neon.js' });
  const dispatch = (data, options = {}) => {
    events.get('window:message')?.({ origin: options.origin ?? origin, source: options.source ?? frame.contentWindow, data });
  };
  const bands = { bass: .35, mid: .42, high: .24, energy: .36 };
  const synthetic = () => ({ type: 'lyvra:audio:visual-fallback', mode: 'synthetic', version: 1, playing: true, ...bands });
  const real = (sequence, playing = true, energy = .65) => ({ type: 'lyvra:audio:levels', version: 1, sequence, playing, bass: energy, mid: energy, high: energy, energy });
  return { dispatch, status, layer, synthetic, real, setClock(n) { clock = n; intervalTick?.(); }, toggle() { events.get('element:click')?.(); }, motion, document, changeMotion(value) { motion.matches = value; events.get('motion:change')?.(); }, changeVisibility(hidden) { document.hidden = hidden; events.get('document:visibilitychange')?.(); } };
}
test('runtime: trusted synthetic frame activates visibly disclosed fallback', () => {
  const x = runReceiver();
  x.toggle();
  x.dispatch(x.synthetic());
  assert.match(x.status.textContent, /Visueller Fallback/);
  assert.equal(x.layer.dataset.active, 'true');
});
test('runtime: genuine samples override synthetic then zero frames allow fallback', () => {
  const x = runReceiver();
  x.toggle();
  x.dispatch(x.synthetic());
  x.dispatch(x.real(1, true, .72));
  assert.match(x.status.textContent, /Audioreaktiv/);
  x.dispatch(x.real(2, false, 0));
  assert.match(x.status.textContent, /Visueller Fallback/);
});
test('runtime: forged origin and source rejected; expired fallback becomes inactive', () => {
  const x = runReceiver();
  x.dispatch(x.synthetic(), { origin: 'https://forged.example' });
  assert.doesNotMatch(x.status.textContent, /Visueller Fallback/);
  x.dispatch(x.synthetic(), { source: {} });
  assert.doesNotMatch(x.status.textContent, /Visueller Fallback/);
  x.toggle();
  x.dispatch(x.synthetic());
  x.setClock(1200);
  assert.equal(x.layer.dataset.active, 'false');
});

test('runtime: synthetic-only frame cannot autoactivate effects without visitor toggle', () => {
  const x = runReceiver();
  x.dispatch(x.synthetic());
  assert.doesNotMatch(x.status.textContent, /Visueller Fallback/);
  assert.equal(x.layer.dataset.active, 'false');
  x.toggle();
  x.dispatch(x.synthetic());
  assert.match(x.status.textContent, /Visueller Fallback/);
});
test('runtime: authentic real audio retains existing automatic activation', () => {
  const x = runReceiver();
  x.dispatch(x.real(1, true, .65));
  assert.match(x.status.textContent, /Audioreaktiv/);
});

test('runtime: explicit off remains off despite subsequent genuine and synthetic frames', () => {
  const x = runReceiver();
  x.dispatch(x.real(1, true, .65));
  assert.match(x.status.textContent, /Audioreaktiv/);
  x.toggle();
  x.dispatch(x.real(2, true, .7));
  x.dispatch(x.synthetic());
  assert.equal(x.layer.dataset.active, 'false');
  assert.doesNotMatch(x.status.textContent, /Audioreaktiv|Visueller Fallback/);
});
test('runtime: reduced motion suppresses fallback and real animation', () => {
  const x = runReceiver();
  x.toggle();
  x.dispatch(x.synthetic());
  assert.equal(x.layer.dataset.active, 'true');
  x.changeMotion(true);
  x.dispatch(x.synthetic());
  x.dispatch(x.real(1, true, .65));
  assert.equal(x.layer.dataset.active, 'false');
  assert.match(x.status.textContent, /Reduzierte Bewegung/);
});
test('runtime: hidden tab clears light state and does not accept fallback', () => {
  const x = runReceiver();
  x.toggle();
  x.dispatch(x.synthetic());
  assert.equal(x.layer.dataset.active, 'true');
  x.changeVisibility(true);
  x.dispatch(x.synthetic());
  assert.equal(x.layer.dataset.active, 'false');
  x.changeVisibility(false);
  assert.equal(x.layer.dataset.active, 'false');
});
