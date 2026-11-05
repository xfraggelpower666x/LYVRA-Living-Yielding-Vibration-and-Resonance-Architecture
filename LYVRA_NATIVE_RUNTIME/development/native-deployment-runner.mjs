// LYVRA R34: ausfuehrbarer read-only Aufruf fuer vorhandenen R33-Visual-Adapter.
// Keine HTML-Oberflaeche, keine externe Host-Aktion, keine eigenstaendige Authority.
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {reconcileDeploymentEvidence} from './native-deployment-visual.mjs';

export function runNativeDeployment(data, {expectedHead, expectedPointer, selection='ALL',receipts=[]}={}) {
  if (!expectedHead || !expectedPointer) throw new TypeError('Frisch verifizierter Head und Pointer erforderlich');
  if (data?.source_anchor?.head !== expectedHead || data.source_anchor.pointer_blob !== expectedPointer) {
    throw new TypeError('R32-Daten passen nicht zum frisch verifizierten Current; erneute Quellenpruefung erforderlich');
  }
  const projected = reconcileDeploymentEvidence(data,receipts,{selection});
  return {
    ...projected,
    execution: {source:'EXACT_SUPPLIED_R32_SNAPSHOT',type:'LOCAL_NODE_READ_ONLY',native_host_pass:false},
    rehydration: {current_match:true,full_whole_rehydrated:false},
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args=process.argv.slice(2);
  const get=n=>{const i=args.indexOf(n);return i<0?undefined:args[i+1]};
  const input=get('--input'), head=get('--head'), pointer=get('--pointer'), selection=get('--selection')||'ALL';
  const receiptPaths=[]; for(let i=0;i<args.length-1;i++)if(args[i]==='--receipts')receiptPaths.push(args[i+1]);
  if (!input || !head || !pointer) {
    process.stderr.write('Benutzung: node native-deployment-runner.mjs --input R32_PROJECTION.json --head VERIFIZIERTER_HEAD --pointer VERIFIZIERTER_POINTER [--selection STRANG] [--receipts R36.json --receipts R39.json]\n');
    process.exitCode=2;
  } else {
    try {const view=JSON.parse(readFileSync(input,'utf8'));const receipts=receiptPaths.flatMap(p=>{const rows=JSON.parse(readFileSync(p,'utf8'));if(!Array.isArray(rows))throw TypeError('RECEIPTS_ARRAY_REQUIRED');return rows;});process.stdout.write(JSON.stringify(runNativeDeployment(view,{expectedHead:head,expectedPointer:pointer,selection,receipts}),null,2)+'\n');}
    catch(e){process.stderr.write(`R34_VALIDATION_BLOCKED: ${e.message}\n`);process.exitCode=1;}
  }
}
