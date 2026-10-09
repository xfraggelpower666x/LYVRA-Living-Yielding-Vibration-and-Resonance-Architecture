import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=new URL('./',import.meta.url);
const contract=await readFile(new URL('CONTRACT.md',base),'utf8');
const cycle=JSON.parse(await readFile(new URL('livecircle/SUB_LIVECIRCLE_CURRENT.json',base),'utf8'));
const recovery=JSON.parse(await readFile(new URL('rehydration/SUB_REHYDRATION_MANIFEST.json',base),'utf8'));
const impact=JSON.parse(await readFile(new URL('PLUGIN_IMPACT_CURRENT.json',base),'utf8'));
assert.match(contract,/DEV_COMPLETE_PLUGIN_PENDING/);
assert.match(contract,/No invented release IDs/);
assert.equal(cycle.both_plugins_required,true);
assert.equal(cycle.auto_release_without_approval,false);
assert.equal(cycle.blocks_whole_complete_when_plugin_drift,true);
assert.equal(recovery.productive_plugin_integration,false);
assert.equal(impact.status,'DEV_COMPLETE_PLUGIN_PENDING');
assert.equal(impact.live_plugin_parity_verified,false);
assert.equal(impact.release_approved,false);
assert.equal(impact.managed_plugin_count,3);
assert.equal(impact.pet_plugin.state,'EXACT_ID_AND_RELEASE_PENDING_VERIFICATION');
assert.equal(impact.protected_assets.policy,'EXPLICIT_USER_LOGO_CHANGE_ONLY');
assert.equal(impact.protected_assets.routine_update,'PRESERVE_ALL_LOGOS_BYTE_IDENTICAL');
assert.match(contract,/LOGO_ASSET_CHANGE = EXPLICIT_USER_REQUEST_ONLY/);


const inventory=JSON.parse(await readFile(new URL('ZIP_ARCHIVE_INVENTORY_CURRENT.json',base),'utf8'));
assert.equal(inventory.archive_entries.length,3);
assert.equal(inventory.status,'REPOSITORY_PATHS_VERIFIED_RELEASE_PARITY_PENDING');
assert.ok(inventory.hard_guards.includes('LOGO_CHANGE_EXPLICIT_USER_ONLY'));
assert.match(contract,/Mandatory plugin ZIP current and immutable history checkpoints/);
assert.match(contract,/Git blob SHA is NOT ZIP SHA-256/);
for(const a of inventory.archive_entries){assert.equal(a.release_parity,'NOT_VERIFIED');assert.ok(a.path.endsWith('.zip'));assert.match(a.git_blob_sha,/^[a-f0-9]{40}$/);}
console.log('PASS CodeForge plugin steward: two surfaces, lifecycle, recovery and no premature release');
