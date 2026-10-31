import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const compile = name => ts.transpileModule(fs.readFileSync(new URL(name,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2020}}).outputText;
const moduleURL = source => 'data:text/javascript;base64,'+Buffer.from(source).toString('base64');
const locationURL=moduleURL(compile('../src/learner/location.ts'));
const code=compile('../src/learner/onboarding.ts').replace("'./location.ts'",JSON.stringify(locationURL));
const {emptyProfile,firstIncompleteStep,validateOnboardingStep,updateOnboardingProfile}=await import(moduleURL(code));
const {markProfileDraft,acknowledgeProfileDraft,readProfileDraft}=await import(moduleURL(compile('../src/auth/profileDraft.ts')));
const complete=()=>({...emptyProfile(),name:'Preview Learner',mobile:'+91 90000 00000',whatsapp:'+91 90000 00000',email:'learner@example.invalid',age:'22',state:'Maharashtra',city:'Pune',pincode:'411001',category:'Student',education:'College / University',board:'B.Com',minutes:'20 minutes',commitment:'Yes, I can commit',goals:['Speak confidently'],interests:['Reading']});
test('all fourteen steps must be valid before completion',()=>{
 const p=complete();assert.equal(firstIncompleteStep(p),14);
 for(const [key,value,step] of [['name','',0],['mobile','12345678',1],['whatsapp','',2],['email','bad',3],['age','',4],['state','unknown',5],['pincode','000000',6],['category','unknown',7],['education','',8],['board','',9],['minutes','5 minutes',10],['commitment','No, not right now',11],['goals',[],12],['interests',[],13]])assert.equal(firstIncompleteStep({...p,[key]:value}),step,key);
});
test('working learners need work and experience rather than a school board',()=>{
 const p={...complete(),category:'Working Professional',work:'Education',experience:'1–2 years',board:'',education:''};assert.equal(firstIncompleteStep(p),14);assert.notEqual(validateOnboardingStep({...p,experience:''},9),'');
});
test('Other goals and interests require an explanation',()=>{
 const p=complete();assert.notEqual(validateOnboardingStep({...p,goals:['Other']},12),'');assert.notEqual(validateOnboardingStep({...p,interests:['Other']},13),'');assert.equal(validateOnboardingStep({...p,goals:['Other'],otherGoal:'Speak at events'},12),'');
});
test('changing category clears incompatible old answers',()=>{
 const p=updateOnboardingProfile(complete(),'category','Working Professional');for(const key of ['education','board','work','experience'])assert.equal(p[key],'');
});
test('changing study level, daily minutes and state clears dependent answers',()=>{
 assert.equal(updateOnboardingProfile(complete(),'education','Class 12').board,'');assert.equal(updateOnboardingProfile(complete(),'minutes','30 minutes').commitment,'');const p=updateOnboardingProfile(complete(),'state','Delhi');assert.equal(p.city,'');assert.equal(p.pincode,'');
});
test('same WhatsApp number follows a phone edit',()=>{
 const p=updateOnboardingProfile(complete(),'mobile','+91 90000 00001');assert.equal(p.mobile,p.whatsapp);const q=updateOnboardingProfile({...complete(),whatsapp:'+91 90000 00002'},'mobile','+91 90000 00001');assert.equal(q.whatsapp,'+91 90000 00002');
});
function storage(){const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};}
const draft=p=>({version:1,step:0,profile:p,completedAt:null,welcomeSeen:false,waitlists:[]});
test('an old save acknowledgement cannot remove a newer unsynced draft',()=>{
 const store=storage(),a=draft(complete()),b=draft({...complete(),name:'New name'});markProfileDraft(store,'owner',a);markProfileDraft(store,'owner',b);acknowledgeProfileDraft(store,'owner',a);assert.equal(readProfileDraft(store,'owner').profile.name,'New name');acknowledgeProfileDraft(store,'owner',b);assert.equal(readProfileDraft(store,'owner'),null);
});
test('drafts remain separate for each learner and malformed storage is ignored',()=>{
 const store=storage();markProfileDraft(store,'owner-a',draft(complete()));assert.equal(readProfileDraft(store,'owner-b'),null);store.setItem('owner-b','invalid');assert.equal(readProfileDraft(store,'owner-b'),null);
});
test('frontend and deployed backend use identical validation rules',()=>{
 for(const name of ['onboarding.ts','location.ts'])assert.equal(fs.readFileSync(new URL('../src/learner/'+name,import.meta.url),'utf8'),fs.readFileSync(new URL('../supabase/functions/registration/'+name,import.meta.url),'utf8'));
});
