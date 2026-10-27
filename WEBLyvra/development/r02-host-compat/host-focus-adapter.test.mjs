import test from 'node:test';
import assert from 'node:assert/strict';
import { createR02HostFocusAdapter } from './host-focus-adapter.mjs';

function fixture() {
  let lang = 'de', current = null, renders = [], listeners = new Map(), focusCalls = [];
  const elements = [];
  const make = ({kind, href, filter, searchCheck = false}) => {
    const node = {
      kind, href, dataset: filter ? { reachFilter: filter } : {},
      classList: { contains(v) { return v === 'gr-search-check' && searchCheck; } },
      getAttribute(v) { return v === 'href' ? href : null; },
      closest(selector) {
        const mapping = {search:'[data-disco-search]',provider:'[data-disco-provider]',more:'[data-disco-more]',filter:'[data-reach-filter]',link:'.gr-item a'};
        return mapping[kind] === selector ? this : null;
      },
      focus(options) { current = this; focusCalls.push(options); },
    };
    elements.push(node); return node;
  };
  const root = {
    contains(node) { return elements.includes(node); },
    querySelectorAll(selector) { return elements.filter(n => n.closest(selector)); },
  };
  const doc = {
    get activeElement() { return current; },
    addEventListener(type, handler) { listeners.set(type, handler); },
    removeEventListener(type) { listeners.delete(type); },
  };
  const bridge = createR02HostFocusAdapter({
    hostDocument: doc, addonRoot: root, getLanguage: () => lang,
    renderAddon(next) { renders.push(next); },
  });
  return { bridge, make, root, doc, renders, focusCalls,
    setLang(v) { lang = v; }, focus(node) { current = node; },
    get focused() { return current; },
    event(detail = {language:'en'}) { listeners.get('lyvra:languagechange')?.({detail}); },
    get listeners() { return listeners.size; },
  };
}
test('R02: host language is authoritative; forged event detail cannot override it', () => {
  const x = fixture(); x.bridge.mount(); assert.deepEqual(x.renders,['de']);
  x.event({language:'en'}); assert.deepEqual(x.renders,['de','de']);
  x.setLang('en'); x.event({language:'de'}); assert.equal(x.renders.at(-1),'en');
  x.bridge.unmount(); x.event(); assert.equal(x.renders.length,3);
});
test('R02: restored discography input focus does not scroll or create new controls', () => {
  const x = fixture(), search = x.make({kind:'search'});
  x.focus(search); x.bridge.mount(); x.setLang('en'); x.event();
  assert.equal(x.focused,search); assert.deepEqual(x.focusCalls.at(-1),{preventScroll:true});
  x.bridge.mount(); assert.equal(x.listeners,1);
});
test('R02: exact source link identity survives dynamic list rebuild', () => {
  const x = fixture(), before = x.make({kind:'link',href:'https://example.org/original'});
  x.make({kind:'link',href:'https://example.org/other'});
  x.focus(before); x.bridge.mount();
  x.root.contains = node => node !== before;
  const replacement = x.make({kind:'link',href:'https://example.org/original'});
  x.event(); assert.equal(x.focused,replacement);
});
test('R02: missing dynamic link restores focus to available filter, never an unrelated link', () => {
  const x = fixture(), old = x.make({kind:'link',href:'https://example.org/removed'});
  const filter = x.make({kind:'filter',filter:'all'});
  x.focus(old); x.bridge.mount(); x.root.contains = node => node !== old;
  x.event(); assert.equal(x.focused,filter);
});
test('R02: no focus movement when focus is outside the add-on', () => {
  const x = fixture(), outside = {focus() { throw Error('external focus changed'); }};
  x.focus(outside); x.bridge.mount(); x.event();
  assert.equal(x.focused,outside); assert.equal(x.focusCalls.length,0);
});
