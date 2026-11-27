import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const origin='https://www.lanxgrow.com';
const routes=['/','/interview-prep','/smart-ai','/about','/services','/faq','/privacy','/terms'];
const redirects=JSON.parse(await readFile('vercel.json','utf8'));
const sitemap=await readFile('dist/sitemap.xml','utf8');
const robots=await readFile('dist/robots.txt','utf8');
const llms=await readFile('dist/llms.txt','utf8');
assert.match(llms,/# LanXgrow/);
assert.match(llms,/illustrative or proposed/);

assert.match(sitemap,/<urlset\b/);
assert.match(robots,/Sitemap:\s*https:\/\/www\.lanxgrow\.com\/sitemap\.xml/);
assert.equal((sitemap.match(/<loc>/g)||[]).length,routes.length,'Unexpected sitemap size');
for(const route of routes){
 const url=origin+route;
 const loc='<loc>'+url+'</loc>';
 assert.ok(sitemap.includes(loc),'Sitemap missing '+route);
 const file=route==='/'?'dist/index.html':route==='/interview-prep'?'dist/interview-prep.html':'dist/seo-pages/'+route.slice(1)+'.html';
 const html=await readFile(file,'utf8');
 assert.equal((html.match(/<title\b[^>]*>/gi)||[]).length,1,'Title count '+route);
 assert.ok(html.includes('href="/llms.txt"'),'Missing AI-readable guide discovery '+route);
 assert.ok(html.includes('<link rel="canonical" href="'+url+'"/>'),'Incorrect canonical '+route);
 const metaTags=html.match(/<meta\b[^>]*>/gi)||[];
 for(const name of ['description','og:title','og:description','og:url','og:type','og:image','twitter:card','twitter:title','twitter:description','twitter:image']){
  const matches=metaTags.filter(tag=>{
   const m=tag.match(/\b(?:name|property)\s*=\s*(["'])(.*?)\1/i);
   return m?.[2]?.toLowerCase()===name;
  });
  assert.equal(matches.length,1,'Expected exactly one '+name+' for '+route);
 }
 assert.equal((html.match(/<script\b[^>]*id=["']lx-public-schema["'][^>]*>/gi)||[]).length,1,'Exactly one public schema expected '+route);
 const metaRecord=JSON.parse(await readFile('seo/public-pages.json','utf8')).find(p=>p.path===route);
 assert.ok(metaRecord?.description?.length>=80 && metaRecord.description.length<=175,'Missing useful description '+route);
 if(route!=='/' && route!=='/interview-prep') {
  assert.match(html,/<main id="lx-static-overview"/,'Non-JS HTML summary missing '+route);
  assert.ok(html.includes('<h1')&&html.includes(metaRecord.heading),'Missing visible factual heading '+route);
  assert.ok(html.includes(metaRecord.summary.slice(0,45)),'Missing accurate initial content '+route);
 }
 assert.ok(!/<meta\b[^>]*name=["']robots["'][^>]*content=["']noindex/i.test(html),'Public route noindexed '+route);
 if(route!=='/'&&route!=='/interview-prep'){
  const rule=redirects.rewrites.find(r=>r.source===route);
  assert.equal(rule?.destination,'/seo-pages/'+route.slice(1)+'.html','Missing rewrite '+route);
 }
}
// A blanket SPA fallback returns 200 for nonexistent paths (soft-404). Keep
// known client-side deep links explicit so Vercel can return a real 404.
assert.ok(!redirects.rewrites.some(rule=>rule.source==='/(.*)'), 'Catch-all SPA rewrite would create soft-404 responses');
for (const source of ['/account','/auth-callback','/consent','/forgot-password','/reset-password','/placeholder','/review-lab','/activate','/career/interview','/guest/:audience','/dashboard/:path*','/smart-ai/review']) {
 assert.ok(redirects.rewrites.some(rule=>rule.source===source && rule.destination==='/app.html'), 'Missing known SPA route '+source);
}
for (const source of ['/account','/dashboard/:path*','/guest/:path*','/review-lab','/smart-ai/review','/career/interview','/activate','/consent','/forgot-password','/reset-password','/auth-callback','/placeholder']) {
 assert.ok(redirects.headers.some(rule=>rule.source===source && rule.headers.some(h=>h.key.toLowerCase()==='x-robots-tag' && h.value.startsWith('noindex'))), 'Missing noindex header '+source);
}
for (const source of ['/home','/index.html','/seo-pages/:path*']) {
 assert.ok(redirects.redirects.some(rule=>rule.source===source && rule.permanent), 'Missing alias redirect '+source);
}
const notFound=await readFile('dist/404.html','utf8');
assert.match(notFound,/<title>Page not found \| LanXgrow<\/title>/i);
assert.match(notFound,/name="robots" content="noindex,follow"/i);
assert.ok(!sitemap.includes('<loc>'+origin+'/get-started</loc>'), 'Redirected onboarding route must not be in sitemap');

console.log('SEO build checks passed for '+routes.length+' public routes');
