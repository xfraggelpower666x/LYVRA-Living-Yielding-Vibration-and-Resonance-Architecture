// LYVRA existing Semantic Cyber Field: two read-only projections, no new engine.
// Source evidence is supplied by the verified CURRENT registry, not inferred by this module.
export const STATES = Object.freeze(["PROPOSED","DEV_ACTIVE","DEFERRED_WITH_REASON","ADOPTED","SUPERSEDED","ARCHIVED"]);
export function projectDualLayer(registry, opts = {}) {
  if (!registry || registry.schema !== "LYVRA_DUAL_LAYER_PROJECT_VIEW_V1" || !Array.isArray(registry.items)) throw new TypeError("unverified registry");
  const items = registry.items.map(item => ({...item, priority_inputs:{...item.priority_inputs}}));
  const ids = new Set();
  for (const item of items) {
    if (!item.id || ids.has(item.id) || !STATES.includes(item.state) || !item.evidence_path) throw new TypeError("invalid or duplicate item");
    ids.add(item.id);
  }
  const persistent = items.filter(item => opts.includeArchived || !["ARCHIVED","SUPERSEDED"].includes(item.state));
  const score = item => Number(Boolean(item.priority_inputs?.creator_selected)) * 4 + Number(Boolean(item.priority_inputs?.blocked)) * 2 + Number(Boolean(item.priority_inputs?.urgent));
  const dynamic = persistent.filter(item => item.state !== "ADOPTED").sort((a,b) => score(b)-score(a) || a.id.localeCompare(b.id)).map(item=>({...item, priority_basis:{creator_selected:!!item.priority_inputs?.creator_selected,blocked:!!item.priority_inputs?.blocked,urgent:!!item.priority_inputs?.urgent}}));
  return {authority:"WHOLE_LYVRA", dynamic, persistent, source_count:items.length, no_autoactivation:true, no_private_content:true};
}
