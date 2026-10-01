import { getLanguage, initializeLanguage, menuLabel } from '/i18n.js';
import { policy } from './privacy-data.js';
const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function renderPolicy(){
 const i=getLanguage()==='en'?1:0;
 document.querySelector('#privacy-title').textContent=policy.title[i];
 document.querySelector('#privacy-intro').textContent=policy.introduction[i];
 document.querySelector('#privacy-content').innerHTML=policy.sections.map(s=>`<section id="${s.id}"><h2>${esc(s.title[i])}</h2>${s.paragraphs.map(p=>`<p>${esc(p[i])}</p>`).join('')}${s.links?`<div class="privacy-sources">${s.links.map(l=>`<a href="${esc(l[0])}" target="_blank" rel="noopener noreferrer">${esc(l[i+1])}</a>`).join('')}</div>`:''}</section>`).join('');
 document.title=policy.title[i]+' — LYVRA';
 document.querySelector('meta[name="description"]').content=i?'LYVRA privacy notice: website storage, hosting, external media and planned AI integration.':'LYVRA-Datenschutzhinweise: lokale Speicherung, Hosting, externe Medien und vorgesehene KI-Integration.';
 document.querySelector('#privacy-back').textContent=i?'Back to LYVRA':'Zurück zu LYVRA';
}
const menu=document.querySelector('.menu'),nav=document.querySelector('.nav');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',menuLabel(open));nav.classList.toggle('open',open);});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',menuLabel(false));nav.classList.remove('open');}});
document.addEventListener('lyvra:languagechange',renderPolicy);
initializeLanguage();
