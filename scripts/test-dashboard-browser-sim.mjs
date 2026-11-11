/**
 * LANX-01 SYNTHETIC browser integration test.
 * A forged browser session and intercepted development Career API responses
 * exercise the genuine React navigation, NEVER real Google authentication.
 * Every request to the development host is intercepted: no credential is sent.
 */
import { spawn, spawnSync } from 'node:child_process';
import { setTimeout as sleep } from 'node:timers/promises';
import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync } from 'node:fs';

const host = 'kzjvvwuyigiclryoqpkv.supabase.co';
const origin = 'http://127.0.0.1:4173';
const chrome = [process.env.CHROME_BIN,'google-chrome','chromium','google-chrome-stable','chromium-browser']
  .filter(Boolean).find(x => x.startsWith('/') || spawnSync('which',[x]).status===0);
if (!chrome) throw Error('BLOCKED: Chrome/Chromium not available');
const port=25000+(process.pid%15000);
const processChrome=spawn(chrome,['--headless=new','--no-sandbox','--disable-gpu','--disable-dev-shm-usage',
  '--disable-extensions','--no-first-run','--remote-debugging-port='+port,
  '--user-data-dir=/tmp/lanx01-synth-'+process.pid,'about:blank'],{stdio:['ignore','ignore','pipe']});
let diagnostics='';
processChrome.stderr.on('data',chunk => {diagnostics=(diagnostics+chunk).slice(-4000);});
let socket;
let serial=0;
let audience='student', resultType='assigned';
const pending=new Map();
const requests=[];
function send(method,params={}) {
  return new Promise((resolve,reject)=>{
    const id=++serial;
    const timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout '+method));},20000);
    pending.set(id,{resolve,reject,timer});
    socket.send(JSON.stringify({id,method,params}));
  });
}
async function evalJS(expression) {
  const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
  if(response.exceptionDetails) throw Error('Browser JS error '+JSON.stringify(response.exceptionDetails));
  return response.result.value;
}
async function waitFor(check,description) {
  for(let i=0;i<100;i++){
    try{
      const state=await evalJS('({path:location.pathname,text:document.body?.innerText||"",width:innerWidth,scroll:document.documentElement?.scrollWidth||0})');
      if(check(state)) return state;
    }catch{}
    await sleep(140);
  }
  throw Error('Browser did not reach '+description);
}
const b64 = data=>Buffer.from(data).toString('base64');
async function intercept(msg){
  const url=msg.params.request.url, method=msg.params.request.method;
  requests.push({method,url});
  if(!new URL(url).hostname.endsWith(host)) throw Error('Mock interceptor received unexpected host');
  let status=403, data={error:'synthetic test rejects all other requests'};
  if(method==='OPTIONS'){status=204;data=null;}
  else if(url.endsWith('/functions/v1/career/audience')){
    if(resultType==='assigned'){status=200;data={assigned:true,role:'learner',audience};}
    else if(resultType==='unassigned'){status=200;data={assigned:false,role:null,audience:null};}
    else if(resultType==='consent-required'){status=403;data={error:'synthetic consent missing'};}
    else if(resultType==='session-expired'){status=401;data={error:'synthetic session expired'};}
    else if(resultType==='wrong-role'){status=200;data={assigned:true,role:'admin',audience};}
  }
  const headers=[
    {name:'Access-Control-Allow-Origin',value:origin},
    {name:'Access-Control-Allow-Headers',value:'authorization,apikey,cache-control,content-type'},
    {name:'Access-Control-Allow-Methods',value:'GET,POST,OPTIONS'},
    {name:'Content-Type',value:'application/json'},
    {name:'Vary',value:'Origin'},
  ];
  await send('Fetch.fulfillRequest',{requestId:msg.params.requestId,responseCode:status,
    responseHeaders:headers,body:data?b64(JSON.stringify(data)):''});
}
function synthSession(role){
  const userId='synthetic-'+role+'-no-valid-google-identity';
  const session={
    access_token:'fake-token-not-a-jwt-'+role,
    refresh_token:'fake-refresh-not-a-token',
    token_type:'bearer',
    expires_at:Math.floor(Date.now()/1000)+3600,
    expires_in:3600,
    user:{id:userId,email:role+'@synthetic.invalid',aud:'authenticated',role:'authenticated',
      app_metadata:{provider:'google',providers:['google']},user_metadata:{},created_at:new Date().toISOString()}
  };
  return JSON.stringify(session);
}
let injector;
async function asRole(role){
  audience=role;resultType='assigned';
  if(injector)await send('Page.removeScriptToEvaluateOnNewDocument',{identifier:injector});
  const storage='sb-'+host.split('.')[0]+'-auth-token';
  const source='try{localStorage.setItem('+JSON.stringify(storage)+','+JSON.stringify(synthSession(role))+');}catch{}';
  injector=(await send('Page.addScriptToEvaluateOnNewDocument',{source})).identifier;
}
async function go(path,until){
  await send('Page.navigate',{url:origin+path});
  return waitFor(until,path);
}
try{
  let endpoint;
  for(let i=0;i<140;i++){
    if(processChrome.exitCode!==null)throw Error('Chrome failed '+diagnostics);
    try{const res=await fetch('http://127.0.0.1:'+port+'/json');
      if(res.ok){const pages=await res.json();endpoint=pages.find(x=>x.type==='page')?.webSocketDebuggerUrl;if(endpoint)break;}
    }catch{}
    await sleep(150);
  }
  if(!endpoint)throw Error('Chrome debugging unavailable '+diagnostics);
  socket=new WebSocket(endpoint);
  await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
  socket.addEventListener('message',event=>{
    const msg=JSON.parse(event.data);
    if(msg.method==='Fetch.requestPaused'){void intercept(msg).catch(e=>{throw e;});return;}
    if(!msg.id)return;
    const request=pending.get(msg.id);if(!request)return;
    clearTimeout(request.timer);pending.delete(msg.id);
    if(msg.error)request.reject(Error(JSON.stringify(msg.error)));else request.resolve(msg.result);
  });
  await send('Page.enable');await send('Runtime.enable');
  await send('Fetch.enable',{patterns:[{urlPattern:'https://'+host+'/*',requestStage:'Request'}]});
  mkdirSync('browser-evidence',{recursive:true});
  let count=0;
  for(const role of ['student','fresher','professional']){
    await asRole(role);
    const state=await go('/placeholder',s=>s.path==='/dashboard/'+role&&s.text.includes(role==='professional'?'Working Professional dashboard':role==='fresher'?'Fresher dashboard':'Student dashboard'));
    assert(!state.text.includes('Dashboard access denied'),'Known assignment must resolve '+role);
    assert(state.scroll<=state.width+1,'No horizontal scrolling');
    assert(!state.text.includes(role==='student'?'Interview Preparation':'Video Practice'),'Role feature leakage');
    for(const width of [320,768,1280]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:850,deviceScaleFactor:1,mobile:width===320});
      const resized=await go('/dashboard/'+role,view=>view.path==='/dashboard/'+role&&view.text.includes('Learning & practice'));
      assert(resized.scroll<=resized.width+1,'Horizontal overflow on signed-in '+role+' at '+width+'px');
      const targets=await evalJS('Array.from(document.querySelectorAll("main .lx-role-link")).filter(el=>el.getBoundingClientRect().height<43).map(el=>el.textContent.trim())');
      assert.deepEqual(targets,[],'Undersized dashboard action target '+role+' at '+width+'px');
      const shot=(await send('Page.captureScreenshot',{format:'png',fromSurface:true})).data;
      writeFileSync('browser-evidence/synthetic-auth-'+role+'-'+width+'.png',Buffer.from(shot,'base64'));
    }
    const forbidden=role==='student'?'interview-video':'video-practice';
    const direct=await go('/dashboard/'+role+'/'+forbidden,s=>s.text.includes('Feature unavailable for your audience'));
    assert(!direct.text.includes('Private camera practice'));
    const wrongRole=role==='student'?'fresher':'student';
    await go('/dashboard/'+wrongRole,s=>s.text.includes('Dashboard access denied'));
    await go('/dashboard/'+role,s=>s.text.includes('dashboard')&&s.text.includes('Learning & practice'));
    const keyboardTarget = '/dashboard/'+role+'/'+(role==='student'?'video-practice':'interview-video');
    const focused = await evalJS('(()=>{const link=document.querySelector(\'a[href="'+keyboardTarget+'"]\');if(!link)return false;link.focus();return document.activeElement===link;})()');
    assert.equal(focused,true,'Keyboard navigation target not focusable '+keyboardTarget);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});
    const opened=await waitFor(state=>state.path===keyboardTarget&&state.text.includes(role==='student'?'Private camera practice':'Practice workspace'),keyboardTarget+' keyboard activation');
    assert(opened.text.includes(role==='student'?'Start camera preview':'practice exercise'),'Keyboard activation did not open permitted feature');
    await go('/dashboard/'+role,state=>state.path==='/dashboard/'+role&&state.text.includes('Learning & practice'));
    await send('Page.reload',{ignoreCache:true});
    await waitFor(s=>s.path==='/dashboard/'+role&&s.text.includes('Learning & practice'),role+' refresh');
    count++;
  }
  await asRole('student');resultType='unassigned';
  await go('/placeholder',s=>s.path==='/activate'||s.text.includes('Checking your learner assignment'));
  resultType='consent-required';
  await go('/dashboard/student',s=>s.text.includes('Consent required'));
  resultType='wrong-role';
  await go('/dashboard/student',s=>s.text.includes('Could not verify learner access'));
  resultType='session-expired';
  await go('/dashboard/student',s=>s.text.includes('Session expired'));
  assert(requests.some(r=>r.url.endsWith('/functions/v1/career/audience')),'Server audience endpoint must be queried');
  console.log('PASS: '+count+' mocked signed-in browser role journeys (3 viewports each, keyboard Enter activation) with refresh, forbidden deep links, role mismatch, consent and expired session (SYNTHETIC sessions; NOT real Google login).');
}finally{
  try{socket?.close();}catch{}
  processChrome.kill('SIGTERM');
}
