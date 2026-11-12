import { copyFile, rename } from 'node:fs/promises';

// Keep the application shell for all existing non-home routes.
await rename('dist/index.html', 'dist/app.html');

// Website sources live together; their deployed URLs stay unchanged.
const websiteFiles = [
  ['website/pages/home.html', 'dist/index.html'],
  ['website/pages/home.html', 'dist/founder-homepage.html'],
  ['website/pages/interview-prep.html', 'dist/interview-prep.html'],
  ['website/assets/site-support.css', 'dist/site-support.css'],
  ['website/assets/site-support.js', 'dist/site-support.js'],
];

for (const [source, destination] of websiteFiles) {
  await copyFile(source, destination);
}
