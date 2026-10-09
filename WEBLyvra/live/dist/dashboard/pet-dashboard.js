(()=>{'use strict';
const root=document.querySelector('[data-pet-dashboard]');if(!root)return;
const sprite=root.querySelector('[data-pet-dashboard-sprite]'),label=root.querySelector('[data-pet-dashboard-state]'),buttons=[...root.querySelectorAll('[data-pet-dashboard-set]')];
if(!sprite||!label)return;
const states={idle:{row:0,frames:6,fps:5},greeting:{row:3,frames:4,fps:6},fraggle:{row:3,frames:4,fps:6},heart:{row:0,frames:6,fps:5},music:{row:4,frames:5,fps:8},thinking:{row:8,frames:6,fps:5},glitch:{row:5,frames:8,fps:8},playful:{row:4,frames:5,fps:8}};
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
let mode='mini',state='idle',frame=0,timer=null;
const controls=document.createElement('div');controls.className='petDashModes';controls.setAttribute('role','group');controls.setAttribute('aria-label','Pet Ansicht');
const modes=[['mini','Mini'],['quiet','Ruhe'],['detail','Detail']];
function stop(){if(timer!==null){clearInterval(timer);timer=null;}}
function draw(){const cfg=states[state]||states.idle,scale=mode==='detail'?1:.5;sprite.style.backgroundSize=(1536*scale)+'px '+(2288*scale)+'px';sprite.style.backgroundPosition='-'+(frame*192*scale)+'px -'+(cfg.row*208*scale)+'px';}
function updateAnimation(){stop();frame=0;draw();if(mode==='quiet'||reduce.matches||document.hidden)return;const cfg=states[state]||states.idle;timer=setInterval(()=>{frame=(frame+1)%cfg.frames;draw();},1000/cfg.fps);}
function setMode(next){if(!modes.some(([key])=>key===next))return;mode=next;root.dataset.petMode=mode;controls.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.petModeSet===mode)));updateAnimation();}
function setState(next){state=Object.hasOwn(states,next)?next:'idle';label.textContent='DEMO · '+state.toUpperCase();buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.petDashboardSet===state)));updateAnimation();}
for(const [value,title]of modes){const b=document.createElement('button');b.type='button';b.dataset.petModeSet=value;b.textContent=title;b.setAttribute('aria-pressed',String(value===mode));b.addEventListener('click',()=>setMode(value));controls.append(b);}
const top=root.querySelector('.petDashTop');if(top)top.insertAdjacentElement('afterend',controls);else root.prepend(controls);
buttons.forEach(b=>b.addEventListener('click',()=>setState(b.dataset.petDashboardSet)));
document.addEventListener('visibilitychange',updateAnimation);reduce.addEventListener?.('change',updateAnimation);window.addEventListener('pagehide',stop,{once:true});

// Automatic, read-only source binding. Repository status is never treated as live emotion or host-render evidence.
const binding=document.createElement('p');binding.className='petDashNote';binding.setAttribute('role','status');binding.setAttribute('aria-live','polite');binding.textContent='Pet startet automatisch · semantischer Live-Kontext nicht verbunden';
controls.insertAdjacentElement('afterend',binding);
const api='https://api.github.com/repos/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture';
const raw='https://raw.githubusercontent.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/';
let bindingTicket=0,lastBindingAttempt=0;
async function autoBind(){
 if(document.hidden||Date.now()-lastBindingAttempt<60000)return;
 lastBindingAttempt=Date.now();
 const ticket=++bindingTicket;
 try{
  const get=async url=>{const response=await fetch(url,{cache:'no-store',headers:{'Accept':'application/vnd.github+json'}});if(!response.ok)throw Error('SOURCE_UNAVAILABLE');return response.json();};
  const revision=(await get(api+'/branches/lyvra')).commit?.sha;
  if(!/^[a-f0-9]{40}$/i.test(revision||''))throw Error('INVALID_REVISION');
  const [character,pet]=await Promise.all([
   get(raw+revision+'/LYVRA_NATIVE_RUNTIME/current/personality/CURRENT_STATE.json'),
   get(raw+revision+'/LYVRA_PET/livecircle/CURRENT_STATE.json')
  ]);
  const current=(await get(api+'/branches/lyvra')).commit?.sha;
  if(ticket!==bindingTicket||current!==revision)throw Error('STALE_CURRENT');
  if(character.authority!=='WHOLE_LYVRA'||character.status!=='CURRENT_PRODUCTIVE'||character.whole_lyvra_decision_authority!==true||pet.parent_authority!=='WHOLE_LYVRA'||pet.status!=='CURRENT_PRODUCTIVE'||!/^pet_[a-z0-9]+$/.test(pet.pet_id||''))throw Error('AUTHORITY_MISMATCH');
  binding.textContent='Pet automatisch bereit · Whole-LYVRA-Quellenbindung geprüft · Live-Semantik offen';
 }catch{
  if(ticket===bindingTicket)binding.textContent='Pet lokal bereit · Quellenbindung derzeit nicht bestätigt · sicherer Ruhemodus verfügbar';
 }
}

setState('idle');setMode('mini');
void autoBind();
// Revalidate only on user-visible recovery; no permanent polling or invented live state.
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void autoBind();});
window.addEventListener('online',()=>{if(!document.hidden)void autoBind();});
window.addEventListener('pagehide',()=>{bindingTicket++;},{once:true});
})();
