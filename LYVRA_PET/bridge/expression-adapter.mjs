// LYVRA bleibt Quelle und Autorität; dieser Adapter speichert keine Erinnerungen.
export const PET_ID = "pet_6ab791129364819183885f44a21497a2";
const routing = Object.freeze({greeting:"waving",fraggle:"waving",heart:"idle",music:"jumping",thinking:"review",playful:"jumping",new_idea:"review",promising_experiment:"jumping",musical_discovery:"jumping",failed_experiment:"failed",verified_repair:"waving",idle:"idle"});
export function resolveExpression(input, now = Date.now()) {
  const fallback = {pet_id:PET_ID,instance:"PRIMARY_NATIVE",context:"idle",animation:"idle",effect:"",intensity:0,reason:"Kein gültiger aktueller Ausdruck",source_revision:null,valid_until:null,status:"FALLBACK"};
  if (!input || input.pet_id !== PET_ID || input.authority !== "WHOLE_LYVRA" || !/^[a-f0-9]{40}$/.test(input.source_revision || "")) return fallback;
  const issued = Date.parse(input.issued_at), until = Date.parse(input.valid_until);
  if (!Number.isFinite(issued) || !Number.isFinite(until) || issued > now || until <= now || until <= issued || until-issued > 300000 || !Object.hasOwn(routing,input.context)) return fallback;
  // Nur freigegebene Ausdrucksdaten übernehmen, niemals private Payloads oder freie Texte.
  return {pet_id:PET_ID,instance:"PRIMARY_NATIVE",context:input.context,animation:routing[input.context],effect:input.context === "heart" ? "heart" : input.context === "failed_experiment" ? "glitch" : "",intensity:Number.isFinite(input.intensity) ? Math.max(0,Math.min(1,input.intensity)) : 0.5,reason:"Aktueller kontextbezogener Ausdruck aus Whole LYVRA",source_revision:input.source_revision,valid_until:input.valid_until,status:"VALIDATED_INPUT"};
}
export function secondaryGptProjection() {
  return {pet_id:PET_ID,instance:"SECONDARY_GPT",optional:true,metadata_supported:true,live_state_control:false,memory_sync:false,status:"HOST_CAPABILITY_BLOCKED"};
}
