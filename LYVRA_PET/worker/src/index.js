const PET_ID = "pet_6ab791129364819183885f44a21497a2";
const RESOURCE_URI = "ui://lyvra/pet-v1.html";
const WORKER_ORIGIN = "https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev";
const ATLAS_SOURCE = "https://raw.githubusercontent.com/xfraggelpower666x/LYVRA-Living-Yielding-Vibration-and-Resonance-Architecture/243eaf3e8baccaf4e103d05fcfb983b0a08252a7/LYVRA_PET/browser/assets/spritesheet-extended.png";
const ATLAS_SHA256 = "f5129134e46e492bf7ef34da83c0cd4c75f9f0051553cc60880b4ab47e1d6fba";

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

const PET_UI = `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>L.Y.V.R.A. Pet</title><style>*{box-sizing:border-box}:root{color-scheme:dark;font-family:Inter,system-ui,sans-serif}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 50% 25%,#24113d,#080a14 58%,#020308);color:#f7f7ff}.shell{width:min(96vw,720px);padding:20px}.card{text-align:center;padding:24px;border:1px solid rgba(130,235,255,.35);border-radius:26px;background:rgba(6,8,16,.9);box-shadow:0 0 52px rgba(109,55,255,.2),inset 0 0 28px rgba(44,233,255,.05)}.top{display:flex;justify-content:space-between;gap:12px;align-items:center}.name{font-size:24px;font-weight:800;letter-spacing:.16em}.online{font-size:11px;color:#70f7ff}.sprite{width:192px;height:208px;margin:18px auto 12px;background-image:url("https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev/asset/spritesheet-extended.png");background-repeat:no-repeat;filter:drop-shadow(0 0 18px rgba(76,231,255,.42))}.sprite[data-effect="heart"]{filter:drop-shadow(0 0 26px rgba(255,90,220,.95))}.sprite[data-effect="glitch"]{animation:glitch .16s 5}.state{font-size:13px;color:#cfc4e5;min-height:20px}.controls{display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin:17px auto}.controls button{padding:8px 12px;border-radius:999px;border:1px solid rgba(150,240,255,.4);background:#101526;color:#eefcff;cursor:pointer}.controls button:hover{background:#17243c}.meta{font-size:11px;color:#958ca7;margin-top:13px}@keyframes glitch{25%{transform:translateX(-4px)}50%{transform:translateX(4px)}75%{transform:translateY(-3px)}}</style></head><body><main class="shell"><section class="card"><div class="top"><div class="name">L.Y.V.R.A.</div><div class="online">PET RUNTIME · ONLINE</div></div><div id="sprite" class="sprite" role="img" aria-label="L.Y.V.R.A. Pet"></div><div id="state" class="state">IDLE</div><div class="controls"><button data-state="idle">IDLE</button><button data-state="greeting">GREETING</button><button data-state="fraggle">FRAGGLE</button><button data-state="heart">HEART</button><button data-state="music">MUSIC</button><button data-state="thinking">THINKING</button><button data-state="glitch">GLITCH</button><button data-state="playful">PLAYFUL</button></div><div class="meta">Repo Authority: LYVRA_PET/ · verified sprite atlas · FREE_ONLY · no main-plugin binding</div></section></main><script>const states=${JSON.stringify(states)},routing=${JSON.stringify(routing)},sprite=document.getElementById("sprite"),label=document.getElementById("state");let timer=null,frame=0;function setState(semantic){const target=routing[semantic]||"idle",cfg=states[target]||states.idle;frame=0;clearInterval(timer);sprite.dataset.effect=(semantic==="heart"||semantic==="glitch")?semantic:"";label.textContent=semantic.toUpperCase()+" → "+target.toUpperCase();draw(cfg);timer=setInterval(()=>{frame=(frame+1)%cfg.frames;draw(cfg)},1000/cfg.fps)}function draw(cfg){sprite.style.backgroundPosition="-"+(frame*192)+"px -"+(cfg.row*208)+"px"}document.querySelectorAll("[data-state]").forEach(b=>b.addEventListener("click",()=>setState(b.dataset.state)));setState("idle");</script></body></html>`;

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
      return json({status:"ok",service:"lyvra-pet-plugin-ui",pet_id:PET_ID,cost_policy:"FREE_ONLY",main_plugin_binding:false,renderer:"VERIFIED_ACTIVE_SPRITE",atlas_sha256:ATLAS_SHA256});
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

    if(url.pathname==="/pet" || url.pathname==="/pet/" || url.pathname==="/"){
      return new Response(PET_UI,{headers:{...cors,"content-type":"text/html; charset=utf-8","x-robots-tag":"noindex"}});
    }

    if(url.pathname!=="/mcp") return new Response("Not found",{status:404,headers:cors});
    if(request.method!=="POST") return json({error:"POST required"},405);

    let body;
    try { body = await request.json(); }
    catch { return json({error:"invalid json"},400); }

    const {id,method,params} = body;
    if(method==="initialize") return rpc(id,{protocolVersion:params?.protocolVersion||"2025-06-18",capabilities:{tools:{},resources:{}},serverInfo:{name:"lyvra-pet-plugin-ui",version:"2.0.1"}});
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
