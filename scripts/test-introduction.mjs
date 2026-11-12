import { test } from 'node:test';
import assert from 'node:assert/strict';
import { objectiveIntroductionReview } from '../supabase/functions/career/introduction-review.mjs';

test('uploaded video with no transcript never invents spoken-language scores',()=>{
  const value=objectiveIntroductionReview('',12345);
  assert.equal(value.recordingReceived,true);
  assert.equal(value.recordingBytes,12345);
  assert.equal(value.aiEvaluated,false);
  assert.equal(value.transcriptWords,null);
  assert.equal(value.transcriptSource,'unavailable');
  assert.match(value.limitations,/not an AI.*pronunciation/);
  assert.equal(Object.hasOwn(value,'fluencyScore'),false);
});
test('browser transcript review counts words, not fluency or pronunciation',()=>{
  const value=objectiveIntroductionReview('Hello, I am learning English and I would like to improve my communication.',999);
  assert.equal(value.aiEvaluated,false);
  assert.equal(value.transcriptWords,14);
  assert.equal(value.transcriptSource,'browser-generated-or-user-corrected-unverified');
  assert.equal(value.suggestedNextSteps.length,2);
});
test('short transcript receives a clear limitation rather than a misleading score',()=>{
  const value=objectiveIntroductionReview('Hello world',512);
  assert.equal(value.transcriptWords,2);
  assert.match(value.observations.join(' '),/short/);
});
test('untrusted transcript input is bounded',()=>{
  const value=objectiveIntroductionReview('hello '.repeat(2000),123);
  assert.ok(value.transcriptWords<=1000);
});
