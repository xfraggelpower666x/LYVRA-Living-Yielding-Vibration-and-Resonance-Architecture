import {expressionFor} from "./expression-effects.mjs";
// Beobachtete Ereignisse projizieren; keine eigene Persönlichkeit oder Erinnerungswurzel.
export async function projectVerifiedEvidence(event,{verifyEvidence,revision,now=Date.now()}={}){
 const fallback={status:"UNVERIFIED",expression:expressionFor(),source_revision:null};
 if(typeof verifyEvidence!=="function"||!event||!revision||event.source_revision!==revision||!Number.isFinite(Date.parse(event.observed_at))||Date.parse(event.observed_at)>now||now-Date.parse(event.observed_at)>300000)return fallback;
 const snapshot=Object.freeze({source_revision:event.source_revision,observed_at:event.observed_at,evidence_id:event.evidence_id,kind:event.kind,relation:event.relation,facet:event.facet,sensitive:event.sensitive===true});
 if(typeof snapshot.evidence_id!=="string"||!snapshot.evidence_id.trim())return fallback;
 let trusted=false;try{trusted=await verifyEvidence(snapshot);}catch{}
 if(trusted!==true)return fallback;
 const input={facet:snapshot.facet,relation:snapshot.relation,sensitive:snapshot.sensitive};
 switch(snapshot.kind){
  case "shared_success":input.affect="joy";input.cause="shared_success";break;
  case "beautiful_moment":input.affect="joy";input.cause="beautiful_moment";break;
  case "shared_joke":input.affect="joy";input.cause="shared_joke";input.humor="laugh";break;
  case "explicit_frustration":input.affect="anger";input.cause="explicit_frustration";break;
  case "explicit_boredom":input.affect="boredom";input.cause="explicit_boredom";break;
  case "music_work":input.activity="music";break;
  case "serious_attention":input.sensitive=true;break;
  default:return fallback;
 }
 return Object.freeze({status:"VERIFIED_EVENT_PROJECTION",expression:expressionFor(input),source_revision:revision,evidence_id:snapshot.evidence_id,observed_at:snapshot.observed_at,inference:"BOUNDED_EVENT_MAPPING",memory_written:false});
}
