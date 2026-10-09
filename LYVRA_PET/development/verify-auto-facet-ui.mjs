import assert from 'node:assert/strict';
import {patchAutoFacetUI} from './patch-auto-facet-ui.mjs';
const source = '<html><div class="controls" aria-label="Ausdrucksvorschau">'+
 '<select id="facet"></select></div><script>createSignedEffectConnection();'+
 'fetch("/native-expression");nativeTicket++;</script></html>';
const patched = patchAutoFacetUI(source);
assert.match(patched, /hidden inert/);
assert.match(patched, /controls\[hidden\]\{display:none!important\}/);
assert.ok(patched.includes('createSignedEffectConnection'));
assert.ok(patched.includes('/native-expression'));
assert.ok(patched.includes('nativeTicket++'));
assert.throws(()=>patchAutoFacetUI('missing'),/exactly one/);
assert.throws(()=>patchAutoFacetUI(source+source),/exactly one/);
assert.throws(()=>patchAutoFacetUI('<div class="controls" aria-label="Ausdrucksvorschau"></div>'),/signed runtime/);
console.log('PASS: automatic default, guarded source, signed code preserved, no duplicate patch');
