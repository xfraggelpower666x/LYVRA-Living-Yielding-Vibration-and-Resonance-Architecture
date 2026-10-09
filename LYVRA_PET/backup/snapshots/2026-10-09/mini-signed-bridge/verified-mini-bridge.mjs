import {createSignedEventVerifier} from '../bridge/signed-event-transport.mjs';
import {projectMiniPet} from './mini-view-adapter.mjs';
const PET_ID='pet_6ab791129364819183885f44a21497a2';
const MODES={shared_success:'SUCCESS',beautiful_moment:'SUCCESS',shared_joke:'SUCCESS',music_work:'ACTIVE',serious_attention:'CONCENTRATED',explicit_frustration:'WARNING',explicit_boredom:'REST'};
export function createVerifiedMiniBridge({trustedKeys,getParentRevision,clock=()=>Date.now(),cryptoApi=crypto}={}){
 if(typeof getParentRevision!=='function')throw Error('Shared parent PET revision getter is mandatory');
 const verifier=createSignedEventVerifier({trustedKeys,clock,cryptoApi});
 let serial=0,closed=false,lastKey=null;
 return Object.freeze({
  async accept(envelope){
   if(closed)return projectMiniPet(null);
   const ticket=++serial;
   let event;try{event=structuredClone(envelope?.event);}catch{return projectMiniPet(null);}
   if(!event||event.pet_id!==PET_ID||!Object.hasOwn(MODES,event.kind)||!await verifier.verify({...envelope,event})||closed||ticket!==serial)return projectMiniPet(null);
   let revision;try{revision=await getParentRevision();}catch{return projectMiniPet(null);}
   if(closed||ticket!==serial||revision!==event.source_revision)return projectMiniPet(null);
   const key=event.source_revision+':'+event.evidence_id;
   if(key===lastKey)return projectMiniPet(null);
   lastKey=key;
   const expires_at=Math.min(Date.parse(event.observed_at)+60000,clock()+60000);
   return projectMiniPet({source:'PARENT_PET_VERIFIED_PROJECTION',pet_id:PET_ID,parent_verified:true,parent_verification_token:'NATIVE_HOST_VERIFIED',source_revision:event.source_revision,expires_at,mode:MODES[event.kind],facet:event.facet},{now:clock()});
  },
  reset(){serial++;lastKey=null;},
  dispose(){closed=true;serial++;lastKey=null;}
 });
}
