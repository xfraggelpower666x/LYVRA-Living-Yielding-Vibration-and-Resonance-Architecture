// Additive adapter: strict, read-only evidence ingestion for existing R02 view.
// Caller MUST supply independently fetched receipt bytes and actual verified blob SHAs.
import {projectOperationsCenterContinuity} from './operations-continuity-view.mjs';
const KINDS=new Set(['source','delivery','adoption','host']);
const SHA=/^[a-f0-9]{40}$/;
const freeze = x => Object.freeze(x);
function validateInput(r, ledger, known){
 if(!r || !KINDS.has(r.kind) || typeof r.record_id!=='string')throw new TypeError('invalid receipt kind/id');
 const item=ledger.records.find(x=>x.id===r.record_id);
 if(!item)throw new TypeError('unregistered record');
 if(!SHA.test(r.blob_sha||'') || r.blob_sha!==r.fetched_blob_sha)throw new TypeError('receipt bytes not read back');
 if(typeof r.path!=='string'||!r.path.startsWith('LYVRA_NATIVE_RUNTIME/')||r.path.includes('..'))throw new TypeError('invalid native receipt path');
 if(!r.payload||r.payload.record_id!==r.record_id||r.payload.kind!==r.kind || r.payload.status!=='VERIFIED')throw new TypeError('receipt payload mismatch');
 if(r.payload.source_head !== known.source_head || !SHA.test(known.source_head||''))throw new TypeError('noncurrent or unverified source head');
 if(!r.payload.receipt_id || r.payload.receipt_id!==r.receipt_id)throw new TypeError('invalid receipt id');
 if(r.kind==='source' && r.payload.evidence_id!==item.origin.evidence_id)throw new TypeError('wrong source evidence');
 if((r.kind==='delivery'||r.kind==='adoption') && (item.handoff.status==='NOT_SENT'||item.handoff.receipt!==r.receipt_id))throw new TypeError('handoff has no matching verified sent receipt');
 if(r.kind==='host' && (!r.payload.test_receipt||r.payload.host_status!=='PASS'))throw new TypeError('unverified host execution');
 return item;
}
export function bindVerifiedReceipts(ledger, receipts=[], known={}){
 if(ledger?.schema!=='LYVRA_DEVELOPMENT_CONTINUITY_V1'||!Array.isArray(ledger.records))throw new TypeError('invalid continuity ledger');
 if(!Array.isArray(receipts))throw new TypeError('receipts must be array');
 const evidence=Object.create(null), seen=new Set();
 for(const receipt of receipts){
  validateInput(receipt,ledger,known);
  const key=receipt.record_id+':'+receipt.kind;
  if(seen.has(key))throw new TypeError('duplicate receipt kind');seen.add(key);
  const r=evidence[receipt.record_id]??=Object.create(null);
  if(receipt.kind==='source')r.source=freeze({status:'VERIFIED',evidence_id:receipt.payload.evidence_id,readback_id:receipt.blob_sha});
  if(receipt.kind==='delivery')r.delivery=freeze({status:'VERIFIED',receipt_id:receipt.receipt_id,readback_id:receipt.blob_sha});
  if(receipt.kind==='adoption')r.adoption=freeze({status:'VERIFIED',receipt_id:receipt.receipt_id,readback_id:receipt.blob_sha});
  if(receipt.kind==='host')r.host=freeze({status:'VERIFIED',test_receipt:receipt.payload.test_receipt,readback_id:receipt.blob_sha});
 }
 return evidence;
}
export function projectOperationsCenterFromReadbacks(registry, ledger, receipts=[], known={}){
 const evidence=bindVerifiedReceipts(ledger,receipts,known);
 return projectOperationsCenterContinuity(registry,ledger,evidence);
}
