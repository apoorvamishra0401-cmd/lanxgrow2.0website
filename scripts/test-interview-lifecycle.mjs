import test from 'node:test';
import assert from 'node:assert/strict';
import { DURATION_MS, remainingMs, formatRemaining, assertAttempt, completionState, submissionKey, resumeKey }
  from '../src/features/interview/lifecycle.ts';

const started = Date.parse('2026-11-11T07:00:00Z');
const user = { userId: 'synthetic-owner-0001', audience: 'fresher', allowed: true };
function attempt(kind = 'video-interview') {
  return {
    id: 'attempt_0001', ownerId: user.userId, audience: user.audience, kind,
    startedAt: new Date(started).toISOString(),
    deadlineAt: new Date(started + DURATION_MS[kind]).toISOString(),
    questions: [{ id: 'q1', prompt: 'Explain a difficult decision.', format: kind === 'video-interview' ? 'video' : 'text' }],
    answers: {}, status: 'active'
  };
}

test('10-minute video and independent 20-minute assessment timing', () => {
  assert.equal(DURATION_MS['video-interview'], 600000);
  assert.equal(DURATION_MS['skills-assessment'], 1200000);
  assert.equal(formatRemaining(600000), '10:00');
  assert.equal(formatRemaining(1200000), '20:00');
});
test('refresh cannot reset trusted deadline; zero is bounded', () => {
  const a = attempt();
  assert.equal(remainingMs(a.deadlineAt, started + 300000), 300000);
  assert.equal(remainingMs(a.deadlineAt, started + 600001), 0);
  assert.equal(completionState(a, started + 600001), 'expired');
});
test('reject wrong user, wrong audience, disabled entitlement, wrong journey', () => {
  const a = attempt();
  assert.doesNotThrow(() => assertAttempt(user, a, 'video-interview'));
  assert.throws(() => assertAttempt({...user, userId:'synthetic-owner-0002'}, a, 'video-interview'));
  assert.throws(() => assertAttempt({...user, audience:'professional'}, a, 'video-interview'));
  assert.throws(() => assertAttempt({...user, allowed:false}, a, 'video-interview'));
  assert.throws(() => assertAttempt(user, a, 'skills-assessment'));
});
test('reject untrusted extended deadlines and corrupted payloads', () => {
  const a = attempt('skills-assessment');
  assert.throws(() => assertAttempt(user, {...a, deadlineAt: new Date(started + 1200001).toISOString()}, 'skills-assessment'));
  assert.throws(() => assertAttempt(user, {...a, questions:[]}, 'skills-assessment'));
  assert.throws(() => remainingMs('not-a-timestamp'));
});
test('stable submission idempotency key and owner-separated resume metadata', () => {
  assert.equal(submissionKey('attempt_0001'), submissionKey('attempt_0001'));
  assert.notEqual(resumeKey('synthetic-owner-0001', 'video-interview'), resumeKey('synthetic-owner-0002','video-interview'));
  assert.notEqual(resumeKey('synthetic-owner-0001', 'video-interview'), resumeKey('synthetic-owner-0001','skills-assessment'));
  assert.throws(() => submissionKey('../path'));
});
test('a queued durable receipt remains submitted after deadline', () => {
  assert.equal(completionState({...attempt(), receipt:{id:'receipt_0001',status:'queued'}}, started + 800000), 'submitted');
});

test('original question banks are distinct and reject duplicates', async () => {
  const { VIDEO_INTERVIEW_PROMPTS, SKILLS_ASSESSMENT_PROMPTS, validatePromptBank } =
    await import('../src/features/interview/questionBank.ts');
  assert.equal(VIDEO_INTERVIEW_PROMPTS.length, 5);
  assert.equal(SKILLS_ASSESSMENT_PROMPTS.length, 8);
  assert(VIDEO_INTERVIEW_PROMPTS.every(question => question.format === 'video'));
  assert(SKILLS_ASSESSMENT_PROMPTS.some(question => question.format === 'choice'));
  assert(SKILLS_ASSESSMENT_PROMPTS.some(question => question.format === 'text'));
  assert.doesNotThrow(() => validatePromptBank(VIDEO_INTERVIEW_PROMPTS));
  assert.doesNotThrow(() => validatePromptBank(SKILLS_ASSESSMENT_PROMPTS));
  assert.throws(() => validatePromptBank([SKILLS_ASSESSMENT_PROMPTS[0], SKILLS_ASSESSMENT_PROMPTS[0]]));
});
