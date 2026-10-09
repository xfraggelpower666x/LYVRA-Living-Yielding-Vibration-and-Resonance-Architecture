import {PET_ID,resolveExpression} from "./expression-adapter.mjs";
const BASE="https://api.github.com/repos/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture";
// Nur öffentliche technische Bindungen lesen; keine privaten Beziehungspayloads.
export function createContextSource({fetchJson,clock=()=>Date.now()}) {
  let minted=null;
  async function head(){const value=await fetchJson(BASE+"/branches/lyvra");const sha=value?.commit?.sha;if(!/^[a-f0-9]{40}$/.test(sha||""))throw Error("Ungültiger Current HEAD");return sha;}
  async function snapshot(){
    const revision=await head();
    const read=path=>fetchJson(BASE+"/contents/"+path+"?ref="+revision);
    const [character,pet]=await Promise.all([read("LYVRA_NATIVE_RUNTIME/current/personality/CURRENT_STATE.json"),read("LYVRA_PET/livecircle/CURRENT_STATE.json")]);
    if(character.authority!=="WHOLE_LYVRA"||character.status!=="CURRENT_PRODUCTIVE"||character.whole_lyvra_decision_authority!==true||pet.pet_id!==PET_ID||pet.parent_authority!=="WHOLE_LYVRA"||pet.status!=="CURRENT_PRODUCTIVE")throw Error("Native Bindung ungültig");
    if(await head()!==revision)throw Error("Current während Readback verändert");
    return Object.freeze({revision,pet_id:PET_ID,authority:"WHOLE_LYVRA",status:"TECHNICAL_BINDING_VERIFIED",whole_rehydrated:false,context_inference:false});
  }
  async function produce(context="idle",intensity=0.5){
    minted=null;
    const current=await snapshot(),now=clock();
    const envelope={pet_id:PET_ID,authority:"WHOLE_LYVRA",source_revision:current.revision,issued_at:new Date(now).toISOString(),valid_until:new Date(now+60000).toISOString(),context,intensity};
    if(resolveExpression(envelope,now).status!=="VALIDATED_INPUT")throw Error("Unbekannter Kontext");
    minted=JSON.stringify(envelope);
    return Object.freeze(envelope);
  }
  async function verifySource(envelope){
    if(!envelope||JSON.stringify(envelope)!==minted)return false;
    return (await head())===envelope.source_revision;
  }
  return Object.freeze({snapshot,produce,verifySource});
}
export async function publicGithubJson(url){
  const response=await fetch(url,{headers:{Accept:"application/vnd.github.raw+json"},cache:"no-store"});
  if(!response.ok)throw Error("Quellenzugriff fehlgeschlagen: "+response.status);
  return response.json();
}
