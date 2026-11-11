import test from 'node:test';
import assert from 'node:assert/strict';
import { createHttpCareerTransport } from '../src/features/interview/httpTransport.ts';

test('HTTP adapter requires configured HTTPS or local development and bearer session', async () => {
  assert.throws(() => createHttpCareerTransport({baseUrl:'http://example.com/',getAccessToken:async()=>null}), /HTTPS/);
  const api = createHttpCareerTransport({
    baseUrl:'http://localhost:3000/api/',
    getAccessToken:async()=>null,
    fetchImpl:async()=>{ throw Error('Must not send an unauthenticated request'); }
  });
  await assert.rejects(api.authorize(), /token missing/);
});

test('HTTP adapter sends authenticated metadata, stable idempotency and binary media without fake scores', async () => {
  const requests=[];
  const uploads=[];
  const api=createHttpCareerTransport({
    baseUrl:'https://dev.example.test/v1/',
    getAccessToken:async()=> 'synthetic-bearer-token',
    storage:{url:'https://dev.example.test',publishableKey:'public-test-key'},
    uploadSignedVideo:async(ticket,video)=>uploads.push({ticket,video}),
    fetchImpl:async(url,init)=>{
      requests.push({url,init});
      const response = url.endsWith('/access') ? {userId:'owner_0001',audience:'fresher',allowed:true}
        : url.endsWith('/attempts') ? {id:'attempt_0001'}
        : url.endsWith('/media-ticket') ? {bucket:'lanx-career-video-dev',path:'owner_0001/attempt_0001/recording.webm',token:'test-signed-upload'}
        : url.endsWith('/submission') ? {id:'receipt_0001',status:'queued'}
        : url.includes('/answers/') ? {id:'attempt_0001'}
        : {id:'receipt_0001',status:'queued'};
      return new Response(JSON.stringify(response),{status:200,headers:{'Content-Type':'application/json'}});
    }
  });
  assert.equal((await api.authorize()).allowed,true);
  assert.equal((await api.start('video-interview','idempotency-start-1')).id,'attempt_0001');
  await api.saveAnswer('attempt_0001','q1','synthetic written answer');
  assert.equal((await api.submit('attempt_0001','stable-submit-1',new Blob(['video-bytes'],{type:'video/webm'}))).status,'queued');
  assert.equal((await api.readReceipt('receipt_0001')).id,'receipt_0001');
  assert(requests.every(({init})=>init.headers.Authorization==='Bearer synthetic-bearer-token'));
  assert(requests.every(({init})=>init.credentials==='omit'));
  assert(requests.every(({url})=>url.startsWith('https://dev.example.test/v1/career/')));
  assert.equal(requests[1].init.headers['Idempotency-Key'],'idempotency-start-1');
  assert.equal(uploads.length,1);
  assert.equal(uploads[0].video.size,11);
  assert.equal(uploads[0].ticket.token,'test-signed-upload');
  assert.equal(requests[3].url.endsWith('/media-ticket'),true);
  assert.equal(requests[4].init.headers['Idempotency-Key'],'stable-submit-1');
  assert.equal(JSON.parse(requests[4].init.body).recordingPath,'owner_0001/attempt_0001/recording.webm');
  assert.equal(requests[4].init.headers['Content-Type'],'application/json');
  assert.equal(requests[5].init.method,'GET');
});

test('HTTP adapter preserves server denial and rejects malformed resource paths', async () => {
  const api=createHttpCareerTransport({
    baseUrl:'https://dev.example.test',
    getAccessToken:async()=> 'synthetic-bearer-token',
    fetchImpl:async()=>new Response('denied',{status:403})
  });
  await assert.rejects(api.recover('attempt_0001'), /denied/);
  assert.throws(() => api.readReceipt('../escape'), /Invalid resource/);
});
