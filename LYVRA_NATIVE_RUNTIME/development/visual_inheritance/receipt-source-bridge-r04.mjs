// LYVRA Visual Continuity R04: source-backed read-only contextual receipts.
// NO second visual engine; use R03's projectOperationsCenterFromReadbacks for bound receipts.
import { createHash } from 'node:crypto';
import { projectOperationsCenterFromReadbacks } from './receipt-intake-r03.mjs';
const sha40 = /^[a-f0-9]{40}$/;
const nativeRoot = 'LYVRA_NATIVE_RUNTIME/';
const contextRoots = [nativeRoot, 'WEBLyvra/'];
export function gitBlobSha(bytes) {
  const b=Buffer.isBuffer(bytes)?bytes:Buffer.from(bytes);
  return createHash('sha1').update(Buffer.from(`blob ${b.length}\0`)).update(b).digest('hex');
}
function validatedSource(receipt, trusted) {
  if (!receipt || !trusted || typeof receipt.path !== 'string' || !contextRoots.some(p=>receipt.path.startsWith(p)) || receipt.path.includes('..'))throw new TypeError('invalid source path');
  if (!sha40.test(trusted.head||'') || !sha40.test(trusted.blob_sha||'') || !Buffer.isBuffer(receipt.bytes))throw new TypeError('missing HEAD / raw bytes');
  if (trusted.path!==receipt.path || trusted.ref_head!==trusted.head || gitBlobSha(receipt.bytes)!==trusted.blob_sha)throw new TypeError('independent git blob mismatch');
  let payload;try{payload=JSON.parse(receipt.bytes.toString('utf8'));}catch{throw new TypeError('unparseable receipt');}
  return {path:receipt.path,blob_sha:trusted.blob_sha,head:trusted.head,payload};
}
// Display older receipts as contextual provenance only, never as claimed adoption/host PASS.
export function contextualReceiptInventory(ledger, receipts, expectedHead) {
  if (ledger?.schema!=='LYVRA_DEVELOPMENT_CONTINUITY_V1' || !Array.isArray(ledger.records))throw new TypeError('invalid ledger');
  if (!sha40.test(expectedHead||''))throw new TypeError('invalid expected head');
  const seen=new Set();const context=[];const accepted=[];
  for (const r of receipts) {
    const source=validatedSource(r,r.trusted);
    const key=source.path+'@'+source.blob_sha;
    if(seen.has(key))throw new TypeError('duplicate source');seen.add(key);
    if(source.head!==expectedHead)throw new TypeError('stale source head');
    const matched=ledger.records.find(x=>x.id===source.payload.record_id && x.origin?.evidence_id===source.payload.evidence_id);
    if(matched && source.payload.kind==='source' && source.payload.status==='VERIFIED' && source.payload.source_head===expectedHead && source.path.startsWith(nativeRoot) && source.payload.receipt_id) {
      accepted.push({record_id:matched.id,kind:'source',path:source.path,blob_sha:source.blob_sha,fetched_blob_sha:source.blob_sha,payload:source.payload,receipt_id:source.payload.receipt_id});
    } else {
      context.push({path:source.path,blob_sha:source.blob_sha,classification:'HISTORICAL_OR_UNBOUND_CONTEXT',status:'NOT_A_CONTINUITY_RECEIPT'});
    }
  }
  return {accepted,context};
}
export function projectOperationsCenterFromOriginals(registry,ledger,receipts=[],expectedHead='') {
  const {accepted,context}=contextualReceiptInventory(ledger,receipts,expectedHead);
  const view=projectOperationsCenterFromReadbacks(registry,ledger,accepted,{source_head:expectedHead});
  return {...view,historical_context:context,source_receipts_accepted:accepted.length,provenance_not_delivery:true,host_not_inferred:true};
}
