import {useEffect,useRef,useState} from 'react';
import {registrationRequest,type Channel,type VerificationGrant} from './registration';
export default function PhoneEmailButton({channel,clientId,onVerified}:{channel:Channel;clientId:string;onVerified:(value:VerificationGrant)=>void}){
 const frame=useRef<HTMLIFrameElement>(null);const callback=useRef(onVerified);callback.current=onVerified;const [busy,setBusy]=useState(false);const [error,setError]=useState('');const pending=useRef(false);
 useEffect(()=>{let mounted=true;
  const receive=async(event:MessageEvent)=>{
   if(event.origin!==window.location.origin||event.source!==frame.current?.contentWindow||event.data?.type!=='lanxgrow.phone-email'||event.data.channel!==channel||pending.current)return;
   if(event.data.error){setError('The verification button could not load. Check your connection and retry.');return;}
   pending.current=true;setBusy(true);setError('');
   try{const result=await registrationRequest<VerificationGrant>({action:'verify',channel,user_json_url:event.data.user_json_url});if(mounted)callback.current(result);}
   catch(e){if(mounted)setError(e instanceof Error?e.message:'Verification could not finish. Please retry.');}
   finally{pending.current=false;if(mounted)setBusy(false);}
  };window.addEventListener('message',receive);return()=>{mounted=false;window.removeEventListener('message',receive);};
 },[channel,clientId]);
 return <div className="otp-provider"><iframe ref={frame} title={`Verify your ${channel==='phone'?'phone number':'email address'} with OTP`} src={`/auth/phone-email.html?channel=${channel}&clientId=${encodeURIComponent(clientId)}`} sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"/><p role="status">{busy?'Confirming your verification…':`Complete ${channel==='phone'?'phone':'email'} verification in the secure window, then return here to set your password.`}</p>{error&&<p role="alert" className="af-error">{error}</p>}</div>;
}
