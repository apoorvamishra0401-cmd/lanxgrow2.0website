import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import './mobile-first.css';
import './styles/version-b-page-polish.css';
import { registerServiceWorker } from './registerServiceWorker';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root container #root was not found in index.html');
}

const app = (
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

if (container.dataset.prerendered === 'true') hydrateRoot(container, app);
else createRoot(container).render(app);

registerServiceWorker();
