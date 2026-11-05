import { createServer } from 'vite';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
const server = await createServer({ server: { middlewareMode: true, open: false }, appType: 'custom' });
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
try {
  const { render, publicPages } = await server.ssrLoadModule('/src/entry-prerender.tsx');
  const shell = await readFile('dist/index.html', 'utf8');
  await writeFile('dist/app-shell.html', shell.replace('</head>', '<meta name="robots" content="noindex,follow"/></head>'));
  for (const path of ['/', '/about', '/services', '/faq', '/privacy', '/terms', '/404']) {
    const page = publicPages[path] ?? { title: 'Page not found', description: 'This page could not be found. Explore LanXgrow English communication practice.' };
    const canonical = 'https://www.lanxgrow.com' + path;
    let html = shell.replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(page.title)} — LanXgrow</title>`)
      .replace(/<meta\s+name="description"[\s\S]*?\/>/, `<meta name="description" content="${escape(page.description)}"/>`)
      .replace(/<meta property="og:(title|description)"[^>]*\/>/g, '')
      .replace('</head>', `${path === '/404' ? '<meta name="robots" content="noindex,follow"/>' : `<link rel="canonical" href="${canonical}"/>`}<meta property="og:title" content="${escape(page.title)} — LanXgrow"/><meta property="og:description" content="${escape(page.description)}"/><meta property="og:url" content="${canonical}"/></head>`)
      .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`);
    const file = path === '/' ? 'dist/index.html' : path === '/404' ? 'dist/404.html' : `dist${path}/index.html`;
    await mkdir(file.slice(0, file.lastIndexOf('/')), { recursive: true });
    await writeFile(file, html);
    console.log('Prerendered', path);
  }
  const urls = Object.keys(publicPages).map(path => `<url><loc>https://www.lanxgrow.com${path}</loc></url>`).join('');
  await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
} finally { await server.close(); }
