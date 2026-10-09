// LYVRA Pet bounded UI repair: pure source-to-source patch, no publishing.
// Automatically signed Whole-LYVRA events remain the only live facet authority.
// Preserves worker script and all assets, budget, signatures and native connection.
export function patchAutoFacetUI(source) {
  if (typeof source !== 'string') throw new TypeError('Worker source required');
  const anchor = '<div class="controls" aria-label="Ausdrucksvorschau">';
  const count = source.split(anchor).length - 1;
  if (count !== 1) throw new Error('Expected exactly one legacy preview control block; found ' + count);
  if (!source.includes('createSignedEffectConnection') || !source.includes('/native-expression') ||
      !source.includes('nativeTicket++') || !source.includes('id="facet"')) {
    throw new Error('Expected signed runtime and legacy facet selector; refusing unverified source');
  }
  // Default-safe native mode: the old controls cannot capture pointer/keyboard focus,
  // and cannot generate user clicks that reset the signed native evidence controller.
  // No fake events and no autonomous affect inference.
  const replacement = '<style>.controls[hidden]{display:none!important}</style>' +
    '<div class="controls" aria-label="Ausdrucksvorschau" hidden inert>';
  return source.replace(anchor, replacement);
}
