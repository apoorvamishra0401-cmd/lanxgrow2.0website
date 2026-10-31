import './pwa/install';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './mobile-first.css';
import { registerServiceWorker } from './registerServiceWorker';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

if(import.meta.env.VITE_AUTH_VERIFICATION==='true'){const manifest=document.querySelector<HTMLLinkElement>('link[rel="manifest"]');if(manifest)manifest.href='/learner-manifest.json';}
registerServiceWorker();
