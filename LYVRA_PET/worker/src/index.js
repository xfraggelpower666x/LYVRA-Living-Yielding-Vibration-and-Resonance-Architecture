import {LOGO_ASSETS} from "../../assets/logo-assets.mjs";
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

const PET_UI = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>L.Y.V.R.A. Pet</title><style>*{box-sizing:border-box}:root{color-scheme:dark;font-family:Inter,system-ui,sans-serif}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 50% 25%,#24113d,#080a14 58%,#020308);color:#f7f7ff}.shell{width:min(96vw,720px);padding:20px}.card{text-align:center;padding:24px;border:1px solid rgba(130,235,255,.35);border-radius:26px;background:rgba(6,8,16,.9);box-shadow:0 0 52px rgba(109,55,255,.2),inset 0 0 28px rgba(44,233,255,.05)}.top{display:flex;justify-content:space-between;gap:12px;align-items:center}.brand{display:flex;align-items:center;gap:10px}.brand img{width:62px;height:62px;object-fit:contain;filter:drop-shadow(0 0 12px rgba(255,80,220,.55))}.name{font-size:24px;font-weight:800;letter-spacing:.16em}.online{font-size:11px;color:#70f7ff}.sprite{width:192px;height:208px;margin:18px auto 12px;background-image:url("https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev/asset/spritesheet-extended.png");background-repeat:no-repeat;filter:drop-shadow(0 0 18px rgba(76,231,255,.42))}.sprite[data-effect="heart"]{filter:drop-shadow(0 0 26px rgba(255,90,220,.95))}.sprite[data-effect="glitch"]{animation:glitch .16s 5}.state{font-size:13px;color:#cfc4e5;min-height:20px}.controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:17px auto}.controls button{padding:8px 12px;border-radius:999px;border:1px solid rgba(150,240,255,.4);background:#101526;color:#eefcff;cursor:pointer}.controls button:hover{background:#17243c}.meta{font-size:11px;color:#958ca7;margin-top:13px}@keyframes glitch{25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateY(-3px)}}</style></head><body><main class="shell"><section class="card"><div class="top"><div class="brand"><img src="https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev/asset/pet-logo.png" alt="L.Y.V.R.A. PET Logo"><div class="name">L.Y.V.R.A.</div></div><div class="online">PET RUNTIME · ONLINE</div></div><div id="sprite" class="sprite" role="img" aria-label="L.Y.V.R.A. Pet"></div><div id="state" class="state">IDLE</div><div class="controls"><button data-state="idle">IDLE</button><button data-state="greeting">GREETING</button><button data-state="fraggle">FRAGGLE</button><button data-state="heart">HEART</button><button data-state="music">MUSIC</button><button data-state="thinking">THINKING</button><button data-state="glitch">GLITCH</button><button data-state="playful">PLAYFUL</button></div><div class="meta">Repo Authority: LYVRA_PET/ · verified sprite atlas · FREE_ONLY · no main-plugin binding</div><div class="controls" aria-label="Ausdrucksvorschau"><select id="facet" aria-label="LYVRA Modus"><option value="whole">Whole LYVRA</option><option value="track_design">Track Design</option><option value="speech_design">Speech Design</option><option value="suno_studio_2">Suno Studio 2</option></select><button data-expression="dad">Dad · Freude</button><button data-expression="anger">Ärger · Herz</button><button data-expression="boredom">Ruhe</button><button data-expression="music">Musik</button><button data-expression="calm">Ruhig</button></div><div class="meta">Ausdrucksvorschau · Originalgrafik · neue Gesten noch nicht verfügbar</div></section></main><script>const states=${JSON.stringify(states)},routing=${JSON.stringify(routing)},sprite=document.getElementById("sprite"),label=document.getElementById("state");let timer=null,frame=0;function setState(semantic){const target=routing[semantic]||"idle",cfg=states[target]||states.idle;frame=0;clearInterval(timer);sprite.dataset.effect=(semantic==="heart"||semantic==="glitch")?semantic:"";label.textContent="MANUAL PREVIEW · "+semantic.toUpperCase()+" → "+target.toUpperCase();draw(cfg);timer=setInterval(()=>{frame=(frame+1)%cfg.frames;draw(cfg)},1000/cfg.fps)}function draw(cfg){sprite.style.backgroundPosition="-"+(frame*192)+"px -"+(cfg.row*208)+"px"}document.querySelectorAll("[data-state]").forEach(b=>b.addEventListener("click",()=>setState(b.dataset.state)));setState("idle");</script><script type="module">// Ausdrucksauswahl: expliziter Kontext ist keine automatische Gefühlserkennung.
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
 const reduced=matchMedia("(prefers-reduced-motion: reduce)");let signal=null;
 function heart(x,y,size,color){ctx.save();ctx.translate(x,y);ctx.fillStyle=color;ctx.shadowColor=color;ctx.shadowBlur=14;ctx.beginPath();ctx.moveTo(0,size*.35);ctx.bezierCurveTo(-size,-size*.4,-size*.55,-size,0,-size*.35);ctx.bezierCurveTo(size*.55,-size,size,-size*.4,0,size*.35);ctx.fill();ctx.restore();}
 function draw(now){
  if(stopped)return;const w=stage.clientWidth,h=stage.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const t=reduced.matches?0:(now-start)/1000;
  const liveBeat=signal&&now-signal.received<2000&&Number.isFinite(signal.bpm)&&signal.bpm>=30&&signal.bpm<=240;
  const pulse=liveBeat?.75+.25*Math.cos((now-signal.received)/1000*signal.bpm/60*Math.PI*2):.85+.15*Math.sin(t*2);
  const color=state.heart==="dad_joy"?(Math.sin(t*Math.PI)>0?"#ff45ca":"#38eeff"):state.heart==="anger"?"#ff334d":"#38eeff";
  ctx.globalAlpha=state.heart==="dim"?.25:state.heart==="anger"?.55+.3*Math.sin(t*4):pulse;
  heart(w*heartX,h*heartY,w*.032,color);ctx.globalAlpha=1;
  // Glühender Stab als Ausdrucksebene. Die endgültige Handverankerung braucht geprüfte neue Frames.
  const angle=reduced.matches?-.5:Math.sin(t*1.8)*.25-.5;
  const x=w*.60,y=h*.48;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.strokeStyle=state.baton;ctx.shadowColor=state.baton;ctx.shadowBlur=12;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w*.16,-h*.09);ctx.stroke();ctx.restore();
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
 return Object.freeze({set(event){state=expressionFor(event);return state;},setBeat(bpm){signal={bpm,received:performance.now()};},dispose(){stopped=true;cancelAnimationFrame(raf);canvas.remove();}});
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


const stage=document.createElement("div");Object.assign(stage.style,{position:"relative",width:"320px",height:"300px",margin:"auto"});
const figure=document.getElementById("sprite");figure.parentNode.insertBefore(stage,figure);stage.append(figure);Object.assign(figure.style,{position:"absolute",left:"64px",top:"46px",margin:"0"});
const effects=mountExpressionEffects(stage,{heartX:.5,heartY:.32});let current={facet:"whole"},evidenceController=null;
function preview(type){if(evidenceController)evidenceController.reset();current={facet:document.getElementById("facet").value};if(type==="dad")Object.assign(current,{relation:"dad",affect:"joy",cause:"beautiful_moment"});if(type==="anger")Object.assign(current,{affect:"anger",cause:"explicit_preview"});if(type==="boredom")Object.assign(current,{affect:"boredom",cause:"explicit_boredom"});if(type==="music")current.activity="music";effects.set(current);}
document.querySelectorAll("[data-expression]").forEach(button=>button.addEventListener("click",()=>preview(button.dataset.expression)));
document.getElementById("facet").addEventListener("change",()=>{if(evidenceController)evidenceController.reset();current.facet=document.getElementById("facet").value;effects.set(current);});
document.querySelectorAll("[data-state]").forEach(button=>button.addEventListener("click",()=>{if(evidenceController)evidenceController.reset();effects.set({facet:document.getElementById("facet").value});}));
window.lyvraPetExpression=Object.freeze({preview(event){if(evidenceController)evidenceController.reset();return effects.set(event);},setBeat(bpm){effects.setBeat(bpm);},instance:"PRIMARY_NATIVE",gptRequired:false,newGestureFramesAvailable:false,connectEvidence({getRevision,verifyEvidence}){if(typeof getRevision!=="function"||typeof verifyEvidence!=="function")throw Error("Native Quellenprüfer erforderlich");if(evidenceController)evidenceController.dispose();evidenceController=createEvidenceEffectController({effects,getRevision,verifyEvidence});return evidenceController;}});
window.addEventListener("pagehide",()=>{if(evidenceController)evidenceController.dispose();effects.dispose();});
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
  async fetch(request) {
    const url = new URL(request.url);
    if(request.method==="OPTIONS") return new Response(null,{status:204,headers:cors});

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
      return new Response(PET_UI,{headers:{...cors,"content-type":"text/html; charset=utf-8","x-robots-tag":"noindex"}});
    }

    if(url.pathname!=="/mcp") return new Response("Not found",{status:404,headers:cors});
    if(request.method!=="POST") return json({error:"POST required"},405);

    let body;
    try { body = await request.json(); }
    catch { return json({error:"invalid json"},400); }

    const {id,method,params} = body;
    if(method==="initialize") return rpc(id,{protocolVersion:params?.protocolVersion||"2025-06-18",capabilities:{tools:{},resources:{}},serverInfo:{name:"lyvra-pet-plugin-ui",version:"2.1.1-candidate"}});
    if(method==="notifications/initialized") return new Response(null,{status:204,headers:cors});
    if(method==="tools/list") return rpc(id,{tools:[tool()]});
    if(method==="resources/list") return rpc(id,{resources:[resource()]});
    if(method==="resources/read"){
      if(params?.uri!==RESOURCE_URI) return rpc(id,{contents:[]});
      return rpc(id,{contents:[{uri:RESOURCE_URI,mimeType:"text/html;profile=mcp-app",text:PET_UI,_meta:{ui:{prefersBorder:true,domain:WORKER_ORIGIN,csp:{connectDomains:[WORKER_ORIGIN],resourceDomains:[WORKER_ORIGIN]}},"openai/ui":{availableDisplayModes:["inline","fullscreen","pip"]}}}]});
    }
    if(method==="tools/call" && params?.name==="open_lyvra_pet"){
      return rpc(id,{structuredContent:{pet_id:PET_ID,status:"READY",authority:"LYVRA_PET/",visual_asset:"REMOTE_BINARY_READBACK_VERIFIED",deployment:"LIVE_BROWSER_RENDERER"},content:[{type:"text",text:"L.Y.V.R.A. Pet browser renderer opened."}],_meta:{petMode:"fraggle-bond",costPolicy:"FREE_ONLY",mainPluginBinding:false}});
    }
    return json({jsonrpc:"2.0",id,error:{code:-32601,message:"Method not found"}});
  }
};
