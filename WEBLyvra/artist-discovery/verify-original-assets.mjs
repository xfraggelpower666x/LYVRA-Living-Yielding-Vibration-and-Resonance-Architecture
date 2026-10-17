#!/usr/bin/env node
// LYVRA artist-discovery original-art integrity check. Read-only, fails closed.
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const assets=[
 ['lyvra-cyber-emblem.webp',35350,'66be298a7c4b043b6a6226504a4f7a8c124eeaac94c510b56e7be93622cb887e'],
 ['lyvra-resonance-banner.webp',110228,'23eb55eef9bacf1a2a7ae7d0b986a4910a587824e094c62296fbd1607c49b3f1'],
 ['fraggel-system-designer.webp',59568,'19a7db3b094f7a63725f08faf2d34c443fa6438aa70517df16bdd72d93ae4b86'],
 ['lyvra-666soundsdesign-wordmark.webp',47676,'40cddfaffe1084fa2928083f75340be8dbcc66cd1b9f465f6a7fb857f1557119'],
 ['lyvra-hero-crest.webp',77490,'18300a9a71fc7665344c20c520fe8bb0aa41c8121a8a5dace776b50a6104cbaa']
];
let ok=true;
for (const [name,size,sha] of assets) {
 const p=join(root,'assets',name);
 if(!existsSync(p)){console.error('MISSING',name);ok=false;continue;}
 const b=readFileSync(p),hash=createHash('sha256').update(b).digest('hex');
 const passed=b.length===size&&hash===sha;
 console.log(passed?'PASS':'FAIL',name,b.length,hash);
 if(!passed)ok=false;
}
if(!ok){console.error('BRIDGE_READBACK_PENDING: no image integration promotion');process.exitCode=1;}
else console.log('LOCAL_ASSET_INTEGRITY_PASS; remote independent readback still required.');
