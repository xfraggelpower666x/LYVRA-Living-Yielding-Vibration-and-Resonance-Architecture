import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {JSDOM} from 'jsdom';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const read = name => readFileSync(path.join(root,name),'utf8');
const mainHTML = read('live/dist/index.html');
const discoveryHTML = read('artist-discovery/index.html');
const mainI18n = read('live/dist/i18n.js');
const dynasty = read('live/dist/dynasty-data.js');
const songs = JSON.parse(read('artist-discovery/data/suno-releases.json'));
const albums = JSON.parse(read('artist-discovery/data/soundcloud-albums.json'));
const tracks = JSON.parse(read('artist-discovery/data/soundcloud-tracks.json'));
const origin = 'https://weblyvra.666soundsdesign-broadcaster.com';
const main = new JSDOM(mainHTML,{url:origin+'/'}).window.document;
const addon = new JSDOM(discoveryHTML,{url:origin+'/artist-discovery/'}).window.document;

test('R04: homepage header has exactly one direct same-origin Discovery navigation entry',()=>{
  const links = [...main.querySelectorAll('header .nav a')].filter(a=>new URL(a.href).pathname==='/artist-discovery/');
  assert.equal(links.length,1);
  assert.equal(links[0].getAttribute('href'),'/artist-discovery/');
  assert.match(links[0].getAttribute('aria-label')||links[0].textContent, /Musik|Music|Plattform/i);
  assert.equal(new URL(links[0].href).origin,origin);
});
test('R04: mobile hamburger controls that same navigation tree and original header is preserved',()=>{
  const navigation = main.querySelector('header nav#navigation');
  const menu = main.querySelector('header button.menu');
  assert.ok(navigation?.contains(main.querySelector('header .nav a[href="/artist-discovery/"]')));
  assert.equal(menu?.getAttribute('aria-controls'),'navigation');
  assert.equal(menu?.getAttribute('aria-expanded'),'false');
  assert.equal(main.querySelectorAll('header .brand').length,1);
  assert.ok(main.querySelector('#radio'));
});
test('R04: addon header provides keyboard reachable backlink to same origin',()=>{
  const back = addon.querySelector('header a.back');
  assert.ok(back);
  assert.equal(new URL(back.href).origin,origin);
  assert.equal(new URL(back.href).pathname,'/');
  assert.equal(back.hasAttribute('tabindex')&&Number(back.tabIndex)<0,false);
});
test('R04: discovery catalogs preserve current 514 Suno + 45 sets + 122 tracks exactly',()=>{
  assert.equal(songs.public_songs.length,514);
  assert.equal(albums.albums.length,45);
  assert.equal(tracks.tracks.length,122);
  const urls = [...songs.public_songs,...albums.albums,...tracks.tracks].map(item=>item.url);
  assert.equal(urls.length,681);
  assert.equal(new Set(urls).size,681);
});
test('R04: distinct legacy destinations remain in main source, without card removal',()=>{
  const keys=['radio','veluna','twitchRadio','twitch','spotifyArtist','spotifyUser'];
  for (const key of keys) assert.match(dynasty,new RegExp('\\b'+key+':\\s*\\{[^}]*url:'));
    assert.ok(dynasty.includes('https://webradio.666soundsdesign-broadcaster.com/veluna/'));
    assert.ok(dynasty.includes('https://open.spotify.com/intl-de/artist/'));
  assert.ok(main.querySelector('#radio'));
  assert.ok(main.querySelector('[src*="gallery"]') || mainHTML.includes('gallery.js'));
});
test('R04: language authority remains host-only on main; addon keeps independent controls',()=>{
  assert.equal(main.querySelectorAll('#language').length,1);
  assert.equal(main.querySelectorAll('[data-addon-lang]').length,0);
  assert.equal(addon.querySelectorAll('[data-addon-lang]').length,2);
  assert.ok(mainI18n.includes('export function getLanguage('));
  assert.ok(mainI18n.includes('export function setLanguage('));
  assert.ok(mainI18n.includes('lyvra:languagechange'));
});
