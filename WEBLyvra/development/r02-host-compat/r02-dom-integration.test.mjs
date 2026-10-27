import test from 'node:test';
import assert from 'node:assert/strict';
import { JSDOM } from 'jsdom';
import { createR02HostFocusAdapter } from './host-focus-adapter.mjs';

function setup() {
  const dom = new JSDOM(`<!doctype html><html lang="de"><body>
    <select id="language"><option value="de">DE</option><option value="en">EN</option></select>
    <div id="outside"><button id="external">Radio</button><a href="#gallery">Gallery</a></div>
    <main id="addon"><section id="discography">
      <input type="search" value="psy"><select><option value="Suno">Suno</option></select>
      <div class="disco-grid"><a class="disco-item" href="https://suno.com/song/stable">Track</a></div>
      <button class="disco-more">More</button>
    </section><section id="google-resonance"><button data-reach-filter="all">All</button>
      <div class="gr-item"><a href="https://example.org/source">Source</a></div>
    </section></main></body></html>`, {url:'https://weblyvra.666soundsdesign-broadcaster.com/'});
  const doc = dom.window.document, root = doc.getElementById('addon');
  let language = 'de', renders = 0, dropItem = false, dropLink = false;
  const renderAddon = (lang) => {
    renders++;
    const section = doc.getElementById('discography');
    const search = section.querySelector('input[type="search"]');
    const provider = section.querySelector('select');
    const item = section.querySelector('.disco-item');
    const more = section.querySelector('.disco-more');
    section.replaceChildren();
    section.innerHTML = '<input type="search"><select><option value="Suno">Suno</option></select><div class="disco-grid"></div><button class="disco-more">More</button>';
    section.querySelector('input').value=search?.value ?? '';
    section.querySelector('select').value=provider?.value ?? 'Suno';
    if (!dropItem) section.querySelector('.disco-grid').innerHTML = '<a class="disco-item" href="https://suno.com/song/stable">Track</a>';
    const reach = doc.getElementById('google-resonance');
    reach.innerHTML = '<button data-reach-filter="all">All</button><div class="gr-item"></div>';
    if (!dropLink) reach.querySelector('.gr-item').innerHTML = '<a href="https://example.org/source">Source</a>';
    doc.documentElement.lang = lang;
  };
  const bridge = createR02HostFocusAdapter({hostDocument:doc,addonRoot:root,getLanguage:()=>language,renderAddon});
  return {dom,doc,root,bridge,renderAddon,
    setLanguage(next,eventDetail=next) {language=next; doc.dispatchEvent(new dom.window.CustomEvent('lyvra:languagechange',{detail:{language:eventDetail}}));},
    dropItem() {dropItem=true;}, dropLink() {dropLink=true;},
    get renders() {return renders;},
  };
}
test('DOM: real search input survives DE/EN rebuild with selection state and host authority', () => {
  const x=setup();x.bridge.mount();
  const search=x.doc.querySelector('#discography input[type="search"]');search.value='dark psy';search.focus();
  x.setLanguage('en','de');
  assert.equal(x.doc.activeElement,x.doc.querySelector('#discography input[type="search"]'));
  assert.equal(x.doc.activeElement.value,'dark psy');
  assert.equal(x.doc.documentElement.lang,'en');
  assert.equal(x.doc.getElementById('language').value,'de'); // adapter never creates or controls a second selector
  x.bridge.unmount(); x.dom.window.close();
});
test('DOM: real discography provider and item focus survive replacement', () => {
  const x=setup();x.bridge.mount();
  x.doc.querySelector('#discography select').focus();x.setLanguage('en');
  assert.equal(x.doc.activeElement,x.doc.querySelector('#discography select'));
  x.doc.querySelector('.disco-item').focus();x.setLanguage('de');
  assert.equal(x.doc.activeElement,x.doc.querySelector('.disco-item'));
  x.dom.window.close();
});
test('DOM: vanished catalog item falls back to existing reach filter, not unrelated radio or gallery', () => {
  const x=setup();x.bridge.mount();
  x.doc.querySelector('.disco-item').focus();x.dropItem();x.setLanguage('en');
  assert.equal(x.doc.activeElement,x.doc.querySelector('[data-reach-filter="all"]'));
  assert.equal(x.doc.getElementById('external').textContent,'Radio');
  assert.equal(x.doc.querySelector('#outside a').getAttribute('href'),'#gallery');
  x.dom.window.close();
});
test('DOM: source link restoration and fallback stay within addon; unmount prevents further work', () => {
  const x=setup();x.bridge.mount();
  x.doc.querySelector('.gr-item a').focus();x.setLanguage('en');
  assert.equal(x.doc.activeElement,x.doc.querySelector('.gr-item a'));
  x.doc.querySelector('.gr-item a').focus();x.dropLink();x.setLanguage('de');
  assert.equal(x.doc.activeElement,x.doc.querySelector('[data-reach-filter="all"]'));
  const count=x.renders;x.bridge.unmount();x.setLanguage('en');
  assert.equal(x.renders,count);x.dom.window.close();
});
test('DOM: language event does not steal focus from host radio or external controls', () => {
  const x=setup();x.bridge.mount();const outside=x.doc.getElementById('external');
  outside.focus();x.setLanguage('en');assert.equal(x.doc.activeElement,outside);
  x.dom.window.close();
});
