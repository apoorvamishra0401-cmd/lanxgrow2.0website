import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

function execute(file, dep = {}) {
  const source = readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const module = { exports: {} };
  new Function('require','module','exports',result.outputText)(spec => {
    if (spec === './audienceCapabilities') return dep;
    throw new Error('Unexpected dependency '+spec);
  },module,module.exports);
  return module.exports;
}
const contract = execute('src/config/audienceCapabilities.ts');
const api = execute('src/config/verifiedAudienceApi.ts', contract);
const dev = { url:'https://kzjvvwuyigiclryoqpkv.supabase.co', anonKey:'public-testing-key' };
const token = async () => 'test-nonvalid-jwt';
const reply = (status, body) => async (_url, config) => {
  assert.equal(config.method, 'GET');
  assert.equal(config.headers.Authorization, 'Bearer test-nonvalid-jwt');
  assert.equal(config.cache, 'no-store');
  assert.equal(config.credentials, 'omit');
  return { status, ok:status>=200 && status<300, json:async()=>body };
};

test('strictly allow development Career API endpoint only', () => {
  assert.equal(api.developmentCareerAudienceUrl(dev.url), dev.url+'/functions/v1/career/audience');
  for(const url of ['https://example.com','https://kzjvvwuyigiclryoqpkv.supabase.co.evil.test',
    'http://kzjvvwuyigiclryoqpkv.supabase.co','https://kzjvvwuyigiclryoqpkv.supabase.co@evil.test',
    'https://kzjvvwuyigiclryoqpkv.supabase.co/unexpected','javascript:alert(1)']) {
    assert.equal(api.developmentCareerAudienceUrl(url),null,url);
  }
});

test('only server-confirmed learner role + assigned audience can unlock', async () => {
  for(const audience of ['student','fresher','professional']) {
    const result=await api.requestVerifiedAudience(dev,token,{fetcher:reply(200,{assigned:true,role:'learner',audience})});
    assert.deepEqual(result,{status:'assigned',audience});
  }
  for(const data of [
    {assigned:true,role:'admin',audience:'student'},
    {assigned:true,role:'learner',audience:'admin'},
    {assigned:true,role:'learner',audience:'student',user_metadata:{audience:'professional'}},
    {assigned:false,role:'learner',audience:'student'},
    {assigned:true,role:'learner',audience:'STUDENT'}, null,
  ]) {
    // user_metadata and email are not evidence of assignment.
    if (data?.user_metadata) {
      const res=await api.requestVerifiedAudience(dev,token,{fetcher:reply(200,data)});
      assert.deepEqual(res,{status:'assigned',audience:'student'});
    } else {
      assert.deepEqual(await api.requestVerifiedAudience(dev,token,{fetcher:reply(200,data)}),{status:'unavailable'});
    }
  }
});

test('unassigned, consent denial, expired session and network failure are fail-closed', async () => {
  assert.deepEqual(await api.requestVerifiedAudience(dev,token,{fetcher:reply(200,{assigned:false,role:null,audience:null})}),{status:'unassigned'});
  assert.deepEqual(await api.requestVerifiedAudience(dev,token,{fetcher:reply(403,{error:'consent'})}),{status:'consent-required'});
  assert.deepEqual(await api.requestVerifiedAudience(dev,token,{fetcher:reply(401,{})}),{status:'sign-in-required'});
  assert.deepEqual(await api.requestVerifiedAudience(dev,async()=>null),{status:'sign-in-required'});
  assert.deepEqual(await api.requestVerifiedAudience(dev,token,{fetcher:async()=>{throw new Error('network');}}),{status:'unavailable'});
  assert.deepEqual(await api.requestVerifiedAudience({url:'https://production.invalid',anonKey:'k'},token),{status:'unavailable'});
});

test('signed-in dashboard never derives feature entitlement from URL and guest demo is distinct', () => {
  const app=readFileSync('src/App.tsx','utf8');
  const guard=readFileSync('src/pages/VerifiedDashboardRoute.tsx','utf8');
  const dashboard=readFileSync('src/pages/AudienceDashboard.tsx','utf8');
  const callback=readFileSync('src/pages/AuthCallback.tsx','utf8');
  const consent=readFileSync('src/pages/Consent.tsx','utf8');
  assert.match(app,/path="\/preview\/dashboard\/:audience\/\:feature\?"/);
  assert.match(app,/path="\/dashboard\/\:audience\/\:feature\?"/);
  assert.match(app,/path="\/placeholder" element=\{<Suspense/);
  assert.match(guard,/requestVerifiedAudience\(getAuthConfig\(\), getAccessTokenForCareer/);
  assert.match(guard,/requestedAudience !== verified\.audience/);
  assert.match(dashboard,/verifiedAudience/);
  assert.match(callback,/navigate\(recovery \? '\/reset-password' : '\/consent'/);
  assert.match(consent,/navigate\('\/placeholder'/);
});
