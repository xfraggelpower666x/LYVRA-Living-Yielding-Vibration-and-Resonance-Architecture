// LYVRA R34: ausfuehrbarer read-only Aufruf fuer vorhandenen R33-Visual-Adapter.
// Keine HTML-Oberflaeche, keine externe Host-Aktion, keine eigenstaendige Authority.
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import {projectNativeDeployment} from './native-deployment-visual.mjs';

export function runNativeDeployment(data, {expectedHead, expectedPointer, selection='ALL'}={}) {
  if (!expectedHead || !expectedPointer) throw new TypeError('Frisch verifizierter Head und Pointer erforderlich');
  if (data?.source_anchor?.head !== expectedHead || data.source_anchor.pointer_blob !== expectedPointer) {
    throw new TypeError('R32-Daten passen nicht zum frisch verifizierten Current; erneute Quellenpruefung erforderlich');
  }
  const projected = projectNativeDeployment(data,{selection});
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
  if (!input || !head || !pointer) {
    process.stderr.write('Benutzung: node native-deployment-runner.mjs --input R32_PROJECTION.json --head VERIFIZIERTER_HEAD --pointer VERIFIZIERTER_POINTER [--selection STRANG]\n');
    process.exitCode=2;
  } else {
    try {const view=JSON.parse(readFileSync(input,'utf8'));process.stdout.write(JSON.stringify(runNativeDeployment(view,{expectedHead:head,expectedPointer:pointer,selection}),null,2)+'\n');}
    catch(e){process.stderr.write(`R34_VALIDATION_BLOCKED: ${e.message}\n`);process.exitCode=1;}
  }
}
