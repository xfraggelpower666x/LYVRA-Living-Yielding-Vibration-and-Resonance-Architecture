import { getLanguage } from './i18n.js';

// Nur Pegeldaten des freigegebenen MiniPlayers; kein zweiter Audiostream.
const origin = 'https://webradio.666soundsdesign-broadcaster.com';
const frames = [...document.querySelectorAll('iframe')].filter(frame => frame.src === `${origin}/embed/miniplayer.html`);
const panel = document.querySelector('#audio-neon-controls');
const layer = document.querySelector('#audio-neon-layer');
if (panel && layer) {
  const toggle = panel.querySelector('button');
  const status = panel.querySelector('[data-neon-status]');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map();
  const words = {
    de: { title: 'Klang wird Licht.', off: 'Neon-Effekte einschalten', on: 'Neon-Effekte ausschalten', idle: 'Effekte aus', waiting: 'Bereit · Starte den MiniPlayer', active: 'Audioreaktiv · echtes Audiosignal', paused: 'Kein aktuelles Audiosignal', reduced: 'Reduzierte Bewegung · Effekte pausiert', note: 'Bass, Mitten und Höhen steuern das Neonlicht. Keine Mikrofonfreigabe, keine Audioaufzeichnung.' },
    en: { title: 'Sound becomes light.', off: 'Enable neon effects', on: 'Disable neon effects', idle: 'Effects off', waiting: 'Ready · Start the MiniPlayer', active: 'Audio reactive · real audio signal', paused: 'No current audio signal', reduced: 'Reduced motion · effects paused', note: 'Bass, mids and highs control the neon light. No microphone access or audio recording.' }
  };
  let enabled = false, timer = null, mode = 'idle';
  function labels() {
    const text = words[getLanguage()] || words.de;
    panel.querySelector('h3').textContent = text.title;
    panel.querySelector('[data-neon-note]').textContent = text.note;
    toggle.textContent = enabled ? text.on : text.off;
    toggle.setAttribute('aria-pressed', String(enabled));
    toggle.disabled = motion.matches;
    status.textContent = text[motion.matches ? 'reduced' : mode];
  }
  function setMode(next) { if (mode !== next) { mode = next; labels(); } }
  function reset() {
    for (const key of ['bass', 'mid', 'high', 'energy']) layer.style.setProperty(`--audio-${key}`, '0');
    layer.dataset.active = 'false';
  }
  function subscribe(frame) {
    frame.contentWindow?.postMessage({ type: 'lyvra:audio:subscribe', version: 1, enabled: enabled && !motion.matches && !document.hidden }, origin);
  }
  function render() {
    const now = performance.now();
    const candidates = [...states.values()].filter(s => s.playing && now - s.received < 1500);
    if (!enabled || motion.matches || document.hidden || !candidates.length) {
      reset();
      if (enabled) setMode(states.size ? 'paused' : 'waiting');
      return;
    }
    const signal = candidates.reduce((a, b) => a.energy >= b.energy ? a : b);
    for (const key of ['bass', 'mid', 'high', 'energy']) layer.style.setProperty(`--audio-${key}`, String(signal[key]));
    layer.dataset.active = 'true';
    setMode('active');
  }
  function configure() {
    if (timer !== null) { clearInterval(timer); timer = null; }
    frames.forEach(subscribe);
    states.clear(); reset();
    mode = enabled ? 'waiting' : 'idle';
    if (enabled && !motion.matches && !document.hidden) timer = setInterval(render, 500);
    labels();
  }
  window.addEventListener('message', event => {
    const frame = frames.find(f => f.contentWindow === event.source);
    if (!enabled || motion.matches || document.hidden || event.origin !== origin || !frame) return;
    const data = event.data;
    if (!data || data.type !== 'lyvra:audio:levels' || data.version !== 1 || typeof data.playing !== 'boolean' || !Number.isSafeInteger(data.sequence) || data.sequence < 0) return;
    if (!['bass', 'mid', 'high', 'energy'].every(k => typeof data[k] === 'number' && Number.isFinite(data[k]) && data[k] >= 0 && data[k] <= 1)) return;
    const previous = states.get(frame);
    if (previous && data.sequence <= previous.sequence) return;
    states.set(frame, { ...data, received: performance.now() }); render();
  });
  frames.forEach(frame => frame.addEventListener('load', () => { states.delete(frame); subscribe(frame); render(); }));
  toggle.addEventListener('click', () => { enabled = !enabled; configure(); });
  motion.addEventListener('change', configure);
  document.addEventListener('visibilitychange', configure);
  document.addEventListener('lyvra:languagechange', labels);
  window.addEventListener('pagehide', () => { enabled = false; configure(); });
  reset(); labels();
}
