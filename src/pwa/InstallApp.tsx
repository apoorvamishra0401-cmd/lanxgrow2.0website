import {useEffect,useState} from 'react';
import {installState,requestInstall,watchInstall} from './install';
import './install.css';
export default function InstallApp(){
 const [state,setState]=useState(installState),[visible,setVisible]=useState(false),[instructions,setInstructions]=useState(false),[dismissed,setDismissed]=useState(false);
 useEffect(()=>{const off=watchInstall(()=>setState(installState()));const timer=window.setTimeout(()=>setVisible(true),3500);return()=>{off();clearTimeout(timer);};},[]);
 if(!visible||dismissed||state==='installed')return null;
 return <aside className="lx-install" aria-label="Install LanXgrow"><div><strong>Keep LanXgrow close.</strong><p>Add the app to your Home Screen for easy access.</p>{instructions&&<p role="status">In Safari, open Share → Add to Home Screen. In Chrome or Edge, open the browser menu → Install app or Add to Home Screen. Availability depends on your browser.</p>}</div><button className="lx-install-action" onClick={()=>{void requestInstall().then(result=>{if(result==='manual')setInstructions(true);if(result==='dismissed')setDismissed(true);});}}>Install app</button><button className="lx-install-close" aria-label="Dismiss install suggestion" onClick={()=>setDismissed(true)}>×</button></aside>;
}
