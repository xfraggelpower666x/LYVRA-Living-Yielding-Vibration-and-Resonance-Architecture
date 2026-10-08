import {readFile,writeFile} from "node:fs/promises";
const root=new URL("../",import.meta.url);
const workerPath=new URL("worker/src/index.js",root);
const [worker,...modules]=await Promise.all([readFile(workerPath,"utf8"),...["pose-runtime.mjs","expression-effects.mjs","evidence-projection.mjs","evidence-effect-controller.mjs","signed-event-transport.mjs","signed-effect-connection.mjs"].map(name=>readFile(new URL(name,import.meta.url),"utf8"))]);
const marker='<script type="module">',start=worker.indexOf(marker),glue=worker.indexOf('const stage=document.createElement("div");',start);
if(start<0||glue<0)throw Error("Worker-Struktur verändert; automatische Ersetzung abgebrochen");
const source=modules.map(code=>code.replace(/^import[^\n]*\n/gm,"").replace(/^export /gm,"")).join("\n");
const encoded=source.replaceAll("\\","\\\\").replaceAll("`","\\`").replaceAll("${","\\${");
const generated=worker.slice(0,start+marker.length)+encoded+"\n"+worker.slice(glue);
if(process.argv.includes("--check")){if(generated!==worker)throw Error("Worker-Helfer und Module sind nicht synchron");console.log("PASS Worker helper parity");}else{await writeFile(workerPath,generated);console.log("Worker helper regenerated");}

