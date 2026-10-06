const label=document.getElementById("stateLabel");
const core=document.getElementById("petCore");
const allowed=new Set(["idle","greeting","fraggle","heart","music","thinking","glitch","return","playful"]);
function setState(next){
  const state=allowed.has(next)?next:"idle";
  core.dataset.state=state;
  label.textContent=state.toUpperCase();
}
document.querySelectorAll("[data-state]").forEach(btn=>{
  btn.addEventListener("click",()=>setState(btn.dataset.state));
});
setState("idle");
