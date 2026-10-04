// LYVRA: one shared two-video transition, reused at each section boundary.
(() => {
  const link=document.createElement('link');
  link.rel='stylesheet';
  link.href='topic-banners.css';
  document.head.appendChild(link);
  function boot(){
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
      v.preload='metadata';
      v.setAttribute('muted','');
      v.setAttribute('playsinline','');
      v.setAttribute('webkit-playsinline','');
      v.disablePictureInPicture=true;
      return v;
    }
    // Previous subject ends (left), next subject starts (right).
    const videos=[movie('assets/topic-banner-end.mp4'),movie('assets/topic-banner-start.mp4')];
    pair.append(...videos);
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
      if(!best||distance>Math.max(380,innerHeight*.8)){
        videos.forEach(v=>v.pause());
        if(selected){selected.classList.remove('is-active');selected=null;}
        return;
      }
      if(selected!==best){
        if(selected)selected.classList.remove('is-active');
        selected=best;
        best.classList.add('is-active');
        best.appendChild(pair);
      }
      for(const v of videos){
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
