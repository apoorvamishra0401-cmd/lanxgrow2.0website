import {copyFile,rename} from 'node:fs/promises';
// Keep the application shell for all existing non-home routes.
await rename('dist/index.html','dist/app.html');
await copyFile('public/founder-homepage.html','dist/index.html');
