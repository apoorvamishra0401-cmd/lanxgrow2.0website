import {readFile,writeFile,mkdir} from 'node:fs/promises';
const origin='https://www.lanxgrow.com';
// Single metadata source shared with the client navigation hook.
const pages=JSON.parse(await readFile('seo/public-pages.json','utf8')).map(({path,title,description})=>[path,title,description]);
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const shell=await readFile('dist/app.html','utf8');
await mkdir('dist/seo-pages',{recursive:true});
for(const [path,title,description] of pages){
 const file=path==='/'?'dist/index.html':path==='/interview-prep'?'dist/interview-prep.html':'dist/seo-pages/'+path.slice(1)+'.html';
 let html=path==='/'||path==='/interview-prep'?await readFile(file,'utf8'):shell;
 const url=origin+path;
 html=html.replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi,'');
 // Attribute order varies between static HTML, React shells, and generated pages.
 // Remove matching metadata tags regardless of whether content= precedes name=/property=.
 html=html.replace(/<meta\b[^>]*>/gi,tag=>{
  const match=tag.match(/\b(?:name|property)\s*=\s*(["'])(.*?)\1/i);
  return match&&/^(description|og:(title|description|url|type|image)|twitter:(card|title|description|image))$/i.test(match[2])?'':tag;
 });
 html=html.replace(/<title>[\s\S]*?<\/title>/i,'<title>'+esc(title)+'</title>');
 const schema=path==='/'?{'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':origin+'/#organization',name:'LanXgrow',url:origin+'/'},{'@type':'WebSite','@id':origin+'/#website',name:'LanXgrow',url:origin+'/',publisher:{'@id':origin+'/#organization'}}]}:{'@context':'https://schema.org','@type':'WebPage',name:title,url,description,isPartOf:{'@id':origin+'/#website'}};
 const tags='<link rel="canonical" href="'+url+'"/>\n<meta name="description" content="'+esc(description)+'"/>\n<meta property="og:title" content="'+esc(title)+'"/>\n<meta property="og:description" content="'+esc(description)+'"/>\n<meta property="og:url" content="'+url+'"/>\n<meta property="og:type" content="website"/>\n<meta property="og:image" content="'+origin+'/icons/icon-512.png"/>\n<meta name="twitter:card" content="summary"/>\n<meta name="twitter:title" content="'+esc(title)+'"/>\n<meta name="twitter:description" content="'+esc(description)+'"/>\n<meta name="twitter:image" content="'+origin+'/icons/icon-512.png"/>\n<script type="application/ld+json">'+JSON.stringify(schema)+'</script>\n';
 if(!/<\/head>/i.test(html))throw new Error('Missing head: '+file);
 html=html.replace(/<\/head>/i,tags+'</head>');
 await writeFile(file,html);
}
const sitemap='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(([p])=>'  <url><loc>'+origin+p+'</loc></url>').join('\n')+'\n</urlset>\n';
await writeFile('dist/sitemap.xml',sitemap);
