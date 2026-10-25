/** HTTPS production only; never intercept Vite's development server. */
export function registerServiceWorker() {
  if (import.meta.env.VITE_SMART_SHOWCASE === 'true') return;
  if (!import.meta.env.PROD || !('serviceWorker' in navigator) || !window.isSecureContext) return;
  let reloading = false;
  let wasControlled = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (wasControlled && !reloading) { reloading = true; window.location.reload(); }
    wasControlled = true;
  });
  const start = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', { scope: '/', updateViaCache: 'none' });
      const notify = () => window.dispatchEvent(new Event('lanxgrow:update-ready'));
      if (registration.waiting) notify();
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'installed' && navigator.serviceWorker.controller) notify();
        });
      });
      await registration.update();
    } catch { console.info('LanXgrow offline files could not finish installing. Online browsing is still available.'); }
  };
  if (document.readyState === 'complete') void start();
  else window.addEventListener('load', () => void start(), { once: true });
}
