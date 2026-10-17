/**
 * LYVRA Artist Discovery — deterministic import/merge core.
 * No web requests, no credentials, no writes. Run in node with input JSON.
 * node sync-catalog.mjs existing.json incoming.json [soundcloud|distrokid]
 * Emits merged JSON to stdout; caller must review/diff before publication.
 */
import {readFileSync} from 'node:fs';
const [existingPath,incomingPath,source] = process.argv.slice(2);
if(!existingPath||!incomingPath||!['soundcloud','distrokid'].includes(source)){console.error('Usage: node sync-catalog.mjs existing.json incoming.json soundcloud|distrokid');process.exit(2)}
const old=JSON.parse(readFileSync(existingPath,'utf8')),incoming=JSON.parse(readFileSync(incomingPath,'utf8'));
const canonical=u=>{try{const x=new URL(u);if(x.protocol!=='https:')return null;x.hash='';x.search='';return x.toString().replace(/\/$/,'').toLowerCase()}catch{return null}};
function uniqueKey(x){return x.canonical_id||canonical(x.url)||null}
const current=(old.items||old.albums||[]).map(x=>({...x}));
const seen=new Map(current.map((item,i)=>[uniqueKey(item),i]).filter(x=>x[0]));
const fresh=(incoming.items||incoming.albums||[]);
const report={source,scanned:fresh.length,new:0,existing:0,rejected:0};
for(const item of fresh){
 const key=uniqueKey(item);
 const host=(()=>{try{return new URL(item.url).hostname.toLowerCase()}catch{return ''}})();
 if(!key||!item.title||source==='soundcloud'&&!['soundcloud.com','www.soundcloud.com'].includes(host)){report.rejected++;continue}
 if(seen.has(key)){report.existing++;continue}
 const candidate={...item,status:'review_pending',discovery_source:source};
 // Even a public SoundCloud hit must be validated before publication.
 if(source==='distrokid')candidate.delivery_status='not_verified';
 current.push(candidate);seen.set(key,current.length-1);report.new++;
}
const result={...old,items:current,import_report:report,publication_allowed:false};
process.stdout.write(JSON.stringify(result,null,2)+'\n');
