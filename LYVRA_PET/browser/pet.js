const sprite=document.getElementById("sprite");const label=document.getElementById("state");let manifest=null,timer=null,frame=0;async function boot(){manifest=await fetch("sprite-manifest.json").then(r=>r.json());if(pageClosed)return;if(expressionSequence===0&&bridgeSequence===0)setSemanticState("idle");document.querySelectorAll("[data-state]").forEach(b=>b.addEventListener("click",()=>setSemanticState(b.dataset.state)));}function setSemanticState(semantic){if(pageClosed)return;interruptExpression();++bridgeSequence;if(primaryBridge){primaryBridge.dispose();primaryBridge=null;}const target=manifest.routing[semantic]||"idle";const cfg=manifest.states[target]||manifest.states.idle;frame=0;clearInterval(timer);sprite.dataset.effect=(semantic==="heart"||semantic==="glitch")?semantic:"";label.textContent="MANUAL PREVIEW · "+semantic.toUpperCase()+" → "+target.toUpperCase();draw(cfg);timer=setInterval(()=>{frame=(frame+1)%cfg.frames;draw(cfg)},1000/cfg.fps);}function draw(cfg){sprite.style.backgroundPosition=`-${frame*manifest.cell.width}px -${cfg.row*manifest.cell.height}px`;}
let primaryBridge=null,contextSource=null,bridgeSequence=0,pageClosed=false,expressionSequence=0,evidenceConnectionSequence=0;
function interruptExpression(){++expressionSequence;if(evidenceEffects)evidenceEffects.reset();if(expressionEffects)expressionEffects.set({});}
function stopPrimaryAnimation(){++bridgeSequence;if(primaryBridge){primaryBridge.dispose();primaryBridge=null;}clearInterval(timer);}
const bridgeReady=Promise.all([import("../bridge/primary-controller.mjs"),import("../bridge/context-source.mjs")]).then(([controllerModule,sourceModule])=>{
  contextSource=sourceModule.createContextSource({fetchJson:sourceModule.publicGithubJson});
  return controllerModule;
});
async function acceptNativeContext(context="idle",intensity=0.5){
  if(pageClosed)return false;interruptExpression();
  const ticket=++bridgeSequence;
  try{
    const module=await bridgeReady;
    if(pageClosed||!manifest||ticket!==bridgeSequence)return false;
    clearInterval(timer);
    if(!primaryBridge)primaryBridge=module.bindPrimaryBrowser({sprite,label,manifest,verifySource:contextSource.verifySource});
    const envelope=await contextSource.produce(context,intensity);
    if(pageClosed||ticket!==bridgeSequence||!primaryBridge)return false;
    const accepted=await primaryBridge.accept(envelope);
    if(pageClosed||ticket!==bridgeSequence)return false;
    if(accepted)label.textContent="QUELLE GEPRÜFT · EXPLIZITER KONTEXT · "+context.toUpperCase();
    return accepted;
  }catch(error){
    if(ticket===bridgeSequence){if(primaryBridge){primaryBridge.dispose();primaryBridge=null;}setSemanticState("idle");label.textContent="NATIVE IDLE · QUELLE NICHT VERFÜGBAR";}
    return false;
  }
}
window.lyvraPetPrimary=Object.freeze({acceptContext:acceptNativeContext,instance:"PRIMARY_NATIVE",gptRequired:false,memoryInference:false});
window.addEventListener("pagehide",()=>{pageClosed=true;++expressionSequence;++evidenceConnectionSequence;++bridgeSequence;if(primaryBridge)primaryBridge.dispose();clearInterval(timer);});
bridgeReady.catch(()=>{sprite.dataset.bridgeStatus="UNAVAILABLE";});

boot().catch(err=>{label.textContent="RENDERER ERROR";console.error(err)});

let expressionEffects=null,evidenceEffects=null;
const effectsReady=import("../bridge/expression-effects.mjs").then(module=>{
 if(pageClosed)return null;
 const stage=document.createElement("div");Object.assign(stage.style,{position:"relative",width:"320px",height:"300px",margin:"auto",overflow:"visible"});
 sprite.parentNode.insertBefore(stage,sprite);stage.append(sprite);Object.assign(sprite.style,{position:"absolute",left:"64px",top:"46px",margin:"0"});
 expressionEffects=module.mountExpressionEffects(stage,{heartX:.5,heartY:.32});
 return expressionEffects;
});
window.lyvraPetExpression=Object.freeze({
 async preview(event){if(pageClosed)return false;const ticket=++expressionSequence;stopPrimaryAnimation();if(evidenceEffects)evidenceEffects.reset();const snapshot={...event};const effects=await effectsReady;if(pageClosed||ticket!==expressionSequence||!effects)return false;const state=effects.set(snapshot);label.textContent="AUSDRUCKSVORSCHAU · "+state.facet+" · "+state.gesture;return {...state,newGestureFramesAvailable:false};},
 async setBeat(bpm){const effects=await effectsReady;if(pageClosed||!effects)return false;effects.setBeat(bpm);return true;},
 instance:"PRIMARY_NATIVE",gptRequired:false,
 async connectEvidence({getRevision,verifyEvidence}){if(typeof getRevision!=="function"||typeof verifyEvidence!=="function")throw Error("Native Quellenprüfer erforderlich");if(pageClosed)throw Error("Renderer geschlossen");const ticket=++evidenceConnectionSequence;if(evidenceEffects)evidenceEffects.dispose();const [effects,module]=await Promise.all([effectsReady,import("../bridge/evidence-effect-controller.mjs")]);if(pageClosed||ticket!==evidenceConnectionSequence||!effects)throw Error("Verbindung abgebrochen");stopPrimaryAnimation();evidenceEffects=module.createEvidenceEffectController({effects,getRevision,verifyEvidence});return evidenceEffects;}
});
effectsReady.catch(()=>{sprite.dataset.effectsStatus="UNAVAILABLE";});
window.addEventListener("pagehide",()=>{if(evidenceEffects)evidenceEffects.dispose();if(expressionEffects)expressionEffects.dispose();});

// Branding aus dem gelieferten ZIP; die Pet-Sprites bleiben unverändert.
Promise.all([import("../assets/logo-assets.mjs"),effectsReady]).then(([{LOGO_ASSETS}])=>{if(pageClosed)return;const logo=document.createElement("img");logo.src="data:image/png;base64,"+LOGO_ASSETS["app-logo.png"].base64;logo.alt="L.Y.V.R.A. Logo";logo.width=56;logo.height=56;logo.style.display="block";logo.style.margin="0 auto 10px";sprite.parentNode.parentNode.insertBefore(logo,sprite.parentNode);}).catch(()=>{sprite.dataset.logoStatus="UNAVAILABLE";});
