import {projectVerifiedEvidence} from "./evidence-projection.mjs";
// Brücke zu Whole-LYVRA-Ereignissen: Prüfer bleiben beim autorisierten Host.
export function createEvidenceEffectController({effects,getRevision,verifyEvidence,clock=()=>Date.now(),schedule=setTimeout,cancel=clearTimeout}){
 let generation=0,closed=false,timer=null,lastObserved=-Infinity;
 // Kurzlebiger Replay-Schutz ist keine Erinnerungs- oder Persönlichkeitswurzel.
 const seen=new Map();
 function clear(){if(timer!==null)cancel(timer);timer=null;}
 function calm(){effects.set({});}
 async function accept(event){
  if(closed)return false;
  const snapshot=event&&Object.freeze({source_revision:event.source_revision,observed_at:event.observed_at,evidence_id:event.evidence_id,kind:event.kind,relation:event.relation,facet:event.facet,sensitive:event.sensitive});
  const observed=Date.parse(snapshot?.observed_at);
  const key=JSON.stringify([snapshot?.source_revision,snapshot?.evidence_id]);
  for(const [id,expiry] of seen)if(expiry<=clock())seen.delete(id);
  if(seen.has(key)||observed<lastObserved)return false;
  const ticket=++generation;clear();calm();
  try{
   const revision=await getRevision();
   const projected=await projectVerifiedEvidence(snapshot,{revision,verifyEvidence,now:clock()});
   if(closed||ticket!==generation)return false;
   if(projected.status!=="VERIFIED_EVENT_PROJECTION"||await getRevision()!==revision)return false;
   if(closed||ticket!==generation)return false;
   const expiry=Date.parse(snapshot.observed_at)+60000;
   if(expiry<=clock())return false;
   if(seen.has(key)||observed<lastObserved)return false;
   effects.set(projected.render_input);
   lastObserved=observed;seen.set(key,expiry);
   while(seen.size>256)seen.delete(seen.keys().next().value);
   timer=schedule(()=>{if(!closed&&ticket===generation){timer=null;calm();}},expiry-clock());
   return true;
  }catch{return false;}
 }
 function reset(){++generation;clear();if(!closed)calm();}
 function dispose(){closed=true;++generation;clear();seen.clear();}
 return Object.freeze({accept,reset,dispose});
}

