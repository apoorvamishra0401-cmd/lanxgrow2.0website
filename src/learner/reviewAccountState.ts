const accountKey='lanxgrow.frontend.account.v1';
export type ReviewAccount={version:1;method:'email'|'phone'|'google';identity:string};
export function readReviewAccount():ReviewAccount|null{try{const a=JSON.parse(sessionStorage.getItem(accountKey)||'null');return a?.version===1&&['email','phone','google'].includes(a.method)&&typeof a.identity==='string'?a:null;}catch{return null;}}
export function leaveReviewAccount(){try{sessionStorage.removeItem(accountKey);}catch{/* no session to clear */}}
