// LYVRA R39 - quellengetreue Funktionsauszuege aus R26, ohne fremde Runtime.
// Funktionen: R13 ingestAnalyticsEvidence + learningProbe,
// R08 newLearningRegistry/evaluateReuse, R04 researchCostGate.
// Originaldateien im R26-Paket bleiben unveraendert; isolierte Vergleichstests
// muessen die Ergebnisse gegen die Originalimporte pruefen.
import {SIX} from './r38_original_r26/always-on-impact-r09.mjs';
const HASH=/^[a-f0-9]{64}$/;
const fail=(msg)=>{throw new Error(msg)};

// Original R13 — analytics evidence only; no Suno-provider connection.
export function ingestAnalyticsEvidence({kind,sourceId,sourceUrl=null,sourceRevision,observedAt,contentDigest,assertion,confidence='OBSERVED',costUSD=0,completeReadback=false}={}){
 if(!['SUNO_MONITOR','RESEARCH','RENDERER','USER_AUDIO_OBSERVATION'].includes(kind)||!sourceId||!sourceRevision||!observedAt||!HASH.test(contentDigest||'')||!assertion||costUSD!==0)fail('ANALYTICS_EVIDENCE_INVALID');
 if(!['OBSERVED','HYPOTHESIS','VALIDATED'].includes(confidence))fail('INVALID_CONFIDENCE');
 if(confidence==='VALIDATED'&&!completeReadback)fail('UNVERIFIED_PROMOTION');
 return {schema:'LYVRA_R13_ANALYTICS_EVIDENCE',kind,sourceId,sourceUrl,sourceRevision,observedAt,contentDigest,assertion,confidence,sourceComplete:completeReadback,independentHostVerification:false,trackDesignTakeover:false,wholeAuthority:'LYVRA_ONLY',costUSD};
}
// Original R04 — operation-specific zero-cost gate. 0 is not inferred.
export function researchCostGate({tool,operation,priceUSD,costChecked,authorization}={}){
 if(!tool||!operation||costChecked!==true||typeof priceUSD!=='number'||priceUSD<0)return {allowed:false,status:'COST_UNVERIFIED'};
 if(priceUSD!==0)return {allowed:false,status:authorization===true?'OWNER_APPROVAL_REQUIRES_GOVERNED_ACTION':'ZERO_ADDITIONAL_COST_BLOCK'};
 return {allowed:true,status:'ZERO_COST_VERIFIED_FOR_OPERATION'};
}
// R08 source extract — immutable query, no new experience silently promoted.
const SCHEMA='LYVRA_PARALLEL_CAUSAL_LEARNING_R08';
export function newLearningRegistry(){return {schema:SCHEMA,revision:0,owner:'WHOLE_LYVRA',returnForeground:'LYVRA_ANALYTICS',entries:[],events:[],automaticPromotion:false,productiveWrites:0,strands:[...SIX]};}
const must=(x,k)=>{if(typeof x!=='string'||!x.trim())throw Error('MISSING_'+k);};
function validateRegistry(r){if(!r||r.schema!==SCHEMA||!Array.isArray(r.entries)||!Array.isArray(r.events)||!Number.isInteger(r.revision))throw Error('INVALID_REGISTRY');return r;}
const contextMatch=(required,actual)=>Object.entries(required).every(([k,v])=>Object.hasOwn(actual,k)&&actual[k]===v);
export function evaluateReuse(registry,{problemKey,strand,context,sourceRevision}={}){
 validateRegistry(registry);must(problemKey,'PROBLEM_KEY');if(!SIX.includes(strand)||!context||typeof context!=='object'||Array.isArray(context))throw Error('BAD_REUSE_QUERY');
 const matches=registry.entries.filter(e=>e.problemKey===problemKey&&contextMatch(e.conditions,context));
 const classified=matches.map(e=>{const stale=!!sourceRevision&&e.sourceRevision!==sourceRevision;const eligible=e.stage==='VALIDATED'||e.stage==='INTEGRATED';
 const verified=e.observedOutcome==='SUCCESS'&&!!e.outcomeReadback&&!e.hasContradiction&&eligible&&!stale&&(!e.expiryAt||Date.parse(e.expiryAt)>Date.now());
 return {caseId:e.caseId,method:e.method,stage:e.stage,source:e.source,sourceRevision:e.sourceRevision,evidenceId:e.evidenceId,conditions:e.conditions,observedOutcome:e.observedOutcome,stale,contradicted:!!e.hasContradiction,eligibleForProposedReuse:verified,confidenceClass:verified?'CONTEXTUAL_VERIFIED_LEARNING':stale?'STALE_REVALIDATE':e.hasContradiction?'CONFLICT_QUARANTINE':'EVIDENCE_ONLY'};});
 return {schema:'LYVRA_R08_REUSE_ASSESSMENT',problemKey,strand,matchingCases:classified,proposals:classified.filter(x=>x.eligibleForProposedReuse),skipDuplicateDiagnostics:classified.some(x=>x.eligibleForProposedReuse),automaticExecute:false,automaticWrites:false,requiresNewScopedAuthorization:true,returnForeground:'LYVRA_ANALYTICS'};
}
// Original R13 — causal learning gate, keeps CodeForge boundaries independent.
export function learningProbe({problemKey,strand,context,sourceRevision,registry=newLearningRegistry()}={}){
 const result=evaluateReuse(registry,{problemKey,strand,context,sourceRevision});return {...result,codeforgeReview:'PENDING_EVIDENCE_CHECK',superCodeforgeReview:'PENDING_INDEPENDENT_BOUNDARY_CHECK',automaticExecute:false};
}
