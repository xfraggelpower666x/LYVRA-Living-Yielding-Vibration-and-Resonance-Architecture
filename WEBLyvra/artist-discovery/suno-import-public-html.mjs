#!/usr/bin/env node
// Suno public profile HTML → evidence-scoped existing JSON catalog.
// Node >=18. No network/API/login. Operates only on supplied public HTML readback.
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
const dataFile = process.argv[3] ?? path.join(path.dirname(new URL(import.meta.url).pathname),'data','suno-releases.json');
const apply = process.argv.includes('--apply');
if (!input) {
  console.error('Usage: node suno-import-public-html.mjs <public-suno-profile.html> [catalog.json] [--apply]');
  process.exit(2);
}
const html=fs.readFileSync(input,'utf8');
const raw=JSON.parse(fs.readFileSync(dataFile,'utf8'));
if (!Array.isArray(raw.public_songs)) throw new Error('Expected public_songs array');
const deentity=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#(?:39|x27);/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').trim();
const re=/<a\b[^>]*href="https:\/\/suno\.com\/song\/([0-9a-f-]{36})"[^>]*>([^<]{1,250})<\/a>/g;
const seen=new Map();
for (const m of html.matchAll(re)) {
  const title=deentity(m[2]);
  if (title) seen.set(m[1],title);
}
if (!seen.size) throw new Error('No public Suno song title anchors. Refusing empty ingestion.');
const known=new Map(raw.public_songs.map(s=>[s.url,s]));
const conflicts=[], additions=[];
for (const [id,title] of seen) {
  const url='https://suno.com/song/'+id;
  const existing=known.get(url);
  if (existing && existing.title !== title) conflicts.push({url,oldTitle:existing.title,observedTitle:title});
  else if (!existing) additions.push({title,url,status:'public_profile_html_anchor_readback',source:'supplied public Suno HTML readback'});
}
console.log(JSON.stringify({sourceIds:seen.size,existing:known.size,new:additions.length,titleConflicts:conflicts,preview:additions.slice(0,12)},null,2));
if (conflicts.length) {console.error('Conflicts require manual review. No write.');process.exit(3);}
if (apply) {
  raw.public_songs.push(...additions);
  raw.observed_public_song_links=raw.public_songs.length;
  raw.coverage='partial; public profile song count and HTML anchor coverage are separate measurements';
  fs.writeFileSync(dataFile,JSON.stringify(raw,null,2)+'\n');
  console.log('Wrote',dataFile);
} else console.log('Dry run. Pass --apply only after reviewing evidence and backups.');
