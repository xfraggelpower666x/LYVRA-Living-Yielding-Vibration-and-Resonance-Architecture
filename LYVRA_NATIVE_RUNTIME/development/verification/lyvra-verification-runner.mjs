// LYVRA verification capability — real composed execution, NOT an autonomous daemon.
// Receives evidence from existing LYVRA callers; NEVER acquires runtime or decision authority.
import {verifyCommunication,verifyVisualStatus,verifyFacetRelations,verifyEvidence} from './semantic-causal-verifier.mjs';
import {inspectClaim} from './evidence-bound-verifier.mjs';
import {verifyProvenance,verifyCausalDecision,inspectLifeCircleManifest} from './provenance-causal-lifecircle-verifier.mjs';
import {bindProviderReadback,assessCausalSupport} from './provider-observation-adapter.mjs';
import {inspectCooperation} from './cooperation-continuity-verifier.mjs';
export const RUNNER_BOUNDARIES=Object.freeze({owner:'WHOLE_LYVRA',new_system:false,daemon:false,router:false,blocks_communications:false,issues_orders:false,foreign_mutations:false,auto_promotions:false});
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const statuses=Object.freeze({SOURCE:'SOURCE_ONLY',SEMANTIC:'HYPOTHESIS_ONLY',RUNTIME:'NOT_OBSERVED'});
export function runVerification(input={}){
 const data=plain(input)?input:{};
 const source=plain(data.source)?data.source:{};
 const facets=plain(data.facets)?data.facets:{};
 // Raw caller flags and JSON ledgers are claims, not authenticated provider/host evidence.
 // Keep source stage diagnostics; no caller may elevate to RECEIPT, ADOPTED or HOST_VERIFIED.
 const communicationClaim=verifyCommunication(data.communication);
 const communication={...communicationClaim,
  stage:communicationClaim.stage==='PREPARED'?'PREPARED':'CALLER_REPORTED_'+communicationClaim.stage,
  classification:'UNVERIFIED_CALLER_CLAIM',automatic_transport_verified:false,
  issues:[...communicationClaim.issues,'COMMUNICATION_EVIDENCE_NOT_INDEPENDENTLY_ATTESTED']};
 const visualClaim=verifyVisualStatus(data.visual);
 const visual={...visualClaim,status:visualClaim.status==='FAIL'?'FAIL':'UNVERIFIED_VISUAL_CLAIM',
  render_evidence:false,issues:[...visualClaim.issues,'VISUAL_RENDER_NOT_INDEPENDENTLY_ATTESTED']};
 const relations=verifyFacetRelations(facets);
 const crossSurfaceCooperation=inspectCooperation(data.cooperation_input);
 // W01 booleans are descriptive claims, even if internally coherent.
 const evidenceClaim=verifyEvidence(data.evidence);
 const evidence={...evidenceClaim,status:evidenceClaim.status==='PARTIAL'?'PARTIAL':'UNVERIFIED_CALLER_CLAIM',
  issues:['SEMANTIC_OR_RUNTIME_FLAGS_NOT_AUTHENTICATED']};
 const provider=bindProviderReadback(data.provider);
 // Do not allow untrusted input.provider_ledger to bypass W05 via W03.
 const provenanceClaim=verifyProvenance(data.provenance_claim||{},[]);
 const provenance={...provenanceClaim,
  issues:[...provenanceClaim.issues,...(Array.isArray(data.provider_ledger)&&data.provider_ledger.length?['CALLER_PROVIDER_LEDGER_NOT_TRUSTED']:[])]};
 const causal=verifyCausalDecision(data.causal);
 const counter=assessCausalSupport(data.counterhypothesis);
 // Loaded carrier provider_readback flags are caller-controlled, just like provider_ledger.
 // Actual checkout-carrier evidence stays in the separate CI manifest source report.
 const callerCarriers=Array.isArray(data.loaded_carriers)?data.loaded_carriers:[];
 const lifecircleClaim=inspectLifeCircleManifest({manifest:data.manifest,loaded:[],currentness_observed:false});
 const lifecircle={...lifecircleClaim,issues:[...(lifecircleClaim.issues||[]),
  ...(callerCarriers.some(x=>x&&x.provider_readback===true)?['CALLER_CARRIER_READBACK_NOT_AUTHENTICATED']:[])],
  carrier_claims_supplied:callerCarriers.length,caller_carrier_readback_trusted:false};
 const claims=Array.isArray(data.claims)?data.claims.map(c=>inspectClaim(c)):[];
 const issues=[];
 const item=(key,x)=>{for(const code of [...(x.issues||[]),...(x.violations||[])])issues.push({area:key,code})};
 for(const [k,x] of Object.entries({communication,visual,relations,crossSurfaceCooperation,evidence,provider,provenance,causal,counter,lifecircle}))item(k,x);
 claims.forEach((c,i)=>item('claims_'+i,c));
 // Caller data is never allowed to assert observed host facts via flags or self-attestations.
 // CI acceptance requires an independent GitHub Actions readback and is not implemented here.
 const requiredAreas=['source','manifest','causal','counterhypothesis','facets','communication','visual','provider'];
 const missingInputs=requiredAreas.filter(k=>!Object.hasOwn(data,k));
 const verdict=issues.length?'REVIEW':missingInputs.length?'PARTIAL':'SOURCE_DIAGNOSTIC_COMPLETE_RUNTIME_OPEN';
 return {
  contract:'LYVRA_VERIFICATION_RUNNER_V1',
  owner:'WHOLE_LYVRA',verdict,
  input_completeness:{provided:requiredAreas.length-missingInputs.length,required:requiredAreas.length,missingInputs},
  source:{reference:source.reference??null,expected_head:source.expected_head??null,integrity:'NOT_INDEPENDENTLY_AUTHENTICATED_BY_RUNNER'},
  results:{communication,visual,relations,crossSurfaceCooperation,evidence,provider,provenance,causal,counter,lifecircle,claims},
  cooperation:{status:'ADVISORY_ONLY',provider_bound:false,host_bound:false,
   caller_claims_not_authentication:true,authorized_channels_untouched:true,
   channel_discovery:'OPEN_NOT_GATEKEEPED',foreign_authority_transfer:false,
   peer_reports_are_not_commands:true,worker_failure_must_not_block_communications:true},
  issues,proof_stages:statuses,host_runtime_verified:false,ci_verified:false,
  communications_blocked:false,facet_activated:false,mutation:false,
  next:'Use independent provider/host evidence and user-authorized native integration, not booleans or historical status cards'
 };
}
