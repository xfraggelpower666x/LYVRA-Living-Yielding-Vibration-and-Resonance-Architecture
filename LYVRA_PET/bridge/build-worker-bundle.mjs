import {readFile,writeFile,mkdir} from 'node:fs/promises';
// Erzeugt eine einzelne Worker-Datei. Kein Upload und kein Live-Deployment.
const root=new URL('../',import.meta.url);
const [worker,assets]=await Promise.all([readFile(new URL('worker/src/index.js',root),'utf8'),readFile(new URL('assets/logo-assets.mjs',root),'utf8')]);
const binding='import {LOGO_ASSETS} from "../../assets/logo-assets.mjs";';
if(!worker.startsWith(binding+'\n'))throw Error('Worker-Assetimport verändert; Bundle abgebrochen');
const bundle=assets.replace(/^export /gm,'')+'\n'+worker.slice(binding.length+1);
if(/^import\s/m.test(bundle))throw Error('Unerwarteter externer Import im Deployment-Bundle');
const destination=new URL('worker/build/worker-bundle.mjs',root);
await mkdir(new URL('worker/build/',root),{recursive:true});await writeFile(destination,bundle);
console.log('Worker bundle generated; no deployment performed');
