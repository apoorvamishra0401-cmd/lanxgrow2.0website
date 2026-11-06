import { renderToPipeableStream } from 'react-dom/server';
import { PassThrough } from 'node:stream';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { publicPages } from './config/seo';
export { publicPages };
export function render(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks: Buffer[] = [];
    const timeout = setTimeout(() => { stream.abort(); reject(new Error(`Prerender timed out: ${path}`)); }, 15000);
    output.on('data', chunk => chunks.push(Buffer.from(chunk)));
    output.on('end', () => { clearTimeout(timeout); resolve(Buffer.concat(chunks).toString('utf8')); });
    output.on('error', error => { clearTimeout(timeout); reject(error); });
    const stream = renderToPipeableStream(<StaticRouter location={path}><App /></StaticRouter>, {
      onAllReady() { stream.pipe(output); },
      onError(error) { clearTimeout(timeout); reject(error); },
    });
  });
}
