/** LYVRA: kontextgebundene Diktierkorrektur, ohne globale Ersetzungslisten. */
import {readFile, writeFile, rename, mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';

export const defaultState = () => ({schema:'LYVRA_DICTATION_LEARNING_v1',revision:1,scope:'WHOLE_LYVRA',authority:'WHOLE_LYVRA',status:'ISOLATED_CANDIDATE',rules:[{
  id:'LYVRA_NAME_001',observed:['Lübber','Libra','Livra'],canonical:'LYVRA',
  evidence:[{class:'CREATOR_EXPLICIT_CORRECTION',date:'2026-11-04',note:'Lübber ist kein eigenständiger Charakter, sondern ein Spracherkennungsfehler für LYVRA.'}],
  apply_when:{required_any:['LYVRA','Analytics','Track Design','Dirigentin','System','Facette','Suno','Musik'],forbid_any:['Lübbe','Straße','Familienname']},
  confidence:'CREATOR_CONFIRMED_CONTEXTUAL',enabled:true,revision:1
}],proposals:[],contradictions:[],ledger:[]});

const norm=s=>s.normalize('NFKC').toLocaleLowerCase('de-DE');
const contains=(s,w)=>new RegExp(`(^|[^\\p{L}\\p{N}])${w.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}(?=$|[^\\p{L}\\p{N}])`,'iu').test(s);
function contextual(rule,input){const around=norm(input);const good=rule.apply_when.required_any.some(w=>contains(around,norm(w)));const bad=rule.apply_when.forbid_any.some(w=>contains(around,norm(w)));return good&&!bad;}
function boundaryReplace(text,bad,good){const escaped=bad.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');return text.replace(new RegExp(`(^|[^\\p{L}\\p{N}])(${escaped})(?=$|[^\\p{L}\\p{N}])`,'giu'),(_,before)=>before+good);}
export function correct(input,state=defaultState()) {
 if(typeof input!=='string')throw new TypeError('input must be string');
 let result=input; const applied=[];const withheld=[];
 for(const rule of state.rules||[]){if(!rule.enabled)continue;
  const matches=rule.observed.filter(b=>contains(result,b));if(!matches.length)continue;
  if(!contextual(rule,result)){withheld.push({id:rule.id,reason:'CONTEXT_NOT_ESTABLISHED'});continue;}
  for(const bad of matches)result=boundaryReplace(result,bad,rule.canonical);
  if(result!==input)applied.push({id:rule.id,canonical:rule.canonical});
 }
 return {text:result,applied,withheld};
}
export function propose(state,proposal){if(!proposal?.observed||!proposal?.canonical||!proposal?.evidence)throw new Error('Unbelegte Regel nicht erlaubt');const id=`CANDIDATE-${(state.proposals||[]).length+1}`;return {...state,proposals:[...(state.proposals||[]),{id,...proposal,state:'PENDING_CREATOR_OR_REPLICATED_EVIDENCE'}]};}
export function recordCorrection(state,observation){if(!observation?.source||!observation?.observed||!observation?.canonical)throw new Error('Provenienz fehlt');const entry={seq:(state.ledger||[]).length+1,type:'OBSERVATION',...observation};return {...state,ledger:[...(state.ledger||[]),entry]};}
export async function loadState(path){const data=JSON.parse(await readFile(path,'utf8'));if(data.schema!=='LYVRA_DICTATION_LEARNING_v1')throw new Error('Ungültiges Schema');return data;}
export async function saveState(path,state){if(state.schema!=='LYVRA_DICTATION_LEARNING_v1')throw new Error('Ungültiges Schema');await mkdir(dirname(path),{recursive:true});const tmp=path+'.tmp';await writeFile(tmp,JSON.stringify(state,null,2)+'\n','utf8');await rename(tmp,path);const readback=await loadState(path);if(JSON.stringify(readback)!==JSON.stringify(state))throw new Error('READBACK_MISMATCH');return readback;}
