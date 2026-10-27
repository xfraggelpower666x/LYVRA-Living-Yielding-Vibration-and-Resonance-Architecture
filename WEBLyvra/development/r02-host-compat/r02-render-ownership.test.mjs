import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {createR02HostFocusAdapter} from './host-focus-adapter.mjs';

function scene(rendererOwner) {
  const dom = new JSDOM('<!doctype html><html lang="de"><body><select id="language"></select><button id="radio">Radio</button><main id="addon"><section id="discography"><input type="search" value="psy"></section></main></body></html>');
  const doc=dom.window.document, root=doc.getElementById('addon');
  let language='de', hostRenders=0, standaloneRenders=0;
  const standaloneListener=() => { standaloneRenders++; };
  doc.addEventListener('lyvra:languagechange',standaloneListener);
  const adapter=createR02HostFocusAdapter({
    hostDocument:doc,addonRoot:root,rendererOwner,getLanguage:()=>language,
    renderAddon(next) {hostRenders++;root.querySelector('input').setAttribute('data-language',next);}
  });
  return {dom,doc,adapter,root,get hostRenders(){return hostRenders;},
    get standaloneRenders(){return standaloneRenders;},
    switch(next,detail=next) { language=next;doc.dispatchEvent(new dom.window.CustomEvent('lyvra:languagechange',{detail:{language:detail}})); },
    detachStandalone() {doc.removeEventListener('lyvra:languagechange',standaloneListener);}
  };
}
test('single-render ownership: standalone mode never registers the second renderer',()=>{
  const s=scene('standalone');s.adapter.mount();
  assert.equal(s.hostRenders,0);
  s.switch('en');s.switch('de');
  assert.equal(s.hostRenders,0);assert.equal(s.standaloneRenders,2);
  assert.equal(s.root.querySelector('input').hasAttribute('data-language'),false);
  s.adapter.unmount();s.dom.window.close();
});
test('single-render ownership: host mode renders only after standalone listener is detached',()=>{
  const s=scene('host');s.detachStandalone();s.adapter.mount();
  assert.equal(s.hostRenders,1);
  s.switch('en','de');assert.equal(s.hostRenders,2);
  assert.equal(s.root.querySelector('input').getAttribute('data-language'),'en');
  assert.equal(s.standaloneRenders,0);
  s.adapter.unmount();s.switch('de');assert.equal(s.hostRenders,2);
  s.dom.window.close();
});
test('ownership invalid value is rejected rather than silently allowing duplicate rendering',()=>{
  const s=scene('standalone');
  assert.throws(()=>createR02HostFocusAdapter({
    hostDocument:s.doc,addonRoot:s.root,getLanguage:()=> 'de',renderAddon(){},rendererOwner:'both'
  }), /renderer owner/);
  s.dom.window.close();
});
