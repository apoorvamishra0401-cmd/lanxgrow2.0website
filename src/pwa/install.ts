type InstallPrompt=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:'accepted'|'dismissed'}>};
export type InstallState='available'|'manual'|'standalone'|'installed';
let deferred:InstallPrompt|null=null;
let reportedInstalled=false;
const listeners=new Set<()=>void>();
const notify=()=>listeners.forEach(fn=>fn());
export const getInstallState=():InstallState=>window.matchMedia('(display-mode: standalone)').matches||(navigator as Navigator&{standalone?:boolean}).standalone===true?'standalone':reportedInstalled?'installed':deferred?'available':'manual';
export function subscribeInstall(fn:()=>void){listeners.add(fn);return()=>{listeners.delete(fn);};}
export async function promptInstall(){if(!deferred)return 'unavailable' as const;const event=deferred;deferred=null;notify();await event.prompt();return (await event.userChoice).outcome;}
// Capture before React mounts. Only a deliberate learner click can show a prompt.
if(import.meta.env.VITE_AUTH_VERIFICATION==='true'){
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferred=event as InstallPrompt;notify();});
window.addEventListener('appinstalled',()=>{deferred=null;reportedInstalled=true;notify();});
window.matchMedia('(display-mode: standalone)').addEventListener('change',notify);

}
