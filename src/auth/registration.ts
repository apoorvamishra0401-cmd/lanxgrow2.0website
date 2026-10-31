import {getClient,getAuthConfig} from '@/lib/auth';
import type {ReviewState} from '@/learner/state';
export const verificationEnabled=import.meta.env.VITE_AUTH_VERIFICATION==='true';
export type Channel='email'|'phone';
export type VerificationGrant={identity:string;channel:Channel;grant:string;expiresAt:string};
export async function registrationRequest<T>(body:unknown,authenticated=false,expectedOwner?:string):Promise<T>{
 const config=getAuthConfig();if(!config)throw Error('Account verification is unavailable. Please try again later.');
 const headers:Record<string,string>={'Content-Type':'application/json',apikey:config.anonKey};
 if(authenticated){const client=await getClient();const {data}=await client!.auth.getSession();if(!data.session)throw Error('Please sign in again.');if(expectedOwner&&data.session.user.id!==expectedOwner)throw Error('This profile belongs to a different session.');headers.Authorization='Bearer '+data.session.access_token;}
 const response=await fetch(config.url+'/functions/v1/registration',{method:'POST',headers,body:JSON.stringify(body),cache:'no-store',signal:AbortSignal.timeout(20000)});
 let data;try{data=await response.json();}catch{throw Error('The account service could not respond. Please retry.');}
 if(!response.ok)throw Error(data.error||'Could not complete this step. Please retry.');return data as T;
}
export async function finishRegistration(grant:VerificationGrant,password:string,agreed:boolean,policyVersion:string){
 const {session}=await registrationRequest<{session:{access_token:string;refresh_token:string}}>({action:'complete',grant:grant.grant,password,agreed,policyVersion});
 const client=await getClient();if(!client)throw Error('Sign-in is unavailable.');const {error}=await client.auth.setSession(session);if(error)throw Error('Your account was created. Please sign in to continue.');
}
export type CloudProfile={state:ReviewState|null;consentCurrent:boolean;verification:{channel:Channel;identity:string;verified_at:string|null}};
export function loadCloudProfile(){return registrationRequest<CloudProfile>({action:'profile-get'},true);}
const saveQueues=new Map<string,Promise<unknown>>();
export function saveCloudProfile(state:ReviewState,ownerId:string){const task=(saveQueues.get(ownerId)||Promise.resolve()).catch(()=>{}).then(()=>registrationRequest<{saved:boolean}>({action:'profile-save',state},true,ownerId));saveQueues.set(ownerId,task);void task.finally(()=>{if(saveQueues.get(ownerId)===task)saveQueues.delete(ownerId);}).catch(()=>{});return task;}
