type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
let pending:InstallEvent|null=null;
let installed=false;
const listeners=new Set<()=>void>();
const notify=()=>listeners.forEach(listener=>listener());
export const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||(navigator as Navigator&{standalone?:boolean}).standalone===true;
export const installState=()=>isStandalone()||installed?'installed':pending?'available':'manual';
export function watchInstall(listener:()=>void){listeners.add(listener);return()=>{listeners.delete(listener);};}
export async function requestInstall(){
 if(!pending)return 'manual' as const;
 const event=pending;pending=null;notify();
 try{await event.prompt();const result=await event.userChoice;if(result.outcome==='accepted')installed=true;notify();return result.outcome;}
 catch{notify();return 'manual' as const;}
}
// Capture before React mounts. Native installation still requires a user gesture.
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();pending=event as InstallEvent;notify();});
window.addEventListener('appinstalled',()=>{pending=null;installed=true;notify();});
window.matchMedia('(display-mode: standalone)').addEventListener('change',notify);
