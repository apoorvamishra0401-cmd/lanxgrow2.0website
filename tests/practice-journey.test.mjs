import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const load=async p=>import('data:text/javascript;base64,'+Buffer.from(ts.transpileModule(source(p),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText).toString('base64'));
const {skills,firstUnfinished,questionCount,answered,nextLearningStep,reportFocus,nextCefrTarget,wordCount,minimumWritingWords,responseIssue}=await load('src/learner/journey/domain.ts');
const {topics,vocabulary,prompts,selectTopic}=await load('src/learner/journey/content.ts');
const session=(kind='daily')=>({kind,responses:{}});
test('four skills run in the confirmed order',()=>assert.deepEqual(skills,['listening','reading','writing','speaking']));
test('all four skills are required; text cannot substitute for read-aloud or speaking',()=>{
 const s=session();assert.equal(firstUnfinished(s),0);s.responses.listening=[{text:'The main idea is to prepare and stay open to change.'}];assert.equal(firstUnfinished(s),1);s.responses.reading=[{text:'A transcript alone is not a recording.'}];assert.equal(firstUnfinished(s),1);s.responses.reading=[{text:'',audioPath:'owner/session/reading.webm'}];s.responses.writing=[{text:'idea '.repeat(50)}];assert.equal(firstUnfinished(s),3);s.responses.speaking=[{text:'',audioPath:'owner/session/speaking.webm'}];assert.equal(firstUnfinished(s),-1);
});
test('a milestone requires all twenty responses',()=>{
 const s=session('milestone');for(const skill of skills)s.responses[skill]=Array.from({length:5},()=>skill==='reading'||skill==='speaking'?{text:'',audioPath:'saved.webm'}:{text:'idea '.repeat(50)});assert.equal(firstUnfinished(s),-1);s.responses.writing.pop();assert.equal(firstUnfinished(s),2);assert.equal(skills.reduce(n=>n+questionCount('milestone'),0),20);
});
test('milestone due after fifteen completed learning days, not calendar time',()=>{
 assert.deepEqual(nextLearningStep(10,[]),{kind:'daily',day:11});assert.deepEqual(nextLearningStep(15,[]),{kind:'milestone',day:15});assert.deepEqual(nextLearningStep(15,[15]),{kind:'daily',day:16});assert.deepEqual(nextLearningStep(30,[15]),{kind:'milestone',day:30});
});
test('low marks never block a completed milestone; reviewed needs guide next focus',()=>{
 const report={focus:[],skills:{speaking:{rating:30,improvements:['Organise the response'],strengths:[],examples:[],nextSteps:[]}}};assert.deepEqual(reportFocus(report),['speaking']);assert.deepEqual(nextLearningStep(15,[15]),{kind:'daily',day:16});assert.deepEqual(reportFocus(null),[]);
});
test('exactly two expressions per skill and eight distinct expressions per topic',()=>{
 for(const key of Object.keys(topics)){const all=skills.flatMap(skill=>{const values=vocabulary(key,skill);assert.equal(values.length,2);return values.map(v=>v.expression);});assert.equal(new Set(all).size,8);}
});
test('daily and milestone prompts match their section counts',()=>{
 for(const skill of skills){assert.equal(prompts(skill,false).length,1);assert.equal(prompts(skill,true).length,5);}
});
test('interests rotate across completed learning days and unknown interests have a safe default',()=>{
 assert.equal(selectTopic(['Travel','Technology'],1),'travel');assert.equal(selectTopic(['Travel','Technology'],2),'technology');assert.equal(selectTopic([],1),'everyday');
});
test('blank, missing and malformed answers do not count as completion',()=>{
 assert.equal(answered('writing',{text:'   '}),false);assert.equal(answered('reading',{text:'',audioPath:''}),false);assert.equal(answered('listening',undefined),false);assert.equal(answered('writing',{text:null}),false);
});
test('server and frontend share identical completion rules',()=>{
 assert.equal(source('src/learner/journey/domain.ts'),source('supabase/functions/learning-practice/domain.ts'));
});

test('current assessed level stays separate from the next target; C2 never becomes C3',()=>{assert.equal(nextCefrTarget('A2'),'B1');assert.equal(nextCefrTarget('B2'),'C1');assert.equal(nextCefrTarget('C2'),'Specialised communication within C2');});

test('automatic sequencing blocks the next learning block until every due milestone is submitted',()=>{
 assert.deepEqual(nextLearningStep(14,[]),{kind:'daily',day:15});
 assert.deepEqual(nextLearningStep(15,[]),{kind:'milestone',day:15});
 assert.deepEqual(nextLearningStep(16,[]),{kind:'milestone',day:15});
 assert.deepEqual(nextLearningStep(31,[15]),{kind:'milestone',day:30});
 assert.deepEqual(nextLearningStep(31,[15,30]),{kind:'daily',day:32});
});

test('original answers are accepted without matching expressions or correct grammar',()=>{
 const original='Yesterday I go market and meet friend we talk about learning together and I want improve my English because I have many ideas to share with my family and people at work this is my own answer about something that matters to me and I keep trying every single day';
 assert.equal(answered('writing',{text:original},1),true);
 assert.equal(answered('listening',{text:'She changed her plans.'}),true);
 assert.equal(responseIssue('writing',{text:original},1),'');
});
test('writing minimum is 50 words in the first block and 100 afterwards',()=>{
 assert.equal(minimumWritingWords(1),50);assert.equal(minimumWritingWords(15),50);assert.equal(minimumWritingWords(16),100);
 assert.equal(answered('writing',{text:'word '.repeat(49)},1),false);assert.equal(answered('writing',{text:'word '.repeat(50)},1),true);
 assert.equal(answered('writing',{text:'word '.repeat(99)},16),false);assert.equal(answered('writing',{text:'word '.repeat(100)},16),true);
 assert.match(responseIssue('writing',{text:'word '.repeat(49)},1),/1 more word/);
});
test('word counter handles punctuation, apostrophes, line breaks and international text',()=>{
 assert.equal(wordCount('... !!!'),0);assert.equal(wordCount("I'm learning.\nMy own, words!"),5);assert.equal(wordCount('नमस्ते दुनिया'),2);assert.equal(wordCount(null),0);
});
const {readTextDraft,textDraft,DRAFT_LIFETIME}=await load('src/learner/journey/drafts.ts');
test('drafts expire after seven days and never serialize recordings or audio paths',()=>{
 const now=1000000000,draft=textDraft({writing:[{text:'my draft',audioPath:'private.wav'}]},'rev',null,now);
 assert.equal(draft.expiresAt,now+DRAFT_LIFETIME);assert.equal(JSON.stringify(draft).includes('private.wav'),false);
 assert.ok(readTextDraft(JSON.stringify(draft),'rev',now+1));assert.equal(readTextDraft(JSON.stringify(draft),'other',now+1),null);
 assert.equal(readTextDraft(JSON.stringify(draft),'rev',now+DRAFT_LIFETIME),null);
 const updated=textDraft({writing:[{text:'changed'}]},'rev2',draft,now+1000);assert.equal(updated.expiresAt,draft.expiresAt);
 assert.equal(readTextDraft('{bad','rev',now),null);
});
