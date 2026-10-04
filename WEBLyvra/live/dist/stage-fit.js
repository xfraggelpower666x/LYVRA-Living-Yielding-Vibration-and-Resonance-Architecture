// Fixed LYVRA reference canvas: one visual composition across viewport sizes.
// No storage, remote calls, player, or native runtime mutations.
(() => {
  const WIDTH = 1440;
  const viewport = document.querySelector('meta[name="viewport"]');
  // A wide layout viewport lets mobile browsers fit the entire reference canvas.
  if (viewport) viewport.setAttribute('content', 'width=1440');
  const root = document.documentElement;
  const body = document.body;
  body.style.width = WIDTH + 'px';
  body.style.maxWidth = 'none';
  body.style.marginInline = 'auto';
  root.style.overflowX = 'clip';
  function fit() {
    // On desktop, zoom scales layout and scroll-height instead of clipping it.
    const available = window.innerWidth || WIDTH;
    const factor = Math.min(1, Math.max(0.15, available / WIDTH));
    body.style.zoom = String(factor);
    body.dataset.stageScale = factor.toFixed(4);
  }
  fit();
  window.addEventListener('resize', fit, {passive:true});
  window.addEventListener('orientationchange', fit, {passive:true});
})();
