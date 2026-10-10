// LYVRA verification capability — real composed execution, NOT an autonomous daemon.
// Receives evidence from existing LYVRA callers; NEVER acquires runtime or decision authority.
import {verifyCommunication,verifyVisualStatus,verifyFacetRelations,verifyEvidence} from './semantic-causal-verifier.mjs';
import {inspectClaim} from './evidence-bound-verifier.mjs';
import {verifyProvenance,verifyCausalDecision,inspectLifeCircleManifest} from './provenance-causal-lifecircle-verifier.mjs';
import {bindProviderReadback,assessCausalSupport} from './provider-observation-adapter.mjs';
export const RUNNER_BOUNDARIES=Object.freeze({owner:'WHOLE_LYVRA',new_system:false,daemon:false,router:false,blocks_communications:false,issues_orders:false,foreign_mutations:false,auto_promotions:false});
const plain=v=>v&&typeof v==='object'&&!Array.isArray(v);
const statuses=Object.freeze({SOURCE:'SOURCE_ONLY',SEMANTIC:'HYPOTHESIS_ONLY',RUNTIME:'NOT_OBSERVED'});
export function runVerification(input={}){
 const data=plain(input)?input:{};
 const source=plain(data.source)?data.source:{};
 const facets=plain(data.facets)?data.facets:{};
 const communication=verifyCommunication(data.communication);
 const visual=verifyVisualStatus(data.visual);
 const relations=verifyFacetRelations(facets);
 // W01 booleans are descriptive only: never promote to trusted host proof.
 const evidence=verifyEvidence(data.evidence);
 const provider=bindProviderReadback(data.provider);
 const provenance=verifyProvenance(data.provenance_claim||{},Array.isArray(data.provider_ledger)?data.provider_ledger:[]);
 const causal=verifyCausalDecision(data.causal);
 const counter=assessCausalSupport(data.counterhypothesis);
 const lifecircle=inspectLifeCircleManifest({manifest:data.manifest,loaded:data.loaded_carriers,currentness_observed:data.currentness_observed===true});
 const claims=Array.isArray(data.claims)?data.claims.map(c=>inspectClaim(c)):[];
 const issues=[];
 const item=(key,x)=>{for(const code of [...(x.issues||[]),...(x.violations||[])])issues.push({area:key,code})};
 for(const [k,x] of Object.entries({communication,visual,relations,evidence,provider,provenance,causal,counter,lifecircle}))item(k,x);
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
  results:{communication,visual,relations,evidence,provider,provenance,causal,counter,lifecircle,claims},
  issues,proof_stages:statuses,host_runtime_verified:false,ci_verified:false,
  communications_blocked:false,facet_activated:false,mutation:false,
  next:'Use independent provider/host evidence and user-authorized native integration, not booleans or historical status cards'
 };
}
