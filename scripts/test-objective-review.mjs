import test from 'node:test';
import assert from 'node:assert/strict';
import { objectiveChoiceReview } from '../supabase/functions/career/objective.ts';
const questions=[
 {id:'sa-clarity',format:'choice',choices:['Finished, not approved','Approved','Not finished']},
 {id:'sa-collaboration',format:'choice',choices:['Verify the source before sharing','Publish immediately','Hide the issue']},
 {id:'sa-writing',format:'text'}
];
test('objective checks grade only assigned choice items, not written text',()=>{
 const x=objectiveChoiceReview(questions,[
  {question_id:'sa-clarity',answer:'Finished, not approved'},
  {question_id:'sa-collaboration',answer:'Hide the issue'},
  {question_id:'sa-writing',answer:'Detailed professional answer'}
 ]);
 assert.equal(x.evaluatedQuestionCount,2);assert.equal(x.correctChoiceCount,1);
 assert.equal(x.fullAssessmentScore,null);assert.equal(x.aiEvaluationPerformed,false);
 assert.equal(x.freeTextEvaluated,false);assert.equal(x.provenance,'deterministic_server_answer_key');
 assert(!JSON.stringify(x).includes('Detailed professional answer'));
});
test('unanswered and invalid choice values cannot be credited',()=>{
 const x=objectiveChoiceReview(questions,[{question_id:'sa-clarity',answer:'Made up option'}]);
 assert.equal(x.answeredChoiceCount,0);assert.equal(x.correctChoiceCount,0);
 assert.equal(x.checks[0].answered,false);
});
test('no assigned choice items produces no score or fabricated evaluation',()=>{
 const x=objectiveChoiceReview([{id:'essay',format:'text'}],[]);
 assert.equal(x.correctChoiceCount,0);assert.equal(x.evaluatedQuestionCount,0);
 assert.equal(x.fullAssessmentScore,null);
});
