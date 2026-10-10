// Node-only execution adapter. No networking or filesystem mutation; stdout is JSON.
import {readFile} from 'node:fs/promises';
import {runVerification} from './lyvra-verification-runner.mjs';
const file=process.argv[2];
if(!file){console.error('Usage: node lyvra-verification-cli.mjs <input.json>');process.exitCode=2;}
else{
 try{
  const payload=JSON.parse(await readFile(file,'utf8'));
  const report=runVerification(payload);
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
 }catch(e){console.error('LYVRA_VERIFICATION_INPUT_ERROR',String(e?.message||e));process.exitCode=2;}
}
