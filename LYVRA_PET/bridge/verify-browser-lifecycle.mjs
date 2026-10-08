import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../browser/pet.js',import.meta.url),'utf8');
const flush=()=>new Promise(resolve=>setImmediate(resolve));
function setup(){
 const waits=new Map(),listeners={},calls=[];let mounts=0,controllers=0;
 const sprite={style:{},dataset:{},parentNode:{insertBefore(){}}},label={};
 const modules={
 '../bridge/primary-controller.mjs':{bindPrimaryBrowser:()=>({dispose(){},accept:async()=>true})},
 '../bridge/context-source.mjs':{createContextSource:()=>({produce:async()=>({}),verifySource:async()=>true})},
 '../bridge/expression-effects.mjs':{mountExpressionEffects:()=>{mounts++;return {set:x=>(calls.push(x),{facet:x.facet||'whole',gesture:'idle'}),setBeat(){},dispose(){calls.push('dispose')}};}},
 '../bridge/evidence-effect-controller.mjs':{createEvidenceEffectController:()=>{controllers++;return {reset(){calls.push('reset')},dispose(){calls.push('controller-dispose')}};}}
 };
 const context={window:{addEventListener:(name,fn)=>(listeners[name]??=[]).push(fn)},document:{getElementById:id=>id==='sprite'?sprite:label,querySelectorAll:()=>[],createElement:()=>({style:{},append(){}})},fetch:async()=>({json:async()=>({routing:{idle:'idle'},states:{idle:{row:0,frames:1,fps:1}},cell:{width:192,height:208}})}),console,setInterval:()=>1,clearInterval(){},importModule:name=>new Promise(resolve=>{const list=waits.get(name)||[];list.push(()=>resolve(modules[name]));waits.set(name,list);})};
 vm.runInNewContext(source.replaceAll('import(', 'importModule('),context);
 return {window:context.window,calls,get mounts(){return mounts},get controllers(){return controllers},close:()=>listeners.pagehide.forEach(fn=>fn()),resolve:name=>{for(const fn of waits.get(name)||[])fn();waits.delete(name);}};
}
const closed=setup();closed.close();closed.resolve('../bridge/expression-effects.mjs');closed.resolve('../bridge/primary-controller.mjs');closed.resolve('../bridge/context-source.mjs');await flush();assert.equal(closed.mounts,0);assert.equal(await closed.window.lyvraPetExpression.preview({}),false);assert.equal(await closed.window.lyvraPetExpression.setBeat(150),false);
const live=setup();const first=live.window.lyvraPetExpression.preview({facet:'track_design'}),second=live.window.lyvraPetExpression.preview({facet:'speech_design'});live.resolve('../bridge/expression-effects.mjs');await flush();assert.equal(await first,false);assert.equal((await second).facet,'speech_design');assert.equal(live.calls.at(-1).facet,'speech_design');
const a=live.window.lyvraPetExpression.connectEvidence({getRevision(){},verifyEvidence(){}}).catch(error=>error.message);
const b=live.window.lyvraPetExpression.connectEvidence({getRevision(){},verifyEvidence(){}});live.resolve('../bridge/evidence-effect-controller.mjs');await flush();assert.equal(await a,'Verbindung abgebrochen');await b;assert.equal(live.controllers,1);live.close();assert.equal(live.calls.at(-1),'dispose');
console.log('PASS browser late module after close; latest preview wins; competing connections; beat after close; renderer cleanup');
