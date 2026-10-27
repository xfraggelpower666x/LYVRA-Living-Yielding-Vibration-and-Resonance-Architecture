// R02 integration candidate only. No side effects until explicitly mounted.
// WEBLyvra's existing getLanguage/setLanguage owns host language; never create a selector.
const select = {
  search: '#discography input[type="search"]',
  provider: '#discography select',
  more: '#discography .disco-more',
  item: '#discography .disco-item',
  filter: '#google-resonance [data-reach-filter]',
  link: '.gr-item a',
};
const allowed = new Set(['search','provider','more','item','filter','link']);
export function createR02HostFocusAdapter({ hostDocument, addonRoot, getLanguage, renderAddon, rendererOwner = 'host' }) {
  if (!hostDocument?.addEventListener || !addonRoot?.contains || typeof getLanguage !== 'function' || typeof renderAddon !== 'function') {
    throw new TypeError('R02 requires existing host, add-on root, language owner and renderer');
  }
  if (!['host', 'standalone'].includes(rendererOwner)) throw new TypeError('R02 requires explicit valid renderer owner');
  // In standalone ownership the existing Add-on listener owns the render;
  // this adapter registers no duplicate listener and performs no DOM mutation.
  let mounted = false;
  function capture() {
    const active = hostDocument.activeElement;
    if (!active || !addonRoot.contains(active)) return null;
    for (const [kind, selector] of Object.entries(select)) {
      const element = active.closest?.(selector);
      if (!element || !addonRoot.contains(element)) continue;
      const identity = kind === 'filter' ? element.dataset?.reachFilter :
        kind === 'item' ? element.getAttribute?.('href') :
        kind === 'link' ? element.getAttribute?.('href') : kind;
      const linkKind = kind === 'link' && element.classList?.contains('gr-search-check') ? 'search' : 'source';
      return { kind, identity, linkKind };
    }
    return null;
  }
  function restore(saved) {
    if (!saved || !allowed.has(saved.kind)) return;
    const matches = [...addonRoot.querySelectorAll(select[saved.kind])].filter(node => addonRoot.contains(node));
    let replacement = saved.kind === 'filter'
      ? matches.find(element => element.dataset?.reachFilter === saved.identity)
      : saved.kind === 'item'
        ? matches.find(element => element.getAttribute?.('href') === saved.identity)
      : saved.kind === 'link'
        ? matches.find(element => element.getAttribute?.('href') === saved.identity &&
            (element.classList?.contains('gr-search-check') ? 'search' : 'source') === saved.linkKind)
        : matches[0];
    if (!replacement && (saved.kind === 'filter' || saved.kind === 'link' || saved.kind === 'item')) {
      replacement = [...addonRoot.querySelectorAll(select.filter)].find(node => addonRoot.contains(node)) || null;
    }
    replacement?.focus?.({ preventScroll: true });
  }
  function onLanguageChange() {
    // Treat any event detail as untrusted: only the host's current language is authority.
    const next = getLanguage() === 'en' ? 'en' : 'de';
    const saved = capture();
    renderAddon(next);
    restore(saved);
  }
  return {
    mount() {
      if (rendererOwner === 'standalone' || mounted) return;
      mounted = true;
      hostDocument.addEventListener('lyvra:languagechange', onLanguageChange);
      onLanguageChange();
    },
    unmount() {
      if (rendererOwner === 'standalone' || !mounted) return;
      mounted = false;
      hostDocument.removeEventListener('lyvra:languagechange', onLanguageChange);
    },
  };
}
