// Headless-DOM-Funktionstest; kein Browser- oder Audio-Livetest.
const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),cp=require('child_process');
class N{constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attrs={};this.listeners={};this.parentElement=null;this.textContent='';this.className='';}append(...nodes){for(const n of nodes){if(!n||typeof n!=='object')throw Error('Invalid appended node');n.parentElement=this;this.children.push(n);}}prepend(n){n.parentElement=this;this.children.unshift(n);}replaceChildren(...n){this.children=[];this.append(...n);}setAttribute(k,v){this.attrs[k]=v;}getAttribute(k){return this.attrs[k];}addEventListener(k,f){this.listeners[k]=f;}focus(){document.activeElement=this;}remove(){this.parentElement.children=this.parentElement.children.filter(x=>x!==this);}closest(s){let n=this;while(n){if(match(n,s))return n;n=n.parentElement;}return null;}querySelector(s){return this.querySelectorAll(s)[0]||null;}querySelectorAll(s){const all=[];function walk(n){for(const c of n.children){if(match(c,s))all.push(c);walk(c)}}walk(this);return all;}}
function match(n,s){if(s.startsWith('#'))return n.id===s.slice(1);if(s.startsWith('.'))return n.className.split(' ').includes(s.slice(1));if(s.startsWith('[')){const m=s.match(/^\[([^=]+)="([^"]+)"\]$/);if(!m)return false;return m[1].startsWith('data-')?n.dataset[m[1].slice(5)]===m[2]:n.attrs[m[1]]===m[2];}return n.tagName===s;}
const body=new N('body'),document={body,activeElement:null,listeners:{},createElement:t=>new N(t),getElementById:id=>body.querySelector('#'+id),querySelector:s=>s==='#lab .wrap'?body.querySelector('#lab').querySelector('.wrap'):s==='.facet-tabs [aria-selected="true"]'?body.querySelector('.facet-tabs').querySelector('[aria-selected="true"]'):body.querySelector(s),addEventListener(k,f){this.listeners[k]=f;}};
for(const id of ['identity','sound','lab','world','evolution','facet-content','lyvra-system-evolution']){const n=new N('section');n.id=id;body.append(n);if(id==='lab'){const wrap=new N('div');wrap.className='wrap';n.append(wrap);}}
const tabs=new N('div');tabs.className='facet-tabs';body.append(tabs);for(const id of ['sound','art','story','emotion']){const n=new N('button');n.id='tab-'+id;n.dataset.facet=id;n.setAttribute('aria-selected',String(id==='sound'));tabs.append(n);}
const ctx={document,URL,console,language:'de',getLanguage:()=>ctx.language};vm.createContext(ctx);
vm.runInContext(fs.readFileSync('dist/explorer-data.js','utf8').replace(/export /g,''),ctx);vm.runInContext(fs.readFileSync('dist/explorers.js','utf8').replace(/^import .*;\n/gm,'').replace(/export /g,''),ctx);
vm.runInContext('extendFacetTabs();installExplorers();',ctx);assert.equal(tabs.children.length,9);assert.equal(new Set(tabs.children.map(n=>n.dataset.facet)).size,9);
const click=(root,id)=>root.querySelector(`[data-item="${id}"]`).listeners.click();
const root=id=>document.getElementById(id);
assert(root('native-facet-detail').querySelector('h4').textContent==='Music & Sound');
for(const id of ['psytrance','dark-techno','experimental']){click(root('music-universe'),id);assert.equal(root('music-universe').dataset.selection,id);assert(root('music-universe').querySelector('.addon-empty'));assert.equal(root('music-universe').querySelectorAll('audio').length,0);}
for(const id of ['visual','story','lyrics','music','code','all']){click(root('creative-universe'),id);assert(root('creative-universe').querySelector('.addon-empty'));}
for(const id of ['origin','resonance','creation','garden','citadel']){click(root('universe-world-explorer'),id);assert.equal(root('universe-world-explorer').dataset.selection,id);assert(root('universe-world-explorer').querySelector('.addon-link'));root('universe-world-explorer').querySelector('.addon-back').listeners.click();assert.equal(root('universe-world-explorer').dataset.selection,'');}
for(const id of ['public','registered','admin','primary-admin']){click(root('secure-system-gateway'),id);const status=root('secure-system-gateway').querySelector('.addon-status').textContent;assert(status.includes(id==='public'?'verfügbar':'Geplant'));}
ctx.language='en';document.listeners['lyvra:languagechange']();assert(root('secure-system-gateway').querySelector('.addon-status').textContent.includes('Planned'));assert(root('creative-universe').querySelector('.addon-empty').textContent.includes('Approved projects'));
for(const x of ['javascript:alert(1)','data:text/html,test','//evil.example','https://user:pass@example.com','/../private'])assert.equal(ctx.safeLink(x),null);assert.equal(ctx.safeLink('#sound'),'#sound');assert.equal(ctx.safeLink('https://example.com'),'https://example.com/');
assert.equal(ctx.approvedTracks([{id:'private',approved:false}]).length,0);assert.equal(ctx.approvedProjects([{id:'private',approved:false}]).length,0);
// Nicht ausgelieferte Testdaten prüfen Karten, Detail/Zurück und Audio-Freigabe.
vm.runInContext(`projects.push({id:'test-project',title:['Test','Test'],category:'code',description:['Test','Test'],publicationStatus:['Testdaten','Test fixture'],approved:true});tracks.push({id:'test-track',title:['Test','Test'],artist:'Test',genre:'Experimental Sound',description:['Test','Test'],publicationStatus:['Testdaten','Test fixture'],approved:true,audioUrl:'https://example.com/test.mp3',audioVerified:false});`,ctx);
document.listeners['lyvra:languagechange']();const projectButton=root('creative-universe').querySelector('[data-project="test-project"]');projectButton.listeners.click();assert(root('creative-universe').querySelector('.addon-detail'));root('creative-universe').querySelector('.addon-back').listeners.click();assert(root('creative-universe').querySelector('[data-project="test-project"]'));assert.equal(root('music-universe').querySelectorAll('audio').length,0);
vm.runInContext('tracks[0].audioVerified=true;',ctx);document.listeners['lyvra:languagechange']();const audio=root('music-universe').querySelector('audio');assert(audio.controls&&audio.preload==='none'&&audio.autoplay===undefined);
const crypto=require('crypto');const baseline=JSON.parse(fs.readFileSync('tests/preservation-baseline.json','utf8'));const hash=x=>crypto.createHash('sha256').update(x).digest('hex');
// Autorisierter MiniPlayer-Wechsel v15: aktuelle Attribute exakt prüfen;
// nur diese beiden Einbindungen für den historischen Erhaltungsvergleich zurücksetzen.
const currentHtml=fs.readFileSync('dist/index.html','utf8');
const currentFrames=currentHtml.match(/<iframe\b[^>]*>\s*<\/iframe>/g)||[];
assert.equal(currentFrames.length,2);
const expectedFrame=`<iframe
  src="https://webradio.666soundsdesign-broadcaster.com/embed/miniplayer.html"
  title="666SOUNDsDESIGn WebRadio MiniPlayer"
  width="100%"
  height="365"
  style="display:block;max-width:680px;border:0;border-radius:18px;"
  loading="lazy"
  allow="autoplay">
</iframe>`;
for(const frame of currentFrames)assert.equal(frame,expectedFrame);
const oldFrames=JSON.parse(fs.readFileSync('tests/radio-embed-pre-v15.json','utf8'));
let frameIndex=0;
const additiveHtml=currentHtml.replace('<link rel="stylesheet" href="plugin-access.css">','').replace(/<a class="button ghost hero-plugin-link"[\s\S]*?<\/a>/,'').replace(/<!-- LYVRA_PLUGIN_START -->[\s\S]*?<!-- LYVRA_PLUGIN_END -->\n/,'');
const preservationHtml=additiveHtml.replace(/<iframe\b[^>]*>\s*<\/iframe>/g,()=>oldFrames[frameIndex++]);
assert.equal(hash(preservationHtml.replace('<link rel="stylesheet" href="explorers.css">','').replace('<link rel="stylesheet" href="brand-art.css">','').replace(/<a class="button primary hero-gpt-link"[\s\S]*?<\/a>/,'')),baseline.index);
assert.equal(hash(fs.readFileSync('dist/evolution-status.css')),baseline.evolutionCss);
console.log('PASS: existing HTML + Handoff 001 preserved; nine unique facets; music/filter/world/back/gateway interactions; DE/EN; safe URL rejection; approval filtering; future project detail and audio gating using non-shipped test fixtures. No browser/live verification.');
