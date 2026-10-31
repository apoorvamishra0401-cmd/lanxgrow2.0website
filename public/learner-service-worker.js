// Preview install support only. Never cache account, session or learner data.
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method==='GET'&&url.origin===self.location.origin&&url.pathname.startsWith('/icons/'))event.respondWith(fetch(event.request));
});
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting();});
