// R02 review-only host compatibility guard. No deployment or homepage integration.
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const addonRoot = path.resolve(root, '..', 'artist-discovery');
const read = file => fs.readFileSync(file, 'utf8');
const hostHtml = read(path.join(root, 'dist/index.html'));
const hostI18n = read(path.join(root, 'dist/i18n.js'));
const hostDynasty = read(path.join(root, 'dist/dynasty.js'));
const addon = read(path.join(addonRoot, 'index.html'));
const catalog = JSON.parse(read(path.join(addonRoot, 'data/suno-releases.json')));
const albums = JSON.parse(read(path.join(addonRoot, 'data/soundcloud-albums.json'))).albums;
const tracks = JSON.parse(read(path.join(addonRoot, 'data/soundcloud-tracks.json'))).tracks;
assert(hostHtml.includes('href="/artist-discovery/"'), 'main-site standalone navigation was removed');
assert(hostHtml.includes('id="language"'), 'original main-site language selector was removed');
assert(hostHtml.includes('id="radio"'), 'original radio section was removed');
for (const signal of ['export function getLanguage()', 'export function setLanguage(', 'lyvra:languagechange', "localStorage.setItem('lyvra-language'"]) {
  assert(hostI18n.includes(signal), 'host language authority drift: '+signal);
}
assert(hostDynasty.includes('function connectedContent()'), 'existing dynamic connected cards missing');
assert(hostDynasty.includes("document.addEventListener('lyvra:languagechange',refresh)"), 'host dynamic cards no longer react to language changes');
assert(addon.includes('const discoFocus=host.contains(focused)'), 'add-on discography focus retention missing');
assert(addon.includes('if(!replacement)filters.querySelector('), 'add-on Product Reach fallback missing');
assert(addon.includes("document.addEventListener('lyvra:languagechange'"), 'add-on language event listener missing');
assert(addon.includes('data-addon-lang="de"') && addon.includes('data-addon-lang="en"'), 'standalone language controls changed: verify integration mode before embedding');
assert.equal(catalog.public_songs.length,462,'protected Suno baseline changed; separate additive catalog review required');
assert.equal(albums.length,45,'protected SoundCloud album inventory changed');
assert.equal(tracks.length,122,'protected SoundCloud track inventory changed');
console.log('WEBLYVRA_R02_REVIEW_GUARD_PASS source contracts only; NO HOST, IPHONE, DEPLOY OR HOMEPAGE MERGE PASS');
