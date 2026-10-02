const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
class Node{constructor(tag){this.tag=tag;this.children=[];}append(...nodes){this.children.push(...nodes);}querySelector(s){return this.children.find(n=>n.className?.includes(s.slice(1)))||null;}}
const html=fs.readFileSync('dist/index.html','utf8');const targets={};
for(const id of ['home','identity','universe','sound','lab','world','radio','evolution']){assert(html.includes(`id="${id}"`));targets[`#${id}`]=new Node('section');}
assert(html.includes('footer-shell'));targets['.footer-shell']=new Node('footer');targets['#universe > .wrap']=targets['#universe'];targets['#radio > .wrap']=targets['#radio'];
let language='de';const listeners=[];const context=vm.createContext({getLanguage:()=>language,document:{querySelector:s=>targets[s],createElement:t=>new Node(t),addEventListener:(name,fn)=>listeners.push(fn)}});
vm.runInContext(fs.readFileSync('dist/avatar-presence.js','utf8').replace(/^import .*;\n/gm,'').replace(/export /g,''),context);
const figures=()=>[...new Set(Object.values(targets))].flatMap(t=>t.children);const images=figures().map(f=>f.children[0]);assert.equal(images.length,9);assert.equal(new Set(images.map(i=>i.src)).size,5);
for(const image of images){assert(fs.existsSync('dist/'+image.src));assert(image.width>0&&image.height>0);assert(image.alt.includes('LYVRA'));assert.equal(image.decoding,'async');}
assert.equal(images.filter(i=>i.loading==='eager').length,1);assert.equal(images.filter(i=>i.loading==='lazy').length,8);
const de=images.map(i=>i.alt);language='en';listeners.forEach(fn=>fn());assert(images.every((image,i)=>image.alt!==de[i]));assert(images[0].alt.includes('front view'));assert(figures().find(f=>f.children[1])?.children[1].textContent.includes('One identity'));
vm.runInContext('installAvatarPresence()',context);assert.equal(figures().length,9);assert.deepEqual(figures().map(f=>f.children[0]),images);
language='de';listeners.forEach(fn=>fn());assert.deepEqual(images.map(i=>i.alt),de);
console.log('PASS: 9 placements, 5 assets, DE/EN alt/captions, stable nodes, duplicate prevention, eager/lazy loading. Headless DOM only.');
