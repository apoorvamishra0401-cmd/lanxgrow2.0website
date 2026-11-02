export const skills=['listening','reading','writing','speaking'] as const;
export type Skill=typeof skills[number];
export type ImprovedAnswer={text:string;audioPath?:string;submittedAt:string};
export type Answer={text:string;audioPath?:string;improvement?:ImprovedAnswer};
export type Vocabulary={expression:string;meaning:string;example:string};
export type SkillInsight={cefr?:'Pre-A1'|'A1'|'A2'|'B1'|'B2'|'C1'|'C2';rating?:number;strengths:string[];improvements:string[];examples:{learner:string;guidance:string}[];nextSteps:string[]};
export type PracticeReport={skills:Partial<Record<Skill,SkillInsight>>;overall:string;focus:Skill[]};
export type JourneySession={id:string;kind:'daily'|'milestone';day_index:number;topic_key:string;status:'draft'|'submitted'|'reviewed';responses:Partial<Record<Skill,Answer[]>>;report:PracticeReport|null;updated_at:string;submitted_at:string|null};
export const questionCount=(kind:JourneySession['kind'])=>kind==='milestone'?5:1;
// Expression suggestions and grammar never determine submission eligibility.
export function wordCount(text:unknown):number {
 if(typeof text!=='string')return 0;
 return (text.match(/[\p{L}\p{N}][\p{L}\p{M}\p{N}]*(?:['’\-][\p{L}\p{N}][\p{L}\p{M}\p{N}]*)*/gu)||[]).length;
}
export const minimumWritingWords=(day:number)=>day<=15?50:100;
export function responseIssue(skill:Skill,answer:Answer|undefined,day=1):string {
 if(skill==='reading'||skill==='speaking')return typeof answer?.audioPath==='string'&&answer.audioPath.trim()?'':'Record and save your voice to continue. You do not need to use the suggested expressions.';
 if(!wordCount(answer?.text))return 'Write your response in your own words to continue.';
 if(skill==='writing'){
  const remaining=minimumWritingWords(day)-wordCount(answer?.text);
  if(remaining>0)return `Add ${remaining} more ${remaining===1?'word':'words'} to continue. Your ideas and grammar do not need to be perfect.`;
 }
 return '';
}
export function answered(skill:Skill,answer:Answer|undefined,day=1){return responseIssue(skill,answer,day)==='';}

export function firstUnfinished(session:JourneySession):number {
 return skills.findIndex(skill=>!Array.from({length:questionCount(session.kind)},(_,index)=>answered(skill,session.responses[skill]?.[index],session.day_index)).every(Boolean));
}
export function reportFocus(report:PracticeReport|null):Skill[]{
 if(!report)return [];
 return skills.filter(skill=>(report.focus||[]).includes(skill)||Boolean(report.skills[skill]?.improvements.length));
}
export function nextLearningStep(completedDays:number,milestoneDays:number[]){
 for(let boundary=15;boundary<=completedDays;boundary+=15){
  if(!milestoneDays.includes(boundary))return {kind:'milestone' as const,day:boundary};
 }
 return {kind:'daily' as const,day:completedDays+1};
}
// A learning target is not an awarded level or a promise about completion time.
export function nextCefrTarget(level:NonNullable<SkillInsight['cefr']>):string {
 const levels=['Pre-A1','A1','A2','B1','B2','C1','C2'];
 const index=levels.indexOf(level);
 return level==='C2'?'Specialised communication within C2':levels[index+1];
}
