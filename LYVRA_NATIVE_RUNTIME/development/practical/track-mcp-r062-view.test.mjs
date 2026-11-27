import {test} from 'node:test';
import assert from 'node:assert/strict';
import {trackView} from './track-mcp-r062-view.mjs';
test('missing draft stays held',()=>{const v=trackView(null,null);assert.equal(v.companion.status,'BLOCKIERT');assert.equal(v.views.length,3);assert.ok(v.gaps.includes('DRAFT_REQUIRED'));});
test('actual UTF16 counts and contextual controls',()=>{const v=trackView({extended:'🌀',weirdness:86,variety:0,tasteMode:'ON'},{});assert.equal(v.views[1].items.find(x=>x.label==='extended').text,'2/1000');assert.ok(v.gaps.includes('VARIETY_TASTE_CONFLICT'));});
test('no generation action or private payload',()=>{const v=trackView({lyrics:'private fixture'},{});assert.ok(!JSON.stringify(v).includes('private fixture'));assert.ok(v.actions.every(x=>x.kind==='verify'));});
