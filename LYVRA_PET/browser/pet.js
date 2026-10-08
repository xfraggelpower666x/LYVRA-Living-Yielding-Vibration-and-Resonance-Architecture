const sprite=document.getElementById("sprite");const label=document.getElementById("state");let manifest=null,timer=null,frame=0;async function boot(){manifest=await fetch("sprite-manifest.json").then(r=>r.json());setSemanticState("idle");document.querySelectorAll("[data-state]").forEach(b=>b.addEventListener("click",()=>setSemanticState(b.dataset.state)));}function setSemanticState(semantic){++bridgeSequence;if(primaryBridge){primaryBridge.dispose();primaryBridge=null;}const target=manifest.routing[semantic]||"idle";const cfg=manifest.states[target]||manifest.states.idle;frame=0;clearInterval(timer);sprite.dataset.effect=(semantic==="heart"||semantic==="glitch")?semantic:"";label.textContent="MANUAL PREVIEW · "+semantic.toUpperCase()+" → "+target.toUpperCase();draw(cfg);timer=setInterval(()=>{frame=(frame+1)%cfg.frames;draw(cfg)},1000/cfg.fps);}function draw(cfg){sprite.style.backgroundPosition=`-${frame*manifest.cell.width}px -${cfg.row*manifest.cell.height}px`;}
let primaryBridge=null,contextSource=null,bridgeSequence=0;
const bridgeReady=Promise.all([import("../bridge/primary-controller.mjs"),import("../bridge/context-source.mjs")]).then(([controllerModule,sourceModule])=>{
  contextSource=sourceModule.createContextSource({fetchJson:sourceModule.publicGithubJson});
  return controllerModule;
});
async function acceptNativeContext(context="idle",intensity=0.5){
  const ticket=++bridgeSequence;
  try{
    const module=await bridgeReady;
    if(!manifest||ticket!==bridgeSequence)return false;
    clearInterval(timer);
    if(!primaryBridge)primaryBridge=module.bindPrimaryBrowser({sprite,label,manifest,verifySource:contextSource.verifySource});
    const envelope=await contextSource.produce(context,intensity);
    if(ticket!==bridgeSequence||!primaryBridge)return false;
    const accepted=await primaryBridge.accept(envelope);
    if(accepted)label.textContent="QUELLE GEPRÜFT · EXPLIZITER KONTEXT · "+context.toUpperCase();
    return accepted;
  }catch(error){
    if(ticket===bridgeSequence){if(primaryBridge){primaryBridge.dispose();primaryBridge=null;}setSemanticState("idle");label.textContent="NATIVE IDLE · QUELLE NICHT VERFÜGBAR";}
    return false;
  }
}
window.lyvraPetPrimary=Object.freeze({acceptContext:acceptNativeContext,instance:"PRIMARY_NATIVE",gptRequired:false,memoryInference:false});
window.addEventListener("pagehide",()=>{++bridgeSequence;if(primaryBridge)primaryBridge.dispose();clearInterval(timer);});
bridgeReady.catch(()=>{sprite.dataset.bridgeStatus="UNAVAILABLE";});

boot().catch(err=>{label.textContent="RENDERER ERROR";console.error(err)});
