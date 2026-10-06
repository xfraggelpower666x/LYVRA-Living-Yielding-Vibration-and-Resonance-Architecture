// LYVRA Web: CYBER INTRO HUD TEMPLATE v1.9 integration.
// Replaces the previous simple cyber boot while preserving the existing site underneath.
(() => {
  'use strict';
  const RELEASE='cyber-intro-v1.9-r2-20261006';

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const INTRO_MS = reduced ? 700 : 4200;
  const TRANSITION_MS = reduced ? 220 : 1100;
  const ONLINE_MS = reduced ? 700 : 5400;
  const HOLD_MS = reduced ? 350 : 2000;
  const FAIL_OPEN_MS = reduced ? 4000 : 18000;

  const base = new URL('.', import.meta.url);
  const asset = name => { const u=new URL(`./assets/cyber-intro/${name}`, base); u.searchParams.set('v',RELEASE); return u.href; };
  ['intro-background.jpg','intro-brand.png','center-emblem.png'].forEach((name, i) => {
    const link=document.createElement('link');
    link.rel='preload'; link.as='image'; link.href=asset(name);
    if(i===0) link.fetchPriority='high';
    document.head.appendChild(link);
  });

  const css=document.createElement('link');
  css.rel='stylesheet'; { const u=new URL('./cyber-boot.css', base); u.searchParams.set('v',RELEASE); css.href=u.href; }
  let cssReady=false;
  css.addEventListener('load',()=>{ cssReady=true; begin(); },{once:true});
  css.addEventListener('error',()=>{
    css.remove();
    document.documentElement.classList.add('lyvra-cyber-boot-failed');
    window.dispatchEvent(new CustomEvent('lyvra:system-start',{detail:{failOpen:true,reason:'css-load-error'}}));
  },{once:true});
  document.head.appendChild(css);
  setTimeout(()=>{
    if(!cssReady){
      try{ css.remove(); }catch{}
      document.documentElement.classList.add('lyvra-cyber-boot-failed');
      window.dispatchEvent(new CustomEvent('lyvra:system-start',{detail:{failOpen:true,reason:'css-timeout'}}));
    }
  },2500);

  function begin(){
    if(!cssReady) return;
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true});
    else mount();
  }

  function mount(){
    if(document.getElementById('lyvra-cyber-boot-host')) return;
    const host=document.createElement('div');
    host.id='lyvra-cyber-boot-host';
    host.setAttribute('role','status');
    host.setAttribute('aria-live','polite');
    host.innerHTML=`<div class="lyvra-cyber-sequence" data-intro-duration="${INTRO_MS}" data-transition-duration="${TRANSITION_MS}">
      <section class="lyvra-intro-stage" aria-labelledby="lyvra-intro-title">
        <div class="lyvra-intro-scanlines" aria-hidden="true"></div>
        <section class="lyvra-intro-panel">
          <p class="lyvra-intro-eyebrow">666SOUNDsDESIGn · LYVRA interface</p>
          <h1 class="lyvra-intro-title" id="lyvra-intro-title">CYBER BOOTING</h1>
          <div class="lyvra-intro-brand" aria-label="LYVRA · Sound becomes feeling · 666SOUNDsDESIGn">
            <img class="lyvra-intro-brand-image" src="${asset('intro-brand.png')}" width="600" height="253" decoding="async" fetchpriority="high" alt="LYVRA · Sound becomes feeling · 666SOUNDsDESIGn">
          </div>
          <p class="lyvra-intro-status">INITIALIZING INTERFACE</p>
          <div class="lyvra-intro-core" aria-hidden="true"></div>
          <div class="lyvra-intro-progress-wrap" aria-label="Intro progress">
            <div class="lyvra-intro-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div class="lyvra-intro-bar"></div></div>
            <div class="lyvra-intro-percent">0%</div>
          </div>
          <p class="lyvra-intro-phase-label">CONNECTING PROJECT SIGNAL</p>
          <div class="lyvra-intro-steps" aria-hidden="true">
            <div class="lyvra-intro-step active">Connect</div><div class="lyvra-intro-step">Authenticate</div><div class="lyvra-intro-step">Initialize</div><div class="lyvra-intro-step">READY</div>
          </div>
        </section>
      </section>
      <div class="lyvra-transition-fx" aria-hidden="true"></div>
      <section class="lyvra-hud-stage" aria-label="LYVRA interface">
        <div class="lyvra-hud-stage-inner">
          <section class="cyber-hud-logo" aria-label="666SOUNDsDESIGn Cyber HUD Logo">
            <div class="hud-circuit hud-circuit-left"></div><div class="hud-circuit hud-circuit-right"></div>
            <div class="hud-label hud-label-left" data-text="666SOUNDsDESIGn">666SOUNDsDESIGn</div>
            <div class="hud-label hud-label-right" data-text="© FRAGGLEPOWER666">© FRAGGLEPOWER666</div>
            <div class="hud-center-logo-wrap" aria-label="LYVRA Center Emblem"><img class="hud-center-art" src="${asset('center-emblem.png')}" width="420" height="525" decoding="async" alt="666SOUNDsDESIGn · Sound becomes feeling · L.Y.V.R.A."></div>
            <div class="hud-system-online" aria-live="polite">SYSTEM ONLINE</div>
            <div class="hud-scanline"></div><div class="hud-reactor-ring"></div>
          </section>
        </div>
      </section>
    </div>`;
    document.body.appendChild(host);
    const root=host.querySelector('.lyvra-cyber-sequence');
    const bar=root.querySelector('.lyvra-intro-bar'), percent=root.querySelector('.lyvra-intro-percent'), track=root.querySelector('.lyvra-intro-track');
    const status=root.querySelector('.lyvra-intro-status'), phaseLabel=root.querySelector('.lyvra-intro-phase-label');
    const steps=[...root.querySelectorAll('.lyvra-intro-step')], systemOnline=root.querySelector('.hud-system-online');
    const phases=[
      {at:0,status:'INITIALIZING INTERFACE',label:'CONNECTING PROJECT SIGNAL',step:0},
      {at:24,status:'AUTHENTICATING MODULES',label:'VERIFYING LOCAL COMPONENTS',step:1},
      {at:52,status:'SYNCHRONIZING PROTOCOLS',label:'PREPARING CYBER INTERFACE',step:2},
      {at:82,status:'INTRO SEQUENCE ARMED',label:'PROJECT INTERFACE READY',step:3},
      {at:98,status:'SEQUENCE COMPLETE',label:'PROJECT INTERFACE ONLINE',step:3}
    ];
    let start=0, raf=0, lastPhase=-1, introFinished=false, onlineStarted=false, ended=false;

    function setPhase(progress){
      let current=phases[0]; for(const phase of phases) if(progress>=phase.at) current=phase;
      const idx=phases.indexOf(current); if(idx===lastPhase) return; lastPhase=idx;
      status.textContent=current.status; phaseLabel.textContent=current.label;
      steps.forEach((step,i)=>{step.classList.toggle('done',i<current.step);step.classList.toggle('active',i===current.step)});
    }
    function finishSite(){
      if(ended) return; ended=true; cancelAnimationFrame(raf);
      root.classList.add('system-started');
      window.dispatchEvent(new CustomEvent('lyvra:system-start',{detail:{root}}));
      host.classList.add('lyvra-host-exit');
      setTimeout(()=>host.remove(), reduced?0:740);
    }
    function startSystemOnline(){
      if(onlineStarted || !systemOnline) return; onlineStarted=true; root.classList.add('system-online-sequence');
      if(reduced){ setTimeout(finishSite, ONLINE_MS+HOLD_MS); return; }
      let holdStarted=false;
      const beginHold=()=>{ if(holdStarted||ended)return; holdStarted=true; setTimeout(finishSite,HOLD_MS); };
      systemOnline.addEventListener('animationend',beginHold,{once:true});
      setTimeout(beginHold,ONLINE_MS+250);
    }
    function completeIntro(){
      if(introFinished) return; introFinished=true; cancelAnimationFrame(raf);
      bar.style.width='100%';percent.textContent='100%';track.setAttribute('aria-valuenow','100');
      status.textContent='SEQUENCE COMPLETE';phaseLabel.textContent='PROJECT INTERFACE ONLINE';
      steps.forEach(step=>{step.classList.remove('active');step.classList.add('done')});
      root.classList.add('is-transitioning');
      setTimeout(()=>{root.classList.add('intro-complete');root.classList.remove('is-transitioning');startSystemOnline();},TRANSITION_MS);
    }
    function tick(now){
      if(!start) start=now; const elapsed=now-start; const progress=Math.min(100,Math.round(elapsed/INTRO_MS*100));
      bar.style.width=progress+'%';percent.textContent=progress+'%';track.setAttribute('aria-valuenow',String(progress));setPhase(progress);
      if(elapsed<INTRO_MS) raf=requestAnimationFrame(tick); else completeIntro();
    }
    raf=requestAnimationFrame(tick);
    setTimeout(finishSite,FAIL_OPEN_MS);
  }
})();
