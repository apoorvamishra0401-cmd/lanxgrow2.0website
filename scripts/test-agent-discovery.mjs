import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
const llms = await readFile('dist/llms.txt', 'utf8');
assert.match(llms, /^# LanXgrow/m);
assert(llms.length > 50 && /\[.+\]\(.+\)/.test(llms));
assert(!/<!doctype|<html/i.test(llms));
const manifest = JSON.parse(await readFile('dist/.well-known/ard.json', 'utf8'));
assert(manifest.entries.length > 0);
for (const entry of manifest.entries) {
  assert.match(entry.identifier, /^urn:air:www\.lanxgrow\.com:[a-z0-9:-]+$/);
  assert(entry.displayName && entry.type);
  assert.equal(Boolean(entry.url), !Boolean(entry.data));
  assert(entry.representativeQueries.length >= 2 && entry.representativeQueries.length <= 5);
  const url = new URL(entry.url);
  assert.equal(url.origin, 'https://www.lanxgrow.com');
  await access(`dist${url.pathname}`);
}
const guide = JSON.parse(await readFile('dist/agent-guide.json', 'utf8'));
for (const page of guide.pages) {
  const path = new URL(page.url).pathname;
  const content = path === '/interview-prep' ? 'dist/pages/interview-prep-content.html' : path === '/' ? 'dist/index.html' : `dist${path}/index.html`;
  await access(content);
}
for (const file of ['dist/index.html','dist/about/index.html','dist/services/index.html','dist/faq/index.html','dist/smart-ai/index.html','dist/pages/interview-prep-content.html']) {
  const html = await readFile(file, 'utf8');
  assert.match(html, /rel="ard" href="\/\.well-known\/ard.json"/);
  const schema = JSON.parse(html.match(/<script id="lanxgrow-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert(schema['@graph'].some(item => item['@type'] === 'WebPage'));
}
const home = await readFile('dist/index.html','utf8');
assert.match(home, /What you can try today/);
assert.match(home, /Live AI feedback and automated assessment reports are planned/);
console.log('PASS: discovery file formats, ARD entries, linked resource coverage, structured data, visible availability disclosure.');

const color = hex => hex.slice(1).match(/../g).map(x => parseInt(x,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
const luminance = hex => color(hex).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
for (const bg of ['#fffdfa','#f7eee6','#f3eee5','#f4eee5','#fffaf0','#f1e8da']) {
  const values=[luminance('#685846'),luminance(bg)].sort((a,b)=>b-a);
  const ratio=(values[0]+.05)/(values[1]+.05);
  assert(ratio >= 4.5, `Caption contrast on ${bg}: ${ratio}`);
}
console.log('PASS: corrected small-caption colour meets 4.5:1 on its light surfaces.');
