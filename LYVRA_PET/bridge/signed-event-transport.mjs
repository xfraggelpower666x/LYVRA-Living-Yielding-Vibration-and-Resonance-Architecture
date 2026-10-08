// Schlüssel werden ausschließlich vom nativen Betreiber konfiguriert, nie aus dem Ereignis übernommen.
const SIGNED_FIELDS=['pet_id','authority','source_revision','evidence_id','observed_at','kind','facet','relation','cause','affect','humor','sensitive','bpm'];
export function canonicalPetEvent(event){
 if(!event||typeof event!=='object'||Object.keys(event).some(key=>!SIGNED_FIELDS.includes(key)))throw Error('Unzulässige Ereignisfelder');
 const clean={};for(const key of SIGNED_FIELDS)if(event[key]!==undefined){const v=event[key];if(!['string','number','boolean'].includes(typeof v)||typeof v==='string'&&v.length>200)throw Error('Ungültiger Ereigniswert');clean[key]=v;}
 if(clean.authority!=='WHOLE_LYVRA'||!/^pet_[a-f0-9]+$/.test(clean.pet_id||'')||!/^[a-f0-9]{40}$/.test(clean.source_revision||'')||!clean.evidence_id||!Number.isFinite(Date.parse(clean.observed_at)))throw Error('Native Ereignisbindung fehlt');
 return JSON.stringify(clean);
}
const encodeSignature=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
const decodeSignature=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
export function createSignedEventProducer({privateKey,keyId,verifyNativeEvent,cryptoApi=crypto,clock=()=>Date.now()}={}){
 if(!privateKey||!keyId||typeof verifyNativeEvent!=='function')throw Error('Native Signaturkonfiguration erforderlich');
 return Object.freeze({async produce(event){
  const canonical=canonicalPetEvent(event),snapshot=Object.freeze(JSON.parse(canonical));
  if(await verifyNativeEvent(snapshot)!==true)throw Error('Whole LYVRA hat dieses Ereignis nicht freigegeben');
  const age=clock()-Date.parse(snapshot.observed_at);if(age<0||age>60000)throw Error('Ereignis ist nicht aktuell');
  const signature=await cryptoApi.subtle.sign('Ed25519',privateKey,new TextEncoder().encode(canonical));
  return Object.freeze({algorithm:'Ed25519',key_id:keyId,event:snapshot,signature:encodeSignature(signature)});
 }});
}
export function createSignedEventVerifier({trustedKeys,cryptoApi=crypto,clock=()=>Date.now()}={}){
 const pinned=new Map(trustedKeys instanceof Map?trustedKeys:Object.entries(trustedKeys||{}));
 return Object.freeze({async verify(envelope){
  try{
   if(!envelope||envelope.algorithm!=='Ed25519'||typeof envelope.signature!=='string'||envelope.signature.length>128)return false;
   const key=pinned.get(envelope.key_id);if(!key)return false;
   const canonical=canonicalPetEvent(envelope.event),age=clock()-Date.parse(envelope.event.observed_at);
   if(age<0||age>60000)return false;
   return await cryptoApi.subtle.verify('Ed25519',key,decodeSignature(envelope.signature),new TextEncoder().encode(canonical));
  }catch{return false;}
 }});
}
