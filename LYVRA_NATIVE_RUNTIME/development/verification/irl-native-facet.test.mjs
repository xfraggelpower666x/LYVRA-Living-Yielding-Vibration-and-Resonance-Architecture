import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../../',import.meta.url);
const read=p=>readFileSync(new URL(p,root),'utf8');
const contract=read('facets/irl/FACET_CONTRACT.md');
const registry=read('current/governance/FACET_SUB_LIFECIRCLE_REGISTRY.md');
const visual=read('current/visual/SEMANTIC_CYBER_FIELD_LOCAL_ADAPTIVE_VISUAL_CONTRACT.md');
const state=JSON.parse(read('facets/irl/CURRENT_STATE.json'));
const ledger=JSON.parse(read('facets/irl/LEARNING_LEDGER.json'));
const manifest=JSON.parse(read('REHYDRATION_MANIFEST.json'));
for(const [name,ok] of [
['native facet registered',registry.includes('FACET_ID = INTELLIGENT_RESEARCH_AND_LEARNING')],
['single Whole authority',contract.includes('DECISION_AUTHORITY: LYVRA_ONLY')],
['not a root',contract.includes('IRL_NE_ROOT_SYSTEM = TRUE')],
['not a router',contract.includes('IRL_NE_ROUTER_OR_AGENT = TRUE')],
['parent first',manifest.irl_native_facet_integration_2026_10_17.whole_first],
['visual existing engine',visual.includes('NO_SECOND_VISUAL_ENGINE = true')],
['five choice preserved',visual.includes('PRESERVE_FIVE_CHOICE_TERMINAL = true')],
['research method provenance',ledger.entries[0].observations.interactive_page_listings===30],
['method not universalized',ledger.global_learning_promoted===false],
['positive source limitation',state.evidence_case.direct_observed_page_listings===30],
['negative no auto foreground',contract.includes('RESEARCH_NE_AUTOMATIC_FACET_FOREGROUND = TRUE')],
['negative no foreign write',contract.includes('NO_FOREIGN_REPOSITORY_MUTATION = TRUE')],
['negative missing host pass',state.plugin_host==='NOT_VERIFIED'],
['negative no automatic independent proof',contract.includes('NO_AUTOMATIC_INDEPENDENCE_CLAIM.')]
])test(name,()=>assert.ok(ok,name));
