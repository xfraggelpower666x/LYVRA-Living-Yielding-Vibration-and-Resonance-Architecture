import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('./',import.meta.url);
const src=await readFile(new URL('worker/src/index.js',root),'utf8');
const built=await readFile(new URL('worker/build/worker-bundle.mjs',root),'utf8');
const assets=await readFile(new URL('assets/logo-assets.mjs',root),'utf8');
const signed=await readFile(new URL('bridge/signed-event-transport.mjs',root),'utf8');
const reader=await readFile(new URL('bridge/repository-event-source.mjs',root),'utf8');
const importLogo='import {LOGO_ASSETS} from "../../assets/logo-assets.mjs";';
const importReader='import {produceRepositoryEnvelope,publicNativeSourceFailure} from "../../bridge/repository-event-source.mjs";';
assert.ok(src.startsWith(importLogo+'\n'));
assert.ok(src.includes(importReader+'\n'));
const reconstructed=assets.replace(/^export /gm,'')+'\n'+signed.replace(/^export /gm,'')+'\n'+reader.replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'')+'\n'+src.slice(importLogo.length+1).replace(importReader+'\n','');
assert.equal(built,reconstructed,'Native bundle differs from deterministic repository build');
for(const s of [src,built]){
 assert.equal(s.split('aria-label="Ausdrucksvorschau" hidden inert').length-1,1,'Legacy preview must be hidden and inert by default');
 assert.ok(s.includes('.controls[hidden]{display:none!important}'),'Hidden selector must be CSS-enforced');
 assert.ok(s.includes('createSignedEffectConnection'),'Existing Ed25519 signed-event controller must be retained');
 assert.ok(s.includes('/native-expression'),'Native verified event endpoint must be retained');
 assert.ok(s.includes('pet-budget'),'Newer budget UI must survive');
}
for(const code of [src,built]){
 assert.ok(code.includes('function chooseFacet(context)'), 'Historical PFS automatic detector must be restored');
 assert.ok(code.includes('const expiry=Date.parse(result.envelope.event.observed_at)+60000'), 'Verified state must expire at signed observation deadline');
 assert.ok(code.includes('clearTimeout(nativeExpiryTimer);nativeExpiryTimer=null'), 'Refresh must cancel prior expiration timer');
 assert.ok(code.includes('nativeTicket++;clearTimeout(nativeExpiryTimer);'), 'Page unload must release expiration timer');

 assert.equal(code.split('document.getElementById("auto-detector-status").textContent="Automatic Detector · wartet').length-1,3,'Missing approval, unavailable source, and thrown errors must clear stale verified status');
 assert.ok(code.includes('id="auto-detector-status"'), 'Auto detector must expose status without manual control');
 assert.ok(code.includes('if(status)status.textContent="Automatic Detector · verifiziert:'), 'Only accepted native event may mark detector verified');
 assert.ok(code.includes('if(accepted)applyVerifiedNativeFacet(result.envelope.event);'), 'Native facet needs accepted signed event');
 assert.ok(code.includes('current={facet:chooseFacet({type})}'), 'Local preview remains explicitly separate');
 assert.ok(code.includes('if(context?.trusted===true&&PET_FACETS.includes(context.facet))'), 'Untrusted external facet must not be treated as approved');
}
assert.ok(reader.includes("carrier.status==='NONE'"),'Absent approval must remain a calm result');
assert.ok(reader.includes('NO_APPROVED_EVENT'));
console.log('PASS native PET source/bundle exact parity, manual preview disabled, signed events/budget/source semantics retained');
