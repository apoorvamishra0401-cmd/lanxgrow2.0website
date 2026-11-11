/** Deterministic, non-AI checks for the two original assessment choice items.
 * This is not a language proficiency, interview, employability or AI score.
 * The answer key is server-only and must never be sent in assigned questions.
 */
export type ChoiceItem = {id:string;format:string;choices?:readonly string[]};
export type SavedChoice = {question_id:string;answer:string};
const answerKey: Readonly<Record<string,string>> = Object.freeze({
  'sa-clarity': 'Finished, not approved',
  'sa-collaboration': 'Verify the source before sharing',
});
export function objectiveChoiceReview(questions:readonly ChoiceItem[], answers:readonly SavedChoice[]) {
  const all = new Map(answers.map(a=>[a.question_id,a.answer]));
  const assigned = questions.filter(q=>q.format==='choice' && Object.hasOwn(answerKey,q.id));
  const checks=assigned.map(q=>{
    const value=all.get(q.id) ?? null;
    const valid=value!==null && !!q.choices?.includes(value);
    return {questionId:q.id, answered:valid, correct:valid && value===answerKey[q.id]};
  });
  const answered=checks.filter(q=>q.answered).length;
  const correct=checks.filter(q=>q.correct).length;
  return {
    type:'objective_multiple_choice_only' as const,
    provenance:'deterministic_server_answer_key' as const,
    aiEvaluationPerformed:false as const,
    fullAssessmentScore:null,
    evaluatedQuestionCount:checks.length,
    answeredChoiceCount:answered,
    correctChoiceCount:correct,
    freeTextEvaluated:false as const,
    videoEvaluated:false as const,
    note:'Only objective multiple-choice items were checked. Written answers and communication skills have NOT been evaluated or scored.',
    checks:checks.map(({questionId,answered,correct})=>({questionId,answered,correct})),
  };
}
