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

  function setState(next){
    if(!PET_STATES[next])next='idle';
    signal.dataset.state=next;
    signal.setAttribute('aria-label','LYVRA Pet Ausdruck: '+PET_STATES[next].label);
    stateOut.textContent=PET_STATES[next].label;
    detailOut.textContent=PET_STATES[next].detail;
    buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.petState===next)));
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
