// One shared video element for all 16 topic boundaries. Never 16 simultaneous decoders.
(() => {
  const css = document.createElement('link');
  css.rel = 'stylesheet';
  css.href = 'topic-banners.css';
  document.head.append(css);
  const paths = {
    start: 'assets/topic-banner-start.mp4',
    end: 'assets/topic-banner-end.mp4'
  };
  function boot() {
    const markers=[];
    for (const section of document.querySelectorAll('main > section[id]')) {
      if(section.previousElementSibling?.classList.contains('lyvra-topic-banner')) continue;
      for (const type of ['start','end']) {
        const el=document.createElement('div');
        el.className='lyvra-topic-banner';
        el.dataset.topic=section.id;
        el.dataset.marker=type;
        el.setAttribute('aria-hidden','true');
        if(type==='start') section.before(el); else section.after(el);
        markers.push(el);
      }
    }
    if(!markers.length) return;
    const video=document.createElement('video');
    video.autoplay=true;
    video.muted=true;
    video.defaultMuted=true;
    video.playsInline=true;
    video.loop=true;
    video.preload='metadata';
    video.disablePictureInPicture=true;
    video.setAttribute('muted','');
    video.setAttribute('playsinline','');
    video.setAttribute('webkit-playsinline','');
    let current=null, frame=0;
    video.addEventListener('error',()=>{if(current)current.classList.add('is-failed');});
    function update() {
      frame=0;
      if(document.hidden){video.pause();return;}
      const vh=window.innerHeight;
      let best=null, distance=Infinity;
      for(const marker of markers){
        const box=marker.getBoundingClientRect();
        const delta=box.top>vh?box.top-vh:box.bottom<0?-box.bottom:0;
        if(delta<distance){distance=delta;best=marker;}
      }
      if(!best||distance>250){video.pause();return;}
      if(best!==current){
        if(current)current.classList.remove('is-active');
        current=best;
        current.classList.add('is-active');
        current.replaceChildren(video);
        const file=paths[current.dataset.marker];
        if(video.getAttribute('src')!==file) {
          video.setAttribute('src',file);
          video.load();
        }
      }
      const playback=video.play();
      if(playback && typeof playback.catch==='function') playback.catch(()=>{});
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(update);}
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule,{passive:true});
    document.addEventListener('visibilitychange',schedule);
    document.addEventListener('pointerdown',schedule,{passive:true});
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
