import {createSignedEventVerifier,canonicalPetEvent} from './signed-event-transport.mjs';
import {createEvidenceEffectController} from './evidence-effect-controller.mjs';
export function createSignedEffectConnection({effects,getRevision,trustedKeys,expectedPetId,clock=()=>Date.now(),cryptoApi=crypto}={}){
 if(!expectedPetId)throw Error('Pet-Bindung erforderlich');
 const verifier=createSignedEventVerifier({trustedKeys,clock,cryptoApi});const proofs=new Map();let disposed=false,sequence=0;
 const binding=event=>JSON.stringify([event.source_revision,event.evidence_id,event.observed_at,event.kind,event.relation??null,event.facet??null,event.sensitive===true]);
 const controller=createEvidenceEffectController({effects,getRevision,clock,verifyEvidence:snapshot=>(proofs.get(binding(snapshot))??0)>clock()});
 return Object.freeze({async accept(envelope){
  if(disposed)return false;
  const ticket=++sequence;
  // Vor await kopieren: spätere Mutation des Aufrufers kann keine Signatur umgehen.
  let frozen;try{frozen=Object.freeze({...envelope,event:Object.freeze(JSON.parse(canonicalPetEvent(envelope.event)))});}catch{return false;}
  if(frozen.event.pet_id!==expectedPetId||!await verifier.verify(frozen)||disposed||ticket!==sequence)return false;
  for(const [key,expiry] of proofs)if(expiry<=clock())proofs.delete(key);
  proofs.set(binding(frozen.event),Date.parse(frozen.event.observed_at)+60000);
  if(proofs.size>64)proofs.delete(proofs.keys().next().value);
  return controller.accept(frozen.event);
 },reset(){sequence++;controller.reset();},dispose(){sequence++;disposed=true;controller.dispose();proofs.clear();}});
}
