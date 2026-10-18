#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=dirname(fileURLToPath(import.meta.url));
const html=readFileSync(join(root,'index.html'),'utf8');
const suno=JSON.parse(readFileSync(join(root,'data/suno-releases.json'),'utf8')).public_songs;
const soundcloud=JSON.parse(readFileSync(join(root,'data/soundcloud-albums.json'),'utf8')).albums;
const platform=JSON.parse(readFileSync(join(root,'data/platforms.json'),'utf8'));
const found=html.match(/const discoItems=(\[[^;]*\]);\s*const discoState=/s);
assert.ok(found,'embedded unified diskography missing');
const entries=JSON.parse(found[1]);
assert.equal(suno.length,418,'current verified Suno snapshot count mismatch');
assert.equal(soundcloud.length,45,'current SoundCloud snapshot count mismatch');
assert.equal(entries.length,suno.length+soundcloud.length,'discography missing entries');
const urls=new Set();
for(const entry of entries){
 assert.ok(['Suno','SoundCloud'].includes(entry.provider),'unknown provider');
 assert.ok(typeof entry.title==='string'&&entry.title.length>0,'title missing');
 assert.ok(/^https:\/\/(suno\.com\/song\/|soundcloud\.com\/fraggelpower666\/sets\/)/.test(entry.url),'unexpected release URL');
 assert.ok(!urls.has(entry.url),'duplicate release URL');
 urls.add(entry.url);
}
for(const original of [...suno,...soundcloud])assert.ok(urls.has(original.url),'original public URL lost');
for(const token of ['populateRadio(section)','lyvra:languagechange','lyvra-language','id="discography"','const originalArt=','discoState.limit+=40','rel=\'noopener noreferrer\''])assert.ok(html.includes(token),'protected capability missing: '+token);
for(const name of ['lyvra-hero-crest.webp','lyvra-resonance-banner.webp','lyvra-cyber-emblem.webp','lyvra-666soundsdesign-wordmark.webp'])assert.ok(html.includes(name),'progressive art slot missing '+name);
assert.ok(platform.platforms.length>=15,'platform coverage unexpectedly reduced');
assert.ok(platform.radio?.players?.length>=4,'radio provider coverage unexpectedly reduced');
console.log('PASS: 418 Suno links + 45 SoundCloud links + original source parity + radio/social + language + art fallback');
console.log('NOTE: original WebP binary remote verification is separate; this test does not claim asset delivery.');
