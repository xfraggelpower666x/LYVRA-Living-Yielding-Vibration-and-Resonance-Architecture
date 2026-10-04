// LYVRA topic bookends: additive, repeatable, silent, inline animation.
(() => {
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = 'topic-banners.css';
  document.head.appendChild(stylesheet);
  const markers = [
    {kind:'start', src:'assets/topic-banner-start.mp4', label:'Beginn des Themenbereichs'},
    {kind:'end', src:'assets/topic-banner-end.mp4', label:'Ende des Themenbereichs'}
  ];
  function makeMarker(item, section) {
    const region = document.createElement('div');
    region.className = 'lyvra-topic-banner lyvra-topic-banner--' + item.kind;
    region.dataset.topic = section.id;
    region.dataset.marker = item.kind;
    region.setAttribute('aria-hidden','true');
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.setAttribute('muted','');
    video.setAttribute('playsinline','');
    video.setAttribute('aria-label',item.label);
    const source = document.createElement('source');
    source.src = item.src;
    source.type = 'video/mp4';
    video.appendChild(source);
    region.appendChild(video);
    return region;
  }
  function installTopicBanners() {
    // Main sections only: embedded subsections and standalone app pages are untouched.
    for (const section of document.querySelectorAll('main > section[id]')) {
      if (section.previousElementSibling?.classList.contains('lyvra-topic-banner--start')) continue;
      section.before(makeMarker(markers[0],section));
      section.after(makeMarker(markers[1],section));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',installTopicBanners,{once:true});
  else installTopicBanners();
})();
