#!/usr/bin/env node
// Candidate-branch evidence/coverage check. Does not make requests or write files.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const here=dirname(fileURLToPath(import.meta.url));
const read=p=>JSON.parse(readFileSync(join(here,p),'utf8'));
const catalog=read('data/suno-releases.json');
const albums=read('data/soundcloud-albums.json').albums;
const tracks=read('data/soundcloud-tracks.json').tracks;
const receipt=read('SUNO_DISCOVERY_CANDIDATE_502_2026-10-26.json');
const html=readFileSync(join(here,'index.html'),'utf8');
const match=html.match(/const discoItems=(\[[^;]*\]);\s*const discoState=/s);
assert(match,'discography data marker missing');
const embedded=JSON.parse(match[1]);
assert.equal(receipt.origin_scope,'WEBLYVRA_ADDON_ONLY');
assert.equal(receipt.status,'REVIEW_BRANCH_ONLY_NOT_IMPORTED');
assert.equal(receipt.candidate_songs.length,20);
assert.equal(catalog.public_songs.length,482);
assert.equal(albums.length,45);
assert.equal(tracks.length,122);
assert.equal(embedded.length,649);
assert.equal(receipt.source.visible_songs_total,502);
assert.equal(receipt.delta.not_individually_enumerated_remaining,20);
const uuid=new Set();
const sunoURL=/^https:\/\/suno\.com\/song\/([0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12})$/;
for(const entry of catalog.public_songs){
 assert(entry.title&&sunoURL.test(entry.url),'invalid song/title');
 const id=sunoURL.exec(entry.url)[1];
 assert(!uuid.has(id),'duplicate Suno UUID '+id);
 uuid.add(id);
}
const urls=new Set(embedded.map(x=>x.url));
assert.equal(urls.size,649,'duplicate unified link');
for(const song of catalog.public_songs)assert(urls.has(song.url),'lost Suno URL');
for(const soundcloud of [...albums,...tracks])assert(urls.has(soundcloud.url),'lost SoundCloud URL');
for(const candidate of receipt.candidate_songs){
 assert(sunoURL.test(candidate.url),'invalid candidate URL');
 assert(uuid.has(candidate.uuid),'candidate not preserved');
 assert(candidate.url.endsWith('/'+candidate.uuid),'candidate mismatch');
}
assert(html.includes('Suno: 482 katalogisierte öffentliche Song-URLs'));
assert(html.includes('Suno: 482 catalogued public song URLs'));
assert(html.includes('const discoFocus=host.contains(focused)'));
assert(html.includes('lyvra:languagechange'));
console.log('WEBLYVRA_ADDON_482_649_CANDIDATE_EVIDENCE_PASS; 502 PROFILE COUNT IS NOT FULL UUID COVERAGE');
