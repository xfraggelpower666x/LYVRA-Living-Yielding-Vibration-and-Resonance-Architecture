import {resolveExpression} from "./expression-adapter.mjs";
// Der Host muss Herkunft und aktuelle Revision unabhängig prüfen.
// Ohne Prüfer bleibt die primäre Oberfläche im ruhigen Zustand.
export function createPrimaryController({render,verifySource=async()=>false,clock=()=>Date.now(),schedule=setTimeout,cancel=clearTimeout}) {
  let timer=null,sequence=0,closed=false;
  function idle(){render({...resolveExpression(null,clock()),mode:"NATIVE_IDLE"});}
  function clear(){if(timer!==null)cancel(timer);timer=null;}
  async function accept(input){
    const ticket=++sequence;clear();
    // Eingabe kopieren, damit sie während asynchroner Prüfung nicht verändert wird.
    const snapshot=input && {pet_id:input.pet_id,authority:input.authority,source_revision:input.source_revision,issued_at:input.issued_at,valid_until:input.valid_until,context:input.context,intensity:input.intensity};
    idle();
    let verified=false;try{verified=await verifySource(snapshot);}catch{}
    if(closed||ticket!==sequence)return false;
    const state=resolveExpression(snapshot,clock());
    if(verified!==true||state.status!=="VALIDATED_INPUT")return false;
    render({...state,mode:"VERIFIED_NATIVE_CONTEXT"});
    timer=schedule(()=>{if(!closed&&ticket===sequence){timer=null;idle();}},Date.parse(state.valid_until)-clock());
    return true;
  }
  function reset(){++sequence;clear();if(!closed)idle();}
  function dispose(){closed=true;++sequence;clear();}
  idle();
  return Object.freeze({accept,reset,dispose});
}
export function bindPrimaryBrowser({sprite,label,manifest,verifySource,clock,schedule,cancel}) {
  let animationTimer=null;
  const render=state=>{
    clearInterval(animationTimer);
    const cfg=manifest.states[state.animation]||manifest.states.idle;
    let frame=0;
    const draw=()=>{sprite.style.backgroundPosition="-"+frame*manifest.cell.width+"px -"+cfg.row*manifest.cell.height+"px";};
    sprite.dataset.effect=state.effect;
    sprite.dataset.instance="PRIMARY_NATIVE";
    sprite.dataset.mode=state.mode;
    label.textContent=state.mode+" · "+state.context.toUpperCase();
    draw();animationTimer=setInterval(()=>{frame=(frame+1)%cfg.frames;draw();},1000/cfg.fps);
  };
  const controller=createPrimaryController({render,verifySource,clock,schedule,cancel});
  return Object.freeze({accept:controller.accept,reset:controller.reset,dispose(){controller.dispose();clearInterval(animationTimer);}});
}
