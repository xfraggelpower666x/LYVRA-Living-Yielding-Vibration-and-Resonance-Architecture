import { getLanguage } from './i18n.js';

// Freigegebene Markenbilder ergänzen den Bestand, ohne vorhandene Elemente zu ersetzen.
const groups = [
  { target:'#identity', name:['LYVRA · Visuelle Identität','LYVRA · Visual identity'], items:[
    ['brand-chrome-emblem',900,822,'LYVRA Chrome-Emblem mit leuchtendem Lebensbaum','LYVRA chrome emblem with a luminous tree of life']
  ]},
  { target:'#universe > .wrap', name:['LYVRA · Kosmische Bildwelten','LYVRA · Cosmic imagery'], items:[
    ['brand-cosmos-mascot',900,822,'LYVRA Kosmos-Emblem mit violettem Maskottchen','LYVRA cosmos emblem with a violet mascot'],
    ['brand-alien-emblem',900,900,'LYVRA Neon-Emblem mit Alien-Maskottchen und Lebensbaum','LYVRA neon emblem with an alien mascot and tree of life']
  ]},
  { target:'#world', name:['LYVRA · Maskottchen','LYVRA · Mascot'], items:[
    ['mascot-life-tree',831,900,'Violettes LYVRA Maskottchen mit buntem Lebensbaum auf der Brust','Violet LYVRA mascot with a colourful tree of life on its chest'],
    ['mascot-resonance',831,900,'Violettes LYVRA Maskottchen mit leuchtenden Resonanzlinien','Violet LYVRA mascot with luminous resonance lines']
  ]}
];

export function installBrandArt() {
  const displays=[];
  for (const group of groups) {
    const target=document.querySelector(group.target);
    if (!target || target.querySelector('.brand-art')) continue;
    const gallery=document.createElement('div');
    gallery.className='brand-art'+(group.items.length===1?' brand-art-single':'');
    gallery.setAttribute('role','group');
    const images=[];
    for (const [file,width,height,de,en] of group.items) {
      const figure=document.createElement('figure');
      const img=document.createElement('img');
      img.src=`assets/${file}.webp`; img.width=width; img.height=height;
      img.loading='lazy'; img.decoding='async';
      figure.append(img);gallery.append(figure);images.push({img,de,en});
    }
    target.append(gallery);displays.push({gallery,group,images});
  }
  function translate() {
    const english=getLanguage()==='en';
    for (const {gallery,group,images} of displays) {
      gallery.setAttribute('aria-label',group.name[english?1:0]);
      images.forEach(({img,de,en})=>{img.alt=english?en:de;});
    }
  }
  translate();document.addEventListener('lyvra:languagechange',translate);
}
