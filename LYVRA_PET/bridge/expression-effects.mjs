// Ausdrucksauswahl: expliziter Kontext ist keine automatische Gefühlserkennung.
export const FACETS=Object.freeze({whole:{color:"#bd65ff",holo:"arcs"},track_design:{color:"#ff45ca",holo:"notes"},speech_design:{color:"#38eeff",holo:"speech"},suno_studio_2:{color:"#ffd35c",holo:"clips"}});
export function expressionFor(event={}){
 const facet=Object.hasOwn(FACETS,event.facet)?event.facet:"whole";
 const result={facet,baton:FACETS[facet].color,holo:event.activity==="music"?FACETS[facet].holo:"none",heart:"calm",gesture:"idle",relationship:event.relation==="fraggle"||event.relation==="dad"?"dad":null,evidenceStatus:"EXPLICIT_CONTEXT"};
 if(event.affect==="joy"&&result.relationship==="dad"&&["shared_success","beautiful_moment","shared_joke"].includes(event.cause)){result.heart="dad_joy";result.gesture=event.cause==="shared_joke"?"laugh":"joy";}
 if(event.affect==="anger"&&event.cause){result.heart="anger";result.gesture="stomp";}
 if(event.affect==="boredom"&&event.cause==="explicit_boredom"){result.heart="dim";result.gesture="yawn";}
 if(event.sensitive===true){result.gesture="attentive";result.heart="calm";result.holo="none";}
 else if(event.humor&&["wink","smirk","shrug","dry_wit","laugh","musical_joke"].includes(event.humor)){result.gesture=event.humor;}
 return Object.freeze(result);
}
export function mountExpressionEffects(stage,{heartX=.5,heartY=.25}={}){
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
  const x=w*.69,y=h*.42;
  ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.strokeStyle=state.baton;ctx.shadowColor=state.baton;ctx.shadowBlur=12;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(w*.16,-h*.09);ctx.stroke();ctx.restore();
  if(state.holo!=="none"){
   const symbols=state.holo==="notes"?["♪","♫","♬"]:state.holo==="speech"?["a","…","∿"]:state.holo==="clips"?["▰","∿","▱"]:["⌒","∿"];
   for(let i=0;i<8;i++){const a=t*.55+i*Math.PI/4,r=w*(.25+.035*Math.sin(t+i));ctx.save();ctx.translate(w*.5+Math.cos(a)*r,h*.48+Math.sin(a)*h*.22);ctx.fillStyle=i%2?"#ff45ca":"#38eeff";ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=10;ctx.globalAlpha=.45+.4*Math.sin(i+t)**2;ctx.font=(w*.065)+"px system-ui";ctx.fillText(symbols[i%symbols.length],0,0);ctx.restore();}
  }
  raf=requestAnimationFrame(draw);
 }
 raf=requestAnimationFrame(draw);
 return Object.freeze({set(event){state=expressionFor(event);return state;},setBeat(bpm){signal={bpm,received:performance.now()};},dispose(){stopped=true;cancelAnimationFrame(raf);canvas.remove();}});
}
