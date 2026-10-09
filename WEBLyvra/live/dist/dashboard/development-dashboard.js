(()=>{'use strict';
const marker=document.createElement('section');marker.className='lyvraDevProgress';marker.hidden=true;marker.setAttribute('aria-label','Aktive LYVRA Entwicklung');marker.innerHTML='<div class="lyvraDevInner"><span class="lyvraDevKicker">LYVRA · ENTWICKLUNG AKTIV</span><h2 data-dev-title></h2><p data-dev-count role="status" aria-live="polite"></p><div class="lyvraDevTrack" role="progressbar" aria-label="Entwicklungsfortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span data-dev-fill></span></div><p class="lyvraDevSource">Nur nachgewiesene Aufgaben · kein Schätzwert</p></div>';
const css=document.createElement('style');css.textContent='.lyvraDevProgress{margin:20px 0;padding:18px 20px;border:1px solid #555179;border-radius:18px;background:linear-gradient(120deg,#171b35,#142936);color:#eef2ff}.lyvraDevProgress[hidden]{display:none!important}.lyvraDevInner{max-width:980px;margin:auto}.lyvraDevKicker{color:#6ceaf1;font-weight:800;letter-spacing:.1em;font-size:12px}.lyvraDevProgress h2{margin:8px 0;font-size:clamp(18px,3vw,24px)}.lyvraDevProgress p{margin:7px 0}.lyvraDevTrack{height:17px;border:1px solid #637391;border-radius:20px;background:#091322;overflow:hidden}.lyvraDevTrack>span{height:100%;width:0;display:block;background:linear-gradient(90deg,#39cbd2,#cf60d5);border-radius:20px;transition:width .35s}.lyvraDevSource{font-size:12px;color:#abb8d1}';document.head.append(css);
const shell=document.querySelector('.shell')||document.querySelector('main')||document.body;const hero=shell.querySelector('.hero');if(hero)hero.insertAdjacentElement('afterend',marker);else shell.prepend(marker);
const urlBase='https://raw.githubusercontent.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/';
const api='https://api.github.com/repos/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/branches/lyvra';
const carrier='LYVRA_NATIVE_RUNTIME/development/dashboard/DEVELOPMENT_PROGRESS_CURRENT.json';let last=0,inFlight=false;
function hide(){marker.hidden=true;marker.querySelector('[data-dev-title]').textContent='';}
async function refresh(){if(inFlight||document.hidden||Date.now()-last<60000)return;last=Date.now();inFlight=true;try{
const get=async u=>{const res=await fetch(u,{cache:'no-store'});if(!res.ok)throw Error('SOURCE_UNAVAILABLE');return res.json();};
const head=(await get(api)).commit?.sha;if(!/^[a-f0-9]{40}$/.test(head||''))throw Error('NO_HEAD');
const item=await get(urlBase+head+'/'+carrier);
const current=(await get(api)).commit?.sha;if(head!==current)throw Error('STALE');
if(item.schema!=='lyvra.development.progress.v1'||item.authority!=='WHOLE_LYVRA'||item.status!=='ACTIVE'||!item.current_work){hide();return;}
const work=item.current_work, tasks=work.tasks;
if(typeof work.title!=='string'||!work.title.trim()||work.title.length>120||!Array.isArray(tasks)||tasks.length===0||tasks.length>1000||work.source_revision!==head){hide();return;}
const ids=new Set(),allowed=new Set(['OPEN','IN_PROGRESS','DONE','BLOCKED']);
for(const task of tasks){if(!task||typeof task.id!=='string'||!task.id||ids.has(task.id)||!allowed.has(task.status)){hide();return;}ids.add(task.id);}
const done=tasks.filter(t=>t.status==='DONE').length,total=tasks.length,pct=Math.round(done*100/total);
marker.querySelector('[data-dev-title]').textContent=work.title;
marker.querySelector('[data-dev-count]').textContent=done+' von '+total+' Aufgaben erledigt · '+pct+' %';
const bar=marker.querySelector('[role=progressbar]');bar.setAttribute('aria-valuenow',String(pct));
marker.querySelector('[data-dev-fill]').style.width=pct+'%';marker.hidden=false;
}catch{hide();}finally{inFlight=false;}}
void refresh();document.addEventListener('visibilitychange',()=>{if(!document.hidden)void refresh();});window.addEventListener('online',()=>void refresh());})();
