// Read-only repository contract acceptance for the staged 2026-10-28 Analytics migration.
// Run: node LYVRA_NATIVE_RUNTIME/tests/analytics_subfacet_contract_acceptance_20261028.mjs
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../../', import.meta.url)));
const read = p => readFileSync(resolve(root, p), 'utf8');
const state = JSON.parse(read('LYVRA_NATIVE_RUNTIME/facets/analytics/CURRENT_STATE.json'));
const manifest = JSON.parse(read('LYVRA_NATIVE_RUNTIME/facets/analytics/REHYDRATION_MANIFEST.json'));
const contract = read('LYVRA_NATIVE_RUNTIME/facets/analytics/FACET_CONTRACT.md');
const cap = read('LYVRA_NATIVE_RUNTIME/facets/analytics/CAPABILITY_REGISTRY.md');
const circle = read('LYVRA_NATIVE_RUNTIME/facets/analytics/SUB_LIFECIRCLE.md');
const monitor = read('LYVRA_NATIVE_RUNTIME/facets/analytics/SUNO_MONITOR_RESULT_INTAKE.md');
const track = read('LYVRA_NATIVE_RUNTIME/current/music/TRACK_DESIGN_SUB_REHYDRATION.md');
const visual = read('LYVRA_NATIVE_RUNTIME/current/visual/SEMANTIC_CYBER_FIELD_LOCAL_ADAPTIVE_VISUAL_CONTRACT.md');
const index = read('LYVRA_NATIVE_RUNTIME/current/governance/FACET_SUB_LIFECIRCLE_REGISTRY.md');
const checks = {
  analytics_parent_state: state.parent_facet === 'TRACK_DESIGN',
  analytics_parent_manifest: manifest.parent_facet === 'TRACK_DESIGN',
  whole_authority: state.root_authority === 'WHOLE_LYVRA',
  contract_child: contract.includes('ANALYTICS_IS_TRACK_DESIGN_CHILD_FACET=true'),
  old_parent_guard_absent: !contract.includes('ANALYTICS_NE_TRACK_DESIGN_CHILD_FACET=true'),
  selective_peers: cap.includes('SELECTIVELY_ADDRESSABLE_INTELLIGENCES') && index.includes('SPEECH_DESIGN | SUNO_STUDIO_2'),
  monitor_intake: manifest.suno_monitor_result_intake === 'LYVRA_NATIVE_RUNTIME/facets/analytics/SUNO_MONITOR_RESULT_INTAKE.md',
  monitor_independent: monitor.includes('remain independent and unchanged'),
  lifecycle: circle.includes('RECOVERY_AND_OPEN_WORK') && circle.includes('NO_CHANGE'),
  music_preserved: track.includes('FUNCTIONAL_EMOJI_INTELLIGENCE_REQUIRED = true') && track.includes('VISIBLE_STANDARD_CODEBOX_COUNT = 5'),
  visual_preserved: visual.includes('TRACK_DESIGN_CAUSAL_MUSIC_IMAGERY_MUST_NOT_BE_REPLACED=true'),
  registry: index.includes('PROPOSED_PARENT = TRACK_DESIGN'),
};
for (const [name, ok] of Object.entries(checks)) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}`);
const failures = Object.entries(checks).filter(([,ok])=>!ok);
console.log(`${Object.keys(checks).length - failures.length}/${Object.keys(checks).length} contract assertions passed`);
if (failures.length) process.exitCode=1;
// Passing this file test NEVER establishes plugin release parity, fresh-host boot or Suno render.
