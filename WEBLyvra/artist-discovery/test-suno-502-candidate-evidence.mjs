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
const latest=read('SUNO_DISCOVERY_514_PUBLIC_LINKS_2026-10-27.json');
const html=readFileSync(join(here,'index.html'),'utf8');
const match=html.match(/const discoItems=(\[[^;]*\]);\s*const discoState=/s);
assert(match,'discography data marker missing');
const embedded=JSON.parse(match[1]);
assert.equal(receipt.origin_scope,'WEBLYVRA_ADDON_ONLY');
assert.equal(receipt.status,'REVIEW_BRANCH_ONLY_NOT_IMPORTED');
assert.equal(receipt.candidate_songs.length,20);
assert.equal(catalog.public_songs.length,514);
assert.equal(latest.new_songs.length,32);
assert.equal(latest.profile_displayed_song_count,514);
assert.equal(latest.baseline_suno_urls,482);
assert.equal(albums.length,45);
assert.equal(tracks.length,122);
assert.equal(embedded.length,681);
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
assert.equal(urls.size,681,'duplicate unified link');
for(const song of catalog.public_songs)assert(urls.has(song.url),'lost Suno URL');
for(const soundcloud of [...albums,...tracks])assert(urls.has(soundcloud.url),'lost SoundCloud URL');
for(const candidate of receipt.candidate_songs){
 assert(sunoURL.test(candidate.url),'invalid candidate URL');
 assert(uuid.has(candidate.uuid),'candidate not preserved');
 assert(candidate.url.endsWith('/'+candidate.uuid),'candidate mismatch');
}
for(const latestSong of latest.new_songs){
 assert(sunoURL.test(latestSong.url),'invalid 514 discovery source UUID');
 assert(uuid.has(latestSong.uuid),'new 514 UUID not preserved');
 assert(urls.has(latestSong.url),'new 514 song missing from page');
}
assert(html.includes('Suno: 514 katalogisierte öffentliche Song-URLs'));
assert(html.includes('Suno: 514 catalogued public song URLs'));
assert(html.includes('const discoFocus=host.contains(focused)'));
assert(html.includes('lyvra:languagechange'));
console.log('WEBLYVRA_ADDON_514_681_SOURCE_EVIDENCE_PASS; 514 PROFILE COUNT VS 280 DIRECT CURRENT LINKS; EARLIER LINKS RETAINED');
