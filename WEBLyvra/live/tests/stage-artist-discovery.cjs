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
const embedded = main.toString('utf8').match(/const discoItems=(\[[^;]*\]);\s*const discoState=/s);
assert(embedded, 'missing embedded Artist Discovery diskography');
const items=JSON.parse(embedded[1]);
const albums=JSON.parse(fs.readFileSync(path.join(source,'data/soundcloud-albums.json'),'utf8')).albums;
const tracks=JSON.parse(fs.readFileSync(path.join(source,'data/soundcloud-tracks.json'),'utf8')).tracks;
assert(catalog.public_songs.length>=450, 'protected 450-entry Suno baseline regressed');
assert.equal(albums.length,45,'protected SoundCloud set baseline changed');
assert.equal(tracks.length,122,'protected SoundCloud track baseline changed');
const expected=[...catalog.public_songs,...tracks,...albums];
assert.equal(items.length,expected.length,'unified discovery does not match exact current provider inventories');
assert.equal(new Set(items.map(x=>x.url)).size,items.length,'duplicate discovery URLs');
assert.equal(new Set(expected.map(x=>x.url)).size,expected.length,'duplicate source catalog URL');
const embeddedUrls=new Set(items.map(x=>x.url));
for(const item of expected)assert(embeddedUrls.has(item.url),'current source URL missing from staged HTML: '+item.url);
const page=main.toString('utf8');
assert(page.includes('Suno: '+catalog.public_songs.length+' katalogisierte'),'German public count has drifted from current snapshot');
assert(page.includes('Suno: '+catalog.public_songs.length+' catalogued'),'English public count has drifted from current snapshot');
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
console.log('WEBLYVRA_DISCOVERY_STAGE_PASS '+items.length+' unique URLs, '+catalog.public_songs.length+' Suno, '+albums.length+' sets, '+tracks.length+' tracks, 22 WebP binaries, 4 data inventories; repository originals unchanged');
