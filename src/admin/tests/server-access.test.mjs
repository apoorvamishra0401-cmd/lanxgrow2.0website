import test from 'node:test';
import assert from 'node:assert/strict';
import {authorizeServerAction} from '../server-access.mjs';
const ids={student:'11111111-1111-4111-8111-111111111111',fresher:'22222222-2222-4222-8222-222222222222',professional:'33333333-3333-4333-8333-333333333333',admin:'44444444-4444-4444-8444-444444444444'};
const identities={
  [ids.student]:{role:'learner',audience:'student'},
  [ids.fresher]:{role:'learner',audience:'fresher'},
  [ids.professional]:{role:'learner',audience:'professional'},
  [ids.admin]:{role:'admin',audience:'student'},
};
const adapters={
  async verifyAccessToken(token){return token in identities?{userId:token,provider:'google'}:null;},
  async loadServerIdentity(id){return identities[id]??null;},
  async hasCurrentConsent(){return true;}
};
const check=(actor,feature,ownerId=actor,adapter=adapters)=>authorizeServerAction({authorization:'Bearer '+actor,action:{kind:'feature',feature,ownerId}},adapter);
const reject=async (actual,status)=>{const result=await actual;assert.equal(result.ok,false);assert.equal(result.status,status);};
for(const [role,allowed,blocked] of [
  ['student',['video-practice','reading-practice','progress-reports'],['interview-preparation','interview-video','interview-assessment']],
  ['fresher',['interview-preparation','interview-video','interview-assessment'],['video-practice']],
  ['professional',['interview-preparation','interview-video','interview-assessment'],['video-practice']]
]){
  for(const feature of allowed) test(role+' allows '+feature,async()=>assert.equal((await check(ids[role],feature)).ok,true));
  for(const feature of blocked) test(role+' denies '+feature,async()=>reject(check(ids[role],feature),403));
}
test('anonymous direct API denied',async()=>reject(authorizeServerAction({action:{kind:'admin'}},adapters),401));
test('invalid session denied',async()=>reject(authorizeServerAction({authorization:'Bearer invalid-token',action:{kind:'admin'}},adapters),401));
test('invalid bearer denied',async()=>reject(authorizeServerAction({authorization:'Basic abc',action:{kind:'admin'}},adapters),401));
test('password provider denied',async()=>reject(check(ids.student,'video-practice',ids.student,{...adapters,verifyAccessToken:async()=>({userId:ids.student,provider:'email'})}),401));
test('typed founder email cannot grant admin',async()=>reject(authorizeServerAction({authorization:'Bearer '+ids.student,claimedEmail:'apoorvamishra0401@gmail.com',claimedRole:'admin',action:{kind:'admin'}},adapters),403));
test('verified server admin allowed',async()=>assert.equal((await authorizeServerAction({authorization:'Bearer '+ids.admin,action:{kind:'admin'}},adapters)).ok,true));
test('owner-only resource isolation',async()=>reject(authorizeServerAction({authorization:'Bearer '+ids.student,action:{kind:'owner-data',ownerId:ids.fresher}},adapters),403));
test('admin cannot bypass learner owner guard',async()=>reject(check(ids.admin,'video-practice'),403));
test('missing consent denies',async()=>reject(check(ids.fresher,'interview-preparation',ids.fresher,{...adapters,hasCurrentConsent:async()=>false}),403));
test('consent error fails closed',async()=>reject(check(ids.fresher,'interview-preparation',ids.fresher,{...adapters,hasCurrentConsent:async()=>{throw Error('offline');}}),503));
test('role lookup error fails closed',async()=>reject(check(ids.fresher,'interview-preparation',ids.fresher,{...adapters,loadServerIdentity:async()=>{throw Error('offline');}}),503));
test('token verification exception denies',async()=>reject(check(ids.fresher,'interview-preparation',ids.fresher,{...adapters,verifyAccessToken:async()=>{throw Error('expired');}}),401));
test('client audience cannot override stored role',async()=>reject(authorizeServerAction({authorization:'Bearer '+ids.student,audience:'professional',action:{kind:'feature',feature:'interview-assessment',ownerId:ids.student}},adapters),403));
test('unknown feature denies',async()=>reject(check(ids.fresher,'super-admin'),403));
test('unknown user denies',async()=>reject(check('55555555-5555-4555-8555-555555555555','interview-video'),401));
test('two-user isolation both directions',async()=>{await reject(check(ids.student,'video-practice',ids.fresher),403);await reject(check(ids.fresher,'interview-video',ids.student),403);});
test('owner data without consent denies',async()=>reject(authorizeServerAction({authorization:'Bearer '+ids.fresher,action:{kind:'owner-data',ownerId:ids.fresher}},{...adapters,hasCurrentConsent:async()=>false}),403));
test('missing trusted adapters fail closed',async()=>reject(check(ids.fresher,'interview-video',ids.fresher,{}),503));
test('unknown privileged role denied',async()=>reject(check(ids.fresher,'interview-video',ids.fresher,{...adapters,loadServerIdentity:async()=>({role:'founder'})}),403));
test('prototype audience denied',async()=>reject(check(ids.student,'progress-reports',ids.student,{...adapters,loadServerIdentity:async()=>({role:'learner',audience:'__proto__'})}),403));
test('malformed owner rejected',async()=>reject(authorizeServerAction({authorization:'Bearer '+ids.student,action:{kind:'owner-data',ownerId:'bogus'}},adapters),403));
