let owner:string|null=null;
export function setReviewOwner(userId:string|null){owner=userId;}
export function scopedStorageKey(base:string){return import.meta.env.VITE_AUTH_VERIFICATION==='true'?`${base}.${owner||'signed-out'}`:base;}
