import {getClient,getAuthConfig} from '@/lib/auth';
import type {JourneySession} from './domain';
export async function practiceRequest<T>(body:unknown):Promise<T>{
 const config=getAuthConfig(),client=await getClient();if(!config||!client)throw Error('Please sign in to save your practice.');
 const {data}=await client.auth.getSession();if(!data.session)throw Error('Please sign in again to continue.');
 const response=await fetch(config.url+'/functions/v1/learning-practice',{method:'POST',cache:'no-store',signal:AbortSignal.timeout(30000),headers:{apikey:config.anonKey,Authorization:'Bearer '+data.session.access_token,'Content-Type':'application/json'},body:JSON.stringify(body)});
 let result;try{result=await response.json();}catch{throw Error('The practice service could not respond. Please retry.');}
 if(!response.ok)throw Error(result.error||'Could not save your practice. Please retry.');return result;
}
export const loadPractice=()=>practiceRequest<{sessions:JourneySession[];completedDays:number}>({action:'load'});
export const startPractice=()=>practiceRequest<{session:JourneySession}>({action:'start'});
export const savePractice=(session:JourneySession,submit=false)=>practiceRequest<{session:JourneySession}>({action:submit?'submit':'save',id:session.id,revision:session.updated_at,responses:session.responses});
export async function uploadPracticeAudio(sessionId:string,blob:Blob){
 const client=await getClient();if(!client)throw Error('Please sign in again.');const {data:{user},error}=await client.auth.getUser();if(error||!user)throw Error('Please sign in again.');
 if(blob.size>25*1024*1024)throw Error('This recording exceeds the 25 MB upload size. Please make a smaller recording. Your session has not been submitted.');
 const extension=blob.type.includes('mp4')?'mp4':blob.type.includes('ogg')?'ogg':'webm';
 const path=`${user.id}/${sessionId}/${crypto.randomUUID()}.${extension}`;
 const result=await client.storage.from('practice-media').upload(path,blob,{contentType:blob.type.split(';')[0],upsert:false});if(result.error)throw Error('Your recording could not upload. Please retry; your other answers are kept.');return path;
}
export async function playbackURL(path:string){const client=await getClient();if(!client)throw Error('Please sign in again.');const {data,error}=await client.storage.from('practice-media').createSignedUrl(path,1200);if(error||!data)throw Error('Your recording could not load. Please retry.');return data.signedUrl;}
