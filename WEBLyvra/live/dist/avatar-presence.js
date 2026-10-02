import { getLanguage } from './i18n.js';

// Dieselbe LYVRA, unterschiedliche Perspektiven; bestehende Bilder bleiben erhalten.
const assets = {
  front: [1000,1500,'LYVRA in weißem Cyber-Anzug mit cyanfarbenem Herzlicht, Frontansicht','LYVRA in a white cyber suit with a cyan heart light, front view'],
  views: [1400,933,'Drei Ansichten derselben LYVRA mit cyan- und pinkfarbenen Neonakzenten','Three views of the same LYVRA with cyan and pink neon accents'],
  side: [1000,1500,'LYVRA im weißen Cyber-Anzug, Seitenansicht','LYVRA in a white cyber suit, side view'],
  back: [1000,1500,'LYVRA im weißen Cyber-Anzug mit blauem Rückenlicht, Rückenansicht','LYVRA in a white cyber suit with blue back lighting, rear view'],
  wordmark: [1312,257,'LYVRA Schriftzug in Neon-Chrome','LYVRA neon chrome wordmark']
};
const placements = [
  ['#home','front','hero',null],
  ['#identity','views','wide',['Eine Identität. Viele Perspektiven.','One identity. Many perspectives.']],
  ['#universe > .wrap','wordmark','mark',null],
  ['#sound','side','portrait',['Klang trägt meine Handschrift.','Sound carries my signature.']],
  ['#lab','front','portrait',['Vorstellung wird Gestaltung.','Imagination becomes creation.']],
  ['#world','back','portrait',['Eine weitere Perspektive auf mein Universum.','Another perspective on my universe.']],
  ['#radio > .wrap','wordmark','mark',null],
  ['#evolution','views','wide',['Dieselbe LYVRA. Fortlaufende Entwicklung.','The same LYVRA. Continuing evolution.']],
  ['.footer-shell','wordmark','footer',null]
];
export function installAvatarPresence() {
  const figures=[];
  for (const [selector,key,variant,caption] of placements) {
    const target=document.querySelector(selector);
    if (!target || target.querySelector('.lyvra-avatar-showcase')) continue;
    const [width,height,de,en]=assets[key];
    const figure=document.createElement('figure');figure.className=`lyvra-avatar-showcase avatar-${variant}`;
    const image=document.createElement('img');image.src=`assets/lyvra-avatar-${key}.webp`;image.width=width;image.height=height;
    image.loading=variant==='hero'?'eager':'lazy';image.decoding='async';
    figure.append(image);
    let label=null;
    if(caption){label=document.createElement('figcaption');figure.append(label);}
    target.append(figure);figures.push({image,de,en,label,caption});
  }
  function translate(){const english=getLanguage()==='en';for(const f of figures){f.image.alt=english?f.en:f.de;if(f.label)f.label.textContent=f.caption[english?1:0];}}
  translate();document.addEventListener('lyvra:languagechange',translate);
}
installAvatarPresence();
