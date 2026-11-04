/** Anonymous browser allowance, not a trusted server-side API entitlement. */
export const TRIAL_LIMIT=10;
export const TRIAL_WINDOW_MS=10*24*60*60*1000;
const KEY='lanxgrow.lanx.trial.v2',COOKIE='lanx_trial_v2';
type Window={started:number;used:number};
const empty=():Window=>({started:0,used:0});
function parse(raw:string|null|undefined):Window|null{
 if(!raw)return null;
 const match=/^v2:(\d+):(\d+)$/.exec(raw);if(!match)return {started:Date.now(),used:TRIAL_LIMIT};
 const started=Number(match[1]),used=Number(match[2]);
 return Number.isSafeInteger(started)&&started>0&&Number.isSafeInteger(used)?{started,used:Math.min(TRIAL_LIMIT,used)}:{started:Date.now(),used:TRIAL_LIMIT};
}
function cookie(name:string){try{return document.cookie.split('; ').find(v=>v.startsWith(name+'='))?.slice(name.length+1);}catch{return undefined;}}
function read():Window{
 const now=Date.now();let local:Window|null=null;try{local=parse(localStorage.getItem(KEY));}catch{/* cookie fallback */}
 const candidates=[local,parse(cookie(COOKIE))].filter((v):v is Window=>v!==null);
 if(!candidates.length){let legacy=0;try{legacy=Number(localStorage.getItem('lanxgrow.lanx.trial.v1'))||0;}catch{/* cookie fallback */}legacy=Math.max(legacy,Number(cookie('lanx_trial_v1'))||0);return legacy>0?{started:now,used:Math.min(TRIAL_LIMIT,legacy)}:empty();}
 const started=Math.max(...candidates.map(v=>v.started));const used=Math.max(...candidates.filter(v=>v.started===started).map(v=>v.used));
 return now>=started+TRIAL_WINDOW_MS?empty():{started,used};
}
export function trialUsed(){return read().used;}
export function trialResetAt(){const state=read();return state.started?state.started+TRIAL_WINDOW_MS:null;}
function persistWindow(next:Window):boolean{
 const encoded=`v2:${next.started}:${next.used}`;let durable=false;
 try{localStorage.setItem(KEY,encoded);durable=localStorage.getItem(KEY)===encoded;}catch{/* cookie fallback */}
 try{document.cookie=`${COOKIE}=${encoded}; Max-Age=34560000; Path=/; SameSite=Lax; Secure`;durable=durable||cookie(COOKIE)===encoded;}catch{/* fail closed if neither store works */}
 return durable;
}
export function startTrialWindow(){const current=read();return persistWindow({...current,started:current.started||Date.now()});}
export function consumeTrial():boolean{const current=read();if(current.used>=TRIAL_LIMIT)return false;return persistWindow({started:current.started||Date.now(),used:current.used+1});}
