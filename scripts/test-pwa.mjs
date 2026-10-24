import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import vm from 'node:vm';
const manifest = JSON.parse(await readFile('dist/manifest.json','utf8'));
for(const icon of manifest.icons) await access('dist'+icon.src);
assert.equal(manifest.scope,'/');
const source=await readFile('dist/service-worker.js','utf8');
assert(!source.includes('__BUILD_VERSION__'));
const list=JSON.parse(source.match(/const PRECACHE = (\[.*\]);/)[1]);
assert(list.includes('/index.html')); assert(list.some(url=>/\/assets\/.*\.js$/.test(url)));
for(const url of list) await access('dist'+url);
const handlers={}; const records=new Map(); let offline=false; let networkCalls=0;
const cache={put:async(key,value)=>records.set(typeof key==='string'?key:key.url,value.clone()),match:async key=>records.get(typeof key==='string'?key:key.url)?.clone()};
const origin='https://example.test';
class BrowserRequest extends Request { constructor(input,init){super(typeof input==='string'?new URL(input,origin):input,init);} }
const context={self:{location:{origin},addEventListener:(type,handler)=>handlers[type]=handler,clients:{claim:async()=>{}},skipWaiting:async()=>{}},caches:{open:async()=>cache,delete:async()=>true,keys:async()=>[]},fetch:async request=>{networkCalls++;if(offline)throw Error('offline');return new Response(request.url.endsWith('/index.html')?'<html>static shell</html>':'static asset',{status:200});},Request:BrowserRequest,Response,URL,Promise};
vm.runInNewContext(source,context);
let install;handlers.install({waitUntil:p=>install=p});await install;
assert.equal(records.size,list.length,'Install caches complete static allowlist');
const request=(path,mode='navigate',method='GET')=>({url:origin+path,method,mode});
async function respond(req){let response;handlers.fetch({request:req,respondWith:p=>response=p});return response;}
offline=true;const previous=networkCalls;const publicPage=await respond(request('/about'));assert.equal(await publicPage.text(),'<html>static shell</html>');assert.equal(networkCalls,previous,'Public offline navigation uses cache');
const asset=await respond(request(list.find(url=>url.endsWith('.js')),'cors'));assert.equal(await asset.text(),'static asset');
assert.equal(await respond({url:'https://project.supabase.co/auth/v1/token',method:'POST',mode:'cors'}),undefined);
assert.equal(await respond(request('/auth-callback?code=private-code')),undefined,'OAuth codes bypass cache');
assert.equal(await respond(request('/api/profile','cors')),undefined);
assert.equal(await respond(request('/unknown-data.json','cors')),undefined);
const before=records.size;const login=await respond(request('/signin'));assert.equal(await login.text(),'<html>static shell</html>');assert.equal(records.size,before,'Offline auth fallback stores no account responses');
console.log(`PWA checks passed: ${list.length} assets, icons, offline navigation, cached JS, auth/API/token exclusions.`);
