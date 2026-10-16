// LYVRA_GALLERY_BRIDGE_V1: no navigation, original files only, same-source bilingual poster slots.
const overlay=document.querySelector('#lyvra-gallery-lightbox');
const closeButton=overlay?.querySelector('.lyvra-gallery-close');
const bigImage=overlay?.querySelector('.lyvra-gallery-dialog img');
const caption=overlay?.querySelector('.lyvra-gallery-caption');
const cards=[...document.querySelectorAll('[data-gallery-key]')];
const assets={poster1:{de:'statement-01-de.png',en:'statement-01-de.png'},poster2:{de:'statement-02-de.png',en:'statement-02-de.png'},logo:{de:'lyvra-gallery-logo.png',en:'lyvra-gallery-logo.png'},resonance:{de:'resonance-awakens.png',en:'resonance-awakens.png'}};
let previousFocus=null;
function language(){return document.documentElement.lang?.toLowerCase().startsWith('en')?'en':'de';}
function syncLanguage(){const lang=language();for(const card of cards){const key=card.dataset.galleryKey,file=assets[key]?.[lang];if(!file)continue;const img=card.querySelector('img');if(img)img.src=`assets/gallery/${file}`;}if(overlay&&!overlay.hidden)closeOverlay();}
function openOverlay(card){if(!overlay||!bigImage)return;previousFocus=document.activeElement;const key=card.dataset.galleryKey;const filename=assets[key]?.[language()];if(!filename)return;const thumb=card.querySelector('img');bigImage.src=`assets/gallery/${filename}`;bigImage.alt=thumb?.alt||'';caption.textContent=card.querySelector('span')?.textContent||'';overlay.hidden=false;document.body.classList.add('lyvra-gallery-open');document.body.style.overflow='hidden';closeButton?.focus();}
function closeOverlay(){if(!overlay||overlay.hidden)return;overlay.hidden=true;bigImage.removeAttribute('src');document.body.classList.remove('lyvra-gallery-open');document.body.style.overflow='';previousFocus?.focus();}
for(const card of cards)card.addEventListener('click',()=>openOverlay(card));
closeButton?.addEventListener('click',closeOverlay);
overlay?.addEventListener('click',event=>{if(event.target===overlay)closeOverlay();});
document.addEventListener('keydown',event=>{if(!overlay||overlay.hidden)return;if(event.key==='Escape'){event.preventDefault();closeOverlay();}if(event.key==='Tab'){event.preventDefault();closeButton?.focus();}});
document.addEventListener('lyvra:languagechange',syncLanguage);
syncLanguage();
