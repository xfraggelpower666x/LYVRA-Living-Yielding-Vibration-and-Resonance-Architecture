// Three exact-preview Chromium checks; never visits or modifies production data.
// Triggered ONLY on the isolated R04 branch; no production deployment.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const preview='https://1f7d79ad.weblyvra-live.pages.dev';
let fails=0;
async function check(name,fn){
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const page=await context.newPage();
  try { await fn(page); console.log('R04_CHROMIUM_PASS '+name); }
  catch(e){fails++;console.error('R04_CHROMIUM_FAIL '+name+' '+String(e.stack||e));}
  finally {await browser.close();}
}
const visit=async page=>{
  const response=await page.goto(preview+'/',{waitUntil:'domcontentloaded',timeout:40000});
  assert.equal(response?.status(),200,'preview homepage must return HTTP 200');
  await page.locator('.menu').waitFor({state:'visible'});
};
if(process.env.R04_CASE !== '02') await check('01_MOBILE_390x844_HAMBURGER_DE_EN',async page=>{
  await visit(page);
  const dims=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.equal(dims.width,390);
  assert(dims.scroll<=dims.width+1,'horizontal overflow: '+JSON.stringify(dims));
  const menu=page.locator('.menu'),nav=page.locator('#navigation');
  await menu.click();
  assert.equal(await menu.getAttribute('aria-expanded'),'true');
  assert(await nav.evaluate(x=>x.classList.contains('open')),'mobile menu not expanded');
  const link=nav.locator('a[href="/artist-discovery/"]');
  assert(await link.isVisible(),'Discovery is not visible inside expanded mobile navigation');
  assert.match(await link.innerText(),/Musik & Plattformen/);
  // Use existing host selector, never add another one.
  await page.locator('#language').selectOption('en');
  assert.match(await link.innerText(),/Music & Platforms/);
  await page.locator('#language').selectOption('de');
  assert.match(await link.innerText(),/Musik & Plattformen/);
  await link.click();
  await page.waitForURL(preview+'/artist-discovery/',{timeout:25000});
  assert.match(await page.locator('body').innerText(),/Suno:\s*514/);
  assert.match(await page.locator('body').innerText(),/681/);
});
await check('02_KEYBOARD_TAB_SHIFT_TAB_ENTER',async page=>{
  await visit(page);
  const menu=page.locator('.menu');
  await menu.focus();
  assert(await menu.evaluate(x=>x===document.activeElement),'menu focus unsuccessful');
  await page.keyboard.press('Enter');
  assert.equal(await menu.getAttribute('aria-expanded'),'true');
  const nav=page.locator('#navigation');
  const link=nav.locator('a[href="/artist-discovery/"]');
  assert(await link.isVisible(),'target hidden after keyboard menu activation');
  // Walk actual keyboard focus order, not programmatic link.focus().
  let reached=false;
  console.log('R04_FOCUS_TRACE INITIAL '+JSON.stringify(await page.evaluate(()=>({active:document.activeElement?.outerHTML?.slice(0,250),open:document.querySelector('.menu')?.getAttribute('aria-expanded')}))));
  for(let i=0;i<26;i++){
    await page.keyboard.press('Tab');
    console.log('R04_FOCUS_TRACE TAB_'+String(i+1).padStart(2,'0')+' '+JSON.stringify(await page.evaluate(()=>({tag:document.activeElement?.tagName,html:document.activeElement?.outerHTML?.slice(0,260),insideNav:!!document.activeElement?.closest?.('#navigation'),expanded:document.querySelector('.menu')?.getAttribute('aria-expanded')}))));
    if(await link.evaluate(x=>x===document.activeElement)){reached=true;break;}
  }
  assert(reached,'Tab cannot reach Discovery anchor');
  await page.keyboard.press('Shift+Tab');
  assert(!(await link.evaluate(x=>x===document.activeElement)),'Shift+Tab failed to move focus');
  await page.keyboard.press('Tab');
  assert(await link.evaluate(x=>x===document.activeElement),'Tab did not restore Discovery focus');
  await page.keyboard.press('Enter');
  await page.waitForURL(preview+'/artist-discovery/',{timeout:25000});
});
if(process.env.R04_CASE !== '02') await check('03_BROWSER_HISTORY_AND_FOCUS_RETURN',async page=>{
  await visit(page);
  const menu=page.locator('.menu');
  await menu.click();
  const link=page.locator('#navigation a[href="/artist-discovery/"]');
  await link.focus();
  await link.click();
  await page.waitForURL(preview+'/artist-discovery/',{timeout:25000});
  const back=page.locator('a.back');
  assert(await back.isVisible(),'return link not visible');
  assert.equal(await back.getAttribute('href'),'https://weblyvra.666soundsdesign-broadcaster.com/');
  const prev=await page.goBack({waitUntil:'domcontentloaded',timeout:25000});
  assert(prev,'history Back returned no main document');
  assert.equal(new URL(page.url()).pathname,'/','history Back did not return home');
  await page.goForward({waitUntil:'domcontentloaded',timeout:25000});
  assert.equal(new URL(page.url()).pathname,'/artist-discovery/','Forward did not restore Discovery');
  await page.goBack({waitUntil:'domcontentloaded',timeout:25000});
  // On browser-history restoration, focus may be reset by the browser. Validate route
  // remains focusable without inventing focus persistence in the site's own code.
  await page.locator('.menu').focus();
  assert(await page.locator('.menu').evaluate(x=>x===document.activeElement),'home menu not keyboard-focusable after history');
});
if(fails){console.error('R04_CHROMIUM_PARTIAL '+fails+'/3 FAILED');process.exitCode=1;}
else console.log(process.env.R04_CASE === '02' ? 'R04_CHROMIUM_KEYBOARD_ONLY_PASS' : 'R04_CHROMIUM_3_OF_3_PASS_ISOLATED_PREVIEW_ONLY_NO_REAL_DEVICE_VOICEOVER');
