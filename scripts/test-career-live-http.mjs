/**
 * LANX-00 real HTTP E2E against the DEVELOPMENT career API.
 * Tokens are supplied at runtime through secrets/env, never committed/logged.
 * No production endpoints are permitted. This script creates only synthetic
 * attempts and objective choice answers in the authorized development DB.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const API = 'https://kzjvvwuyigiclryoqpkv.supabase.co/functions/v1/career/';
const fresh = process.env.LANX_DEV_FRESHER_TOKEN ?? '';
const student = process.env.LANX_DEV_STUDENT_TOKEN ?? '';
const other = process.env.LANX_DEV_OTHER_CAREER_TOKEN ?? '';
const key = process.env.LANX_DEV_PUBLISHABLE_KEY ?? '';

function requireSecrets(...items) {
  return items.every(Boolean);
}
async function request(token, endpoint, { method='GET', data, idempotencyKey }={}) {
  const response = await fetch(API + endpoint, {
    method,
    headers: {
      Authorization: 'Bearer ' + token,
      ...(key ? { apikey: key } : {}),
      ...(data !== undefined ? { 'Content-Type':'application/json' } : {}),
      ...(idempotencyKey ? { 'Idempotency-Key': idempotencyKey } : {})
    },
    body: data === undefined ? undefined : JSON.stringify(data),
    signal: AbortSignal.timeout(25000)
  });
  const result = await response.json().catch(()=>null);
  return { status:response.status, body:result };
}
test('API denies a forged bearer token', async () => {
  const response=await request('not-a-real-jwt','access');
  assert([401,403].includes(response.status), 'Expected 401/403, received '+response.status);
});
test('development student cannot authorize a career interview', {skip:!requireSecrets(student,key) && 'Requires test Student Google JWT and public API key'}, async () => {
  const response=await request(student,'access');
  assert([401,403].includes(response.status),'Student career access must be denied');
});
test('real career user: durable objective submission and ownership restrictions', {
  skip:!requireSecrets(fresh,other,key) && 'Requires two distinct consented development Google JWTs and public API key'
}, async () => {
  const first=await request(fresh,'access');
  assert.equal(first.status,200,'Test Fresher must have Google consent and assigned career audience');
  assert.equal(first.body?.allowed,true);
  assert(['fresher','professional'].includes(first.body?.audience));
  const second=await request(other,'access');
  assert.equal(second.status,200,'Second test career user must be authorized');
  assert.notEqual(first.body.userId,second.body?.userId,'Use two distinct test Google accounts');

  const startKey='test-e2e-'+randomUUID();
  const started=await request(fresh,'attempts',{method:'POST',idempotencyKey:startKey,
    data:{kind:'skills-assessment'}});
  assert.equal(started.status,201,'Must create a fresh development attempt');
  const attempt=started.body;
  assert.equal(attempt.kind,'skills-assessment');
  assert.equal(attempt.ownerId,first.body.userId);
  assert.equal(Date.parse(attempt.deadlineAt)-Date.parse(attempt.startedAt),
    20*60000,'20-minute server deadline required');

  const unauthorizedAttempt=await request(other,'attempts/'+attempt.id);
  assert([403,404].includes(unauthorizedAttempt.status),
    'Other account must not recover another user attempt');

  const choice=attempt.questions.find(q=>q.format==='choice');
  assert(choice,'Must assign at least one objective question');
  const saved=await request(fresh,'attempts/'+attempt.id+'/answers/'+choice.id,{
    method:'PUT',data:{value:choice.choices[0]}
  });
  assert.equal(saved.status,200);
  assert.equal(saved.body?.answers?.[choice.id],choice.choices[0]);

  const receiptKey='test-receipt-'+randomUUID();
  const submitted=await request(fresh,'attempts/'+attempt.id+'/submission',{
    method:'POST',idempotencyKey:receiptKey,data:{}
  });
  assert([200,201,202].includes(submitted.status));
  assert(submitted.body?.id,'Durable receipt must exist');

  const again=await request(fresh,'attempts/'+attempt.id+'/submission',{
    method:'POST',idempotencyKey:receiptKey,data:{}
  });
  assert.equal(again.body?.id,submitted.body.id,'Idempotent repeat must yield same receipt');

  const deniedReceipt=await request(other,'receipts/'+submitted.body.id);
  assert([403,404].includes(deniedReceipt.status),'Other user must not read this receipt');

  let finalReceipt=await request(fresh,'receipts/'+submitted.body.id);
  if(finalReceipt.body?.status==='queued'){
    const review=await request(fresh,'receipts/'+submitted.body.id+'/objective-review',{method:'POST'});
    assert.equal(review.status,200,'Objective report retry should succeed');
    finalReceipt=await request(fresh,'receipts/'+submitted.body.id);
  }
  assert.equal(finalReceipt.body?.status,'complete');
  assert(finalReceipt.body?.reportId,'Completed receipt must point to a report');

  const report=await request(fresh,'reports/'+finalReceipt.body.reportId);
  assert.equal(report.status,200,'Owner must retrieve saved report');
  assert.equal(report.body?.status,'complete');
  assert.equal(report.body?.feedback?.aiEvaluationPerformed,false);
  assert.equal(report.body?.feedback?.fullAssessmentScore,null);
  assert.equal(report.body?.feedback?.provenance,'deterministic_server_answer_key');

  const deniedReport=await request(other,'reports/'+finalReceipt.body.reportId);
  assert([403,404].includes(deniedReport.status),'Other user must not access this report');
});
