import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const dir=dirname(fileURLToPath(import.meta.url));
const dist=resolve(dir,'../../live/dist');
const main=readFileSync(resolve(dist,'index.html'),'utf8');
const app=readFileSync(resolve(dist,'app.js'),'utf8');
const language=readFileSync(resolve(dist,'i18n.js'),'utf8');
const addon=readFileSync(resolve(dir,'../../artist-discovery/index.html'),'utf8');
const catalog=JSON.parse(readFileSync(resolve(dir,'../../artist-discovery/data/suno-releases.json'),'utf8')).public_songs;
test('R04: one existing same-origin header navigation entry, no duplicate selector',()=>{
  assert.equal([...main.matchAll(/href="\/artist-discovery\/"/g)].length,1);
  assert.match(main,/<nav class="nav"[^>]*id="navigation"/);
  assert.match(main,/class="menu"[^>]*aria-controls="navigation"/);
});
test('R04: host owns DE/EN and discovery header labels follow host event',()=>{
  assert.match(language,/export function getLanguage\(\)/);
  assert.match(language,/lyvra:languagechange/);
  assert.match(app,/function updateDiscoveryNavLabel\(language = getLanguage\(\)\)/);
  assert.match(app,/Musik & Plattformen ↗/);
  assert.match(app,/Music & Platforms ↗/);
  assert.match(app,/document\.addEventListener\('lyvra:languagechange', \(\) => updateDiscoveryNavLabel\(\)\)/);
  assert.match(app,/initializeLanguage\(\);\s*updateDiscoveryNavLabel\(\);/);
});
test('R04: direct return to same origin, standalone language state preserved',()=>{
  assert.match(addon,/class="back" href="https:\/\/weblyvra\.666soundsdesign-broadcaster\.com\/"/);
  assert.match(addon,/data-addon-lang="de"/);
  assert.match(addon,/data-addon-lang="en"/);
  assert.match(addon,/lyvra-language/);
});
test('R04: live release dataset remains 514 Suno and 681 combined without importing into main shell',()=>{
  assert.equal(catalog.length,514);
  const match=addon.match(/const discoItems=(\[[^;]*\]);\s*const discoState=/s);
  assert(match,'add-on discography data missing');
  const items=JSON.parse(match[1]);
  assert.equal(items.length,681);
  assert.equal(new Set(items.map(x=>x.url)).size,681);
  assert.match(main,/id="radio"/);
  assert.match(main,/href="\/artist-discovery\/"/);
});
