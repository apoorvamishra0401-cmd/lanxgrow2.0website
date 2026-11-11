import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import assert from 'node:assert/strict';

const candidates = [process.env.CHROME_BIN, 'google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser'].filter(Boolean);
const chromePath = candidates.find(name => spawnSync('which', [name], { encoding:'utf8' }).status === 0 || name.startsWith('/'));
if (!chromePath) throw new Error('Browser test BLOCKED: no Chromium/Chrome executable in runner.');
const port = 20000 + (process.pid % 20000);
const browser = spawn(chromePath, ['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--disable-background-networking','--no-first-run','--no-default-browser-check','--disable-extensions','--remote-debugging-port='+port,'--user-data-dir=/tmp/lanx01-chrome-'+process.pid,'about:blank'], { stdio:['ignore','ignore','pipe'] });
let chromeDiagnostics = '';
browser.stderr.on('data',chunk => { chromeDiagnostics = (chromeDiagnostics + chunk.toString()).slice(-5000); });
let ws;
let id = 0;
const pending = new Map();
const exceptions = [];
function command(method,params={}) {
  return new Promise((resolve,reject)=>{
    const serial = ++id;
    const timeout=setTimeout(()=>{pending.delete(serial);reject(new Error('CDP timed out: '+method));},15000);
    pending.set(serial,{resolve,reject,timeout});
    ws.send(JSON.stringify({id:serial,method,params}));
  });
}
async function evaluate(expression) {
  const r=await command('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(r.exceptionDetails) throw new Error('Browser JS error: '+JSON.stringify(r.exceptionDetails));
  return r.result.value;
}
async function ready(path) {
  await command('Page.navigate',{url:'http://127.0.0.1:4173'+path});
  for(let n=0;n<90;n++){
    const state=await evaluate('({url:location.pathname,heading:document.querySelector("main h1")?.textContent||"",body:document.body?.innerText||"",scrollWidth:document.documentElement?.scrollWidth||0,width:window.innerWidth})');
    if(state.url===path && state.heading) return state;
    await sleep(120);
  }
  throw new Error('Dashboard did not render '+path);
}
try {
  let endpoint;
  for(let n=0;n<150;n++){
    if(browser.exitCode!==null || browser.signalCode!==null) throw new Error('Chrome exited before remote debugging: '+chromeDiagnostics);
    try {
      const r=await fetch('http://127.0.0.1:'+port+'/json');
      if(r.ok){const pages=await r.json();endpoint=pages.find(p=>p.type==='page')?.webSocketDebuggerUrl;if(endpoint)break;}
    } catch {}
    await sleep(180);
  }
  if(!endpoint) throw new Error('Chrome debugging endpoint did not become ready at port '+port+'; browser='+chromePath+'; diagnostics='+chromeDiagnostics);
  ws=new WebSocket(endpoint);
  await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
  ws.addEventListener('message',event=>{
    const msg=JSON.parse(event.data);
    if(msg.method==='Runtime.exceptionThrown') exceptions.push(msg.params.exceptionDetails?.text||'Uncaught exception');
    if(!msg.id)return;
    const r=pending.get(msg.id);if(!r)return;
    clearTimeout(r.timeout);pending.delete(msg.id);
    if(msg.error)r.reject(new Error(JSON.stringify(msg.error)));else r.resolve(msg.result);
  });
  await command('Page.enable');
  await command('Runtime.enable');
  mkdirSync('browser-evidence',{recursive:true});
  const matrix=[
    {audience:'student',want:['Student dashboard','Video Practice','AI Soul','Speaking','Listening','Reading','Writing','Progress'],deny:['Interview Preparation','10-minute video interview','20-minute assessment']},
    {audience:'fresher',want:['Fresher dashboard','Interview Preparation','10-minute video interview','20-minute assessment','AI Soul','Progress'],deny:['Video Practice']},
    {audience:'professional',want:['Working Professional dashboard','Interview Preparation','10-minute video interview','20-minute assessment','AI Soul','Progress'],deny:['Video Practice']},
  ];
  const widths=[320,390,768,1280];
  let checked=0;
  for(const width of widths){
    await command('Emulation.setDeviceMetricsOverride',{width,height:850,deviceScaleFactor:1,mobile:width<=430});
    for(const item of matrix){
      const state=await ready('/dashboard/'+item.audience);
      assert.ok(state.heading.includes(item.want[0]),JSON.stringify(state));
      for(const label of item.want)assert.ok(state.body.includes(label),item.audience+' missing '+label);
      for(const label of item.deny)assert.ok(!state.body.includes(label),item.audience+' leaked '+label);
      assert.ok(state.scrollWidth<=state.width+1, 'Horizontal overflow on '+width+' '+item.audience+': '+state.scrollWidth+'>'+state.width);
      if(width===320||width===768||width===1280){
        const png=(await command('Page.captureScreenshot',{format:'png',fromSurface:true})).data;
        writeFileSync(join('browser-evidence',item.audience+'-'+width+'.png'),Buffer.from(png,'base64'));
      }
      checked++;
    }
  }
  await command('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
  const denied=await ready('/dashboard/student/interview-preparation');
  assert.match(denied.body,/unavailable for this audience/);
  const deniedVideo=await ready('/dashboard/fresher/video-practice');
  assert.match(deniedVideo.body,/unavailable for this audience/);
  await ready('/dashboard/student');
  const clicked=await evaluate('(()=>{const link=document.querySelector(\'a[href="/dashboard/student/video-practice"]\');if(!link)return false;link.click();return true;})()');
  assert.equal(clicked,true,'student Video Practice link was not clickable');
  const studentVideo=await ready('/dashboard/student/video-practice');
  assert.match(studentVideo.body,/Start camera preview/);
  const prep=await ready('/dashboard/professional/interview-video');
  assert.match(prep.body,/not a timed, submitted, recorded or AI-scored interview/);
  assert.equal(exceptions.length,0,'Runtime errors: '+exceptions.join('; '));
  console.log('PASS: '+checked+' responsive audience matrices, two forbidden deep links, in-app navigation, interview workspace; browser screenshots saved.');
} finally {
  ws?.close();
  browser.kill('SIGTERM');
}
