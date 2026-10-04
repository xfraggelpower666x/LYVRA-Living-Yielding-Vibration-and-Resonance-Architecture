// LYVRA topic bookends: iPhone-safe, viewport-gated, silent, looping playback.
(() => {
  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = 'topic-banners.css';
  document.head.appendChild(sheet);
  const sources = {
    start: 'assets/topic-banner-start.mp4',
    end: 'assets/topic-banner-end.mp4'
  };
  const active = new Set();
  let observer;
  function makeMarker(kind, section) {
    const region = document.createElement('div');
    region.className = 'lyvra-topic-banner lyvra-topic-banner--' + kind;
    region.dataset.topic = section.id;
    region.dataset.marker = kind;
    region.setAttribute('aria-hidden', 'true');
    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.disablePictureInPicture = true;
    const source = document.createElement('source');
    source.dataset.src = sources[kind];
    source.type = 'video/mp4';
    video.appendChild(source);
    video.addEventListener('loadeddata', () => region.classList.add('is-ready'));
    video.addEventListener('playing', () => region.classList.add('is-ready'));
    video.addEventListener('error', () => {region.classList.add('is-failed');active.delete(video);});
    source.addEventListener('error', () => {region.classList.add('is-failed');active.delete(video);});
    region.appendChild(video);
    region._lyvraVideo = video;
    return region;
  }
  function activate(region) {
    if (region.classList.contains('is-failed')) return;
    const video = region._lyvraVideo;
    const source = video.querySelector('source');
    if (source.dataset.src) {
      source.src = source.dataset.src;
      delete source.dataset.src;
      video.load();
    }
    active.add(video);
    const result = video.play();
    if (result && typeof result.catch === 'function') result.catch(() => {
      // iOS can temporarily block playback; retry after a user gesture.
    });
  }
  function deactivate(region) {
    const video = region._lyvraVideo;
    active.delete(video);
    video.pause();
  }
  function install() {
    const sections = document.querySelectorAll('main > section[id]');
    const regions = [];
    for (const section of sections) {
      if (section.previousElementSibling?.classList.contains('lyvra-topic-banner--start')) continue;
      const start = makeMarker('start',section);
      const end = makeMarker('end',section);
      section.before(start);
      section.after(end);
      regions.push(start,end);
    }
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) activate(entry.target);
          else deactivate(entry.target);
        }
      }, {rootMargin:'250px 0px',threshold:0});
      regions.forEach(region => observer.observe(region));
    } else {
      // Fallback: only first pair, never 16 competing videos.
      regions.slice(0,2).forEach(activate);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) active.forEach(video => video.pause());
      else if (observer) for (const region of regions) {
        if (region.classList.contains('is-ready') && region.getBoundingClientRect().bottom > -250 && region.getBoundingClientRect().top < innerHeight+250) activate(region);
      }
    });
    document.addEventListener('pointerdown', () => {
      for (const video of active) if (video.paused) video.play().catch(()=>{});
    }, {passive:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
