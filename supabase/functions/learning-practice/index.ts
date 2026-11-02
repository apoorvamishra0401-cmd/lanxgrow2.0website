import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {skills,firstUnfinished,type JourneySession,type Skill,type Answer} from './domain.ts';
import {selectTopic} from './content.ts';
const url=Deno.env.get('SUPABASE_URL')||'';
if(!url.includes('kzjvvwuyigiclryoqpkv.supabase.co'))throw Error('Development project mismatch');
const db=createClient(url,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'',{auth:{persistSession:false,autoRefreshToken:false}});
const columns='id,kind,day_index,topic_key,status,responses,report,updated_at,submitted_at';
const originAllowed=(origin:string)=>origin==='https://lanxgrow-learner-rev-git-5c58d2-apoorvamishra0401-cmds-projects.vercel.app'||/^https:\/\/lanxgrow-learner-review-[a-z0-9-]+\.vercel\.app$/.test(origin)||['http://localhost:4173','http://localhost:5173','http://terminal.local:4173'].includes(origin);
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(originAllowed(origin)?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST,OPTIONS'}:{})};
 const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(!originAllowed(origin))return reply({error:'This origin is not enabled.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply({error:'Method not allowed.'},405);
 try{
  const bearer=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!bearer)return reply({error:'Please sign in.'},401);
  const {data:{user},error:authError}=await db.auth.getUser(bearer);if(authError||!user)return reply({error:'Please sign in again.'},401);
  const {data:allowed,error:rateError}=await db.rpc('registration_rate_limit',{p_key:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(`practice:${user.id}:${Math.floor(Date.now()/300000)}`)))).map(value=>value.toString(16).padStart(2,'0')).join(''),p_limit:150});if(rateError||!allowed)return reply({error:'Please wait a moment before trying again.'},429);
  const reader=req.body?.getReader();if(!reader)return reply({error:'Request required.'},400);const chunks:Uint8Array[]=[];let total=0;try{for(;;){const part=await reader.read();if(part.done)break;total+=part.value.length;if(total>262144)return reply({error:'This response is too large. Please shorten the text and retry.'},413);chunks.push(part.value);}}finally{await reader.cancel().catch(()=>{});}const bytes=new Uint8Array(total);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}const body=JSON.parse(new TextDecoder().decode(bytes));
  if(body.action==='load'){
   const {data,error}=await db.from('practice_sessions').select(columns).eq('user_id',user.id).order('day_index',{ascending:false}).limit(300);if(error)throw error;
   const {count}=await db.from('practice_sessions').select('id',{count:'exact',head:true}).eq('user_id',user.id).eq('kind','daily').in('status',['submitted','reviewed']);
   return reply({sessions:data,completedDays:count||0});
  }
  if(body.action==='start'){
   const {data:profile}=await db.from('learner_onboarding').select('state').eq('user_id',user.id).maybeSingle();
   const {data:consent}=await db.from('legal_consents').select('user_id').eq('user_id',user.id).eq('policy_version','2026-10-25.1').maybeSingle();
   if(!profile?.state?.completedAt||!consent)return reply({error:'Complete your learner preferences before starting Practice.'},403);
   const {count}=await db.from('practice_sessions').select('id',{count:'exact',head:true}).eq('user_id',user.id).eq('kind','daily').in('status',['submitted','reviewed']);
   const topic=selectTopic(profile.state.profile.interests||[],(count||0)+1);
   const {data,error}=await db.rpc('start_learning_practice',{p_user_id:user.id,p_topic:topic});if(error)throw error;return reply({session:data});
  }
  if(!['save','submit'].includes(body.action)||typeof body.id!=='string')return reply({error:'Unknown request.'},400);
  const {data:session,error}=await db.from('practice_sessions').select('*').eq('id',body.id).eq('user_id',user.id).maybeSingle();if(error)throw error;if(!session)return reply({error:'Practice session not found.'},404);
  if(session.status!=='draft')return reply({session});
  if(body.revision!==session.updated_at)return reply({error:'This practice changed in another tab. Reload to continue with the latest saved answers.'},409);
  const responses:Partial<Record<Skill,Answer[]>>={};const paths:string[]=[];
  for(const skill of skills){const answers=body.responses?.[skill];if(answers===undefined)continue;if(!Array.isArray(answers)||answers.length>(session.kind==='milestone'?5:1))return reply({error:'Please check your practice responses.'},400);
   responses[skill]=answers.map(a=>{
    if(!a||typeof a.text!=='string'||a.text.length>12000)throw Error('invalid response');
    const answer:Answer={text:a.text};
    if(a.audioPath!==undefined){if(typeof a.audioPath!=='string'||!new RegExp(`^${user.id}/${session.id}/[a-z0-9-]+\\.(webm|mp4|ogg|wav|mp3)$`).test(a.audioPath))throw Error('invalid audio');answer.audioPath=a.audioPath;paths.push(a.audioPath);}
    return answer;
   });
  }
  if(paths.length){const {data,error}=await db.storage.from('practice-media').createSignedUrls(paths,60);if(error||!data||data.some(item=>!item.signedUrl||item.error))return reply({error:'One of your recordings has not finished uploading. Please retry.'},400);}
  const complete=body.action==='submit';if(complete&&firstUnfinished({...session,responses} as JourneySession)!==-1)return reply({error:'Complete all four skills before submitting your learning day.'},400);
  const now=new Date().toISOString();const {data:saved,error:saveError}=await db.from('practice_sessions').update({responses,updated_at:now,...(complete?{status:'submitted',submitted_at:now,practice_date:new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}:{})}).eq('id',session.id).eq('user_id',user.id).eq('status','draft').eq('updated_at',body.revision).select(columns).maybeSingle();if(saveError)throw saveError;if(!saved)return reply({error:'This practice changed in another tab. Reload your saved answers.'},409);return reply({session:saved});
 }catch{return reply({error:'Your practice could not be saved. Please check your connection and retry.'},400);}
});
