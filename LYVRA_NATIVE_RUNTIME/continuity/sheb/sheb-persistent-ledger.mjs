// Storage-independent SHEB ledger: persistence is provided by a caller-owned repository adapter.
// No delivery can be claimed without an actual recipient readback.
import {validateHandoff,transitionReceipt,classifyIntake} from './sheb-core.mjs';
export function createShebLedger({read,write}={}){
 if(typeof read!=='function'||typeof write!=='function')throw Error('PERSISTENCE_ADAPTER_REQUIRED');
 const pathFor=m=>'LYVRA_NATIVE_RUNTIME/continuity/sheb/mailboxes/'+encodeURIComponent(m.receiver)+'/'+encodeURIComponent(m.workspace_id)+'/'+encodeURIComponent(m.lineage_id)+'/'+encodeURIComponent(m.handoff_id)+'-v'+m.version+'.json';
 return Object.freeze({
  async send(message){
   const m=validateHandoff(message),path=pathFor(m);
   const old=await read(path);
   if(old){const kind=classifyIntake(m,old.message);return {status:kind==='DUPLICATE'?'DUPLICATE':'QUARANTINED',path};}
   const record={message:m,delivery:'SENT',receipt:null};
   try{await write(path,record,{createOnly:true});}catch{return {status:'WRITE_BLOCKED',path};}
   const check=await read(path);
   if(!check||classifyIntake(m,check.message)!=='DUPLICATE')return {status:'WRITE_BLOCKED',path};
   return {status:'SENT',path};
  },
  async receive(path,{receiver,readbackEvidence}={}){
   const record=await read(path);if(!record)return {status:'NOT_FOUND'};
   const m=validateHandoff(record.message);
   if(receiver!==m.receiver||typeof readbackEvidence!=='string'||!readbackEvidence.trim())return {status:'RECEIPT_BLOCKED'};
   const receipt=transitionReceipt(m,'SENT','RECEIVED',{recipientReadback:true});
   const next={...record,delivery:'RECEIVED',receipt:{...receipt,evidence:readbackEvidence}};
   try{await write(path,next,{expected:record});}catch{return {status:'WRITE_BLOCKED'};}
   const check=await read(path);
   if(check?.delivery!=='RECEIVED'||check?.receipt?.evidence!==readbackEvidence)return {status:'WRITE_BLOCKED'};
   return {status:'RECEIVED',receipt:check.receipt};
  },
  async recover(paths){
   const pending=[];
   for(const path of paths){const record=await read(path);if(record?.delivery==='SENT'||record?.delivery==='RECEIVED')pending.push({path,state:record.delivery,receiver:record.message.receiver});}
   return pending;
  }
 });
}
