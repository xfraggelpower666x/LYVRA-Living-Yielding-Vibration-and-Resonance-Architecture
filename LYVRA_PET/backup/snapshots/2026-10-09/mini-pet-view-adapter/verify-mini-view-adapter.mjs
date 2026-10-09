import assert from 'node:assert/strict';
import {projectMiniPet,renderMiniPetMarkup,FULL_PET_URL} from './mini-view-adapter.mjs';
const pet='pet_6ab791129364819183885f44a21497a2';
const now=1_800_000_000_000;
const input={source:'PARENT_PET_VERIFIED_PROJECTION',pet_id:pet,parent_verified:true,parent_verification_token:'NATIVE_HOST_VERIFIED',source_revision:'a'.repeat(40),expires_at:now+20000,mode:'SUCCESS',facet:'track_design'};
for(const unsafe of [{...input,pet_id:'wrong'},{...input,expires_at:now-1},{...input,parent_verified:false},{...input,parent_verification_token:'FORGED'},{...input,source_revision:'invalid'},{...input,source:'CHAT_TEXT'}]){
 assert.equal(projectMiniPet(unsafe,{now}).verified,false,'Unsafe source must be neutral');
}
const view=projectMiniPet(input,{now});
assert.equal(view.verified,true);
assert.equal(view.mode,'SUCCESS');
assert.equal(view.facet,'track_design');
assert.equal(view.full_pet_url,FULL_PET_URL);
assert.equal(projectMiniPet(null,{now}).mode,'NEUTRAL');
assert.equal(projectMiniPet({...input,mode:'<script>alert(1)</script>',facet:'X'}, {now}).mode,'NEUTRAL');
assert.ok(!renderMiniPetMarkup({...view,mode:'<script>',facet:'<img>'}).includes('<script>'));
const markup=renderMiniPetMarkup(view);
assert.ok(markup.includes('PET-Details'));
assert.ok(markup.includes(FULL_PET_URL));
assert.ok(markup.includes('data-mode="SUCCESS"'));
console.log('PASS mini presentation adapter: neutral fail-closed, state projection, no HTML injection, full PET link');
