import assert from 'node:assert/strict';
import {projectR51NativeFacetMenu} from './dual-layer-visual-projection.mjs';
// Original production-source imports are preserved by this test; its execution needs the full original checkout.
const head='6337840188b0f2b15ef070f9872f65b0ae2bba53';
const pointerBlob='87b6d6cfd400e3866b211bb8b49d683098fbff65';
const registry=[
{id:'LYVRA_MAIN',sourceReadback:true,registrationReadback:true,hostExecutable:true},
{id:'TRACK_DESIGN',sourceReadback:true,registrationReadback:true,hostExecutable:true},
{id:'LYVRA_ANALYTICS',label:'Analytics',trigger:'LYVRA MUSIC ANALYTICS',family:'EVIDENCE',sourceReadback:true,registrationReadback:true,hostExecutable:false}
];
let checks=0;
const ok=(condition)=>{assert.ok(condition);checks++};
const reject=(fn)=>{assert.throws(fn);checks++};
const r=projectR51NativeFacetMenu({currentHead:head,pointerBlob,wholeReadback:true,registry,candidates:[{id:'VISUAL_ATELIER',label:'Visual Atelier',evidenceRef:'R05_ISOLATED_SOURCE'}]});
ok(r.coreFourPreserved===true);
ok(r.cards.length===6);
ok(r.cards.find(x=>x.id==='TRACK_DESIGN').extraVisuals.includes('DIAGRAMS'));
ok(r.cards.find(x=>x.id==='LYVRA_ANALYTICS').extraVisuals.includes('DIAGRAMS'));
ok(r.cards.find(x=>x.id==='VISUAL_ATELIER').actionEnabled===false);
ok(r.cards.find(x=>x.id==='TRACK_DESIGN').readiness==='SOURCE_BOUND_HOST_PENDING');
ok(r.cards.find(x=>x.id==='TRACK_DESIGN').hostVerified===false);

ok(r.cards.find(x=>x.id==='VISUAL_ATELIER').trigger===null);
ok(r.cards.find(x=>x.id==='SUNO_STUDIO_2').readiness==='READBACK_PENDING');
ok(r.cards.every(x=>x.textFallback));
ok(r.hostAccepted===false&&r.noAutomaticActivation===true);
reject(()=>projectR51NativeFacetMenu({currentHead:head,pointerBlob,wholeReadback:false}));
reject(()=>projectR51NativeFacetMenu({currentHead:head,pointerBlob,wholeReadback:true,registry,candidates:[{id:'VISUAL_ATELIER'}]}));
reject(()=>projectR51NativeFacetMenu({currentHead:head,pointerBlob,wholeReadback:true,registry,candidates:[{id:'TRACK_DESIGN',evidenceRef:'bad'}]}));
// R54: source-bound registry ambiguity must never silently select one core claim.
reject(()=>projectR51NativeFacetMenu({currentHead:head,pointerBlob,wholeReadback:true,registry:[...registry,{...registry[0],hostExecutable:false}]}));
reject(()=>projectR51NativeFacetMenu({currentHead:head,pointerBlob,wholeReadback:true,registry:[...registry,{...registry[2]}]}));
reject(()=>projectR51NativeFacetMenu({currentHead:head,pointerBlob,wholeReadback:true,registry:[...registry,{id:'',sourceReadback:true}]}));
console.log(JSON.stringify({result:'PASS',checks,scope:'R51_ORIGINAL_MODULE_NODE_REGRESSION_NOT_HOST',hostAccepted:false}));
