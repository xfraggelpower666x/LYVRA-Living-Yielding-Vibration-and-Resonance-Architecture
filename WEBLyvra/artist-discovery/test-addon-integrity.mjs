#!/usr/bin/env node
import {readFileSync,existsSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import { Script } from 'node:vm';
const root=dirname(fileURLToPath(import.meta.url));
const html=readFileSync(join(root,'index.html'),'utf8');
// Parse the actual inline browser JavaScript without executing DOM or external network actions.
const inlineScripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(match=>match[1]).filter(Boolean);
assert.ok(inlineScripts.length>0,'missing executable inline add-on scripts');
for(const code of inlineScripts)assert.doesNotThrow(()=>new Script(code,{filename:'artist-discovery-inline.js'}),'embedded JavaScript syntax regression');
const suno=JSON.parse(readFileSync(join(root,'data/suno-releases.json'),'utf8')).public_songs;
const soundcloud=JSON.parse(readFileSync(join(root,'data/soundcloud-albums.json'),'utf8')).albums;
const soundcloudTracks=JSON.parse(readFileSync(join(root,'data/soundcloud-tracks.json'),'utf8')).tracks;
const albumDetails=JSON.parse(readFileSync(join(root,'data/soundcloud-album-details.json'),'utf8'));
const apiOwner=JSON.parse(readFileSync(join(root,'data/soundcloud-owned-api-export-20261103.json'),'utf8'));
assert.equal(apiOwner.schema,'LYVRA_SOUNDCLOUD_OWNER_EXPORT_20261103_V1','original SoundCloud API export not bound');
assert.equal(apiOwner.expected_sets,50,'50 original SoundCloud sets lost');
assert.equal(apiOwner.owned_unique_track_ids,3183,'owned SoundCloud track count drift');
assert.equal(apiOwner.external_unique_track_ids,21,'external songs improperly promoted');
assert.equal(apiOwner.complete,false,'partial original export misrepresented as complete');
assert.equal(apiOwner.albums.length,50,'SoundCloud export set coverage drift');
const apiIds=new Set(), apiUrls=new Set();
for(const album of apiOwner.albums){
 assert.match(album.url,/^https:\/\/soundcloud\.com\/fraggelpower666\/sets\/[a-z0-9_-]+$/i,'invalid SoundCloud set owner URL');
 for(const track of album.tracks){
  assert.equal(track.length,4,'original SoundCloud membership format drift');
  assert.match(track[3],/^https:\/\/soundcloud\.com\/fraggelpower666\/[a-z0-9_-]+$/i,'foreign SoundCloud link embedded in owned export');
  apiIds.add(track[1]);apiUrls.add(track[3]);
 }
}
assert.equal(apiIds.size,3183,'original API-ID ownership coverage drift');
assert.equal(apiUrls.size,3183,'original API owned URL coverage drift');
assert.equal(apiOwner.albums.reduce((n,a)=>n+a.tracks.length,0),3185,'owner membership count drift');
for(const token of ["const discoOwnerSource='./data/soundcloud-owned-api-export-20261103.json'","if(ownerTracks.size!==3183)throw new Error","discoOwnerReadback.state='READBACK_PENDING'","loadOriginalSoundcloudAlbumTracks();"])assert.ok(html.includes(token),'complete source owner-export runtime binding missing: '+token);

const soundcloudPlaylists=albumDetails.public_playlists;
const mixcloud=JSON.parse(readFileSync(join(root,'data/mixcloud-releases.json'),'utf8'));
const mixcloudItems=[...mixcloud.shows,...mixcloud.tracks];
const platform=JSON.parse(readFileSync(join(root,'data/platforms.json'),'utf8'));

const evidence=JSON.parse(readFileSync(join(root,'data/discovery-evidence.json'),'utf8'));
assert.equal(evidence.catalog.total,suno.length+soundcloud.length+soundcloudTracks.length+soundcloudPlaylists.length+mixcloudItems.length,'discovery snapshot catalog count mismatch');
assert.equal(evidence.catalog.soundcloud_playlists,2,'source playlist count missing');
assert.equal(evidence.catalog.soundcloud_verified_album_member_urls,233,'album members evidence drift');
assert.equal(evidence.catalog.soundcloud_new_unique_tracks_from_albums,216,'new album derived track links drift');
assert.equal(evidence.catalog.suno,suno.length,'Suno snapshot count mismatch');
assert.equal(evidence.catalog.soundcloud_sets,soundcloud.length,'SoundCloud sets snapshot count mismatch');
assert.equal(evidence.catalog.soundcloud_tracks,soundcloudTracks.length,'SoundCloud tracks snapshot count mismatch');
assert.equal(evidence.catalog.mixcloud_shows,mixcloud.shows.length,'Mixcloud shows snapshot count mismatch');
assert.equal(evidence.catalog.mixcloud_tracks,mixcloud.tracks.length,'Mixcloud tracks snapshot count mismatch');
assert.match(evidence.last_scan_date,/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/,'evidence scan date invalid');
assert.equal(evidence.cost_contract.maximum_incremental_cost_usd,0,'zero additional cost violated');
assert.equal(evidence.discovery_index.is_google_rank,false,'editorial ranking improperly called a Google rank');
assert.equal(evidence.measurements.impressions,null,'Google impressions fabricated');
assert.equal(evidence.google_ai_overview_observation.source_kind,'user_supplied_screenshot_of_google_ai_overview','AI overview provenance missing');
assert.equal(evidence.google_ai_overview_observation.independently_reproduced,false,'screenshot promoted to independent proof');
assert.equal(evidence.google_ai_exact_phrase_estimate_observation.estimate_min_relevant_pages,15,'AI estimated lower bound altered');
assert.equal(evidence.google_ai_exact_phrase_estimate_observation.estimate_max_relevant_pages,30,'AI estimated upper bound altered');
assert.equal(evidence.google_ai_exact_phrase_estimate_observation.independently_reproduced,false,'AI estimate incorrectly promoted to verified');
assert.equal(evidence.bing_exact_artist_search_observation.displayed_approximate_results,2160,'Bing displayed result count changed');
assert.equal(evidence.bing_666soundsdesign_search_observation.query,'"666soundsdesign"','brand Bing query must be separate');
assert.equal(evidence.bing_666soundsdesign_search_observation.displayed_approximate_results,1510,'brand Bing screenshot count changed');
assert.equal(evidence.bing_666soundsdesign_search_observation.independently_reproduced,false,'brand Bing screenshot incorrectly marked independent');
assert.equal(evidence.bing_666soundsdesign_search_observation.not_google_result_count,true,'brand Bing results must not become Google totals');
assert.equal(evidence.google_ai_666soundsdesign_overview_observation.independently_reproduced,false,'brand AI Overview incorrectly marked independent');
assert.equal(evidence.google_ai_666soundsdesign_overview_observation.does_not_change_resonance_scores,true,'AI summary must not modify editorial scores');
assert.ok(html.includes("const brandBingData=grEvidence.bing_666soundsdesign_search_observation"),'brand Bing card source absent');
assert.ok(html.includes("const brandAiData=grEvidence.google_ai_666soundsdesign_overview_observation"),'brand AI summary source absent');

assert.deepEqual(evidence.bing_exact_artist_search_observation.history.map(x=>x.displayed_approximate_results),[1470,2160],'Bing observations history lost');
assert.equal(evidence.bing_exact_artist_search_observation.estimate_change_not_verified_growth,true,'Bing estimate change misrepresented as growth');
assert.equal(evidence.bing_exact_artist_search_observation.independently_reproduced,false,'Bing screenshot promoted to independent proof');
assert.equal(evidence.bing_exact_artist_search_observation.not_unique_pages,true,'Bing displayed hits incorrectly treated as counted unique URLs');
assert.equal(evidence.bing_exact_artist_search_observation.not_google_result_count,true,'Bing value misrepresented as Google result count');
assert.equal(evidence.bing_exact_artist_search_observation.does_not_change_search_term_samples,true,'Bing screenshot mutated search-link samples');
assert.ok(html.includes("className='gr-bing-observation'")&&html.includes('grEvidence.bing_exact_artist_search_observation'),'Bing observation UI missing');

assert.equal(evidence.google_ai_exact_phrase_estimate_observation.does_not_change_sampled_search_link_counts,true,'Google AI estimate must not change real search link counts');
assert.equal(evidence.search_term_samples.terms[0].distinct_sampled_result_urls,28,'direct search sample incorrectly overwritten');
assert.equal(evidence.search_term_samples.terms[1].distinct_sampled_result_urls,25,'brand search sample incorrectly overwritten');
assert.equal(evidence.search_term_samples.terms.length,3,'artist aliases must be kept separate');
assert.equal(evidence.search_term_samples.terms[2].term,'fragglepower666','English spelling not catalogued');
assert.equal(evidence.search_term_samples.terms[2].distinct_sampled_result_urls,19,'English spelling search sample mismatch');
assert.equal(evidence.search_term_samples.terms[2].not_total_google_hits,true,'alias sample incorrectly called Google total');
assert.ok(html.includes("className='gr-google-ai-range'")&&html.includes('grEvidence.google_ai_exact_phrase_estimate_observation'),'Google AI estimated range UI missing');

assert.equal(evidence.google_ai_overview_observation.not_for_scoring_adjustment,true,'AI overview must not inflate popularity scores');
assert.equal(evidence.semrush_backlink_observation.target_domain,'666soundsdesign-broadcaster.com','Semrush target changed');
assert.equal(evidence.semrush_backlink_observation.estimated_backlinks_display,'5.2K','Semrush screenshot backlink count changed');
assert.equal(evidence.semrush_backlink_observation.referring_domains,230,'Semrush referring domain count changed');
assert.equal(evidence.semrush_backlink_observation.authority_score,2,'Semrush authority screenshot changed');
assert.equal(evidence.semrush_backlink_observation.dofollow_backlinks_percent,98.44,'Semrush dofollow screenshot changed');
assert.equal(evidence.semrush_backlink_observation.independently_reproduced,false,'Semrush estimate incorrectly promoted to verified');
assert.equal(evidence.semrush_backlink_observation.does_not_contribute_to_editorial_resonance_scores,true,'Backlink volume must not inflate discovery ranking');
assert.equal(evidence.webradio_seo_audit_observation.target_scope,'WEBRADIO_SITE_ONLY','Webradio audit leaked into another target');
assert.equal(evidence.webradio_seo_audit_observation.seo_score_out_of_100,55,'SEO screenshot score drift');
assert.equal(evidence.webradio_seo_audit_observation.critical_count,8,'SEO screenshot critical drift');
assert.equal(evidence.webradio_seo_audit_observation.warnings_count,4,'SEO screenshot warning drift');
assert.equal(evidence.webradio_seo_audit_observation.passed_count,10,'SEO screenshot passed drift');
assert.equal(evidence.webradio_seo_audit_observation.individual_findings_available,false,'invented individual SEO findings');
assert.equal(evidence.webradio_seo_audit_observation.does_not_contribute_to_editorial_resonance_scores,true,'SEO score must not inflate artist ranking');
assert.equal(evidence.webradio_seo_audit_observation.no_cross_system_mutation,true,'foreign WEBRADIO auto-mutation forbidden');
assert.ok(html.includes("className='gr-webradio-audit'")&&html.includes('grEvidence.webradio_seo_audit_observation'),'Webradio SEO evidence card missing');
assert.ok(html.includes("className='gr-semrush'")&&html.includes('grEvidence.semrush_backlink_observation'),'Semrush warning panel missing');
assert.ok(html.includes("className='gr-ai-observation'")&&html.includes('grEvidence.google_ai_overview_observation'),'Google AI overview evidence UI missing');
assert.equal(evidence.measurements.clicks,null,'Google clicks fabricated');
assert.equal(evidence.measurements.ctr,null,'Google CTR fabricated');
assert.equal(evidence.platform_presence.length,9,'source-backed platform coverage drift');
assert.ok(evidence.platform_presence.every(x=>Number.isInteger(x.discovery_points)&&x.discovery_points>=0&&x.discovery_points<=100),'index scores malformed');
assert.ok(html.includes('const grEvidence='+JSON.stringify(evidence)+';'),'inline Google Resonance evidence differs from ship-ready JSON');
assert.ok(html.includes("className='gr-index-fill'")&&html.includes("grEvidence.last_scan_date"),'dated graphical evidence ranking missing');

const found=html.match(/const discoItems=(\[[^;]*\]);\s*const discoState=/s);
assert.ok(found,'embedded unified diskography missing');
const entries=JSON.parse(found[1]);
assert.ok(suno.length>=462,'protected 462-entry Suno baseline regressed');
assert.ok(entries.length>=629,'protected 629-entry unified discovery baseline regressed');
assert.equal(soundcloud.length,48,'current SoundCloud album/set snapshot count mismatch');
assert.equal(soundcloudTracks.length,358,'current SoundCloud track/mix snapshot count mismatch');
const trackUrls=new Set();
for(const track of soundcloudTracks){
 assert.ok(track.title&&typeof track.title==='string','SoundCloud track title missing');
 assert.ok(/^https:\/\/soundcloud\.com\/fraggelpower666\//.test(track.url),'unexpected artist track URL');
 assert.ok(!track.url.includes('/sets/'),'SoundCloud album/set leaked into track inventory');
 assert.ok(!trackUrls.has(track.url),'duplicate SoundCloud track URL');
 trackUrls.add(track.url);
}
assert.equal(entries.length,suno.length+soundcloud.length+soundcloudTracks.length+soundcloudPlaylists.length+mixcloudItems.length,'discography missing entries');
assert.equal(mixcloud.shows.length,10,'Mixcloud show count mismatch');
assert.equal(mixcloud.tracks.length,10,'Mixcloud track count mismatch');
assert.equal(new Set(mixcloudItems.map(x=>x.url)).size,20,'Mixcloud duplicate URLs');
const urls=new Set();
for(const entry of entries){
 assert.ok(['Suno','SoundCloud','Mixcloud'].includes(entry.provider),'unknown provider');
 assert.ok(typeof entry.title==='string'&&entry.title.length>0,'title missing');
 assert.ok(/^https:\/\/(suno\.com\/song\/|soundcloud\.com\/fraggelpower666\/|www\.mixcloud\.com\/Fraggelpower666\/)/.test(entry.url),'unexpected release URL');
 assert.ok(!urls.has(entry.url),'duplicate release URL');
 urls.add(entry.url);
}
for(const original of [...suno,...soundcloud,...soundcloudTracks,...soundcloudPlaylists,...mixcloudItems])assert.ok(urls.has(original.url),'original public URL lost');
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
assert.ok(html.includes('Suno: '+suno.length+' verifizierte Song-URLs'),'stale German discovery count');
assert.ok(html.includes('Suno: '+suno.length+' verified song URLs'),'stale English discovery count');
assert.ok(html.includes('SoundCloud: 48 Alben/Sets, 2 Playlists und 358 Einzeltracks'),'German SoundCloud count regressed');
assert.ok(html.includes('SoundCloud: 48 albums/sets, 2 playlists and 358 individual tracks'),'English SoundCloud count regressed');
assert.ok(!html.includes('Suno: 418')&&!html.includes('Suno: 436')&&!html.includes('SoundCloud: 30'),'obsolete count restored');
assert.ok(html.includes('LIVE ON WEBLYVRA')&&html.includes('AUF WEBLYVRA LIVE'),'live standalone classification missing');
assert.ok(html.includes('Dieses eigenständige Add-on ist über WEBLyvra live erreichbar'),'German footer must reflect productive standalone deployment');
assert.ok(html.includes('This standalone add-on is live on WEBLyvra'),'English footer must reflect productive standalone deployment');
assert.ok(!html.includes('Diese Vorschau ist unabhängig von der produktiven LYVRA-Webseite.')&&!html.includes('This preview is separate from the production LYVRA website.'),'obsolete standalone preview copy restored');
assert.ok(html.includes('grState.filter=key')&&html.includes('aria-pressed'),'reach filters must update pressed state');
assert.ok(html.includes("const source=[...grPlatforms,...grProducts]"),'ranking has lost indexed platforms and curated products');
assert.ok(html.includes("w.level+' '+item.level+'/3"),'ranking accessibility provenance label missing');
// Separate, voluntary public search checks must never be presented as measured Google rankings.
for(const token of ['gr-search-check','encodeURIComponent(',"'https://www.google.com/search?q='+encodeURIComponent",'w.checkHelp','Check on Google','Google prüfen','item.label'])assert.ok(html.includes(token),'Google item search source check missing: '+token);
assert.ok(html.includes("'linked_from_current_weblyvra_or_mixcloud'].includes(p.status)?2:1"),'verified crosslinked profiles must receive tier 2 rather than fallback tier 1');
assert.ok(html.includes("label:'ALIEN (BLUE LASER GALAXY INVASION) (Special Version)',url:'https://tidal.com/album/564577352'"),'TIDAL release title must preserve verified Special Version suffix');
// The product reach filter must report catalogued row counts, not invent analytics.
for(const token of ["results:'Dokumentierte Einträge: '","results:'Documented entries: '","resultCount.textContent=w.results+source.length","resultCount.setAttribute('role','status')","rankPanel.append(rankHeading,rankInfo,filters,resultCount,listing"]){
 assert.ok(html.includes(token),'accessible bilingual product-reach result count missing: '+token);
}
// Mobile reach layout, keyboard focus and concise screen-reader announcement must survive.
for(const token of ['@media(max-width:480px)','#google-resonance .gr-item .gr-label{grid-column:1/-1}','#google-resonance .gr-filter button:focus-visible','#google-resonance a:focus-visible','min-height:44px',"listing.setAttribute('role','list')","row.setAttribute('role','listitem')","resultCount.setAttribute('role','status')","track.setAttribute('aria-label',item.label"]){
 assert.ok(html.includes(token),'mobile/accessibility regression: '+token);
}
assert.ok(html.includes('#google-resonance .gr-link-row a{display:inline-flex;align-items:center;min-height:44px;'), 'product reach source and search links must keep at least 44px touch height');
for(const token of ['@media(forced-colors:active)','outline:3px solid Highlight','forced-color-adjust:none;background:Highlight','border:2px solid Highlight']){
 assert.ok(html.includes(token),'forced-colors keyboard/visual regression: '+token);
}
assert.ok(!html.includes("listing.setAttribute('aria-live','polite')"),'duplicate live-region announcements reintroduced');
// A DE/EN language switch re-renders the filter buttons: preserve the specific focused key.
for(const token of ["const focusedReachFilter=document.activeElement?.closest?.('#google-resonance .gr-filter button')?.dataset.reachFilter","button.dataset.reachFilter=key","if(focusedReachFilter)filters.querySelector('[data-reach-filter=\"'+focusedReachFilter+'\"]')?.focus({preventScroll:true})"]){
 assert.ok(html.includes(token),'reach keyboard focus must survive language changes: '+token);
}
// Preserve exact external source/search link focus when a DE/EN change rebuilds the ranking.
for(const token of ["const focusedReachLink=document.activeElement?.closest?.('#google-resonance .gr-item a')","const focusedReachHref=focusedReachLink?.href","focusedReachLink?.classList.contains('gr-search-check')?'search':'source'","link.href===focusedReachHref","replacement?.focus({preventScroll:true})"]){
 assert.ok(html.includes(token),'reach source/search keyboard focus regression: '+token);
}
// The discovered Product Reach DE/EN focus contract must have an accessible user-facing entry point.
for(const token of ['role="group" aria-label="Language / Sprache"','data-addon-lang="de"','data-addon-lang="en"','.addon-lang button:focus-visible','min-width:44px;min-height:44px',"button.dataset.addonLang===lang","localStorage.setItem('lyvra-language',selected)","new CustomEvent('lyvra:languagechange'"]){
 assert.ok(html.includes(token),'visible bilingual mobile language control regression: '+token);
}
// Visible filter badges must report actual inventory category counts, never the 617-link discography count.
for(const token of ["const reachEntries=[...grPlatforms,...grProducts]","key==='all'?reachEntries.length:reachEntries.filter(item=>item.category===key).length","button.textContent=w[key]+' ('+count+')'","button.setAttribute('aria-pressed',String(grState.filter===key))"]){
 assert.ok(html.includes(token),'Product Reach badge/state contract missing: '+token);
}
assert.ok(!html.includes("anchor.setAttribute('aria-label',item.label+"),'release source link should announce its visible name only, not repeat the evidence tier');
assert.ok(html.includes('Die Position dort ist nicht gemessen'),'Google uncertainty disclosure missing');
assert.ok(html.includes('Its position is not measured'),'English Google uncertainty disclosure missing');
assert.ok(html.includes('prefers-reduced-motion'),'reduced-motion safety missing');

assert.equal(albumDetails.albums.length,48,'SoundCloud original album cover inventory');
assert.equal(soundcloudPlaylists.length,2,'independent SoundCloud playlist inventory');
assert.equal(albumDetails.total_album_track_memberships,233,'original SoundCloud album track memberships');
assert.equal(albumDetails.distinct_album_track_urls,233,'distinct SoundCloud album track links');
assert.equal(albumDetails.filtered_spurious_album_activity_links,47,'activity-page false positives must remain removed');
const albumUrls=new Set(soundcloud.map(a=>a.url));
const scTrackUrls=new Set(soundcloudTracks.map(t=>t.url));
const sourceMembership=new Set();
for(const album of albumDetails.albums){
 assert.ok(albumUrls.has(album.url),'album details lost original set: '+album.url);
 assert.match(album.artwork_url,/^https:\/\/i[0-9]\.sndcdn\.com\/(artworks|avatars)-[A-Za-z0-9-]+\.(jpg|png)$/,'official SoundCloud album artwork invalid');
 assert.ok(album.track_urls.length>=1,'album has no direct track list: '+album.url);
 const pageSlug=album.url.split('/').at(-1);
 assert.ok(!album.track_urls.includes('https://soundcloud.com/fraggelpower666/'+pageSlug),'album activity link incorrectly counted as track');
 for(const trackUrl of album.track_urls){assert.ok(scTrackUrls.has(trackUrl),'SoundCloud album track missing from global track list: '+trackUrl);sourceMembership.add(trackUrl);}
}
assert.equal(sourceMembership.size,233,'album membership coverage');
assert.ok(html.includes('const discoAlbumDetails='),'album detail data not embedded in actual page');
const embeddedAlbum=html.match(/const discoAlbumDetails=(\{[^\n]*\});/);
assert.ok(embeddedAlbum,'album data inline source missing');
const albumUi=JSON.parse(embeddedAlbum[1]);
assert.equal(albumUi.albums.length,48,'inline album details mismatch');
assert.equal(albumUi.playlists.length,2,'inline playlist data mismatch');
assert.equal(Object.keys(albumUi.track_artwork).length,233,'source verified album cover track mapping incomplete');
assert.ok(html.includes("className='disco-cover'")&&html.includes("className='disco-track-list'"),'official cover + expandable album list UI missing');
assert.ok(html.includes("link.href=track.url")&&html.includes("link.rel='noopener noreferrer'"),'album track original links missing safe target');
assert.ok(html.includes("image.loading='lazy'"),'remote SoundCloud artwork lazy-loading missing');

assert.ok(platform.platforms.length>=15,'platform coverage unexpectedly reduced');
assert.ok(platform.radio?.players?.length>=4,'radio provider coverage unexpectedly reduced');
console.log('PASS: '+suno.length+' Suno + '+soundcloud.length+' SoundCloud sets + '+soundcloudTracks.length+' distinct SoundCloud tracks + 17 staged WebP/source byte-pair checks + UI/radio/language regression');
console.log('NOTE: original WebP binary remote verification is separate; this test does not claim asset delivery.');
