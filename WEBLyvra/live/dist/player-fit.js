// Vertrauenswürdige Größenmeldung; keine Audio- oder Admin-Steuerung.
(() => {
  const origin = 'https://webradio.666soundsdesign-broadcaster.com';
  const frames = [...document.querySelectorAll('iframe')].filter(f => f.src === `${origin}/embed/miniplayer.html`);
  function subscribe(frame) { frame.contentWindow?.postMessage({ type: 'lyvra:embed:subscribe', version: 1 }, origin); }
  window.addEventListener('message', event => {
    if (event.origin !== origin) return;
    const frame = frames.find(f => f.contentWindow === event.source), data = event.data;
    if (!frame || !data || data.type !== 'lyvra:embed:resize' || data.version !== 1 || !Number.isInteger(data.height) || data.height < 120 || data.height > 1000) return;
    frame.style.height = `${data.height}px`;
  });
  frames.forEach(frame => { frame.addEventListener('load', () => subscribe(frame)); subscribe(frame); });
})();
