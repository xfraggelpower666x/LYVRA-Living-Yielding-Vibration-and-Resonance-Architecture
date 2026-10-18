import test from 'node:test';
import assert from 'node:assert/strict';
import {projectDualLayer} from '../dual-layer-visual-projection.mjs';

const state = (id, value, extra = {}) => ({
  id, state: value, evidence_path: `LYVRA_NATIVE_RUNTIME/facets/${id}/CURRENT_STATE.json`,
  priority_inputs: {creator_selected: true, blocked: true, urgent: false}, ...extra
});
const supercodeforge = state('LYVRA_SUPERCODEFORGE_SUPERFACET_20261018', 'DEV_ACTIVE', {
  source: 'MANUAL_GITHUB_ACTIONS_INTEGRATION_SOURCE_READBACK_PASS',
  delivery: 'PLUGIN_SKILL_RELEASES_READBACK_VERIFIED_NOT_HOST_EXECUTED',
  adoption: 'NATIVE_LYVRA_DEVELOPMENT_ONLY',
  host: 'NOT_VERIFIED_GITHUB_ACTIONS_MANUAL_DISPATCH_PENDING',
  blockers: ['MANUAL_GITHUB_ACTIONS_REAL_PROVIDER_RUN_PENDING', 'NATIVE_PLUGIN_HOST_INJECTION_PENDING','ALIVE_PLUGIN_HOST_INJECTION_PENDING'],
  visual_evidence_binding: {
    classification: 'SOURCE_VERIFIED_HOST_PENDING',
    source: 'EXACT_REPO_READBACK', delivery: 'REPO_MANUAL_PROBE_SOURCE_ONLY',
    adoption: 'LYVRA_DEV_SCOPE_ONLY', host: 'PLUGIN_NATIVE_AND_ALIVE_UNVERIFIED',
    persistent: 'KEEP_VISIBLE_WHILE_OPEN', no_new_engine: true, no_inert_controls: true
  }
});
const registry = (...items) => ({schema:'LYVRA_DUAL_LAYER_PROJECT_VIEW_V1', items});

test('SuperCodeForge remains visible in both derived and persistent layers', () => {
  const p = projectDualLayer(registry(state('another', 'PROPOSED'), supercodeforge));
  assert.ok(p.dynamic.some(x => x.id === supercodeforge.id));
  assert.ok(p.persistent.some(x => x.id === supercodeforge.id));
  assert.equal(p.source_count,2);
  assert.equal(p.no_autoactivation,true);
  assert.equal(p.no_private_content,true);
});

test('source readback never promotes plugin host gates', () => {
  const p = projectDualLayer(registry(supercodeforge));
  const card = p.persistent[0];
  assert.equal(card.visual_evidence_binding.source,'EXACT_REPO_READBACK');
  assert.equal(card.visual_evidence_binding.host,'PLUGIN_NATIVE_AND_ALIVE_UNVERIFIED');
  assert.match(card.host,/NOT_VERIFIED/);
  assert.equal(card.visual_evidence_binding.no_new_engine,true);
  assert.equal(card.visual_evidence_binding.no_inert_controls,true);
});

test('delivery and adoption remain distinct from source and host', () => {
  const c=projectDualLayer(registry(supercodeforge)).dynamic[0];
  assert.equal(c.delivery,'PLUGIN_SKILL_RELEASES_READBACK_VERIFIED_NOT_HOST_EXECUTED');
  assert.equal(c.adoption,'NATIVE_LYVRA_DEVELOPMENT_ONLY');
  assert.notEqual(c.delivery,c.host);
  assert.notEqual(c.adoption,c.source);
});

test('priority change does not erase blocked durable development', () => {
  const reg=registry(supercodeforge, state('preferred','DEV_ACTIVE', {priority_inputs:{creator_selected:true,blocked:true,urgent:true}}));
  const before=JSON.stringify(reg);
  const p=projectDualLayer(reg);
  assert.equal(p.dynamic[0].id,'preferred');
  assert.ok(p.persistent.some(x => x.id === supercodeforge.id));
  assert.equal(JSON.stringify(reg), before);
});

test('invalid or duplicate cards fail closed', () => {
  assert.throws(()=>projectDualLayer(registry(supercodeforge,supercodeforge)),/invalid or duplicate/);
  assert.throws(()=>projectDualLayer(registry({...supercodeforge,evidence_path:''})),/invalid or duplicate/);
  assert.throws(()=>projectDualLayer({schema:'OTHER',items:[supercodeforge]}),/unverified registry/);
});
