import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import ts from 'typescript';

// Execute the real shared TS contract + route helpers with CJS transpilation.
const root = process.cwd();
function evaluate(file, dependency = {}) {
  const source = readFileSync(resolve(root, file), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  const module = { exports: {} };
  const load = spec => {
    if (spec === './audienceCapabilities') return dependency;
    throw new Error('Unapproved dependency: ' + spec);
  };
  new Function('require', 'module', 'exports', compiled.outputText)(load, module, module.exports);
  return module.exports;
}
const contract = evaluate('src/config/audienceCapabilities.ts');
const navigation = evaluate('src/config/audienceNavigation.ts', contract);
const features = Object.keys(navigation.FEATURE_DETAILS);
const career = ['fresher', 'professional'];

test('three audience contract entries exist and have unique features', () => {
  assert.deepEqual(Object.keys(contract.AUDIENCE_FEATURES).sort(), ['fresher','professional','student']);
  for (const audience of ['student',...career]) {
    const list = navigation.visibleDashboardFeatures(audience);
    assert.equal(new Set(list).size, list.length, audience + ' must not repeat a feature');
    assert.ok(list.includes('ai-soul') && list.includes('progress-reports'));
  }
});

test('student can open Video Practice, but no interview feature anywhere in student navigation', () => {
  assert.ok(navigation.visibleDashboardFeatures('student').includes('video-practice'));
  for (const feature of ['interview-preparation','interview-video','interview-assessment']) {
    assert.equal(navigation.visibleDashboardFeatures('student').includes(feature), false);
    assert.deepEqual(navigation.resolveDashboardRoute('student', feature), { allowed: false });
  }
});

test('fresher and professional see the 10-minute and 20-minute interview entries, never student Video Practice', () => {
  for (const audience of career) {
    assert.ok(navigation.visibleDashboardFeatures(audience).includes('interview-preparation'));
    for (const feature of ['interview-video','interview-assessment']) {
      assert.equal(navigation.resolveDashboardRoute(audience, feature).allowed, true);
    }
    assert.equal(navigation.visibleDashboardFeatures(audience).includes('video-practice'), false);
    assert.deepEqual(navigation.resolveDashboardRoute(audience, 'video-practice'), { allowed: false });
  }
  assert.equal(contract.INTERVIEW_VIDEO_DURATION_SECONDS, 600);
  assert.equal(contract.INTERVIEW_ASSESSMENT_DURATION_SECONDS, 1200);
});

test('all permitted feature routes resolve; all nonmember feature routes are denied', () => {
  for (const audience of ['student',...career]) {
    assert.deepEqual(navigation.resolveDashboardRoute(audience), { allowed:true,audience,feature:null });
    for (const feature of features) {
      const allowed = contract.canDisplayFeature(audience, feature);
      assert.equal(navigation.resolveDashboardRoute(audience, feature).allowed, allowed, audience + '/' + feature);
      assert.equal(navigation.getAudienceFeaturePath(audience, feature), '/dashboard/' + audience + '/' + feature);
    }
  }
});

test('invalid audiences/features and prototype-property attacks cannot resolve', () => {
  for (const audience of ['admin','unknown','',null,undefined,'STUDENT']) {
    assert.deepEqual(navigation.resolveDashboardRoute(audience), { allowed:false });
  }
  for (const feature of ['constructor','__proto__','toString','',null,'bad-feature']) {
    assert.deepEqual(navigation.resolveDashboardRoute('student', feature), { allowed:false });
  }
});

test('real router and onboarding expose dashboard journeys without modifying sign-in', () => {
  const app = readFileSync(resolve(root, 'src/App.tsx'), 'utf8');
  const onboarding = readFileSync(resolve(root, 'src/pages/GuestEntry.tsx'), 'utf8');
  assert.match(app, /path="\/dashboard\/:audience\/:feature\?"/);
  assert.match(app, /<AudienceDashboard/);
  assert.match(onboarding, /\/dashboard\/\$\{audience\}/);
  assert.match(app, /path="\/signin"/);
});
