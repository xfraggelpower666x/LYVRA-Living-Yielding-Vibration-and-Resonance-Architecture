// LYVRA: one shared two-video transition, reused at each section boundary.
(() => {
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='topic-banners.css';
  document.head.appendChild(link);
  function boot(){
    // Preserve the original intro video, but do not reserve a giant black panel.
    // Keep it in layout with zero height while decoding (display:none can prevent
    // loading on Safari). Reveal only after real frame data becomes available.
    const intro = document.getElementById('lyvra-video-loop');
    const introVideo = intro?.querySelector('video');
    if (intro && introVideo) {
      intro.style.height = '0';
      intro.style.minHeight = '0';
      intro.style.padding = '0';
      intro.style.overflow = 'hidden';
      intro.style.opacity = '0';
      introVideo.muted = true;
      introVideo.playsInline = true;
      introVideo.preload = 'auto';
      introVideo.setAttribute('playsinline', '');
      introVideo.setAttribute('webkit-playsinline', '');
      let ready = false;
      const show = () => {
        if (ready || introVideo.readyState < 2) return;
        ready = true;
        intro.style.height = '';
        intro.style.minHeight = '';
        intro.style.padding = '';
        intro.style.overflow = '';
        intro.style.opacity = '';
      };
      introVideo.addEventListener('loadeddata', show);
      introVideo.addEventListener('playing', show);
      introVideo.addEventListener('error', () => { if(!ready) intro.style.height = '0'; });
      if (introVideo.readyState >= 2) show();
      const promise = introVideo.play();
      if (promise && typeof promise.catch === 'function') promise.catch(() => {});
      document.addEventListener('pointerdown', () => {
        if (!ready && introVideo.paused) introVideo.play().catch(() => {});
      }, {passive:true});
    }
    const sections=[...document.querySelectorAll('main > section[id]')];
    if(!sections.length)return;
    const markers=sections.map(section=>{
      const marker=document.createElement('div');
      marker.className='lyvra-topic-transition';
      marker.dataset.topic=section.id;
      marker.setAttribute('aria-hidden','true');
      section.before(marker);
      return marker;
    });
    const pair=document.createElement('div');
    pair.className='lyvra-topic-transition-pair';
    function movie(src){
      const v=document.createElement('video');
      v.src=src;
      v.muted=true;
      v.defaultMuted=true;
      v.autoplay=true;
      v.loop=true;
      v.playsInline=true;
      v.preload='auto';
      v.controls=false;
      v.removeAttribute('controls');
      v.setAttribute('autoplay','');
      v.setAttribute('loop','');
      v.setAttribute('muted','');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.disablePictureInPicture=true;
      return v;
    }
    // Previous subject ends (left), next subject starts (right).
    const videos=[movie('assets/topic-banner-end.mp4'),movie('assets/topic-banner-start.mp4')];
    pair.append(...videos);
    for (const v of videos) {
      v.addEventListener('canplay', () => {
        if (document.hidden || !v.paused) return;
        const result=v.play();
        if(result && typeof result.catch==='function')result.catch(()=>{});
      });
    }
    let selected=null, scheduled=false;
    function refresh(){
      scheduled=false;
      if(document.hidden){videos.forEach(v=>v.pause());return;}
      const mid=innerHeight/2;
      let best=null, distance=Infinity;
      for(const m of markers){
        const rect=m.getBoundingClientRect();
        const d=Math.abs(rect.top-mid);
        if(d<distance){distance=d;best=m;}
      }
      // Keep the paired divider present at the nearest topic boundary.
      // Only pause decoding when far away; never remove the pair on scroll.
      if(!best)return;
      if(selected!==best){
        if(selected)selected.classList.remove('is-active');
        selected=best;
        best.classList.add('is-active');
        best.appendChild(pair);
      }
      // Keep the two already-loaded, muted decorative loops playing while
      // the page is visible. Offscreen pause caused native iOS play overlays.
      for(const v of videos){
        if (!v.paused) continue;
        const playing=v.play();
        if(playing&&typeof playing.catch==='function')playing.catch(()=>{});
      }
    }
    function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(refresh);}}
    addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',schedule,{passive:true});
    document.addEventListener('visibilitychange',schedule);
    document.addEventListener('pointerdown',schedule,{passive:true});
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
