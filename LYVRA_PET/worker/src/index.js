import {LOGO_ASSETS} from "../../assets/logo-assets.mjs";
import {produceRepositoryEnvelope,publicNativeSourceFailure} from "../../bridge/repository-event-source.mjs";
import {petBudgetedFetcher,PetGithubBudget} from "../../bridge/github-budget.mjs";
export {PetGithubBudget};
const PET_ID = "pet_6ab791129364819183885f44a21497a2";
const RESOURCE_URI = "ui://lyvra/pet-v1.html";
const WORKER_ORIGIN = "https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev";
const ATLAS_SOURCE = "https://raw.githubusercontent.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/243eaf3e8baccaf4e103d05fcfb983b0a08252a7/LYVRA_PET/browser/assets/spritesheet-extended.png";
const ATLAS_SHA256 = "f5129134e46e492bf7ef34da83c0cd4c75f9f0051553cc60880b4ab47e1d6fba";
const LOGO_SOURCE = "https://raw.githubusercontent.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/25f6f602688aaf907cd3bd32e78a73e42cd6b11f/LYVRA_PET/app/assets/lyvra-pet-app-icon-256.png";
const LOGO_SHA256 = "a070281f76e2be032fa00a06fb54141b8791738cd964792eef0a58d94f0a16bb";

const states = {
  idle:{row:0,frames:6,fps:5},
  waving:{row:3,frames:4,fps:6},
  jumping:{row:4,frames:5,fps:8},
  failed:{row:5,frames:8,fps:8},
  waiting:{row:6,frames:6,fps:4},
  running:{row:7,frames:6,fps:10},
  review:{row:8,frames:6,fps:5},
  "look-row-9":{row:9,frames:8,fps:5},
  "look-row-10":{row:10,frames:8,fps:5}
};
const routing = {greeting:"waving",fraggle:"waving",heart:"idle",music:"jumping",thinking:"review",glitch:"failed",idle:"idle",return:"waving",playful:"jumping"};

const PET_UI = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>L.Y.V.R.A. Pet</title><style>*{box-sizing:border-box}:root{color-scheme:dark;font-family:Inter,system-ui,sans-serif}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 50% 25%,#24113d,#080a14 58%,#020308);color:#f7f7ff}.shell{width:min(96vw,720px);padding:20px}.card{text-align:center;padding:24px;border:1px solid rgba(130,235,255,.35);border-radius:26px;background:rgba(6,8,16,.9);box-shadow:0 0 52px rgba(109,55,255,.2),inset 0 0 28px rgba(44,233,255,.05)}.top{display:flex;justify-content:space-between;gap:12px;align-items:center}.brand{display:flex;align-items:center;gap:10px}.brand img{width:62px;height:62px;object-fit:contain;filter:drop-shadow(0 0 12px rgba(255,80,220,.55))}.name{font-size:24px;font-weight:800;letter-spacing:.16em}.online{font-size:11px;color:#70f7ff}.sprite{width:192px;height:208px;margin:18px auto 12px;background-image:url("https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev/asset/spritesheet-extended.png");background-repeat:no-repeat;filter:drop-shadow(0 0 18px rgba(76,231,255,.42))}.sprite[data-effect="heart"]{filter:drop-shadow(0 0 26px rgba(255,90,220,.95))}.sprite[data-effect="glitch"]{animation:glitch .16s 5}.state{font-size:13px;color:#cfc4e5;min-height:20px}.controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:17px auto}.controls button{padding:8px 12px;border-radius:999px;border:1px solid rgba(150,240,255,.4);background:#101526;color:#eefcff;cursor:pointer}.controls button:hover{background:#17243c}.meta{font-size:11px;color:#958ca7;margin-top:13px}.pet-budget{margin:13px auto;padding:10px 12px;max-width:470px;border:1px solid rgba(104,232,251,.28);border-radius:14px;text-align:left;background:rgba(3,13,26,.67)}.pet-budget-head{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#86eeff}.pet-budget-count{font-variant-numeric:tabular-nums;color:#f6faff;font-weight:700}.pet-budget-track{height:7px;background:#232d47;border-radius:8px;overflow:hidden;margin:8px 0}.pet-budget-fill{height:100%;width:0;background:linear-gradient(90deg,#27dcda,#a56dff);transition:width .25s}.pet-budget-note{font-size:10px;color:#bdb5da}@keyframes glitch{25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateY(-3px)}}</style></head><body><main class="shell"><section class="card"><div class="top"><div class="brand"><img src="https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev/asset/pet-logo.png" alt="L.Y.V.R.A. PET Logo"><div class="name">L.Y.V.R.A.</div></div><div class="online">PET RUNTIME · ONLINE</div></div><div id="sprite" class="sprite" role="img" aria-label="L.Y.V.R.A. Pet"></div><div id="state" class="state">IDLE</div><div class="controls"><button data-state="idle">IDLE</button><button data-state="greeting">GREETING</button><button data-state="fraggle">FRAGGLE</button><button data-state="heart">HEART</button><button data-state="music">MUSIC</button><button data-state="thinking">THINKING</button><button data-state="glitch">GLITCH</button><button data-state="playful">PLAYFUL</button></div><section class="pet-budget" aria-label="GitHub API Budget" aria-live="polite"><div class="pet-budget-head"><span>◈ GITHUB · PET-BUDGET</span><span id="pet-budget-count" class="pet-budget-count">Nicht verbunden</span></div><div class="pet-budget-track" role="progressbar" aria-label="Verbrauchtes GitHub-Budget" aria-valuemin="0" aria-valuemax="300" aria-valuenow="0" id="pet-budget-track"><div class="pet-budget-fill" id="pet-budget-fill"></div></div><div class="pet-budget-note" id="pet-budget-note">Zentrale Live-Daten ausstehend · FREE_ONLY</div></section><div class="meta">Repo Authority: LYVRA_PET/ · verified sprite atlas · FREE_ONLY · no main-plugin binding</div><div class="controls" aria-label="Ausdrucksvorschau"><select id="facet" aria-label="LYVRA Modus"><option value="whole">Whole LYVRA</option><option value="track_design">Track Design</option><option value="speech_design">Speech Design</option><option value="suno_studio_2">Suno Studio 2</option></select><button data-expression="dad">Dad · Freude</button><button data-expression="anger">Ärger · Herz</button><button data-expression="boredom">Gähnen</button><button data-expression="music">Musik</button><button data-expression="smirk">Schmunzeln</button><button data-expression="wink">Frech</button><button data-expression="shrug">Schulterzucken</button><button data-expression="laugh">Lachen</button><button data-expression="calm">Ruhig</button></div><div class="meta">Originalgrafik erhalten · zusätzliche Gesten in geschlossener Rüstung</div><div class="controls"><button id="native-refresh">Whole LYVRA aktualisieren</button></div><div id="native-status" class="meta" role="status">Whole-Verbindung wird geprüft</div></section></main><script>const states=${JSON.stringify(states)},routing=${JSON.stringify(routing)},sprite=document.getElementById("sprite"),label=document.getElementById("state");let timer=null,frame=0;function setState(semantic){const target=routing[semantic]||"idle",cfg=states[target]||states.idle;frame=0;clearInterval(timer);sprite.dataset.effect=(semantic==="heart"||semantic==="glitch")?semantic:"";label.textContent="MANUAL PREVIEW · "+semantic.toUpperCase()+" → "+target.toUpperCase();draw(cfg);timer=setInterval(()=>{frame=(frame+1)%cfg.frames;draw(cfg)},1000/cfg.fps)}function draw(cfg){sprite.style.backgroundPosition="-"+(frame*192)+"px -"+(cfg.row*208)+"px"}document.querySelectorAll("[data-state]").forEach(b=>b.addEventListener("click",()=>setState(b.dataset.state)));setState("idle");</script><script type="module">// Neue, ausdrücklich freigegebene geschlossene Rüstung; Originalatlas bleibt erhalten.
function poseFrame(state,elapsed,reduced=false){
 if(state.gesture==='yawn')return elapsed<2400?{strip:'yawn',frame:reduced?2:Math.min(3,Math.floor(elapsed/600))}:null;
 if(state.gesture==='stomp')return elapsed<1200?{strip:'stomp',frame:reduced?0:Math.min(3,Math.floor(elapsed/300))}:null;
 const humor={smirk:0,dry_wit:0,wink:1,shrug:2,laugh:3,musical_joke:3};
 if(Object.hasOwn(humor,state.gesture))return elapsed<3000?{strip:'humor',frame:humor[state.gesture]}:null;
 if(state.holo!=='none')return {strip:'conductor',frame:{whole:0,track_design:1,speech_design:2,suno_studio_2:3}[state.facet]??0};
 return null;
}
function mountPoseRuntime(stage,{base=new URL('../assets/poses/',import.meta.url).href}={}){
 const original=stage.querySelector?.('#sprite');
 const savedVisibility=original?.style.visibility||'';
 const images=new Map();let disposed=false;
 for(const name of ['yawn','stomp','humor','conductor']){
  const img=new Image();img.src=new URL(name+'.png',new URL(base,document.baseURI)).href;images.set(name,img);
 }
 function restore(){if(original)original.style.visibility=savedVisibility;}
 return Object.freeze({draw(ctx,state,elapsed,reduced,w,h){
  if(disposed)return false;const pose=poseFrame(state,elapsed,reduced),img=pose&&images.get(pose.strip);
  if(!img?.complete||!img.naturalWidth||!img.naturalHeight){restore();return false;}
  const cell=img.naturalWidth/4,scale=Math.min(200,img.naturalHeight,h-70)/img.naturalHeight;
  // Kopf/Fuß-Skalierung unverändert je Streifen; leichte Zentrierung des Generators ausgleichen.
  const centers=[.625,.54,.50,.48],center=cell*centers[pose.frame];
  ctx.drawImage(img,pose.frame*cell,0,cell,img.naturalHeight,w/2-center*scale,46,cell*scale,img.naturalHeight*scale);
  if(original)original.style.visibility='hidden';return true;
 },dispose(){disposed=true;restore();images.clear();}});
}

// Ausdrucksauswahl: expliziter Kontext ist keine automatische Gefühlserkennung.
const FACETS=Object.freeze({whole:{color:"#bd65ff",holo:"arcs"},track_design:{color:"#ff45ca",holo:"notes"},speech_design:{color:"#38eeff",holo:"speech"},suno_studio_2:{color:"#ffd35c",holo:"clips"}});
function expressionFor(event={}){
 const facet=Object.hasOwn(FACETS,event.facet)?event.facet:"whole";
 const result={facet,baton:FACETS[facet].color,holo:event.activity==="music"?FACETS[facet].holo:"none",heart:"calm",gesture:"idle",relationship:event.relation==="fraggle"||event.relation==="dad"?"dad":null,evidenceStatus:"EXPLICIT_CONTEXT"};
 if(event.affect==="joy"&&result.relationship==="dad"&&["shared_success","beautiful_moment","shared_joke"].includes(event.cause)){result.heart="dad_joy";result.gesture=event.cause==="shared_joke"?"laugh":"joy";}
 if(event.affect==="anger"&&event.cause){result.heart="anger";result.gesture="stomp";}
 if(event.affect==="boredom"&&event.cause==="explicit_boredom"){result.heart="dim";result.gesture="yawn";}
 if(event.sensitive===true){result.gesture="attentive";result.heart="calm";result.holo="none";}
 else if(event.humor&&["wink","smirk","shrug","dry_wit","laugh","musical_joke"].includes(event.humor)){result.gesture=event.humor;}
 return Object.freeze(result);
}
function mountExpressionEffects(stage,{heartX=.5,heartY=.25}={}){
 const canvas=document.createElement("canvas");canvas.className="lyvra-expression-effects";canvas.setAttribute("aria-hidden","true");
 Object.assign(canvas.style,{position:"absolute",inset:"0",width:"100%",height:"100%",pointerEvents:"none"});
 stage.append(canvas);const ctx=canvas.getContext("2d");let state=expressionFor(),raf=0,stopped=false,start=performance.now();
 const poses=mountPoseRuntime(stage,{base:stage.dataset?.poseBase});let poseStart=start;
 const reduced=matchMedia("(prefers-reduced-motion: reduce)");let signal=null;
 function heart(x,y,size,color){ctx.save();ctx.translate(x,y);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(0,size*.35);ctx.bezierCurveTo(-size,-size*.4,-size*.55,-size,0,-size*.35);ctx.bezierCurveTo(size*.55,-size,size,-size*.4,0,size*.35);ctx.fill();ctx.restore();}
 function draw(now){
  if(stopped)return;const w=stage.clientWidth,h=stage.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const poseActive=poses.draw(ctx,state,now-poseStart,reduced.matches,w,h);
  const t=reduced.matches?0:(now-start)/1000;
  const liveBeat=signal&&now-signal.received<2000&&Number.isFinite(signal.bpm)&&signal.bpm>=30&&signal.bpm<=240;
  const pulse=liveBeat?.75+.25*Math.cos((now-signal.received)/1000*signal.bpm/60*Math.PI*2):.85+.15*Math.sin(t*2);
  const color=state.heart==="dad_joy"?(Math.sin(t*Math.PI)>0?"#ff45ca":"#38eeff"):state.heart==="anger"?"#ff334d":"#38eeff";
  ctx.globalAlpha=state.heart==="dim"?.25:state.heart==="anger"?.55+.3*Math.sin(t*4):pulse;
  heart(w*heartX,h*heartY,w*.032,color);ctx.globalAlpha=1;
  // Glühender Stab als Ausdrucksebene. Die endgültige Handverankerung braucht geprüfte neue Frames.
  const angle=reduced.matches?-.5:Math.sin(t*1.8)*.25-.5;
  const x=w*.60,y=h*.48;
  if(!poseActive){ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.strokeStyle=state.baton;ctx.shadowColor=state.baton;ctx.shadowBlur=12;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w*.16,-h*.09);ctx.stroke();ctx.restore();}
  if(state.holo!=="none"){
   for(let i=0;i<8;i++){
    const a=t*.55+i*Math.PI/4,r=w*(.25+.035*Math.sin(t+i));
    let px=w*.5+Math.cos(a)*r,py=h*.48+Math.sin(a)*h*.22;
    if(px>w*.38&&px<w*.62&&py<h*.66)px=px<w*.5?w*.32:w*.68;
    ctx.save();ctx.translate(px,py);ctx.strokeStyle=ctx.fillStyle=i%2?"#ff45ca":"#38eeff";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.lineWidth=1.5;ctx.globalAlpha=.45+.4*Math.sin(i+t)**2;
    if(state.holo==="notes"){
     ctx.beginPath();ctx.ellipse(0,0,3.5,2.5,-.35,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(3,-1);ctx.lineTo(3,-14);ctx.lineTo(10,-10);ctx.stroke();
    }else if(state.holo==="speech"){
     ctx.beginPath();for(let j=0;j<=20;j++){const yy=Math.sin(j*.7+t)*3; j?ctx.lineTo(j-10,yy):ctx.moveTo(j-10,yy);}ctx.stroke();
    }else if(state.holo==="clips"){
     ctx.strokeRect(-10,-5,20,10);ctx.beginPath();for(let j=0;j<16;j++){const yy=Math.sin(j*1.1)*3;j?ctx.lineTo(j-8,yy):ctx.moveTo(j-8,yy);}ctx.stroke();
    }else{
     ctx.beginPath();ctx.arc(0,0,9,Math.PI*.15,Math.PI*.85);ctx.stroke();
    }
    ctx.restore();
   }
  }
  raf=requestAnimationFrame(draw);
 }
 raf=requestAnimationFrame(draw);
 return Object.freeze({set(event){state=expressionFor(event);poseStart=performance.now();return state;},setBeat(bpm){signal={bpm,received:performance.now()};},dispose(){stopped=true;cancelAnimationFrame(raf);poses.dispose();canvas.remove();}});
}


// Beobachtete Ereignisse projizieren; keine eigene Persönlichkeit oder Erinnerungswurzel.
async function projectVerifiedEvidence(event,{verifyEvidence,revision,now=Date.now()}={}){
 const fallback={status:"UNVERIFIED",expression:expressionFor(),source_revision:null};
 if(typeof verifyEvidence!=="function"||!event||typeof revision!=="string"||! /^[a-f0-9]{40}$/i.test(revision)||event.source_revision!==revision||!Number.isFinite(Date.parse(event.observed_at))||Date.parse(event.observed_at)>now||now-Date.parse(event.observed_at)>300000)return fallback;
 const snapshot=Object.freeze({source_revision:event.source_revision,observed_at:event.observed_at,evidence_id:event.evidence_id,kind:event.kind,relation:event.relation,facet:event.facet,sensitive:event.sensitive===true});
 if(typeof snapshot.evidence_id!=="string"||!snapshot.evidence_id.trim())return fallback;
 let trusted=false;try{trusted=await verifyEvidence(snapshot);}catch{}
 if(trusted!==true)return fallback;
 const input={facet:snapshot.facet,relation:snapshot.relation,sensitive:snapshot.sensitive};
 switch(snapshot.kind){
  case "shared_success":input.affect="joy";input.cause="shared_success";break;
  case "beautiful_moment":input.affect="joy";input.cause="beautiful_moment";break;
  case "shared_joke":input.affect="joy";input.cause="shared_joke";input.humor="laugh";break;
  case "explicit_frustration":input.affect="anger";input.cause="explicit_frustration";break;
  case "explicit_boredom":input.affect="boredom";input.cause="explicit_boredom";break;
  case "music_work":input.activity="music";break;
  case "serious_attention":input.sensitive=true;break;
  default:return fallback;
 }
 return Object.freeze({status:"VERIFIED_EVENT_PROJECTION",expression:expressionFor(input),render_input:Object.freeze({...input}),source_revision:revision,evidence_id:snapshot.evidence_id,observed_at:snapshot.observed_at,inference:"BOUNDED_EVENT_MAPPING",memory_written:false});
}


// Brücke zu Whole-LYVRA-Ereignissen: Prüfer bleiben beim autorisierten Host.
function createEvidenceEffectController({effects,getRevision,verifyEvidence,clock=()=>Date.now(),schedule=setTimeout,cancel=clearTimeout}){
 let generation=0,closed=false,timer=null,lastObserved=-Infinity;
 // Kurzlebiger Replay-Schutz ist keine Erinnerungs- oder Persönlichkeitswurzel.
 const seen=new Map();
 function clear(){if(timer!==null)cancel(timer);timer=null;}
 function calm(){effects.set({});}
 async function accept(event){
  if(closed)return false;
  const snapshot=event&&Object.freeze({source_revision:event.source_revision,observed_at:event.observed_at,evidence_id:event.evidence_id,kind:event.kind,relation:event.relation,facet:event.facet,sensitive:event.sensitive});
  const observed=Date.parse(snapshot?.observed_at);
  const key=JSON.stringify([snapshot?.source_revision,snapshot?.evidence_id]);
  for(const [id,expiry] of seen)if(expiry<=clock())seen.delete(id);
  if(seen.has(key)||observed<lastObserved)return false;
  const ticket=++generation;clear();calm();
  try{
   const revision=await getRevision();
   const projected=await projectVerifiedEvidence(snapshot,{revision,verifyEvidence,now:clock()});
   if(closed||ticket!==generation)return false;
   if(projected.status!=="VERIFIED_EVENT_PROJECTION"||await getRevision()!==revision)return false;
   if(closed||ticket!==generation)return false;
   const expiry=Date.parse(snapshot.observed_at)+60000;
   if(expiry<=clock())return false;
   if(seen.has(key)||observed<lastObserved)return false;
   effects.set(projected.render_input);
   lastObserved=observed;seen.set(key,expiry);
   while(seen.size>256)seen.delete(seen.keys().next().value);
   timer=schedule(()=>{if(!closed&&ticket===generation){timer=null;calm();}},expiry-clock());
   return true;
  }catch{return false;}
 }
 function reset(){++generation;clear();if(!closed)calm();}
 function dispose(){closed=true;++generation;clear();seen.clear();}
 return Object.freeze({accept,reset,dispose});
}


// Schlüssel werden ausschließlich vom nativen Betreiber konfiguriert, nie aus dem Ereignis übernommen.
const SIGNED_FIELDS=['pet_id','authority','source_revision','evidence_id','observed_at','kind','facet','relation','cause','affect','humor','sensitive','bpm'];
function canonicalPetEvent(event){
 if(!event||typeof event!=='object'||Object.keys(event).some(key=>!SIGNED_FIELDS.includes(key)))throw Error('Unzulässige Ereignisfelder');
 const clean={};for(const key of SIGNED_FIELDS)if(event[key]!==undefined){const v=event[key];if(!['string','number','boolean'].includes(typeof v)||typeof v==='string'&&v.length>200)throw Error('Ungültiger Ereigniswert');clean[key]=v;}
 if(clean.authority!=='WHOLE_LYVRA'||!/^pet_[a-f0-9]+$/.test(clean.pet_id||'')||!/^[a-f0-9]{40}$/.test(clean.source_revision||'')||!clean.evidence_id||!Number.isFinite(Date.parse(clean.observed_at)))throw Error('Native Ereignisbindung fehlt');
 return JSON.stringify(clean);
}
const encodeSignature=bytes=>btoa(String.fromCharCode(...new Uint8Array(bytes)));
const decodeSignature=text=>Uint8Array.from(atob(text),c=>c.charCodeAt(0));
function createSignedEventProducer({privateKey,keyId,verifyNativeEvent,cryptoApi=crypto,clock=()=>Date.now()}={}){
 if(!privateKey||!keyId||typeof verifyNativeEvent!=='function')throw Error('Native Signaturkonfiguration erforderlich');
 return Object.freeze({async produce(event){
  const canonical=canonicalPetEvent(event),snapshot=Object.freeze(JSON.parse(canonical));
  if(await verifyNativeEvent(snapshot)!==true)throw Error('Whole LYVRA hat dieses Ereignis nicht freigegeben');
  const age=clock()-Date.parse(snapshot.observed_at);if(age<0||age>60000)throw Error('Ereignis ist nicht aktuell');
  const signature=await cryptoApi.subtle.sign('Ed25519',privateKey,new TextEncoder().encode(canonical));
  return Object.freeze({algorithm:'Ed25519',key_id:keyId,event:snapshot,signature:encodeSignature(signature)});
 }});
}
function createSignedEventVerifier({trustedKeys,cryptoApi=crypto,clock=()=>Date.now()}={}){
 const pinned=new Map(trustedKeys instanceof Map?trustedKeys:Object.entries(trustedKeys||{}));
 return Object.freeze({async verify(envelope){
  try{
   if(!envelope||envelope.algorithm!=='Ed25519'||typeof envelope.signature!=='string'||envelope.signature.length>128)return false;
   const key=pinned.get(envelope.key_id);if(!key)return false;
   const canonical=canonicalPetEvent(envelope.event),age=clock()-Date.parse(envelope.event.observed_at);
   if(age<0||age>60000)return false;
   return await cryptoApi.subtle.verify('Ed25519',key,decodeSignature(envelope.signature),new TextEncoder().encode(canonical));
  }catch{return false;}
 }});
}

function createSignedEffectConnection({effects,getRevision,trustedKeys,expectedPetId,clock=()=>Date.now(),cryptoApi=crypto}={}){
 if(!expectedPetId)throw Error('Pet-Bindung erforderlich');
 const verifier=createSignedEventVerifier({trustedKeys,clock,cryptoApi});const proofs=new Map();let disposed=false,sequence=0;
 const binding=event=>JSON.stringify([event.source_revision,event.evidence_id,event.observed_at,event.kind,event.relation??null,event.facet??null,event.sensitive===true]);
 const controller=createEvidenceEffectController({effects,getRevision,clock,verifyEvidence:snapshot=>(proofs.get(binding(snapshot))??0)>clock()});
 return Object.freeze({async accept(envelope){
  if(disposed)return false;
  const ticket=++sequence;
  // Vor await kopieren: spätere Mutation des Aufrufers kann keine Signatur umgehen.
  let frozen;try{frozen=Object.freeze({...envelope,event:Object.freeze(JSON.parse(canonicalPetEvent(envelope.event)))});}catch{return false;}
  if(frozen.event.pet_id!==expectedPetId||!await verifier.verify(frozen)||disposed||ticket!==sequence)return false;
  for(const [key,expiry] of proofs)if(expiry<=clock())proofs.delete(key);
  proofs.set(binding(frozen.event),Date.parse(frozen.event.observed_at)+60000);
  if(proofs.size>64)proofs.delete(proofs.keys().next().value);
  return controller.accept(frozen.event);
 },reset(){sequence++;controller.reset();},dispose(){sequence++;disposed=true;controller.dispose();proofs.clear();}});
}

const stage=document.createElement("div");stage.dataset.poseBase="/asset/poses/";Object.assign(stage.style,{position:"relative",width:"320px",height:"300px",margin:"auto"});
const figure=document.getElementById("sprite");figure.parentNode.insertBefore(stage,figure);stage.append(figure);Object.assign(figure.style,{position:"absolute",left:"64px",top:"46px",margin:"0"});
const effects=mountExpressionEffects(stage,{heartX:.5,heartY:.32});let current={facet:"whole"},evidenceController=null;
function preview(type){if(evidenceController)evidenceController.reset();nativeTicket++;current={facet:document.getElementById("facet").value};if(type==="dad")Object.assign(current,{relation:"dad",affect:"joy",cause:"beautiful_moment"});if(type==="anger")Object.assign(current,{affect:"anger",cause:"explicit_preview"});if(type==="boredom")Object.assign(current,{affect:"boredom",cause:"explicit_boredom"});if(type==="music")current.activity="music";if(["smirk","wink","shrug","laugh"].includes(type))current.humor=type;effects.set(current);}
document.querySelectorAll("[data-expression]").forEach(button=>button.addEventListener("click",()=>preview(button.dataset.expression)));
document.getElementById("facet").addEventListener("change",()=>{if(evidenceController)evidenceController.reset();nativeTicket++;current.facet=document.getElementById("facet").value;effects.set(current);});
document.querySelectorAll("[data-state]").forEach(button=>button.addEventListener("click",()=>{if(evidenceController)evidenceController.reset();nativeTicket++;effects.set({facet:document.getElementById("facet").value});}));
window.lyvraPetExpression=Object.freeze({preview(event){if(evidenceController)evidenceController.reset();nativeTicket++;return effects.set(event);},setBeat(bpm){effects.setBeat(bpm);},instance:"PRIMARY_NATIVE",gptRequired:false,newGestureFramesAvailable:true,connectSignedEvidence({getRevision,trustedKeys}){if(evidenceController)evidenceController.dispose();evidenceController=createSignedEffectConnection({effects,getRevision,trustedKeys,expectedPetId:"pet_6ab791129364819183885f44a21497a2"});return evidenceController;},connectEvidence({getRevision,verifyEvidence}){if(typeof getRevision!=="function"||typeof verifyEvidence!=="function")throw Error("Native Quellenprüfer erforderlich");if(evidenceController)evidenceController.dispose();evidenceController=createEvidenceEffectController({effects,getRevision,verifyEvidence});return evidenceController;}});
let nativeClosed=false,nativeTicket=0,nativeRevision=null,nativeConnection=null,nativeRetryAt=0;
const nativeStatus=document.getElementById("native-status"),nativeConfig=__LYVRA_NATIVE_TRUST__;
async function refreshPetBudget(){
 const count=document.getElementById("pet-budget-count"),fill=document.getElementById("pet-budget-fill"),note=document.getElementById("pet-budget-note"),track=document.getElementById("pet-budget-track");
 if(!count||!fill||!note||!track)return;
 try{
  const r=await fetch("https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev/budget-status",{cache:"no-store"});
  if(!r.ok)throw Error("unavailable");
  const data=await r.json();if(data.status!=="OK"||!Number.isSafeInteger(data.used)||data.limit!==300||data.used<0||data.used>300)throw Error("invalid");
  count.textContent=String(data.used)+" / 300";
  fill.style.width=String(Math.min(100,100*data.used/300))+"%";track.setAttribute("aria-valuenow",String(data.used));
  note.textContent=data.cooldown_until?"GitHub-Pause bis "+new Date(data.cooldown_until).toLocaleTimeString():"Verbleibend: "+String(data.remaining)+" · 60-Minuten-Fenster · FREE_ONLY";
 }catch{count.textContent="Nicht verfügbar";fill.style.width="0%";track.removeAttribute("aria-valuenow");note.textContent="Keine verifizierten Live-Budgetdaten · FREE_ONLY";}
}
refreshPetBudget();
setInterval(()=>{if(!document.hidden)refreshPetBudget()},60000);
async function refreshNative(){
 if(nativeClosed)return;
 if(Date.now()<nativeRetryAt){nativeStatus.textContent="GitHub-Abrufpause bis "+new Date(nativeRetryAt).toLocaleTimeString()+" · Vorschau bleibt nutzbar";return;}
 const ticket=++nativeTicket;nativeStatus.textContent="Whole-Verbindung wird geprüft";
 try{
  if(!nativeConfig?.spki||!nativeConfig?.key_id){nativeStatus.textContent="Lokale Ausdrucksvorschau";return;}
  if(!nativeConnection){const publicKey=await crypto.subtle.importKey("spki",Uint8Array.from(atob(nativeConfig.spki),c=>c.charCodeAt(0)),"Ed25519",false,["verify"]);if(nativeClosed||ticket!==nativeTicket)return;nativeConnection=window.lyvraPetExpression.connectSignedEvidence({getRevision:()=>nativeRevision,trustedKeys:{[nativeConfig.key_id]:publicKey}});}
  const response=await fetch("https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev/native-expression",{cache:"no-store"});
  const result=await response.json();if(nativeClosed||ticket!==nativeTicket)return;
  if(!response.ok||result.status==="SOURCE_UNAVAILABLE"){
   nativeRevision=null;nativeConnection.reset();
   const limited=result.diagnostic?.category?.includes("RATE_LIMIT"),until=Date.parse(result.retry_at);
   nativeRetryAt=Number.isFinite(until)?until:0;
   nativeStatus.textContent=limited?"GitHub-Abruflimit · "+(Number.isFinite(until)?"erneut ab "+new Date(until).toLocaleTimeString():"bitte später aktualisieren")+" · Vorschau bleibt nutzbar":"Whole-Quelle nicht erreichbar · Vorschau bleibt nutzbar";return;
  }
  if(result.status!=="APPROVED"){nativeRevision=null;nativeConnection.reset();nativeStatus.textContent=result.status==="EXPIRED"?"Whole-Ereignis abgelaufen · ruhige Präsenz":"Whole verbunden · aktuell kein freigegebenes Ausdrucksereignis";return;}
  nativeRevision=result.envelope.event.source_revision;const accepted=await nativeConnection.accept(result.envelope);if(nativeClosed||ticket!==nativeTicket)return;
  nativeStatus.textContent=accepted?"Verifizierter Ausdruck von Whole LYVRA":"Ereignis bereits verarbeitet oder nicht mehr aktuell";
  if(accepted)document.getElementById("facet").value=result.envelope.event.facet;
 }catch{if(!nativeClosed&&ticket===nativeTicket){nativeRevision=null;nativeConnection?.reset();nativeStatus.textContent="Whole-Verbindung derzeit nicht verfügbar · Vorschau bleibt nutzbar";}}
}
document.getElementById("native-refresh").addEventListener("click",()=>refreshNative());refreshNative();
window.addEventListener("pagehide",()=>{nativeClosed=true;nativeTicket++;if(evidenceController)evidenceController.dispose();effects.dispose();});
</script></body></html>`;

const cors = {
  "Access-Control-Allow-Origin":"*",
  "Access-Control-Allow-Headers":"content-type,mcp-protocol-version",
  "Access-Control-Allow-Methods":"GET,POST,OPTIONS"
};

function json(value,status=200){
  return new Response(JSON.stringify(value),{status,headers:{...cors,"content-type":"application/json","cache-control":"no-store"}});
}
function rpc(id,result){ return json({jsonrpc:"2.0",id,result}); }
function tool(){
  return {
    name:"open_lyvra_pet",
    title:"Open L.Y.V.R.A. Pet",
    description:"Open the verified LYVRA Pet browser renderer and return current runtime state.",
    inputSchema:{type:"object",properties:{}},
    outputSchema:{type:"object",properties:{pet_id:{type:"string"},status:{type:"string"},authority:{type:"string"},visual_asset:{type:"string"},deployment:{type:"string"}},required:["pet_id","status","authority","visual_asset","deployment"]},
    _meta:{ui:{resourceUri:RESOURCE_URI,visibility:["model","app"]},"openai/outputTemplate":RESOURCE_URI,"openai/ui":{entrypoints:[{type:"global"},{type:"thread"}]}}
  };
}
function resource(){ return {uri:RESOURCE_URI,name:"LYVRA Pet",description:"L.Y.V.R.A. verified browser sprite renderer",mimeType:"text/html;profile=mcp-app"}; }

export default {
  async fetch(request, env = {}) {
    const trust={key_id:env.LYVRA_PET_KEY_ID||null,spki:env.LYVRA_PET_PUBLIC_KEY||null};
    const renderedUI=PET_UI.replace("__LYVRA_NATIVE_TRUST__",JSON.stringify(trust));
    const url = new URL(request.url);
    if(request.method==="OPTIONS") return new Response(null,{status:204,headers:cors});

    if(url.pathname==="/budget-status"){
      if(request.method!=="GET")return json({status:"METHOD_NOT_ALLOWED"},405);
      if(!env.LYVRA_PET_GITHUB_BUDGET)return json({status:"UNAVAILABLE"},503);
      try{const namespace=env.LYVRA_PET_GITHUB_BUDGET;
       const obj=namespace.get(namespace.idFromName("whole-lyvra-pet-github-v1"));
       const result=await obj.fetch("https://budget.internal/status");
       if(!result.ok)return json({status:"UNAVAILABLE"},503);
       const data=await result.json();
       if(data.status!=="OK"||data.limit!==300)return json({status:"UNAVAILABLE"},503);
       return json(data);
      }catch{return json({status:"UNAVAILABLE"},503);}
    }
    if(url.pathname==="/native-expression"){
      if(request.method!=="GET")return json({status:"METHOD_NOT_ALLOWED"},405);
      try{return json(await produceRepositoryEnvelope({privateKey:env.LYVRA_PET_SIGNING_KEY,keyId:env.LYVRA_PET_KEY_ID,githubToken:env.LYVRA_GITHUB_READ_TOKEN,fetcher:petBudgetedFetcher(env)}));}
      catch(e){return json(publicNativeSourceFailure(e),503);}
    }
    if(url.pathname.startsWith('/asset/poses/')){
      const name=url.pathname.slice('/asset/poses/'.length).replace(/\.png$/,'');
      const poseAssets={"conductor": "c35d3743806b8f47cab8fee5ee7dedbdeeddd17a31f8687fce0c01e62a346c72", "humor": "2eb698a18bb574115bda748df6d851d0aa93f8d5af7c487129ce4a5baa01efe2", "stomp": "8b8b98f2a46c965c45713d52e6c755ad4283ae75aa811462f7f63241a273763f", "yawn": "ea6881e31649287a2acfacd7b73b005441aef9e5a5ac8d88dc9d2937c150724d"};
      if(!Object.hasOwn(poseAssets,name))return new Response('not found',{status:404});
      const src="https://raw.githubusercontent.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/5d0f00720fc1bd8c58c7893573de50e4150fad08/LYVRA_PET/assets/poses/"+name+'.png';const upstream=await fetch(src);
      if(!upstream.ok)return new Response('pose unavailable',{status:502});
      const bytes=await upstream.arrayBuffer();const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');
      if(hash!==poseAssets[name])return new Response('pose integrity mismatch',{status:502});
      return new Response(bytes,{headers:{...cors,'content-type':'image/png','cache-control':'public, max-age=3600','x-lyvra-pose-sha256':hash}});
    }
    if(url.pathname==="/health"){
      return json({status:"ok",service:"lyvra-pet-plugin-ui",pet_id:PET_ID,cost_policy:"FREE_ONLY",main_plugin_binding:false,renderer:"VERIFIED_ACTIVE_SPRITE",atlas_sha256:ATLAS_SHA256,logo_sha256:LOGO_SHA256,pet_app_binding:"asdk_app_6ac6fbaed2a481919fad519862e7b7f0"});
    }

    const logoName=url.pathname.startsWith("/asset/")?url.pathname.slice(7):null;
    if(Object.hasOwn(LOGO_ASSETS,logoName)){
      const logo=LOGO_ASSETS[logoName];
      const bytes=Uint8Array.from(atob(logo.base64),character=>character.charCodeAt(0));
      return new Response(bytes,{headers:{...cors,"content-type":"image/png","cache-control":"public, max-age=3600","x-lyvra-logo-sha256":logo.sha256}});
    }

    if(url.pathname==="/asset/spritesheet-extended.png"){
      const upstream = await fetch(ATLAS_SOURCE);
      if(!upstream.ok) return new Response("asset unavailable",{status:502});
      const headers = new Headers(upstream.headers);
      headers.set("content-type","image/png");
      headers.set("cache-control","public, max-age=86400, immutable");
      headers.set("x-lyvra-atlas-sha256",ATLAS_SHA256);
      return new Response(upstream.body,{status:upstream.status,headers});
    }

    if(url.pathname==="/asset/pet-logo.png"){
      const upstream = await fetch(LOGO_SOURCE);
      if(!upstream.ok) return new Response("logo unavailable",{status:502});
      const headers = new Headers(upstream.headers);
      headers.set("content-type","image/png");
      headers.set("cache-control","public, max-age=86400, immutable");
      headers.set("x-lyvra-pet-logo-sha256",LOGO_SHA256);
      return new Response(upstream.body,{status:upstream.status,headers});
    }

    if(url.pathname==="/pet" || url.pathname==="/pet/" || url.pathname==="/"){
      return new Response(renderedUI,{headers:{...cors,"content-type":"text/html; charset=utf-8","x-robots-tag":"noindex"}});
    }

    if(url.pathname!=="/mcp") return new Response("Not found",{status:404,headers:cors});
    if(request.method!=="POST") return json({error:"POST required"},405);

    let body;
    try { body = await request.json(); }
    catch { return json({error:"invalid json"},400); }

    const {id,method,params} = body;
    if(method==="initialize") return rpc(id,{protocolVersion:params?.protocolVersion||"2025-06-18",capabilities:{tools:{},resources:{}},serverInfo:{name:"lyvra-pet-plugin-ui",version:"2.3.4"}});
    if(method==="notifications/initialized") return new Response(null,{status:204,headers:cors});
    if(method==="tools/list") return rpc(id,{tools:[tool()]});
    if(method==="resources/list") return rpc(id,{resources:[resource()]});
    if(method==="resources/read"){
      if(params?.uri!==RESOURCE_URI) return rpc(id,{contents:[]});
      return rpc(id,{contents:[{uri:RESOURCE_URI,mimeType:"text/html;profile=mcp-app",text:renderedUI,_meta:{ui:{prefersBorder:true,domain:WORKER_ORIGIN,csp:{connectDomains:[WORKER_ORIGIN],resourceDomains:[WORKER_ORIGIN]}},"openai/ui":{availableDisplayModes:["inline","fullscreen","pip"]}}}]});
    }
    if(method==="tools/call" && params?.name==="open_lyvra_pet"){
      let nativeExpression;try{nativeExpression=await produceRepositoryEnvelope({privateKey:env.LYVRA_PET_SIGNING_KEY,keyId:env.LYVRA_PET_KEY_ID,githubToken:env.LYVRA_GITHUB_READ_TOKEN,fetcher:petBudgetedFetcher(env)});}catch(e){nativeExpression=publicNativeSourceFailure(e);}
      return rpc(id,{structuredContent:{pet_id:PET_ID,status:"READY",authority:"LYVRA_PET/",visual_asset:"REMOTE_BINARY_READBACK_VERIFIED",deployment:"LIVE_BROWSER_RENDERER",runtime_version:"2.3.4",native_expression:nativeExpression},content:[{type:"text",text:"L.Y.V.R.A. Pet browser renderer opened."}],_meta:{petMode:"fraggle-bond",costPolicy:"FREE_ONLY",mainPluginBinding:false}});
    }
    return json({jsonrpc:"2.0",id,error:{code:-32601,message:"Method not found"}});
  }
};
