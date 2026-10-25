import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = path.resolve('dist');
async function walk(directory) {
  const items = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(items.map(item => item.isDirectory() ? walk(path.join(directory, item.name)) : path.join(directory, item.name)));
  return nested.flat();
}
const files = (await walk(root)).filter(file => /\.(?:html|css|js|png|jpe?g|webp|svg|ico|woff2?|json|txt)$/.test(file) && !file.endsWith('service-worker.js')).sort();
const hash = createHash('sha256');
for (const file of files) { hash.update(path.relative(root, file)); hash.update(await readFile(file)); }
hash.update(await readFile('public/service-worker.js'));
const version = hash.digest('hex').slice(0, 16);
const urls = files.map(file => '/' + path.relative(root, file).split(path.sep).join('/'));
let worker = await readFile('public/service-worker.js', 'utf8');
worker = worker.replace('__BUILD_VERSION__', version).replace('/* PRECACHE */ []', JSON.stringify(urls));
await writeFile(path.join(root, 'service-worker.js'), worker);
console.log(`PWA: ${urls.length} public assets, version ${version}`);
