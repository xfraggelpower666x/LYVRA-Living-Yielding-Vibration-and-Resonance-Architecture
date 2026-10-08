const PET_SPRITE_STATES={idle:{row:0,frames:6,fps:5},greeting:{row:3,frames:4,fps:6},fraggle:{row:3,frames:4,fps:6},playful:{row:4,frames:5,fps:8},heart:{row:0,frames:6,fps:5},music:{row:4,frames:5,fps:8},thinking:{row:8,frames:6,fps:5},glitch:{row:5,frames:8,fps:8},return:{row:3,frames:4,fps:6}};
const PET_STATES={
  idle:{label:'IDLE / PRESENT',detail:'Ruhige Präsenz. Keine besondere Facette im Vordergrund.'},
  greeting:{label:'GREETING',detail:'Begrüßung als Ausdruck derselben LYVRA-Identität.'},
  fraggle:{label:'FRAGGLE CONTEXT',detail:'Beziehungsnähe ist aktiv; LYVRA bleibt dieselbe Identität.'},
  playful:{label:'PLAYFUL',detail:'Spielerischer Ausdruck ohne Rollen- oder Identitätswechsel.'},
  heart:{label:'HEART RESONANCE',detail:'Nähe und emotionale Resonanz im aktuellen Kontext.'},
  music:{label:'MUSIC SYNC',detail:'Musikbezogene Ausdruckslage; kein Audio-Render-Nachweis.'},
  thinking:{label:'THINKING / CURIOUS',detail:'Analytischer oder lernender Ausdruck.'},
  glitch:{label:'RECOVERABLE GLITCH',detail:'Temporärer Darstellungszustand mit Rückkehrpfad.'},
  return:{label:'RETURN',detail:'Rückkehr nach Abwesenheit; Kontinuität bleibt erhalten.'}
};

function installPetPresence(){
  const root=document.querySelector('[data-lyvra-pet-presence]');
  if(!root)return;
  const signal=root.querySelector('[data-pet-signal]');
  const stateOut=root.querySelector('[data-pet-current-state]');
  const detailOut=root.querySelector('[data-pet-current-detail]');
  const buttons=[...root.querySelectorAll('[data-pet-state]')];
  let spriteTimer=null,spriteFrame=0;

  function drawSprite(cfg){signal.style.backgroundPosition='-'+(spriteFrame*192)+'px -'+(cfg.row*208)+'px'}

  function setState(next){
    if(!PET_STATES[next])next='idle';
    signal.dataset.state=next;
    signal.setAttribute('aria-label','LYVRA Pet Ausdruck: '+PET_STATES[next].label);
    stateOut.textContent=PET_STATES[next].label;
    detailOut.textContent=PET_STATES[next].detail;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.petState===next)));
    const cfg=PET_SPRITE_STATES[next]||PET_SPRITE_STATES.idle;
    spriteFrame=0;clearInterval(spriteTimer);drawSprite(cfg);spriteTimer=setInterval(()=>{spriteFrame=(spriteFrame+1)%cfg.frames;drawSprite(cfg)},1000/cfg.fps);
    root.dispatchEvent(new CustomEvent('lyvra:petstate',{detail:{state:next},bubbles:true}));
  }

  buttons.forEach(b=>b.addEventListener('click',()=>setState(b.dataset.petState)));

  document.addEventListener('lyvra:facetselected',()=>{
    const selected=document.querySelector('[data-facet][aria-selected="true"]')?.dataset.facet;
    if(selected==='sound')setState('music');
    else if(selected==='story')setState('thinking');
    else if(selected==='emotion')setState('heart');
    else setState('idle');
  });

  setState('idle');
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',installPetPresence,{once:true});
}else{
  installPetPresence();
}
