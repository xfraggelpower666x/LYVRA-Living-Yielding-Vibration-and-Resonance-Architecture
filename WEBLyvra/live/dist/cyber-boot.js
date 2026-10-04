// LYVRA first-visit cyber boot. Progressive enhancement: site renders without this module.
(() => {
  const KEY='lyvra-cyber-boot-v1';
  try { if(sessionStorage.getItem(KEY)==='done') return; } catch {}
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION=reduced?450:3400;
  const css=document.createElement('link');
  css.rel='stylesheet';css.href=new URL('./cyber-boot.css',import.meta.url).href;
  document.head.appendChild(css);
  function boot(){
    if(document.getElementById('lyvra-cyber-boot'))return;
    const root=document.createElement('div');
    root.id='lyvra-cyber-boot';
    root.setAttribute('role','status');
    root.setAttribute('aria-live','off');
    root.innerHTML=`<div class="lyvra-boot-panel"><div class="lyvra-boot-kicker">666SOUNDsDESIGn · LYVRA SYSTEM</div><div class="lyvra-boot-title">CYBER BOOTING</div><div class="lyvra-boot-state">INITIALIZING LYVRA UNIVERSE</div><div class="lyvra-boot-glyph" aria-hidden="true"><span>✦</span></div><div class="lyvra-boot-track" aria-hidden="true"><div class="lyvra-boot-fill"></div></div><div class="lyvra-boot-meter"><span class="lyvra-boot-message">CONNECTING SYSTEMS</span><span class="lyvra-boot-percent">0%</span></div><div class="lyvra-boot-steps"><div class="lyvra-boot-step"><span class="lyvra-boot-dot"></span>CONNECT</div><div class="lyvra-boot-step"><span class="lyvra-boot-dot"></span>AUDIO</div><div class="lyvra-boot-step"><span class="lyvra-boot-dot"></span>SYSTEMS</div><div class="lyvra-boot-step"><span class="lyvra-boot-dot"></span>PLAYER</div></div><button type="button" class="lyvra-boot-skip" aria-label="Startanimation überspringen">ÜBERSPRINGEN ↗</button></div>`;
    document.body.append(root);
    const fill=root.querySelector('.lyvra-boot-fill');
    const percent=root.querySelector('.lyvra-boot-percent');
    const caption=root.querySelector('.lyvra-boot-message');
    const state=root.querySelector('.lyvra-boot-state');
    const title=root.querySelector('.lyvra-boot-title');
    const steps=[...root.querySelectorAll('.lyvra-boot-step')];
    let finished=false,raf=0,started=performance.now();
    function finish(){
      if(finished)return;
      finished=true;
      cancelAnimationFrame(raf);
      try{sessionStorage.setItem(KEY,'done')}catch{}
      root.classList.add('lyvra-boot-exit');
      setTimeout(()=>root.remove(),reduced?0:460);
    }
    root.querySelector('.lyvra-boot-skip').addEventListener('click',finish);
    const phases=['CONNECTING SYSTEMS','INITIALIZING AUDIO','SYNCING LYVRA','OPENING UNIVERSE'];
    function step(t){
      if(finished)return;
      const p=Math.min(1,(t-started)/DURATION);
      const n=Math.round(p*100);
      fill.style.width=n+'%';percent.textContent=n+'%';
      const idx=Math.min(3,Math.floor(p*4));
      caption.textContent=phases[idx];
      steps.forEach((el,i)=>{el.dataset.done=String(i<=idx)});
      if(p>=1){title.textContent='BOOT COMPLETE';state.textContent='LYVRA UNIVERSE READY';caption.textContent='SOUND BECOMES FEELING';setTimeout(finish,reduced?0:450);return;}
      raf=requestAnimationFrame(step);
    }
    raf=requestAnimationFrame(step);
    // Fail open if tab throttling or animation is interrupted.
    setTimeout(finish,7000);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
