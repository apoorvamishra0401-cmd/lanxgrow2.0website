import { useEffect, useState } from 'react';
import './PwaStatus.css';
export function PwaStatus() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [update, setUpdate] = useState(false);
  useEffect(() => {
    const online = () => setOffline(false); const offline = () => setOffline(true); const ready = () => setUpdate(true);
    window.addEventListener('online', online); window.addEventListener('offline', offline); window.addEventListener('lanxgrow:update-ready', ready);
    if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistration().then(registration => { if (registration?.waiting) setUpdate(true); });
    return () => { window.removeEventListener('online', online); window.removeEventListener('offline', offline); window.removeEventListener('lanxgrow:update-ready', ready); };
  }, []);
  if (!offline && !update) return null;
  return <aside className="pwa-notice" aria-label="App connection status"><p role="status">{offline ? 'You’re offline. Only saved pages are available; sign-in and messages need internet.' : 'A fresh version of LanXgrow is ready.'}</p>{!offline && update && <button type="button" onClick={async () => { const registration = await navigator.serviceWorker.getRegistration(); registration?.waiting?.postMessage({ type: 'SKIP_WAITING' }); }}>Update</button>}</aside>;
}
