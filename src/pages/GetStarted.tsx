import { useEffect } from 'react';
import { APP_WELCOME_URL } from '@/config/app';

export default function GetStarted() {
  const destination = APP_WELCOME_URL;
  useEffect(() => { window.location.replace(destination); }, [destination]);
  return <main className="lx-container py-20"><h1 className="text-display-sm">Opening your LanXgrow app…</h1><p className="mt-6" role="status">Continue securely in the LanXgrow learning app.</p><a className="mt-6 inline-flex min-h-11 items-center underline" href={destination}>Continue to LanXgrow</a></main>;
}
