// Neue, ausdrücklich freigegebene geschlossene Rüstung; Originalatlas bleibt erhalten.
export function poseFrame(state,elapsed,reduced=false){
 if(state.gesture==='yawn')return elapsed<2400?{strip:'yawn',frame:reduced?2:Math.min(3,Math.floor(elapsed/600))}:null;
 if(state.gesture==='stomp')return elapsed<1200?{strip:'stomp',frame:reduced?0:Math.min(3,Math.floor(elapsed/300))}:null;
 const humor={smirk:0,dry_wit:0,wink:1,shrug:2,laugh:3,musical_joke:3};
 if(Object.hasOwn(humor,state.gesture))return elapsed<3000?{strip:'humor',frame:humor[state.gesture]}:null;
 if(state.holo!=='none')return {strip:'conductor',frame:{whole:0,track_design:1,speech_design:2,suno_studio_2:3}[state.facet]??0};
 return null;
}
export function mountPoseRuntime(stage,{base=new URL('../assets/poses/',import.meta.url).href}={}){
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
