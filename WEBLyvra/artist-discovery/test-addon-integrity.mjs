#!/usr/bin/env node
import {readFileSync,existsSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=dirname(fileURLToPath(import.meta.url));
const html=readFileSync(join(root,'index.html'),'utf8');
const suno=JSON.parse(readFileSync(join(root,'data/suno-releases.json'),'utf8')).public_songs;
const soundcloud=JSON.parse(readFileSync(join(root,'data/soundcloud-albums.json'),'utf8')).albums;
const soundcloudTracks=JSON.parse(readFileSync(join(root,'data/soundcloud-tracks.json'),'utf8')).tracks;
const platform=JSON.parse(readFileSync(join(root,'data/platforms.json'),'utf8'));
const found=html.match(/const discoItems=(\[[^;]*\]);\s*const discoState=/s);
assert.ok(found,'embedded unified diskography missing');
const entries=JSON.parse(found[1]);
assert.equal(suno.length,436,'current verified Suno snapshot count mismatch');
assert.equal(soundcloud.length,45,'current SoundCloud album/set snapshot count mismatch');
assert.equal(soundcloudTracks.length,122,'current SoundCloud track/mix snapshot count mismatch');
const trackUrls=new Set();
for(const track of soundcloudTracks){
 assert.ok(track.title&&typeof track.title==='string','SoundCloud track title missing');
 assert.ok(/^https:\/\/soundcloud\.com\/fraggelpower666\//.test(track.url),'unexpected artist track URL');
 assert.ok(!track.url.includes('/sets/'),'SoundCloud album/set leaked into track inventory');
 assert.ok(!trackUrls.has(track.url),'duplicate SoundCloud track URL');
 trackUrls.add(track.url);
}
assert.equal(entries.length,suno.length+soundcloud.length+soundcloudTracks.length,'discography missing entries');
const urls=new Set();
for(const entry of entries){
 assert.ok(['Suno','SoundCloud'].includes(entry.provider),'unknown provider');
 assert.ok(typeof entry.title==='string'&&entry.title.length>0,'title missing');
 assert.ok(/^https:\/\/(suno\.com\/song\/|soundcloud\.com\/fraggelpower666\/)/.test(entry.url),'unexpected release URL');
 assert.ok(!urls.has(entry.url),'duplicate release URL');
 urls.add(entry.url);
}
for(const original of [...suno,...soundcloud,...soundcloudTracks])assert.ok(urls.has(original.url),'original public URL lost');
for(const token of ['populateRadio(section)','lyvra:languagechange','lyvra-language','id="discography"','const originalArt=','discoState.limit+=40','rel=\'noopener noreferrer\''])assert.ok(html.includes(token),'protected capability missing: '+token);
for(const name of ['lyvra-hero-crest.webp','lyvra-resonance-banner.webp','lyvra-cyber-emblem.webp','lyvra-666soundsdesign-wordmark.webp'])assert.ok(html.includes(name),'progressive art slot missing '+name);
// New WEBLyvra staged artwork must remain complete; this checks presence, not binary hashes or deployment.
for(let i=1;i<=17;i++){
 const name=`art-${String(i).padStart(2,'0')}.webp`;
 const staged=join(root,'assets','addon-20261018',name);
 const snapshot=join(root,'source-snapshots','LYVRA_NEW_ART_20261018','optimized',name);
 const png=join(root,'source-snapshots','LYVRA_NEW_ART_20261018','originals',name.slice(0,-5)+'.png');
 for(const file of [staged,snapshot,png])assert.ok(existsSync(file),'missing artwork/source: '+file);
 const stagedBytes=readFileSync(staged),snapshotBytes=readFileSync(snapshot),originalBytes=readFileSync(png);
 assert.ok(stagedBytes.length>12,'empty or truncated staged WebP: '+name);
 assert.equal(stagedBytes.toString('ascii',0,4),'RIFF','WebP RIFF signature missing: '+name);
 assert.equal(stagedBytes.toString('ascii',8,12),'WEBP','WebP magic missing: '+name);
 assert.ok(stagedBytes.equals(snapshotBytes),'staged/snapshot WebP byte drift: '+name);
 assert.ok(originalBytes.length>24,'empty or truncated source PNG: '+name);
 assert.ok(originalBytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG signature missing: '+name);
}
for(const name of ['art-14.webp','art-17.webp'])assert.ok(html.includes(name),'Global Resonance/brand artwork missing: '+name);
// Google Resonance must not fabricate organic traffic or Google rank.
for(const token of ['id="google-resonance"','renderGoogleResonance(lang)','grPlatforms','grProducts','grState.filter','grCopy','MESSDATEN AUSSTEHEND','METRICS PENDING','Google Search Console','noopener noreferrer'])assert.ok(html.includes(token),'Google Resonance capability missing: '+token);
assert.ok(html.includes("value.textContent='—'"),'unverified search metric must remain empty');
assert.ok(html.includes("item.level/3*100"),'evidence-tier progress bars missing');
assert.ok(html.includes("sort((a,b)=>b.level-a.level"),'ranking must sort by evidence level');
assert.ok(html.includes('Suno: 436 öffentlich erfasste Songversionen'),'stale German discovery count');
assert.ok(html.includes('Suno: 436 publicly observed song versions'),'stale English discovery count');
assert.ok(html.includes('SoundCloud: 45 Alben/Sets und 122 eigenständige Tracks/Mixe'),'German SoundCloud count regressed');
assert.ok(html.includes('SoundCloud: 45 albums/sets and 122 separate tracks/mixes'),'English SoundCloud count regressed');
assert.ok(!html.includes('Suno: 418')&&!html.includes('SoundCloud: 30'),'obsolete count restored');
assert.ok(html.includes('LIVE ON WEBLYVRA')&&html.includes('AUF WEBLYVRA LIVE'),'live standalone classification missing');
assert.ok(html.includes('grState.filter=key')&&html.includes('aria-pressed'),'reach filters must update pressed state');
assert.ok(html.includes("const source=[...grPlatforms,...grProducts]"),'ranking has lost indexed platforms and curated products');
assert.ok(html.includes("w.level+' '+item.level+'/3"),'ranking accessibility provenance label missing');
assert.ok(html.includes('prefers-reduced-motion'),'reduced-motion safety missing');
assert.ok(platform.platforms.length>=15,'platform coverage unexpectedly reduced');
assert.ok(platform.radio?.players?.length>=4,'radio provider coverage unexpectedly reduced');
console.log('PASS: 436 Suno + 45 SoundCloud sets + 122 distinct SoundCloud tracks + 17 staged WebP/source byte-pair checks + UI/radio/language regression');
console.log('NOTE: original WebP binary remote verification is separate; this test does not claim asset delivery.');
