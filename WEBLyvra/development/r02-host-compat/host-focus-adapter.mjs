// R02 integration candidate only. No side effects until explicitly mounted.
// WEBLyvra's existing getLanguage/setLanguage owns host language; never create a selector.
const select = {
  search: '[data-disco-search]',
  provider: '[data-disco-provider]',
  more: '[data-disco-more]',
  filter: '[data-reach-filter]',
  link: '.gr-item a',
};
const allowed = new Set(['search','provider','more','filter','link']);
export function createR02HostFocusAdapter({ hostDocument, addonRoot, getLanguage, renderAddon }) {
  if (!hostDocument?.addEventListener || !addonRoot?.contains || typeof getLanguage !== 'function' || typeof renderAddon !== 'function') {
    throw new TypeError('R02 requires existing host, add-on root, language owner and renderer');
  }
  let mounted = false;
  function capture() {
    const active = hostDocument.activeElement;
    if (!active || !addonRoot.contains(active)) return null;
    for (const [kind, selector] of Object.entries(select)) {
      const element = active.closest?.(selector);
      if (!element || !addonRoot.contains(element)) continue;
      const identity = kind === 'filter' ? element.dataset?.reachFilter :
        kind === 'link' ? element.getAttribute?.('href') : kind;
      const linkKind = kind === 'link' && element.classList?.contains('gr-search-check') ? 'search' : 'source';
      return { kind, identity, linkKind };
    }
    return null;
  }
  function restore(saved) {
    if (!saved || !allowed.has(saved.kind)) return;
    const matches = [...addonRoot.querySelectorAll(select[saved.kind])];
    let replacement = saved.kind === 'filter'
      ? matches.find(element => element.dataset?.reachFilter === saved.identity)
      : saved.kind === 'link'
        ? matches.find(element => element.getAttribute?.('href') === saved.identity &&
            (element.classList?.contains('gr-search-check') ? 'search' : 'source') === saved.linkKind)
        : matches[0];
    if (!replacement && (saved.kind === 'filter' || saved.kind === 'link')) {
      replacement = [...addonRoot.querySelectorAll(select.filter])][0] || null;
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
      if (mounted) return;
      mounted = true;
      hostDocument.addEventListener('lyvra:languagechange', onLanguageChange);
      onLanguageChange();
    },
    unmount() {
      if (!mounted) return;
      mounted = false;
      hostDocument.removeEventListener('lyvra:languagechange', onLanguageChange);
    },
  };
}
