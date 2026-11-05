/** Existing Whole visual-intelligence inheritance for locally composed action queries. */
export const VISUAL_TAIL='Visuelle Führung.';
export function withVisualGuidance(command,{enabled=true}={}){
 if(typeof command!=='string'||!command.trim())throw Error('NONEMPTY_COMMAND_REQUIRED');
 const raw=command.trim();
 if(!enabled)return raw;
 if(/(?:visuelle\s+führung)\s*[.!?]*\s*$/iu.test(raw))return raw.replace(/visuelle\s+führung\s*[.!?]*\s*$/iu,VISUAL_TAIL);
 return raw.replace(/\s+$/u,'')+' '+VISUAL_TAIL;
}
export function actionForStrand(id,allowed,base='LYVRA PARALLEL R11'){
 if(!Array.isArray(allowed)||!allowed.includes(id))throw Error('UNKNOWN_STRAND');
 return withVisualGuidance(`${base} ${id} WEITER — Nutze frischen Whole-LYVRA-Current, bewahre alle sechs Stränge, Originalcode, null Zusatzkosten und Analytics als Rückkehrziel. Keine produktiven Writes ohne Governance.`);
}
export function actionAll(allowed,base='LYVRA PARALLEL R11'){
 if(!Array.isArray(allowed)||allowed.length!==6||new Set(allowed).size!==6)throw Error('SIX_STRANDS_REQUIRED');
 return withVisualGuidance(`${base} ALLE SECHS WEITER — Bearbeite alle sechs Stränge mit CodeForge/SuperCodeForge, evidenzbasierter Wirkungsprüfung und Lernkontinuität. Bewahre Analytics-Rückkehranker, null Zusatzkosten, Recovery und Host-Gates.`);
}
