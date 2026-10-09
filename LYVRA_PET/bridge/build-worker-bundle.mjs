import {readFile,writeFile,mkdir} from 'node:fs/promises';
// Erzeugt eine einzelne Worker-Datei. Kein Upload und kein Live-Deployment.
const root=new URL('../',import.meta.url);
const [worker,assets]=await Promise.all([readFile(new URL('worker/src/index.js',root),'utf8'),readFile(new URL('assets/logo-assets.mjs',root),'utf8')]);
const binding='import {LOGO_ASSETS} from "../../assets/logo-assets.mjs";';
if(!worker.startsWith(binding+'\n'))throw Error('Worker-Assetimport verändert; Bundle abgebrochen');
const transport=await readFile(new URL('bridge/signed-event-transport.mjs',root),'utf8');
const producer=await readFile(new URL('bridge/repository-event-source.mjs',root),'utf8');
const budget=await readFile(new URL('bridge/github-budget.mjs',root),'utf8');
const producerImport='import {produceRepositoryEnvelope,publicNativeSourceFailure} from "../../bridge/repository-event-source.mjs";';
if(!worker.includes(producerImport))throw Error('Native producer import missing');
const budgetImport='import {petBudgetedFetcher,PetGithubBudget} from "../../bridge/github-budget.mjs";';
if(!worker.includes(budgetImport))throw Error('Native GitHub budget import missing');
const bundle=assets.replace(/^export /gm,'')+'\n'+transport.replace(/^export /gm,'')+'\n'+producer.replace(/^import[^\n]*\n/gm,'').replace(/^export /gm,'')+'\n'+budget.replace(/^export /gm,'')+'\n'+worker.slice(binding.length+1).replace(producerImport+'\n','').replace(budgetImport+'\n','').replace('export {PetGithubBudget};\n','');
if(/^import\s/m.test(bundle))throw Error('Unerwarteter externer Import im Deployment-Bundle');
const destination=new URL('worker/build/worker-bundle.mjs',root);
await mkdir(new URL('worker/build/',root),{recursive:true});await writeFile(destination,bundle);
console.log('Worker bundle generated; no deployment performed');
