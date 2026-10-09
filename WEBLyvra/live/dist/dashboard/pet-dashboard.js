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
setState('idle');setMode('mini');
})();
