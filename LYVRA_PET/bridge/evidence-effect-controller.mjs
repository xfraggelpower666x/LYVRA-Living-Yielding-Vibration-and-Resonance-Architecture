import {projectVerifiedEvidence} from "./evidence-projection.mjs";
// Brücke zu Whole-LYVRA-Ereignissen: Prüfer bleiben beim autorisierten Host.
export function createEvidenceEffectController({effects,getRevision,verifyEvidence,clock=()=>Date.now(),schedule=setTimeout,cancel=clearTimeout}){
 let generation=0,closed=false,timer=null;
 function clear(){if(timer!==null)cancel(timer);timer=null;}
 function calm(){effects.set({});}
 async function accept(event){
  if(closed)return false;
  const ticket=++generation;clear();calm();
  const snapshot=event&&Object.freeze({source_revision:event.source_revision,observed_at:event.observed_at,evidence_id:event.evidence_id,kind:event.kind,relation:event.relation,facet:event.facet,sensitive:event.sensitive});
  try{
   const revision=await getRevision();
   const projected=await projectVerifiedEvidence(snapshot,{revision,verifyEvidence,now:clock()});
   if(closed||ticket!==generation)return false;
   if(projected.status!=="VERIFIED_EVENT_PROJECTION"||await getRevision()!==revision)return false;
   if(closed||ticket!==generation)return false;
   const expiry=Date.parse(snapshot.observed_at)+60000;
   if(expiry<=clock())return false;
   effects.set(projected.render_input);
   timer=schedule(()=>{if(!closed&&ticket===generation){timer=null;calm();}},expiry-clock());
   return true;
  }catch{return false;}
 }
 function reset(){++generation;clear();if(!closed)calm();}
 function dispose(){closed=true;++generation;clear();}
 return Object.freeze({accept,reset,dispose});
}
