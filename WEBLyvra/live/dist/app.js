import { installBrandArt } from './brand-art.js';
import { extendFacetTabs, installExplorers } from './explorers.js';
import { extraFacets } from './explorer-data.js';
import { installChatDemo } from './chat-demo.js';
import { installExtensions } from './dynasty.js';
import { getLanguage, menuLabel, initializeLanguage } from './i18n.js';
const facets = {
  ...extraFacets('de'),
  sound: { number:'01', title:'Klang, der unter<br>die Oberfläche geht.', text:'Dark Techno, Psytechno und Psytrance bilden ein Spannungsfeld aus Subdruck, spektralen Texturen und kontrolliertem Chaos. Psychoakustik verleiht dem Klang Bewegung und Tiefe.', target:'#sound', link:'Sound & Creation entdecken' },
  art: { number:'02', title:'Licht, das eine<br>Stimmung trägt.', text:'Aurora-Licht, holografische Tiefe und spektrale Farben übersetzen Energie in digitale Kunst. Bilder schaffen Räume, in denen Klang und Emotion sichtbar werden.', target:'#lab', link:'Creative Lab entdecken' },
  story: { number:'03', title:'Welten, die aus<br>Bedeutung wachsen.', text:'Geschichten verbinden Entscheidungen mit ihren Folgen. Figuren, Beziehungen und Erinnerungen formen einen Zusammenhang, der sich mit jeder Entdeckung erweitert.', target:'#world', link:'LYVRA World entdecken' },
  emotion: { number:'04', title:'Resonanz, die<br>alles verbindet.', text:'Zwischen Intensität und Nähe entsteht emotionaler Ausdruck. Gefühl verbindet Musik, Kunst und Storytelling zu einem Universum mit einer eigenen Handschrift.', target:'#identity', link:'Identity entdecken' }
};
const englishFacets = {
  ...extraFacets('en'),
  sound: {number:'01',title:'Sound that goes<br>beneath the surface.',text:'Dark Techno, Psytechno and Psytrance create a field of sub pressure, spectral textures and controlled chaos. Psychoacoustics gives the sound movement and depth.',target:'#sound',link:'Discover Sound & Creation'},
  art: {number:'02',title:'Light that carries<br>a mood.',text:'Aurora light, holographic depth and spectral colours translate energy into digital art. Images create spaces where sound and emotion become visible.',target:'#lab',link:'Discover the Creative Lab'},
  story: {number:'03',title:'Worlds that grow<br>from meaning.',text:'Stories connect decisions with their consequences. Characters, relationships and memories form a continuous thread that grows with every discovery.',target:'#world',link:'Discover LYVRA World'},
  emotion: {number:'04',title:'Resonance that<br>connects everything.',text:'Emotional expression emerges between intensity and intimacy. Feeling connects music, art and storytelling into a universe with a signature of its own.',target:'#identity',link:'Discover Identity'}
};
extendFacetTabs();
const tabs = [...document.querySelectorAll('[data-facet]')];
function selectFacet(tab, focus=false) {
  tabs.forEach(t=>{const active=t===tab;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});
  const f=(getLanguage()==='en'?englishFacets:facets)[tab.dataset.facet];
  const panel=document.querySelector('#facet-content');
  panel.setAttribute('aria-labelledby',tab.id);
  panel.innerHTML=`<span class="facet-number">${getLanguage()==='de'?'FACETTE':'FACET'} / ${f.number}</span><h3>${f.title}</h3><p>${f.text}</p><a class="text-link" href="${f.target}">${f.link} <span>+</span></a>`;
  document.querySelector('.orbit-map').dataset.facet=tab.dataset.facet;
  document.dispatchEvent(new CustomEvent('lyvra:facetselected'));
  if(focus)tab.focus();
}
tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>selectFacet(tab));
  tab.addEventListener('keydown',e=>{
    let next;
    if(e.key==='ArrowRight')next=(i+1)%tabs.length;
    if(e.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
    if(e.key==='Home')next=0;
    if(e.key==='End')next=tabs.length-1;
    if(next!==undefined){e.preventDefault();selectFacet(tabs[next],true);}
  });
});
const menu=document.querySelector('.menu'),nav=document.querySelector('.nav');
function closeMenu(){menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label',menuLabel(false));nav.classList.remove('open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',menuLabel(open));nav.classList.toggle('open',open);});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();if(document.activeElement.closest('.nav'))menu.focus();}});
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){nav.querySelectorAll('a').forEach(a=>{const active=a.hash==='#'+entry.target.id;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}});},{rootMargin:'-18% 0px -60% 0px'});
document.querySelectorAll('main section[id]').forEach(s=>observer.observe(s));
function fillBars(selector,count){const node=document.querySelector(selector);for(let i=0;i<count;i++){const bar=document.createElement('i');const height=15+Math.abs(Math.sin(i*.63)*Math.cos(i*.13))*85;bar.style.setProperty('--height',height+'%');bar.style.setProperty('--delay',(-i*.13)+'s');node.appendChild(bar);}}
fillBars('.waveform',75);

document.addEventListener('lyvra:languagechange',()=>selectFacet(tabs.find(t=>t.getAttribute('aria-selected')==='true')||tabs[0]));
installExtensions();
installChatDemo();
installExplorers();
installBrandArt();
initializeLanguage();
