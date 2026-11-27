// Datenbrücke zur bestehenden Intelligent UI; keine neue Engine oder Freigabeautorität.
import {inspect,LIMITS} from './track-mcp-r062.mjs';
const item=(label,text)=>({label,text:String(text)});
export function trackView(draft,discovery){
 const a=inspect(draft,discovery), d=draft??{}, source='R06.2 local inspect / '+(d.sourceRevision||'Quelle offen');
 const status=a.status==='HOLD'?'BLOCKIERT':'ABGELEITET';
 const view=(id,title,items)=>({id,title,summary:'Lokaler Entwurfsbefund; kein Audio- oder Host-Nachweis.',kind:'cards',route_terms:[id,title],source,status,items});
 return {title:'LYVRA Track Control',basis:source,views:[
 view('controls','Steuerparameter',[item('Weirdness',d.weirdness??'offen'),item('Style Influence',d.styleInfluence??'offen'),item('Variety',d.variety??'offen'),item('Taste',d.tasteMode??'offen'),item('Dauer',d.duration??'offen'),item('MAX',d.maxMode===true?'ON':'nicht ON')]),
 view('counts','UTF-16 Copy Guard',Object.entries(LIMITS).map(([k,v])=>item(k,(a.counts?.[k]??'offen')+'/'+v))),
 view('audit','Drift und Freigabe',[item('Status',a.status),item('Fehler',a.errors?.join(', ')||'keine lokalen Fehler'),item('Warnungen',a.warnings?.join(', ')||'keine lokalen Warnungen'),item('Revision',a.revision??'HOLD'),item('Provider','Keine Ausführung')])],
 gaps:['Musikalische Evidenz und Creator-Freigabe bleiben nativ; lokale UI erteilt keine Provider-Freigabe.',...(a.errors??[])],
 companion:{phase:'Track Review',status,project_key:'LYVRA:TRACK_DESIGN',source_revision:String(d.sourceRevision||'UNRESOLVED').slice(0,200),next_step:a.status==='HOLD'?'Entwurf reparieren und erneut prüfen':'Creator-Review durchführen'},
 actions:[{id:'review',kind:'verify',label:'Entwurf erneut prüfen',source:'R06.2 inspect',reason:'Änderungen erfordern neue Prüfung',effect:'Neue lokale Befunde und Revision',countercheck:'Keine Provider-Ausführung',status:'VORGESCHLAGEN'}]};
}
