export const skills=['listening','reading','writing','speaking'] as const;
export type Skill=typeof skills[number];
export type Answer={text:string;audioPath?:string};
export type Vocabulary={expression:string;meaning:string;example:string};
export type SkillInsight={cefr?:'Pre-A1'|'A1'|'A2'|'B1'|'B2'|'C1'|'C2';rating?:number;strengths:string[];improvements:string[];examples:{learner:string;guidance:string}[];nextSteps:string[]};
export type PracticeReport={skills:Partial<Record<Skill,SkillInsight>>;overall:string;focus:Skill[]};
export type JourneySession={id:string;kind:'daily'|'milestone';day_index:number;topic_key:string;status:'draft'|'submitted'|'reviewed';responses:Partial<Record<Skill,Answer[]>>;report:PracticeReport|null;updated_at:string;submitted_at:string|null};
export const questionCount=(kind:JourneySession['kind'])=>kind==='milestone'?5:1;
export function answered(skill:Skill,answer:Answer|undefined){return Boolean(answer&&(skill==='reading'||skill==='speaking'?typeof answer.audioPath==='string'&&answer.audioPath.trim():typeof answer.text==='string'&&answer.text.trim()));}
export function firstUnfinished(session:JourneySession):number {
 return skills.findIndex(skill=>!Array.from({length:questionCount(session.kind)},(_,index)=>answered(skill,session.responses[skill]?.[index])).every(Boolean));
}
export function reportFocus(report:PracticeReport|null):Skill[]{
 if(!report)return [];
 return skills.filter(skill=>(report.focus||[]).includes(skill)||Boolean(report.skills[skill]?.improvements.length));
}
export function nextLearningStep(completedDays:number,milestoneDays:number[]){
 const due=completedDays>0&&completedDays%15===0&&!milestoneDays.includes(completedDays);
 return {kind:due?'milestone' as const:'daily' as const,day:due?completedDays:completedDays+1};
}
