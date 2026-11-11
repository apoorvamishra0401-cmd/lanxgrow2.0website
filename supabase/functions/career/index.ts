import { createClient } from 'npm:@supabase/supabase-js@2.57.0';

const url = Deno.env.get('SUPABASE_URL') || '';
const anon = Deno.env.get('SUPABASE_ANON_KEY') || '';
const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const bucket = 'lanx-career-video-dev';
const consentVersion = '2026-10-25.1';
const admin = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false } });
const authClient = createClient(url, anon, { auth: { persistSession: false, autoRefreshToken: false } });
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const keyPattern = /^[\w:-]{8,200}$/;
const allowedOrigins = (Deno.env.get('LANX_ALLOWED_REVIEW_ORIGINS') ||
  'https://lanxgrow-founder-review-isolate-apoorvamishra0401-cmds-projects.vercel.app,https://lanxgrow-founder-rev-git-819f9f-apoorvamishra0401-cmds-projects.vercel.app,http://localhost:4173,http://localhost:5173')
  .split(',').map(s => s.trim()).filter(Boolean);
const previewPattern = /^https:\/\/lanxgrow-founder-review-isolated-[a-z0-9-]+\.vercel\.app$/;
function approvedOrigin(origin: string | null): boolean {
  return origin === null || allowedOrigins.includes(origin) || previewPattern.test(origin);
}
const videoQuestions = [
  { id:'vi-introduction',format:'video',prompt:'Introduce yourself and the kind of role you want.' },
  { id:'vi-communication',format:'video',prompt:'Describe a time you explained a difficult idea.' },
  { id:'vi-learning',format:'video',prompt:'Describe a skill you recently improved.' },
  { id:'vi-teamwork',format:'video',prompt:'How do you handle disagreement in a team?' },
  { id:'vi-motivation',format:'video',prompt:'Why does this career direction interest you?' },
];
const assessmentQuestions = [
  {id:'sa-clear-message',format:'text',prompt:'Write a concise professional self-introduction.'},
  {id:'sa-empathy',format:'text',prompt:'Explain how you would respond to an unhappy customer.'},
  {id:'sa-clarity',format:'choice',prompt:'A report is finished but awaiting approval. What is true?',choices:['Finished, not approved','Approved','Not finished']},
  {id:'sa-priority',format:'text',prompt:'How would you prioritize three urgent work requests?'},
  {id:'sa-speaking',format:'text',prompt:'Describe a professional goal and two steps toward it.'},
  {id:'sa-collaboration',format:'choice',prompt:'You notice an error in shared data. Best next step?',choices:['Verify the source before sharing','Publish immediately','Hide the issue']},
  {id:'sa-writing',format:'text',prompt:'Draft a respectful update about a delayed task.'},
  {id:'sa-reflection',format:'text',prompt:'Describe one practical way you could improve communication.'},
];
type Identity = { userId: string; audience: 'fresher'|'professional' };
const headers = (origin: string | null) => ({
  'Content-Type': 'application/json', 'Cache-Control': 'no-store',
  'Vary': 'Origin', 'Access-Control-Allow-Origin': origin && approvedOrigin(origin) ? origin : 'null',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, idempotency-key',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS'
});
function respond(status: number, data: unknown, origin: string | null) {
  return new Response(JSON.stringify(data), { status, headers: headers(origin) });
}
function fail(status: number, message: string, origin: string | null) {
  return respond(status, {error: message}, origin);
}
function validId(value: unknown): value is string { return typeof value === 'string' && uuid.test(value); }
async function verifiedGoogleAndConsent(req: Request): Promise<string | null> {
  const token = req.headers.get('authorization')?.match(/^Bearer ([A-Za-z0-9._~+/-]+=*)$/)?.[1];
  if (!token || !url || !anon || !secret) return null;
  const {data: {user}, error} = await authClient.auth.getUser(token);
  if (error || !user || user.is_anonymous || user.app_metadata?.provider !== 'google' ||
      !user.identities?.some(i => i.provider === 'google')) return null;
  const {data: consent, error: consentError} = await admin.from('legal_consents').select('policy_version')
    .eq('user_id',user.id).eq('policy_version',consentVersion).maybeSingle();
  return consentError || !consent ? null : user.id;
}
async function identity(req: Request): Promise<Identity | null> {
  const userId = await verifiedGoogleAndConsent(req);
  if (!userId) return null;
  const {data: access, error} = await admin.from('lanx_learner_access')
    .select('role,audience').eq('user_id',userId).maybeSingle();
  if (error || access?.role !== 'learner' ||
      (access.audience !== 'fresher' && access.audience !== 'professional')) return null;
  return {userId,audience:access.audience};
}
async function loadAttempt(id: string, owner: string) {
  const {data,error} = await admin.from('lanx_career_attempts').select('*').eq('id',id).eq('user_id',owner).maybeSingle();
  if (error) throw error;
  return data;
}
async function receiptFor(id: string, owner: string) {
  const {data,error} = await admin.from('lanx_career_receipts').select('*').eq('attempt_id',id).eq('user_id',owner).maybeSingle();
  if (error) throw error;
  return data;
}
async function serialize(a: Record<string,any>) {
  const {data:answerRows,error} = await admin.from('lanx_career_answers').select('question_id,answer').eq('attempt_id',a.id);
  if (error) throw error;
  const receipt = await receiptFor(a.id,a.user_id);
  return {
    id:a.id, ownerId:a.user_id, kind:a.kind, audience:a.audience,
    startedAt:a.started_at, deadlineAt:a.deadline_at, questions:a.questions,
    answers:Object.fromEntries((answerRows||[]).map(r=>[r.question_id,r.answer])),
    status:a.status, receipt: receipt ? {id:receipt.id,status:receipt.status,reportId:receipt.report_id||undefined} : undefined
  };
}
function isActive(a:Record<string,any>) { return a.status === 'active' && Date.now() < Date.parse(a.deadline_at); }

Deno.serve(async req => {
  const origin = req.headers.get('origin');
  if (req.method === 'OPTIONS') return new Response(null,{status:204,headers:headers(origin)});
  if (!approvedOrigin(origin)) return fail(403,'Origin not allowed',origin);
  if (!url || !anon || !secret) return fail(503,'Development backend is not configured',origin);
  const path = new URL(req.url).pathname.split('/career/')[1] || '';
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 1 && (parts[0] === 'audience' || parts[0] === 'enroll')) {
    const userId = await verifiedGoogleAndConsent(req).catch(() => null);
    if (!userId) return fail(403,'Verified Google login and current consent required',origin);
    const {data: current, error: currentError} = await admin.from('lanx_learner_access')
      .select('role,audience').eq('user_id',userId).maybeSingle();
    if (currentError) return fail(503,'Audience lookup unavailable',origin);
    if (req.method === 'GET' && parts[0] === 'audience')
      return respond(200,{assigned:!!current,role:current?.role||null,audience:current?.audience||null},origin);
    if (req.method === 'POST' && parts[0] === 'enroll') {
      const body = await req.json().catch(()=>null);
      if (!['student','fresher','professional'].includes(body?.audience))
        return fail(400,'Only a learner audience may be selected',origin);
      if (current) return current.role === 'learner' && current.audience === body.audience
        ? respond(200,{assigned:true,role:'learner',audience:current.audience},origin)
        : fail(409,'Audience is already assigned; it cannot be changed here',origin);
      // Development-only, self-declared learner category, permanently stored server-side.
      // This does NOT validate employment or payment entitlement; no admin role assignment.
      const {data: assigned, error: insertError} = await admin.from('lanx_learner_access')
        .insert({user_id:userId,role:'learner',audience:body.audience,assignment_source:'trusted_onboarding'})
        .select('role,audience').single();
      if (insertError) return insertError.code === '23505'
        ? fail(409,'Audience was already assigned by another request',origin)
        : fail(503,'Cannot store learner audience',origin);
      return respond(201,{assigned:true,role:assigned.role,audience:assigned.audience},origin);
    }
    return fail(405,'Unsupported learner enrollment method',origin);
  }
  const who = await identity(req).catch(()=>null);
  if (!who) return fail(403,'Verified Google login, career audience and current consent required',origin);
  try {
    if(req.method==='GET' && parts.join('/')==='access')
      return respond(200,{allowed:true,userId:who.userId,audience:who.audience},origin);
    if(req.method==='POST' && parts.join('/')==='attempts') {
      const key=req.headers.get('idempotency-key');
      if(!keyPattern.test(key||'')) return fail(400,'Invalid idempotency key',origin);
      const body=await req.json().catch(()=>null);
      const kind=body?.kind;
      if(kind!=='video-interview'&&kind!=='skills-assessment') return fail(400,'Invalid journey',origin);
      const existing=await admin.from('lanx_career_attempts').select('*').eq('user_id',who.userId).eq('kind',kind).eq('start_key',key).maybeSingle();
      if(existing.error) throw existing.error;
      if(existing.data) return respond(200,await serialize(existing.data),origin);
      const start=new Date();
      const deadline=new Date(start.getTime()+(kind==='video-interview'?600000:1200000));
      const {data,error}=await admin.from('lanx_career_attempts').insert({
        user_id:who.userId,audience:who.audience,kind,started_at:start.toISOString(),
        deadline_at:deadline.toISOString(),questions:kind==='video-interview'?videoQuestions:assessmentQuestions,
        start_key:key
      }).select('*').single();
      if(error) {
        if(error.code==='23505') {
          const again=await admin.from('lanx_career_attempts').select('*').eq('user_id',who.userId).eq('kind',kind).eq('start_key',key).single();
          if(again.data) return respond(200,await serialize(again.data),origin);
        }
        throw error;
      }
      return respond(201,await serialize(data),origin);
    }
    if(parts[0]==='attempts'&&validId(parts[1])) {
      const attempt=await loadAttempt(parts[1],who.userId);
      if(!attempt) return fail(404,'Attempt not found',origin);
      if(req.method==='GET'&&parts.length===2) return respond(200,await serialize(attempt),origin);
      if(req.method==='PUT'&&parts[2]==='answers'&&parts.length===4) {
        if(!isActive(attempt)) return fail(409,'Attempt expired or submitted',origin);
        const q=attempt.questions.find((q:any)=>q.id===parts[3]&&q.format!=='video');
        if(!q) return fail(400,'Question not assigned for text response',origin);
        const body=await req.json().catch(()=>null);
        if(typeof body?.value!=='string'||body.value.length>16000) return fail(400,'Invalid answer',origin);
        const {error}=await admin.from('lanx_career_answers').upsert({attempt_id:attempt.id,question_id:q.id,answer:body.value,saved_at:new Date().toISOString()},{onConflict:'attempt_id,question_id'});
        if(error) throw error;
        return respond(200,await serialize(attempt),origin);
      }
      if(req.method==='POST'&&parts[2]==='media-ticket'&&parts.length===3) {
        if(attempt.kind!=='video-interview'||!isActive(attempt)) return fail(409,'Video attempt is not active',origin);
        const objectPath=who.userId+'/'+attempt.id+'/recording.webm';
        const {data,error}=await admin.storage.from(bucket).createSignedUploadUrl(objectPath);
        if(error||!data) throw error||new Error('Cannot create upload ticket');
        return respond(200,{path:objectPath,token:data.token,bucket},origin);
      }
      if(req.method==='POST'&&parts[2]==='submission'&&parts.length===3) {
        const key=req.headers.get('idempotency-key');
        if(!keyPattern.test(key||'')) return fail(400,'Invalid idempotency key',origin);
        const previous=await receiptFor(attempt.id,who.userId);
        if(previous) {
          if(previous.submission_key!==key) return fail(409,'Attempt already submitted using another key',origin);
          return respond(200,{id:previous.id,status:previous.status,reportId:previous.report_id||undefined},origin);
        }
        const body=await req.json().catch(()=>null);
        const expected=who.userId+'/'+attempt.id+'/recording.webm';
        if(attempt.kind==='video-interview') {
          if(body?.recordingPath!==expected) return fail(400,'Recording path does not match attempt',origin);
          const {data:objects,error:objectError}=await admin.storage.from(bucket).list(who.userId+'/'+attempt.id,{limit:10,search:'recording.webm'});
          if(objectError||!objects?.some(o=>o.name==='recording.webm'&&o.metadata?.size>0)) return fail(400,'Uploaded recording not found',origin);
        }
        if(attempt.status!=='active'||Date.now()>Date.parse(attempt.deadline_at)+300000)
          return fail(409,'Attempt is no longer eligible for submission',origin);
        const {data,error}=await admin.from('lanx_career_receipts').insert({
          attempt_id:attempt.id,user_id:who.userId,submission_key:key,status:'queued'
        }).select('*').single();
        if(error) {
          if(error.code==='23505') {
            const again=await receiptFor(attempt.id,who.userId);
            if(again&&again.submission_key===key) return respond(200,{id:again.id,status:again.status},origin);
          }
          throw error;
        }
        const {error:statusError}=await admin.from('lanx_career_attempts').update({
          status:'submitted',submitted_at:new Date().toISOString(),recording_path:attempt.kind==='video-interview'?expected:null
        }).eq('id',attempt.id).eq('user_id',who.userId);
        if(statusError) throw statusError;
        return respond(201,{id:data.id,status:data.status},origin);
      }
    }
    if(req.method==='GET'&&parts[0]==='receipts'&&validId(parts[1])&&parts.length===2) {
      const {data,error}=await admin.from('lanx_career_receipts').select('id,status,report_id').eq('id',parts[1]).eq('user_id',who.userId).maybeSingle();
      if(error) throw error;
      if(!data) return fail(404,'Receipt not found',origin);
      return respond(200,{id:data.id,status:data.status,reportId:data.report_id||undefined},origin);
    }
    return fail(404,'Unknown career endpoint',origin);
  } catch(e) {
    console.error('Career handler failed',e instanceof Error?e.message:'unknown');
    return fail(500,'Career operation failed without exposing internal details',origin);
  }
});
