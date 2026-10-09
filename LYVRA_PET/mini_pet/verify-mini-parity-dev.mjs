import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root = new URL('./',import.meta.url);
const contract=await readFile(new URL('MINI_PET_FACET_CONTRACT.md',root),'utf8');
const live=JSON.parse(await readFile(new URL('livecircle/SUB_LIVECIRCLE_CURRENT.json',root),'utf8'));
const rehydrate=JSON.parse(await readFile(new URL('rehydration/SUB_REHYDRATION_MANIFEST.json',root),'utf8'));
assert.match(contract,/FULL CAPABILITY PARITY/);
assert.match(contract,/Only visual layout, dimensions, displayed text and controls may be compact/);
for(const d of [live,rehydrate]){
 assert.equal(d.authority,'LYVRA_PET/');
 assert.equal(d.capability_parity,'SAME_FULL_PARENT_PET_INTELLIGENCE');
 assert.equal(d.shared_runtime,'LYVRA_PET/');
 assert.equal(d.compactness_only.length,4);
}
assert.equal(live.live_approved,false);
assert.equal(rehydrate.host_embedding_verified,false);
assert.equal(rehydrate.pointer_promotion,'BLOCKED_UNTIL_VERIFIED');
assert.ok(live.phases.includes('parent_capability_parity_audit'));
assert.ok(rehydrate.order.includes('verify_parent_full_capability_parity'));
console.log('PASS mini-PET parity, shared authority, sub lifecycle, rehydration and non-live release guards');
