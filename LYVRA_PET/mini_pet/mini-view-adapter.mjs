// Compact presentation adapter only. Whole LYVRA and parent PET own all cognition.
export const FULL_PET_URL='https://lyvra.pet.alive.666soundsdesign-broadcaster.com';
const MODES=new Set(['NEUTRAL','ACTIVE','CONCENTRATED','SUCCESS','WARNING','RECOVERY','REST']);
const FACETS=new Set(['whole','track_design','speech_design','suno_studio_2']);
const PET_ID='pet_6ab791129364819183885f44a21497a2';
const neutral=Object.freeze({pet_id:PET_ID,mode:'NEUTRAL',facet:'whole',verified:false,caption:'Whole LYVRA · keine verifizierte PET-Aktivität',full_pet_url:FULL_PET_URL});
export function projectMiniPet(input,{now=Date.now()}={}){
  // Verified envelopes must be validated by the shared parent PET verifier upstream.
  // This adapter never treats a UI-provided "verified" boolean as sufficient evidence.
  if(!input||input.source!=='PARENT_PET_VERIFIED_PROJECTION'||input.pet_id!==PET_ID||input.parent_verified!==true||input.parent_verification_token!=='NATIVE_HOST_VERIFIED'||!Number.isFinite(input.expires_at)||input.expires_at<=now||input.expires_at>now+60000||typeof input.source_revision!=='string'||!/^[a-f0-9]{40}$/i.test(input.source_revision))return neutral;
  const mode=MODES.has(input.mode)?input.mode:'NEUTRAL';
  const facet=FACETS.has(input.facet)?input.facet:'whole';
  return Object.freeze({pet_id:PET_ID,mode,facet,verified:true,caption:mode==='NEUTRAL'?'Whole LYVRA · ruhig':'Whole LYVRA · '+mode,full_pet_url:FULL_PET_URL});
}
export function renderMiniPetMarkup(state=neutral){
  const s=state?.pet_id===PET_ID&&state?.full_pet_url===FULL_PET_URL?state:neutral;
  // No untrusted source text is interpolated into HTML.
  const mode=MODES.has(s.mode)?s.mode:'NEUTRAL',facet=FACETS.has(s.facet)?s.facet:'whole';
  return '<aside class="lyvra-mini-pet" data-pet-id="'+PET_ID+'" data-mode="'+mode+'" data-facet="'+facet+'" aria-label="LYVRA Mini-PET"><strong>L.Y.V.R.A. 🐾</strong><span>'+mode+'</span><a href="'+FULL_PET_URL+'" target="_blank" rel="noopener noreferrer" aria-label="LYVRA Haupt-PET in Detailansicht öffnen">PET-Details ↗</a></aside>';
}
