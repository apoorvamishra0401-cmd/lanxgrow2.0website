import test from 'node:test';
import assert from 'node:assert/strict';
import { DURATION_MS, submissionKey } from '../src/features/interview/lifecycle.ts';
import { VIDEO_INTERVIEW_PROMPTS, SKILLS_ASSESSMENT_PROMPTS } from '../src/features/interview/questionBank.ts';

/** Synthetic trusted-service fixture, NOT a hosted API or real durable database. */
class FixtureServer {
  constructor(store, owner) { this.store = store; this.owner = owner; }
  authorize() { return Promise.resolve({userId:this.owner, audience:this.owner === 'student_0001' ? 'student' : 'fresher', allowed:this.owner !== 'student_0001'}); }
  async start(kind, key) {
    if (this.owner === 'student_0001') throw Error('403: audience denied');
    const lookup = `${this.owner}:${key}`;
    if (this.store.starts.has(lookup)) return this.recover(this.store.starts.get(lookup));
    const id = `attempt_${++this.store.counter}_000000`;
    const startedAt = new Date(1762860000000).toISOString();
    const deadlineAt = new Date(1762860000000 + DURATION_MS[kind]).toISOString();
    const questions = kind === 'video-interview' ? VIDEO_INTERVIEW_PROMPTS : SKILLS_ASSESSMENT_PROMPTS;
    const row = {id,kind,ownerId:this.owner,audience:'fresher',startedAt,deadlineAt,questions:[...questions],answers:{},status:'active'};
    this.store.attempts.set(id,row);
    this.store.starts.set(lookup,id);
    return structuredClone(row);
  }
  async recover(id) {
    const row = this.store.attempts.get(id);
    if (!row || row.ownerId !== this.owner) throw Error('403: foreign attempt');
    return structuredClone(row);
  }
  async saveAnswer(id, questionId, value) {
    const row = await this.recover(id);
    if (row.status !== 'active' || !row.questions.some(q => q.id === questionId)) throw Error('409: invalid question or status');
    const saved = this.store.attempts.get(id);
    saved.answers[questionId] = value;
    return structuredClone(saved);
  }
  async submit(id, key, video) {
    const row = await this.recover(id);
    if (key !== submissionKey(id)) throw Error('422: invalid idempotency key');
    if (row.kind === 'video-interview' && (!video || video.size === 0)) throw Error('422: missing recording');
    const seen = this.store.receipts.get(id);
    if (seen) return structuredClone(seen);
    const receipt = { id:`receipt_${id}`,status:'queued' };
    this.store.receipts.set(id,receipt);
    this.store.attempts.get(id).status='submitted';
    this.store.attempts.get(id).receipt=receipt;
    if (this.store.dropNextResponse) {
      this.store.dropNextResponse = false;
      throw Error('Synthetic transport lost acknowledgement after durable write');
    }
    return structuredClone(receipt);
  }
  async readReceipt(id) {
    const receipt = [...this.store.receipts.values()].find(r=>r.id===id);
    if (!receipt || !this.store.attempts.has(id.slice('receipt_'.length)) ||
        this.store.attempts.get(id.slice('receipt_'.length)).ownerId !== this.owner) {
      throw Error('403: foreign receipt');
    }
    return structuredClone(receipt);
  }
}
function fixture() { return {counter:0,attempts:new Map(),starts:new Map(),receipts:new Map(),dropNextResponse:false}; }

test('synthetic restart: durable fixture readback, owner isolation and negative student authorization', async () => {
  const store=fixture(), one=new FixtureServer(store,'owner_0001'), other=new FixtureServer(store,'owner_0002');
  const student=new FixtureServer(store,'student_0001');
  await assert.rejects(student.start('video-interview','start-token-1'), /403/);
  const interview=await one.start('video-interview','start-token-1');
  await one.saveAnswer(interview.id,interview.questions[0].id,'fixture answer');
  const restarted=new FixtureServer(store,'owner_0001');
  const restored=await restarted.recover(interview.id);
  assert.equal(restored.answers[interview.questions[0].id],'fixture answer');
  assert.equal(restored.id,interview.id);
  await assert.rejects(other.recover(interview.id), /403/);
  await assert.rejects(other.saveAnswer(interview.id,interview.questions[0].id,'tampered'), /403/);
});

test('synthetic duplicate-start, receipt replay and lost-acknowledgement recovery', async () => {
  const store=fixture(), server=new FixtureServer(store,'owner_0001');
  const first=await server.start('video-interview','stable-start-key');
  const repeated=await server.start('video-interview','stable-start-key');
  assert.equal(first.id,repeated.id);
  assert.equal(store.attempts.size,1);
  await assert.rejects(server.submit(first.id,submissionKey(first.id)), /missing recording/);
  store.dropNextResponse=true;
  await assert.rejects(server.submit(first.id,submissionKey(first.id),new Blob(['synthetic-video'])), /lost acknowledgement/);
  const restarted=new FixtureServer(store,'owner_0001');
  const receipt=await restarted.submit(first.id,submissionKey(first.id),new Blob(['synthetic-video']));
  assert.equal(receipt.status,'queued');
  assert.deepEqual(await restarted.readReceipt(receipt.id),receipt);
  assert.equal(store.receipts.size,1);
  await assert.rejects(new FixtureServer(store,'owner_0002').readReceipt(receipt.id), /403/);
});

test('synthetic assessment remains separate from video recording', async () => {
  const server=new FixtureServer(fixture(),'owner_0001');
  const assessment=await server.start('skills-assessment','assessment-start');
  assert.equal(assessment.questions.length,8);
  await server.saveAnswer(assessment.id,assessment.questions[0].id,'Option 1');
  const receipt=await server.submit(assessment.id,submissionKey(assessment.id));
  assert.equal(receipt.status,'queued');
});
