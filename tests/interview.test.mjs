import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync(new URL('../supabase/functions/interview-assessment/domain.ts', import.meta.url), 'utf8');
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { parseCandidate, parseFeedback } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
const candidate = { name: 'Synthetic Learner', category: 'Fresher', track: 'Technical', department: 'Software Engineering' };
test('interview profile rejects unsupported categories and mismatched departments', () => {
  assert.deepEqual(parseCandidate(candidate), candidate);
  for (const patch of [{ category: 'Student' }, { department: 'Customer Support' }, { name: ' ' }, { track: '__proto__' }]) {
    assert.throws(() => parseCandidate({ ...candidate, ...patch }));
  }
});
const transcript = 'I enjoy explaining software problems to my team.';
const feedback = { summary: 'Transcript-based review.', strengths: ['A clear topic.'], priorities: ['Add an example.'], evidence: [{ quote: 'explaining software problems', guidance: 'Describe one example.' }], nextPractice: 'Tell a short story.' };
test('feedback must cite actual learner words and contain no more than three priorities', () => {
  assert.deepEqual(parseFeedback(feedback, transcript), feedback);
  assert.throws(() => parseFeedback({ ...feedback, evidence: [{ quote: 'invented quote', guidance: 'Try again.' }] }, transcript));
  assert.throws(() => parseFeedback({ ...feedback, priorities: ['a', 'b', 'c', 'd'] }, transcript));
  assert.throws(() => parseFeedback({ ...feedback, evidence: [] }, transcript));
  assert.throws(() => parseFeedback(null, transcript));
});
test('unrequested model fields are stripped before report persistence', () => {
  const parsed = parseFeedback({ ...feedback, hiringDecision: 'pass', score: 99 }, transcript);
  assert.equal('score' in parsed, false);
  assert.equal('hiringDecision' in parsed, false);
});

const audienceCode = ts.transpileModule(fs.readFileSync(new URL('../src/interview/audience.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const audience = await import('data:text/javascript;base64,' + Buffer.from(audienceCode).toString('base64'));
test('Student retains account-first entry while both career categories start with interview', () => {
  assert.equal(audience.audienceDestination('Student'), '/signin');
  assert.equal(audience.audienceDestination('Fresher'), '/interview?audience=Fresher');
  assert.equal(audience.audienceDestination('Working Professional'), '/interview?audience=Working%20Professional');
  assert.equal(audience.isAudience('administrator'), false);
});
test('an account window restores only validated career preferences', () => {
  const values = new Map();
  globalThis.sessionStorage = { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value) };
  audience.prepareInterviewAccountWindow('?interview=Fresher');
  assert.equal(audience.accountDestination(), '/interview?audience=Fresher&account=connected');
  audience.rememberAudience('Student');
  assert.equal(audience.accountDestination(), '/app-preview?begin=1');
  audience.prepareInterviewAccountWindow('?interview=administrator');
  assert.equal(audience.readAudience(), 'Student');
  delete globalThis.sessionStorage;
  assert.equal(audience.readAudience(), null);
});
