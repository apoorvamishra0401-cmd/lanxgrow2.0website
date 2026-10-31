import {useEffect,useState} from 'react';
import {getInstallState,promptInstall,subscribeInstall,type InstallState} from '@/pwa/install';
export function HomeScreenAgreement({checked,onChange,disabled=false}:{checked:boolean;onChange:(value:boolean)=>void;disabled?:boolean}){
 return <label className="la-check home-screen-agreement"><input type="checkbox" checked={checked} disabled={disabled} onChange={e=>{const value=e.target.checked;onChange(value);if(value&&getInstallState()==='available')void promptInstall().catch(()=>{});}}/><span>I agree to add LanXgrow to my Home Screen for easy access. <em>(Optional)</em><small className="home-screen-note">You can continue without adding the app. Your browser will ask separately before installation. Where automatic installation is unavailable, follow the Home Screen instructions.</small></span></label>;
}
export function HomeScreenInstall(){
 const [state,setState]=useState<InstallState>(getInstallState),[help,setHelp]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 useEffect(()=>subscribeInstall(()=>setState(getInstallState())),[]);
 if(state==='installed')return <p className="af-small" role="status">Your browser reports LanXgrow was added. Open it from your Home Screen or app launcher.</p>;
 if(state==='standalone')return <p className="af-small" role="status">You’re using LanXgrow in an app window.</p>;
 return <section className="home-screen-install" aria-label="Add LanXgrow to your Home Screen"><button className="af-secondary" type="button" disabled={busy} onClick={async()=>{if(state!=='available'){setHelp(true);return;}setBusy(true);try{const result=await promptInstall();setMessage(result==='accepted'?'Installation requested. Your browser will complete the next step.':'You can add LanXgrow later from your browser menu.');setHelp(result!=='accepted');}catch{setMessage('The install prompt could not open. Use your browser menu instead.');setHelp(true);}finally{setBusy(false);}}}>{state==='available'?'Add LanXgrow to Home Screen':'How to add to Home Screen'}</button>{message&&<p className="af-small" role="status">{message}</p>}{help&&<div className="af-panel"><p>On iPhone or iPad: open LanXgrow in Safari, tap Share, then Add to Home Screen.</p><p>On Android: open your browser menu, then choose Install app or Add to Home screen.</p><p>On a laptop: use your browser’s Install app or Add to Dock option, if available.</p><p className="af-small">If you opened this inside another app, open the link in your main browser first. Adding to Home Screen does not enable notifications.</p></div>}</section>;
}

export function HomeScreenReminder({userId}:{userId:string}){
 const key='lanxgrow.install-reminder.v1.'+userId;
 const [visible,setVisible]=useState(()=>{try{return Date.now()-Number(localStorage.getItem(key)||0)>7*86400000;}catch{return true;}});
 const [state,setState]=useState<InstallState>(getInstallState);
 useEffect(()=>subscribeInstall(()=>setState(getInstallState())),[]);
 if(!visible||state==='installed'||state==='standalone')return null;
 return <aside className="home-screen-reminder" aria-label="Home Screen reminder"><strong>LanXgrow, one tap away.</strong><p>Add it to your Home Screen whenever you’re ready.</p><HomeScreenInstall/><button className="af-text-button" type="button" onClick={()=>{try{localStorage.setItem(key,String(Date.now()));}catch{}setVisible(false);}}>Not now</button></aside>;
}
