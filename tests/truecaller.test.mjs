import test from 'node:test';
import assert from 'node:assert/strict';
import start from '../api/truecaller-start.js';
import callback from '../api/truecaller-callback.js';
import status from '../api/truecaller-status.js';
import {verifiedEndpoint} from '../api/_truecaller.js';

function response(){
 return {code:0,headers:{},body:null,setHeader(k,v){this.headers[k]=v;},status(v){this.code=v;return this;},json(v){this.body=v;return this;}};
}
function req(method,body={},extra={}){return {method,headers:{origin:'https://review.example.com',host:'review.example.com'},body,...extra};}
test('allowlist rejects callback-controlled outbound URLs',()=>{
 for (const url of ['https://evil.com/v1/default','http://profile4.truecaller.com/v1/default','https://profile4.truecaller.com.evil.com/v1/default','https://profile4.truecaller.com/admin']) assert.equal(verifiedEndpoint(url),null);
 assert.equal(verifiedEndpoint('https://profile4-noneu.truecaller.com/v1/default'),'https://profile4-noneu.truecaller.com/v1/default');
});
test('start rejects cross-origin and unsupported HTTP method',async()=>{
 const post=response();
 await start(req('POST',{}, {headers:{origin:'https://evil.com',host:'review.example.com'}}),post);
 assert.equal(post.code,403);
 const get=response();await start(req('GET'),get);assert.equal(get.code,405);
});
test('callback does not expose tokens or accept unsafe profile endpoints',async()=>{
 const fake=response();
 await callback(req('POST',{requestId:'not-a-real-id',accessToken:'test',endpoint:'https://evil.test'}),fake);
 assert.equal(fake.code,400);
});
test('status rejects bad request IDs without querying Redis',async()=>{
 const res=response();await status(req('GET',{}, {query:{requestId:'bad'}}),res);
 assert.equal(res.code,400);
});
test('complete callback flow is bound to same-browser secret and consumes verified ticket',async()=>{
 const originalFetch=global.fetch;
 const oldUrl=process.env.UPSTASH_REDIS_REST_URL,oldToken=process.env.UPSTASH_REDIS_REST_TOKEN;
 process.env.UPSTASH_REDIS_REST_URL='https://testredis.example.com';
 process.env.UPSTASH_REDIS_REST_TOKEN='synthetic-test-only';
 const entries=new Map();
 let profileFetches=0;
 global.fetch=async (url,options)=>{
  if(String(url)==='https://testredis.example.com'){
   const [cmd,key,value,_ex,seconds]=JSON.parse(options.body);
   if(cmd==='GET')return {ok:true,json:async()=>({result:entries.get(key)||null})};
   if(cmd==='SET'){entries.set(key,value);assert.equal(Number(seconds),180);return {ok:true,json:async()=>({result:'OK'})};}
   if(cmd==='DEL'){entries.delete(key);return {ok:true,json:async()=>({result:1})};}
  }
  if(String(url)==='https://profile4-noneu.truecaller.com/v1/default'){
   profileFetches++;
   assert.equal(options.headers.Authorization,'Bearer test-access-token-verified');
   return {ok:true,json:async()=>({phoneNumbers:[{phoneNumber:'+919876543210'}],firstName:'Test',lastName:'Person'})};
  }
  throw Error('Unexpected outbound URL');
 };
 try{
  const initiated=response();await start(req('POST'),initiated);
  assert.equal(initiated.code,200);assert.match(initiated.headers['Set-Cookie'],/HttpOnly/);
  const requestId=initiated.body.requestId;
  const wrong=response();await status(req('GET',{}, {query:{requestId},headers:{cookie:'bad'}}),wrong);
  assert.equal(wrong.code,403);
  const accepted=response();await callback(req('POST',{requestId,accessToken:'test-access-token-verified',endpoint:'https://profile4-noneu.truecaller.com/v1/default'}),accepted);assert.equal(accepted.code,200);
  const cookie=initiated.headers['Set-Cookie'].split(';')[0];
  const verified=response();await status(req('GET',{}, {query:{requestId},headers:{cookie}}),verified);
  assert.equal(verified.code,200);assert.equal(verified.body.status,'verified');
  assert.equal(verified.body.profile.phone,'+919876543210');
  assert.equal(verified.body.sessionEstablished,false);
  assert.equal(profileFetches,1);
  const consumed=response();await status(req('GET',{}, {query:{requestId},headers:{cookie}}),consumed);
  assert.equal(consumed.code,403);
 }finally{
  global.fetch=originalFetch;
  if(oldUrl===undefined)delete process.env.UPSTASH_REDIS_REST_URL;else process.env.UPSTASH_REDIS_REST_URL=oldUrl;
  if(oldToken===undefined)delete process.env.UPSTASH_REDIS_REST_TOKEN;else process.env.UPSTASH_REDIS_REST_TOKEN=oldToken;
 }
});
