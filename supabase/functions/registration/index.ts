import {createClient} from 'npm:@supabase/supabase-js@2.118.0';
import {readProof,type Channel} from './proof.ts';
const CLIENT_ID='16602682226704766067'; // Public client ID supplied by the owner.
const POLICY='2026-10-25.1';
const url=Deno.env.get('SUPABASE_URL')||'',secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||'';
if(!url.includes('kzjvvwuyigiclryoqpkv.supabase.co'))throw Error('Development project mismatch');
const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
const hash=async(value:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');
let cachedMethods:{email:boolean;phone:boolean;google:boolean;phoneSignup:boolean}|null=null;let methodsAt=0;
async function loginMethods(){if(cachedMethods&&Date.now()-methodsAt<30000)return cachedMethods;const response=await fetch(url+'/auth/v1/settings',{headers:{apikey:Deno.env.get('SUPABASE_ANON_KEY')||''},signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error('settings unavailable');const settings=await response.json();cachedMethods={email:settings.external?.email===true,phone:settings.external?.phone===true,google:settings.external?.google===true,phoneSignup:settings.external?.phone===true&&settings.phone_autoconfirm===true};methodsAt=Date.now();return cachedMethods;}
const token=()=>Array.from(crypto.getRandomValues(new Uint8Array(32))).map(x=>x.toString(16).padStart(2,'0')).join('');
function originAllowed(origin:string){return /^https:\/\/lanxgrow-learner-review-[a-z0-9-]+\.vercel\.app$/.test(origin)||['http://localhost:4173','http://localhost:5173','http://terminal.local:4173'].includes(origin);}
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin')||'';const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(originAllowed(origin)?{'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Headers':'authorization, apikey, content-type, x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'}:{})};
 const reply=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(!originAllowed(origin))return reply({error:'This origin is not enabled for development authentication.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply({error:'Method not allowed.'},405);
 try{
  if(Number(req.headers.get('content-length')||0)>20000)return reply({error:'Request too large.'},413);
  const reader=req.body?.getReader();if(!reader)return reply({error:'Request body required.'},400);let total=0;const pieces:Uint8Array[]=[];try{for(;;){const part=await reader.read();if(part.done)break;total+=part.value.byteLength;if(total>20000)return reply({error:'Request too large.'},413);pieces.push(part.value);}}finally{await reader.cancel().catch(()=>{});}const bytes=new Uint8Array(total);let offset=0;for(const part of pieces){bytes.set(part,offset);offset+=part.length;}const body=JSON.parse(new TextDecoder().decode(bytes));
  if(body.action==='config')return reply({ready:true,clientId:CLIENT_ID,policyVersion:POLICY,methods:await loginMethods()});
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]||'unknown';const bucket=Math.floor(Date.now()/300000);
  const {data:allowed,error:rateError}=await db.rpc('registration_rate_limit',{p_key:await hash(secret+ip+bucket),p_limit:String(body.action).startsWith('profile-')?180:35});
  if(rateError)return reply({error:'Account service is temporarily unavailable. Please retry.'},503);
  if(!allowed)return reply({error:'Too many attempts. Please wait a few minutes.'},429);
  if(body.action==='verify'){
   if(!['phone','email'].includes(body.channel))return reply({error:'Choose phone or email.'},400);
   const channel=body.channel as Channel;if(!(await loginMethods())[channel])return reply({error:'This account method is temporarily unavailable. Please choose email or try later.'},503);const {identity,proof}=await readProof(body.user_json_url,channel);const grant=token();
   const {data,error}=await db.from('auth_registration_receipts').insert({channel,identity,proof_hash:await hash(proof),grant_hash:await hash(grant)}).select('expires_at').single();
   if(error)return reply({error:'This verification could not be accepted. Verify again or sign in if you already have an account.'},409);
   return reply({identity,channel,grant,expiresAt:data.expires_at});
  }
  if(body.action==='complete'){
   if(typeof body.password!=='string'||body.password.length<8||body.password.length>128)return reply({error:'Use a password between 8 and 128 characters.'},400);
   if(body.agreed!==true||body.policyVersion!==POLICY)return reply({error:'Please review and accept the current policies.'},400);
   if(typeof body.grant!=='string'||!/^[a-f0-9]{64}$/.test(body.grant))return reply({error:'Please verify your phone or email again.'},400);
   const grantHash=await hash(body.grant),now=new Date().toISOString();
   const {data:claimed,error:claimError}=await db.from('auth_registration_receipts').update({claimed_at:now}).eq('grant_hash',grantHash).is('claimed_at',null).gt('expires_at',now).select('*').maybeSingle();
   if(claimError)return reply({error:'Account service is temporarily unavailable.'},503);
   let receipt=claimed;
   if(!receipt){const {data}=await db.from('auth_registration_receipts').select('*').eq('grant_hash',grantHash).gt('expires_at',now).maybeSingle();receipt=data;if(!receipt?.completed_user_id)return reply({error:'Verification expired or account creation is already in progress. Please sign in or verify again.'},409);}
   if(!(await loginMethods())[receipt.channel as Channel])return reply({error:'This account method is temporarily unavailable. Please try later.'},503);
   const identity=receipt.channel==='email'?{email:receipt.identity}:{phone:receipt.identity};
   if(!receipt.completed_user_id){
    const {error}=await db.auth.admin.createUser({...identity,password:body.password,...(receipt.channel==='email'?{email_confirm:true}:{phone_confirm:true}),app_metadata:{registration_receipt_id:receipt.id,verification_provider:'phone.email'}});
    if(error)return reply({error:'Account creation was not completed. If you already registered, sign in instead; otherwise verify again.'},409);
   }
   // A separate non-persistent client prevents one learner's session leaking to another.
   const client=createClient(url,Deno.env.get('SUPABASE_ANON_KEY')||'',{auth:{persistSession:false,autoRefreshToken:false}});
   const {data,error}=await client.auth.signInWithPassword({...identity,password:body.password});
   if(error||!data.session)return reply({error:'Your account was created. Please sign in to continue.'},409);
   return reply({session:{access_token:data.session.access_token,refresh_token:data.session.refresh_token}});
  }
  if(body.action==='profile-get'||body.action==='profile-save'){
   const bearer=req.headers.get('authorization')?.replace(/^Bearer /,'');if(!bearer)return reply({error:'Please sign in.'},401);
   const {data:{user},error}=await db.auth.getUser(bearer);if(error||!user)return reply({error:'Please sign in again.'},401);
   let {data:verification}=await db.from('account_verifications').select('channel,identity,verified_at').eq('user_id',user.id).maybeSingle();
   if(!verification){const channel=user.email_confirmed_at?'email':user.phone?'phone':null;const identity=channel==='email'?user.email?.toLowerCase():user.phone?'+'+user.phone.replace(/^\+/, ''):null;if(!channel||!identity)return reply({error:'A signed-in account is required.'},403);const {error}=await db.from('account_verifications').upsert({user_id:user.id,channel,identity,provider:channel==='phone'?'unverified-phone':'supabase',verified_at:channel==='phone'?null:user.email_confirmed_at},{onConflict:'user_id',ignoreDuplicates:true});if(error)throw error;const {data}=await db.from('account_verifications').select('channel,identity,verified_at').eq('user_id',user.id).single();verification=data;}
   if(!verification)return reply({error:'Could not load verified account details.'},503);
   if(body.action==='profile-get'){const {data,error}=await db.from('learner_onboarding').select('state').eq('user_id',user.id).maybeSingle();if(error)throw error;const {data:consent}=await db.from('legal_consents').select('policy_version').eq('user_id',user.id).eq('policy_version',POLICY).maybeSingle();return reply({state:data?.state||null,verification,consentCurrent:Boolean(consent)});}
   const state=body.state;if(!state||state.version!==1||!Number.isInteger(state.step)||state.step<0||state.step>14||!state.profile||!Array.isArray(state.profile.goals)||!Array.isArray(state.profile.interests)||JSON.stringify(state).length>12000)return reply({error:'Please check your profile details.'},400);
   const profile=state.profile;const fields=['name','mobile','whatsapp','email','age','city','state','pincode','category','education','board','work','experience','minutes','commitment','otherGoal','otherInterest'];if(fields.some(key=>profile[key]!==undefined&&(typeof profile[key]!=='string'||profile[key].length>500))||[profile.goals,profile.interests].some(a=>a.length>30||a.some((v:unknown)=>typeof v!=='string'||v.length>100)))return reply({error:'Please check your profile details.'},400);
   if(state.completedAt&&(state.step!==14||String(profile.name||'').trim().length<2||!/^\+?[1-9][\d\s()-]{7,18}$/.test(profile.mobile||'')||!/^\S+@[^\s@]+\.[^\s@]+$/.test(profile.email||'')||!profile.state||!profile.city||!/^[1-9]\d{5}$/.test(profile.pincode||'')||parseInt(profile.minutes,10)<20||!Number.isFinite(parseInt(profile.minutes,10))||profile.commitment!=='Yes, I can commit'||!profile.goals.length||!profile.interests.length))return reply({error:'Please finish your onboarding details and daily commitment.'},400);
   const {data:existing}=await db.from('learner_onboarding').select('state').eq('user_id',user.id).maybeSingle();
   // Completing onboarding can set a trial start once, never reset it through edits.
   const completed=existing?.state?.completedAt||(state.completedAt?new Date().toISOString():null);
   const sanitized={...state,completedAt:completed,profile:{...state.profile,...(verification.channel==='email'?{email:verification.identity}:{mobile:verification.identity})}};
   const {error:saveError}=await db.from('learner_onboarding').upsert({user_id:user.id,state:sanitized,updated_at:new Date().toISOString()});if(saveError)throw saveError;return reply({saved:true});
  }
  return reply({error:'Unknown request.'},400);
 }catch{return reply({error:'Verification could not finish. Please retry. No unverified account has been accepted.'},400);}
});
