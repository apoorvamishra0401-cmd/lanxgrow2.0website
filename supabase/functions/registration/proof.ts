export type Channel='phone'|'email';
export function proofUrl(value:unknown):URL {
 if(typeof value!=='string'||value.length>512)throw Error('invalid-proof');
 const url=new URL(value);
 if(url.protocol!=='https:'||url.hostname!=='user.phone.email'||url.port||url.username||url.password||url.search||url.hash||!/^\/user_[A-Za-z0-9_-]{8,200}\.json$/.test(url.pathname))throw Error('invalid-proof');
 return url;
}
export function verifiedIdentity(data:unknown,channel:Channel):string {
 if(!data||typeof data!=='object')throw Error('invalid-proof');const d=data as Record<string,unknown>;
 if(channel==='email'){const email=typeof d.user_email_id==='string'?d.user_email_id.trim().toLowerCase():'';if(email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))throw Error('invalid-proof');return email;}
 const country=typeof d.user_country_code==='string'||typeof d.user_country_code==='number'?String(d.user_country_code).replace(/^\+/,''):'';
 const number=typeof d.user_phone_number==='string'?d.user_phone_number.replace(/[\s()-]/g,''):'';
 const phone='+'+country+number;if(!/^\+[1-9]\d{7,14}$/.test(phone))throw Error('invalid-proof');return phone;
}
export async function readProof(value:unknown,channel:Channel,request:typeof fetch=fetch){
 const url=proofUrl(value);const response=await request(url,{redirect:'error',signal:AbortSignal.timeout(8000),headers:{Accept:'application/json'}});
 if(!response.ok)throw Error('invalid-proof');
 const reader=response.body?.getReader();if(!reader)throw Error('invalid-proof');let total=0;const chunks:Uint8Array[]=[];
 try{for(;;){const {done,value}=await reader.read();if(done)break;total+=value.byteLength;if(total>8192)throw Error('invalid-proof');chunks.push(value);}}finally{await reader.cancel().catch(()=>{});}
 const bytes=new Uint8Array(total);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
 return {identity:verifiedIdentity(JSON.parse(new TextDecoder().decode(bytes)),channel),proof:url.href};
}
