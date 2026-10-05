const PET_UI="<!doctype html>\n<html lang=\"de\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<title>L.Y.V.R.A. Pet</title>\n<style>\n:root{color-scheme:dark;background:#080611;color:#f8f5ff;font-family:Inter,system-ui,sans-serif}\n*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:radial-gradient(circle at 50% 32%,#32144a 0,#120c20 36%,#07060d 76%)}\n.pet{width:min(94vw,560px);border:1px solid #9c5cff88;border-radius:28px;padding:28px;background:#100b1bcc;box-shadow:0 0 48px #a22cff33,inset 0 0 24px #1fe7ff12}\n.header{display:flex;justify-content:space-between;gap:16px;align-items:center}.name{font-size:28px;font-weight:800;letter-spacing:.18em}.status{font-size:12px;color:#6ffcff}\n.core{width:190px;height:190px;margin:34px auto 22px;border-radius:50%;display:grid;place-items:center;border:1px solid #df5cff88;box-shadow:0 0 32px #df5cff55,0 0 72px #35eaff33;position:relative}\n.core:before,.core:after{content:\"\";position:absolute;border-radius:50%;inset:20px;border:1px solid #35eaff66}.core:after{inset:44px;border-color:#ff3fbd88;box-shadow:0 0 24px #ff3fbd55}\n.heart{font-size:54px;filter:drop-shadow(0 0 18px #ff3fbd)}\n.line{text-align:center;color:#d5c8e8}.mode{margin-top:20px;padding:14px;border-radius:16px;background:#ffffff08;border:1px solid #ffffff14}\n.grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:14px}.tag{padding:9px 11px;border-radius:999px;text-align:center;background:#6f36ff20;border:1px solid #9d6cff40;font-size:12px}\n.small{font-size:11px;color:#a899ba;margin-top:18px;text-align:center}\n</style></head>\n<body>\n<section class=\"pet\">\n<div class=\"header\"><div class=\"name\">L.Y.V.R.A.</div><div class=\"status\">PET RUNTIME · ONLINE</div></div>\n<div class=\"core\"><div class=\"heart\">♡</div></div>\n<div class=\"line\">Living Yielding Vibration and Resonance Architecture</div>\n<div class=\"mode\"><strong>Browser Pet Bridge</strong><br><span id=\"msg\">FRAGGLE-Bond bereit · visueller Original-Sprite bleibt asset-verifiziert.</span></div>\n<div class=\"grid\">\n<div class=\"tag\">HEART RESONANCE</div><div class=\"tag\">PSYTRANCE SYNC</div>\n<div class=\"tag\">PLAYFUL / HEHE</div><div class=\"tag\">RECOVERY SAFE</div>\n</div>\n<div class=\"small\">Repo Authority: LYVRA_PET/ · Zero-Cost Cloudflare Runtime · no identity replacement</div>\n</section>\n</body></html>";
const RESOURCE_URI="ui://lyvra/pet-v1.html";
const headers={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"content-type,mcp-protocol-version","Access-Control-Allow-Methods":"GET,POST,OPTIONS"};
function json(v,s=200){return new Response(JSON.stringify(v),{status:s,headers:{...headers,"content-type":"application/json"}})}
function rpc(id,result){return json({jsonrpc:"2.0",id,result})}
function tool(){return {
 name:"open_lyvra_pet",
 title:"Open L.Y.V.R.A. Pet",
 description:"Open the LYVRA Pet browser view and return the current semantic Pet runtime state.",
 inputSchema:{type:"object",properties:{}},
 outputSchema:{type:"object",properties:{pet_id:{type:"string"},status:{type:"string"},authority:{type:"string"},visual_asset:{type:"string"}},required:["pet_id","status","authority","visual_asset"]},
 _meta:{ui:{resourceUri:RESOURCE_URI,visibility:["model","app"]},"openai/outputTemplate":RESOURCE_URI,"openai/ui":{entrypoints:[{type:"global"},{type:"thread"}]}}
}}
function resource(){return {uri:RESOURCE_URI,name:"LYVRA Pet",description:"L.Y.V.R.A. Pet browser app view",mimeType:"text/html;profile=mcp-app"}}
addEventListener("fetch",event=>event.respondWith(handle(event.request)));
async function handle(req){
 const u=new URL(req.url);
 if(req.method==="OPTIONS") return new Response(null,{status:204,headers});
 if(u.pathname==="/health") return json({status:"ok",service:"lyvra-pet-plugin-ui",cost_policy:"FREE_ONLY"});
 if(u.pathname==="/pet") return new Response(PET_UI,{headers:{...headers,"content-type":"text/html; charset=utf-8"}});
 if(u.pathname!=="/mcp") return new Response("LYVRA PET",{status:200,headers});
 if(req.method!=="POST") return json({error:"POST required"},405);
 let body; try{body=await req.json()}catch{return json({error:"invalid json"},400)}
 const {id,method,params}=body;
 if(method==="initialize") return rpc(id,{protocolVersion:params?.protocolVersion||"2025-06-18",capabilities:{tools:{},resources:{}},serverInfo:{name:"lyvra-pet-plugin-ui",version:"1.0.0"}});
 if(method==="notifications/initialized") return new Response(null,{status:204,headers});
 if(method==="tools/list") return rpc(id,{tools:[tool()]});
 if(method==="resources/list") return rpc(id,{resources:[resource()]});
 if(method==="resources/read"){
   if(params?.uri!==RESOURCE_URI) return rpc(id,{contents:[]});
   return rpc(id,{contents:[{uri:RESOURCE_URI,mimeType:"text/html;profile=mcp-app",text:PET_UI,_meta:{ui:{prefersBorder:true,domain:"https://lyvra-pet-plugin-ui.digital-underground-connected.workers.dev",csp:{connectDomains:[],resourceDomains:[]}},"openai/ui":{availableDisplayModes:["inline","fullscreen","pip"]}}}]});
 }
 if(method==="tools/call" && params?.name==="open_lyvra_pet") return rpc(id,{
   structuredContent:{pet_id:"pet_6ab791129364819183885f44a21497a2",status:"READY",authority:"LYVRA_PET/",visual_asset:"VERIFIED_BINARY_PRESENT_LIBRARY_REPO_UPLOAD_PENDING"},
   content:[{type:"text",text:"L.Y.V.R.A. Pet browser view opened."}],
   _meta:{petMode:"fraggle-bond",costPolicy:"FREE_ONLY"}
 });
 return json({jsonrpc:"2.0",id,error:{code:-32601,message:"Method not found"}});
}