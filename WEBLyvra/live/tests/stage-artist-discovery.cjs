// WEBLyvra artist-discovery: deterministic, local, additive Pages build staging.
// No external network, repo writes, runtime activation, or independent deploy.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const source = path.resolve(__dirname, '../../artist-discovery');
const target = path.resolve(__dirname, '../dist/artist-discovery');
const main = fs.readFileSync(path.join(source, 'index.html'));
const catalog = JSON.parse(fs.readFileSync(path.join(source, 'data/suno-releases.json'),'utf8'));
const embedded = main.toString('utf8').match(/const discoItems=(\\[[^;]*\\]);\\s*const discoState=/s);
assert(embedded, 'missing embedded Artist Discovery diskography');
const items=JSON.parse(embedded[1]);
assert.equal(catalog.public_songs.length, 436, 'unexpected Suno catalog');
assert.equal(items.length, 603, 'unexpected unified discovery inventory');
assert.equal(new Set(items.map(x=>x.url)).size,603,'duplicate discovery URLs');
const data=['platforms.json','suno-releases.json','soundcloud-albums.json','soundcloud-tracks.json'];
const art=[...Array(17)].map((_,i)=>'art-'+String(i+1).padStart(2,'0')+'.webp');
const original=['fraggel-system-designer.webp','lyvra-666soundsdesign-wordmark.webp','lyvra-cyber-emblem.webp','lyvra-hero-crest.webp','lyvra-resonance-banner.webp'];
const files=['index.html',...data.map(x=>'data/'+x),...art.map(x=>'assets/addon-20261018/'+x),...original.map(x=>'assets/'+x)];
assert(!fs.existsSync(path.join(target,'index.html')),'target is already populated; refuse ambiguous overwrite');
for(const rel of files){
 const src=path.join(source,rel),dst=path.join(target,rel);
 assert(fs.statSync(src).isFile(),'missing source: '+rel);
 fs.mkdirSync(path.dirname(dst),{recursive:true});
 fs.copyFileSync(src,dst);
 const digest=b=>crypto.createHash('sha256').update(b).digest('hex');
 assert.equal(digest(fs.readFileSync(src)),digest(fs.readFileSync(dst)),'staging byte drift: '+rel);
}
assert.equal(files.length,27,'unexpected asset selection');
console.log('WEBLYVRA_DISCOVERY_STAGE_PASS 603 unique URLs, 436 Suno, 22 WebP binaries, 4 data inventories; repository originals unchanged');
